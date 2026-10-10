/**
 * Interne vaste LRS starttarieven excl. btw — op basis van de openbare
 * LRS-prijsbanden voor daktypen en aanvulbare interne starttarieven voor details.
 * Dit zijn voorstellen, geen door LRS geverifieerde inkoop-/margeprijzen.
 * Gebruik bij complexe daken de eigen tariefaanpassing in het prijsboek.
 */
export type RoofItem = { id:string; category:string; description:string; unit:string; defaultPriceEx:number; pack?:"pannen"|"bitumen" };
export type WorkLine = { id:string; description:string; unit:string; qty:number; priceEx:number };
export type CustomerLine = { description:string; unit:string; qty:number; amountEx:number };
export type InternalLine = { id:string; baseEx:number; afterStaffelEx:number; volumeDiscountEx:number; combineDiscountEx:number; customerEx:number };
export const MIN_ROOF_JOB_EX=195;

export const CATALOG:readonly RoofItem[]=[
  {id:"bitumen",category:"Bitumen / plat dak",description:"Nieuwe bitumen dakbedekking aanbrengen",unit:"m²",defaultPriceEx:95,pack:"bitumen"},
  {id:"overlagen",category:"Bitumen / plat dak",description:"Bitumen dak overlagen (geschikte ondergrond)",unit:"m²",defaultPriceEx:59,pack:"bitumen"},
  {id:"warmdak",category:"Bitumen / plat dak",description:"Compleet warmdak: isolatie + bitumen",unit:"m²",defaultPriceEx:155,pack:"bitumen"},
  {id:"verwijderen",category:"Bitumen / plat dak",description:"Oude dakbedekking verwijderen en afvoeren",unit:"m²",defaultPriceEx:26},
  {id:"onderlaag",category:"Bitumen / plat dak",description:"Bitumen onderlaag aanbrengen",unit:"m²",defaultPriceEx:31},
  {id:"isolatie",category:"Bitumen / plat dak",description:"Dakisolatie aanbrengen (losse werkregel)",unit:"m²",defaultPriceEx:65},
  {id:"opstanden",category:"Bitumen / plat dak",description:"Dakopstanden / dakranden inbranden",unit:"m¹",defaultPriceEx:58},
  {id:"daktrim",category:"Bitumen / plat dak",description:"Daktrim / dakrand afwerken",unit:"m¹",defaultPriceEx:49},
  {id:"bitumen-reparatie",category:"Bitumen / plat dak",description:"Bitumen dak plaatselijk repareren",unit:"m²",defaultPriceEx:135},
  {id:"bitumen-afvoer",category:"Bitumen / plat dak",description:"Dakafvoer / plakplaat vernieuwen",unit:"stuk",defaultPriceEx:190},
  {id:"bitumen-noodoverloop",category:"Bitumen / plat dak",description:"Noodoverloop aanbrengen",unit:"stuk",defaultPriceEx:175},
  {id:"pannendak",category:"Dakpannen / schuin dak",description:"Pannendak leggen (basis dakpannen en montage)",unit:"m²",defaultPriceEx:105,pack:"pannen"},
  {id:"pannen-beton",category:"Dakpannen / schuin dak",description:"Betonnen dakpannen wisselen / leggen",unit:"m²",defaultPriceEx:78,pack:"pannen"},
  {id:"pannen-keramisch",category:"Dakpannen / schuin dak",description:"Keramische dakpannen wisselen / leggen",unit:"m²",defaultPriceEx:110,pack:"pannen"},
  {id:"pannen-renovatie",category:"Dakpannen / schuin dak",description:"Complete pannendakrenovatie (basispakket)",unit:"m²",defaultPriceEx:120,pack:"pannen"},
  {id:"pannen-afvoeren",category:"Dakpannen / schuin dak",description:"Bestaande dakpannen afnemen / afvoeren",unit:"m²",defaultPriceEx:21},
  {id:"pannen-vervangen",category:"Dakpannen / schuin dak",description:"Dakpannen vervangen (losse aantallen)",unit:"stuk",defaultPriceEx:47},
  {id:"pannen-slijpen",category:"Dakpannen / schuin dak",description:"Dakpannen op maat slijpen",unit:"m¹",defaultPriceEx:26},
  {id:"vogelschroten",category:"Dakpannen / schuin dak",description:"Vogelschroten vervangen / plaatsen",unit:"m¹",defaultPriceEx:29},
  {id:"panlatten",category:"Dakpannen / schuin dak",description:"Panlatten vervangen",unit:"m¹",defaultPriceEx:22},
  {id:"tengels",category:"Dakpannen / schuin dak",description:"Tengels vernieuwen",unit:"m¹",defaultPriceEx:14},
  {id:"folie",category:"Dakpannen / schuin dak",description:"Dampopen dakfolie plaatsen",unit:"m²",defaultPriceEx:22},
  {id:"pannen-isolatie",category:"Dakpannen / schuin dak",description:"Dakisolatie onder pannendak",unit:"m²",defaultPriceEx:65},
  {id:"nokvorsten",category:"Dakpannen / schuin dak",description:"Nokvorsten / ondervorsten vernieuwen",unit:"m¹",defaultPriceEx:79},
  {id:"verankeren",category:"Dakpannen / schuin dak",description:"Dakpannen verankeren",unit:"stuk",defaultPriceEx:14},
  {id:"zink-goot",category:"Zink / lood / goten",description:"Zinken dakgoot vervangen",unit:"m¹",defaultPriceEx:94},
  {id:"zink-reparatie",category:"Zink / lood / goten",description:"Zinkwerk repareren",unit:"m¹",defaultPriceEx:105},
  {id:"zink-solderen",category:"Zink / lood / goten",description:"Zink solderen / lekdicht herstellen",unit:"las",defaultPriceEx:145},
  {id:"zink-kilgoot",category:"Zink / lood / goten",description:"Zinken kilgoot vernieuwen",unit:"m¹",defaultPriceEx:115},
  {id:"zink-deklijst",category:"Zink / lood / goten",description:"Zinken deklijst / kraal monteren",unit:"m¹",defaultPriceEx:95},
  {id:"zink-afvoer",category:"Zink / lood / goten",description:"Hemelwaterafvoer zink vernieuwen",unit:"m¹",defaultPriceEx:85},
  {id:"loodslabben",category:"Zink / lood / goten",description:"Loodslabben vernieuwen",unit:"m¹",defaultPriceEx:115},
  {id:"loodvoegen",category:"Zink / lood / goten",description:"Loodvoegen uitslijpen / opnieuw voegen",unit:"m¹",defaultPriceEx:75},
  {id:"steiger",category:"Overig dakwerk",description:"Steiger / valbeveiliging",unit:"post",defaultPriceEx:550},
  {id:"dakraam",category:"Overig dakwerk",description:"Dakraam plaatsen / vervangen",unit:"stuk",defaultPriceEx:850},
  {id:"schoorsteen",category:"Overig dakwerk",description:"Schoorsteen herstellen",unit:"post",defaultPriceEx:490},
  {id:"container",category:"Overig dakwerk",description:"Container / afval afvoeren",unit:"post",defaultPriceEx:425},
  {id:"arbeidsuren",category:"Overig dakwerk",description:"Overige dakwerkzaamheden",unit:"uur",defaultPriceEx:75},
];
export const CATEGORIES=[...new Set(CATALOG.map(item=>item.category))];
export const DEFAULT_PRICES:Record<string,number>=Object.fromEntries(CATALOG.map(item=>[item.id,item.defaultPriceEx]));
export const round=(value:number)=>Math.round((value+Number.EPSILON)*100)/100;
export const euro=(value:number)=>new Intl.NumberFormat("nl-NL",{style:"currency",currency:"EUR"}).format(value);

