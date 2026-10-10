export type RoofItem = { id: string; category: string; description: string; unit: string };
export type WorkLine = { id: string; description: string; unit: string; qty: number; priceEx: number };
export type CustomerLine = { description: string; unit: string; qty: number; amountEx: number };

export const CATALOG: readonly RoofItem[] = [
  { id:"bitumen",category:"Bitumen / plat dak",description:"Bitumen dakbedekking aanbrengen",unit:"m²" },
  { id:"overlagen",category:"Bitumen / plat dak",description:"Bitumen dak overlagen",unit:"m²" },
  { id:"verwijderen",category:"Bitumen / plat dak",description:"Oude dakbedekking verwijderen en afvoeren",unit:"m²" },
  { id:"onderlaag",category:"Bitumen / plat dak",description:"Onderlaag dakbedekking aanbrengen",unit:"m²" },
  { id:"isolatie",category:"Bitumen / plat dak",description:"Dakisolatie aanbrengen",unit:"m²" },
  { id:"opstanden",category:"Bitumen / plat dak",description:"Dakopstanden / dakranden inbranden",unit:"m¹" },
  { id:"daktrim",category:"Bitumen / plat dak",description:"Daktrim / dakrand afwerken",unit:"m¹" },
  { id:"bitumen-reparatie",category:"Bitumen / plat dak",description:"Bitumen dak plaatselijk repareren",unit:"m²" },
  { id:"bitumen-afvoer",category:"Bitumen / plat dak",description:"Dakafvoer / plakplaat vernieuwen",unit:"stuk" },
  { id:"bitumen-noodoverloop",category:"Bitumen / plat dak",description:"Noodoverloop aanbrengen",unit:"stuk" },
  { id:"pannendak",category:"Dakpannen / schuin dak",description:"Dakpannen leggen / dak vernieuwen",unit:"m²" },
  { id:"pannen-afvoeren",category:"Dakpannen / schuin dak",description:"Bestaande dakpannen afnemen / afvoeren",unit:"m²" },
  { id:"pannen-vervangen",category:"Dakpannen / schuin dak",description:"Dakpannen vervangen",unit:"stuk" },
  { id:"pannen-slijpen",category:"Dakpannen / schuin dak",description:"Dakpannen op maat slijpen",unit:"m¹" },
  { id:"vogelschroten",category:"Dakpannen / schuin dak",description:"Vogelschroten vervangen / plaatsen",unit:"m¹" },
  { id:"panlatten",category:"Dakpannen / schuin dak",description:"Panlatten vervangen",unit:"m¹" },
  { id:"tengels",category:"Dakpannen / schuin dak",description:"Tengels vernieuwen",unit:"m¹" },
  { id:"folie",category:"Dakpannen / schuin dak",description:"Dampopen dakfolie plaatsen",unit:"m²" },
  { id:"nokvorsten",category:"Dakpannen / schuin dak",description:"Nokvorsten / ondervorsten vernieuwen",unit:"m¹" },
  { id:"verankeren",category:"Dakpannen / schuin dak",description:"Dakpannen verankeren",unit:"stuk" },
  { id:"zink-goot",category:"Zink / lood / goten",description:"Zinken dakgoot vervangen",unit:"m¹" },
  { id:"zink-reparatie",category:"Zink / lood / goten",description:"Zinkwerk repareren",unit:"m¹" },
  { id:"zink-solderen",category:"Zink / lood / goten",description:"Zink solderen / lekdicht herstellen",unit:"las" },
  { id:"zink-kilgoot",category:"Zink / lood / goten",description:"Zinken kilgoot vernieuwen",unit:"m¹" },
  { id:"zink-deklijst",category:"Zink / lood / goten",description:"Zinken deklijst / kraal monteren",unit:"m¹" },
  { id:"zink-afvoer",category:"Zink / lood / goten",description:"Hemelwaterafvoer zink vernieuwen",unit:"m¹" },
  { id:"loodslabben",category:"Zink / lood / goten",description:"Loodslabben vernieuwen",unit:"m¹" },
  { id:"loodvoegen",category:"Zink / lood / goten",description:"Loodvoegen uitslijpen / opnieuw voegen",unit:"m¹" },
  { id:"steiger",category:"Overig dakwerk",description:"Steiger / valbeveiliging",unit:"post" },
  { id:"dakraam",category:"Overig dakwerk",description:"Dakraam plaatsen / vervangen",unit:"stuk" },
  { id:"schoorsteen",category:"Overig dakwerk",description:"Schoorsteen herstellen",unit:"post" },
  { id:"container",category:"Overig dakwerk",description:"Container / afval afvoeren",unit:"post" },
  { id:"arbeidsuren",category:"Overig dakwerk",description:"Overige dakwerkzaamheden",unit:"uur" },
];
export const CATEGORIES = [...new Set(CATALOG.map(item=>item.category))];
export const round = (value:number) => Math.round((value + Number.EPSILON)*100)/100;
export const euro = (value:number) => new Intl.NumberFormat("nl-NL",{style:"currency",currency:"EUR"}).format(value);
export function localDay() {
  const d=new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
export function formattedDay(value:string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "—";
  return `${value.slice(8)}-${value.slice(5,7)}-${value.slice(0,4)}`;
}
export function calculate(lines:WorkLine[],extraCost:number,passThrough:boolean,vatRate:number) {
  const eligible=lines.filter(l=>l.description.trim() && l.unit.trim() && l.qty>0 && l.priceEx>0 && Number.isFinite(l.qty*l.priceEx));
  const base=eligible.map(l=>round(l.qty*l.priceEx));
  const baseTotal=round(base.reduce((a,b)=>a+b,0));
  const surcharge=passThrough && baseTotal>0 ? round(Math.max(0,extraCost)) : 0;
  // Verdeel uitsluitend hele eurocenten. Zo blijft de som altijd exact,
  // ook wanneer veel kleine werkregels tegelijk zijn geselecteerd.
  const cents=Math.round(surcharge*100);
  const raw=cents>0 ? base.map(n=>cents*n/baseTotal) : base.map(()=>0);
  const allocated=raw.map(n=>Math.floor(n));
  const order=raw.map((n,i)=>({i,fraction:n-allocated[i]}))
    .sort((a,b)=>b.fraction-a.fraction || a.i-b.i);
  const remaining=cents-allocated.reduce((s,n)=>s+n,0);
  for (let i=0;i<remaining;i++) allocated[order[i].i]+=1;
  const publicLines:CustomerLine[]=eligible.map((l,i)=>({
    description:l.description.trim(), unit:l.unit.trim(), qty:l.qty,
    amountEx:round(base[i]+allocated[i]/100),
  }));
  const subtotal=round(publicLines.reduce((s,l)=>s+l.amountEx,0));
  const vat=round(subtotal*vatRate/100);
  return {publicLines,baseTotal,surcharge,subtotal,vat,total:round(subtotal+vat)};
}