export function localDay() {
  const d=new Date();
  return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
}
export function formattedDay(value:string) {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "—";
  return value.slice(8)+"-"+value.slice(5,7)+"-"+value.slice(0,4);
}

// Alleen de EXTRA aantallen boven elke drempel krijgen korting.
// Bij 100 m²: 10x vol, 20x 96%, 45x 91%, 25x 86%.
export function volumeRate(qty:number,unit:string):number {
  if(!Number.isFinite(qty)||qty<=0)return 0;
  const linear=["m²","m¹","meter","strekkende meter"].includes(unit);
  const items=unit==="stuk";
  if(!linear&&!items)return qty;
  const limit=unit==="m²" ? [10,30,75,Infinity] : items ? [1,5,15,Infinity] : [5,15,40,Infinity];
  const factors=items ? [1,.97,.93,.89] : [1,.96,.91,.86];
  let prev=0,total=0;
  for(let i=0;i<limit.length;i++){
    const amount=Math.max(0,Math.min(qty,limit[i])-prev);
    total+=amount*factors[i];
    prev=limit[i];
    if(qty<=prev)break;
  }
  return total;
}

export function calculate(
  lines:WorkLine[],extraCost:number,passThrough:boolean,vatRate:number,
  mode:"legacy"|"staffel-v2"="staffel-v2"
) {
  const eligible=lines.filter(l=>l.description.trim()&&l.unit.trim()&&l.qty>0&&l.priceEx>0&&Number.isFinite(l.qty*l.priceEx));
  const base=eligible.map(l=>Math.max(0.01,round(l.qty*l.priceEx)));
  const baseTotal=round(base.reduce((a,b)=>a+b,0));
  const afterVolume=eligible.map((l,i)=>mode==="legacy"?base[i]:Math.max(0.01,round(l.priceEx*volumeRate(l.qty,l.unit))));
  const discountable=eligible.map((l,i)=>({i,amount:afterVolume[i]}))
    .filter(({i})=>["m²","m¹","meter","strekkende meter","stuk"].includes(eligible[i].unit))
    .sort((a,b)=>b.amount-a.amount||a.i-b.i);
  const afterBundle=[...afterVolume];
  if(mode==="staffel-v2") discountable.forEach(({i},rank)=>{
    const pct=rank===0?0:rank===1?0.03:rank===2?0.045:rank===3?0.055:0.06;
    const discounted=round(afterVolume[i]*(1-pct));
    afterBundle[i]=Math.max(round(base[i]*.82),discounted);
  });
  const volumeDiscount=round(base.reduce((s,n,i)=>s+n-afterVolume[i],0));
  const combineDiscount=round(afterVolume.reduce((s,n,i)=>s+n-afterBundle[i],0));
  const discountedEx=round(afterBundle.reduce((s,n)=>s+n,0));
  const minimumCharge=mode==="staffel-v2"&&eligible.length>0?round(Math.max(0,MIN_ROOF_JOB_EX-discountedEx)):0;
  const surcharge=passThrough&&discountedEx>0?round(Math.max(0,extraCost)):0;
  const spread=round(minimumCharge+surcharge);
  // Hele eurocenten exact proportioneel verdelen (geen interne regel naar klant).
  const cents=Math.round(spread*100);
  const raw=cents>0?afterBundle.map(n=>cents*n/discountedEx):afterBundle.map(()=>0);
  const allocated=raw.map(n=>Math.floor(n));
  const order=raw.map((n,i)=>({i,fraction:n-allocated[i]})).sort((a,b)=>b.fraction-a.fraction||a.i-b.i);
  const remaining=cents-allocated.reduce((s,n)=>s+n,0);
  for(let i=0;i<remaining;i++)allocated[order[i].i]+=1;
  const publicLines:CustomerLine[]=eligible.map((l,i)=>({
    description:l.description.trim(),unit:l.unit.trim(),qty:l.qty,amountEx:round(afterBundle[i]+allocated[i]/100)
  }));
  const internalLines:InternalLine[]=eligible.map((l,i)=>({
    id:l.id,baseEx:base[i],afterStaffelEx:afterBundle[i],
    volumeDiscountEx:round(base[i]-afterVolume[i]),
    combineDiscountEx:round(afterVolume[i]-afterBundle[i]),
    customerEx:publicLines[i].amountEx
  }));
  const subtotal=round(publicLines.reduce((s,l)=>s+l.amountEx,0));
  const vat=round(subtotal*vatRate/100);
  return {publicLines,internalLines,baseTotal,volumeDiscount,combineDiscount,
    minimumCharge,surcharge,subtotal,vat,total:round(subtotal+vat)};
}
