/**
 * PNG-export voor LRS/Allround klantdocumenten.
 * Canvas wordt opgebouwd uit uitsluitend klantvelden, NOOIT uit interne
 * werkregelprijzen, marges, staffels of verborgen personeelskosten.
 *
 * Geen externe assets/fonts: dit werkt ook op mobiele Safari en als
 * de opmaak op het scherm smal of gecachet is.
 */
export type CustomerImageKind = "offerte" | "factuur";

export type CustomerImageInput = {
  kind: CustomerImageKind;
  issuer: "lrs" | "allround-lem";
  company: {
    name: string;
    address: string;
    kvk: string;
    vatId: string;
    phone?: string;
    email?: string;
    iban?: string;
  };
  customer: { name: string; address: string; email?: string; number?: string };
  number: string;
  title: string;
  issueDate: string;
  validUntil?: string;
  serviceDate?: string;
  dueDate?: string;
  lines: { description: string; qty: number; unit: string }[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  notes?: string;
  paymentTermDays?: number;
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("nl-NL", {style:"currency",currency:"EUR"}).format(value);
const formatQuantity = (value: number) =>
  new Intl.NumberFormat("nl-NL", {maximumFractionDigits:2}).format(value);

export function imageFilename(input: CustomerImageInput): string {
  const prefix=input.issuer==="allround-lem" ? "LEM" : "LRS";
  const type=input.kind==="offerte" ? "OFFERTE" : "FACTUUR";
  // De project- en factuurnummers bevatten soms al LRS/LEM en OFF.
  const reference=input.number.replace(/^(?:LRS|LEM)-(?:OFF-)?/i,"")
    .replace(/[^A-Za-z0-9_-]/g,"-").replace(/^-+|-+$/g,"");
  return prefix+"-"+type+"-"+(reference || "document")+".png";
}

export function validateCustomerImage(input: CustomerImageInput): string | null {
  if (!input.number.trim() || !input.company.name.trim() || !input.company.address.trim()
    || !input.company.kvk.trim() || !input.company.vatId.trim()) {
    return "Vul de bedrijfsgegevens en het documentnummer in.";
  }
  if (!input.customer.name.trim() || !input.customer.address.trim()) {
    return "Vul eerst klantnaam en volledig werkadres in.";
  }
  if (!input.title.trim() || !input.issueDate.trim()) {
    return "Vul de omschrijving en documentdatum in.";
  }
  if (!input.lines.length || input.lines.length>50
    || input.lines.some(line=>!line.description.trim() || !line.unit.trim()
      || !Number.isFinite(line.qty) || line.qty<=0)) {
    return "Selecteer minimaal één geldige werkzaamheid met een aantal.";
  }
  if (!Number.isFinite(input.total) || input.total<=0
    || !Number.isFinite(input.vatRate) || input.vatRate<0) {
    return "De totaalprijs of btw is ongeldig.";
  }
  if (input.kind==="factuur" && (
    !input.company.iban?.trim()
    || !Number.isFinite(input.subtotal) || !Number.isFinite(input.vatAmount)
    || input.subtotal<0 || input.vatAmount<0
    || Math.abs(Math.round((input.subtotal+input.vatAmount)*100)-Math.round(input.total*100))>1
  )) {
    return "Controleer de bankrekening en de btw-bedragen van de factuur.";
  }
  return null;
}

const WIDTH=1100;
const LEFT=66;
const RIGHT=WIDTH-LEFT;
const LINE="#d9e3e7";
const INK="#172c38";
const MUTED="#516878";

function font(ctx:CanvasRenderingContext2D,size:number,bold=false) {
  ctx.font=(bold ? "700 " : "400 ")+size+"px Arial, Helvetica, sans-serif";
}

function text(
  ctx:CanvasRenderingContext2D,
  value:string,
  x:number,y:number,size=24,bold=false,
  color=INK,align:CanvasTextAlign="left",
) {
  font(ctx,size,bold);
  ctx.fillStyle=color;
  ctx.textAlign=align;
  ctx.textBaseline="top";
  ctx.fillText(value,x,y);
}

// Splitsen op meetbare breedte, inclusief lange namen zonder spaties.
function wrap(
  ctx:CanvasRenderingContext2D,
  value:string,width:number,size:number,bold=false,
): string[] {
  font(ctx,size,bold);
  const result:string[]=[];
  for(const paragraph of String(value||"").replace(/\r/g,"").split("\n")) {
    if(!paragraph.trim()) {result.push("");continue;}
    const words=paragraph.trim().split(/\s+/);
    let current="";
    for(const word of words) {
      const candidate=current ? current+" "+word : word;
      if(ctx.measureText(candidate).width<=width) {current=candidate;continue;}
      if(current) {result.push(current);current="";}
      // Een ononderbroken woord kan langer zijn dan een kolom.
      let remaining=word;
      while(remaining.length>1 && ctx.measureText(remaining).width>width) {
        let end=1;
        while(end<remaining.length && ctx.measureText(remaining.slice(0,end+1)).width<=width) end++;
        result.push(remaining.slice(0,end));
        remaining=remaining.slice(end);
      }
      current=remaining;
    }
    if(current) result.push(current);
  }
  return result;
}

function lines(
  ctx:CanvasRenderingContext2D,
  content:string[],x:number,y:number,size:number,height:number,color=INK,bold=false,
) {
  content.forEach((line,index)=>text(ctx,line,x,y+index*height,size,bold,color));
}

function horizontal(ctx:CanvasRenderingContext2D,y:number,color=LINE,width=1) {
  ctx.fillStyle=color;ctx.fillRect(LEFT,y,RIGHT-LEFT,width);
}

/** Maakt een vaste, nette portret-PNG onafhankelijk van de telefoonschermbreedte. */
export function drawCustomerImage(
  input:CustomerImageInput,
  createCanvas:()=>HTMLCanvasElement=()=>document.createElement("canvas"),
):HTMLCanvasElement {
  const error=validateCustomerImage(input);
  if(error) throw new Error(error);

  const isLem=input.issuer==="allround-lem";
  const accent=isLem ? "#e3b23b" : "#16435a";
  const header=isLem ? "#191a20" : "#102a38";
  const canvas=createCanvas();
  canvas.width=WIDTH;
  canvas.height=1;
  const ctx=canvas.getContext("2d");
  if(!ctx) throw new Error("Dit apparaat kan geen PNG-afbeeldingen maken.");

  // Hoogte vooraf meten: de afbeelding bevat alle werkzaamheden zonder afsnijden.
  const companyRows=wrap(ctx,input.company.address,620,22);
  const customerRows=wrap(ctx,input.customer.address,525,25);
  const customerEmailRows=input.customer.email ? wrap(ctx,input.customer.email,505,22) : [];
  const jobTitleRows=wrap(ctx,input.title,RIGHT-LEFT,34,true);
  const prepared=input.lines.map(line=>{
    const description=wrap(ctx,line.description,720,25);
    const height=Math.max(62,description.length*34+19);
    return {description,height,qty:formatQuantity(line.qty)+" "+line.unit};
  });
  const notesRows=input.notes?.trim() ? wrap(ctx,input.notes.trim(),RIGHT-LEFT,23) : [];

  const sellerY=240;
  const sellerEnd=sellerY+companyRows.length*31+93;
  const customerY=sellerEnd+46;
  const clientRows=Math.max(1,customerRows.length)+customerEmailRows.length;
  const metaRows=input.kind==="offerte" ? 3 : 4;
  const clientEnd=customerY+56+Math.max(clientRows*34+45,metaRows*57+20);
  const jobY=clientEnd+24;
  const tableY=jobY+jobTitleRows.length*44+33;
  const tableHeaderH=58;
  const rowStart=tableY+tableHeaderH;
  const rowEnd=rowStart+prepared.reduce((sum,row)=>sum+row.height,0);
  const totalsY=rowEnd+55;
  const totalsEnd=totalsY+(input.kind==="factuur" ? 210 : 134);
  const notesY=totalsEnd+35;
  const notesEnd=notesRows.length ? notesY+56+notesRows.length*33 : totalsEnd+12;
  const footerY=notesEnd+50;
  const footerRows=input.kind==="offerte" ? 2 : 3;
  const footerEnd=footerY+63+footerRows*33;

  if(footerEnd+62>10000) throw new Error(
    "Deze offerte is te lang voor één afbeelding. Gebruik PRINT / PDF."
  );
  canvas.height=Math.max(1470,footerEnd+62);
  const c=canvas.getContext("2d");
  if(!c) throw new Error("Afbeelding kon niet worden gemaakt.");
  c.fillStyle="#ffffff";c.fillRect(0,0,WIDTH,canvas.height);

  c.fillStyle=header;c.fillRect(0,0,WIDTH,205);
  c.fillStyle=accent;c.fillRect(LEFT,170,RIGHT-LEFT,7);
  if(isLem) {
    c.fillStyle=accent;c.fillRect(LEFT,40,550,76);
    text(c,input.company.name.toUpperCase(),LEFT+23,55,41,true,"#141518");
  } else {
    text(c,input.company.name.toUpperCase(),LEFT,49,43,true,"#ffffff");
    text(c,"DAKTECHNIEK · BREDA EN OMGEVING",LEFT,111,18,true,"#c4d8e3");
  }
  text(c,input.kind==="offerte" ? "OFFERTE" : "FACTUUR",RIGHT,60,32,true,isLem?"#f1c757":"#ffffff","right");
  text(c,input.number,RIGHT,113,23,true,isLem?"#fbe6a4":"#d6e9f2","right");

  text(c,"VAN",LEFT,sellerY,19,true,MUTED);
  text(c,input.company.name,LEFT,sellerY+34,28,true);
  lines(c,companyRows,LEFT,sellerY+71,22,31);
  const sellerExtras=[
    "KvK "+input.company.kvk+"   ·   Btw-ID "+input.company.vatId,
    [input.company.phone,input.company.email].filter(Boolean).join("   ·   "),
  ].filter(Boolean);
  sellerExtras.forEach((value,i)=>text(c,value,LEFT,sellerY+74+companyRows.length*31+i*30,20,false,MUTED));

  horizontal(c,customerY-24);
  text(c,"AAN",LEFT,customerY,20,true,MUTED);
  text(c,input.customer.name,LEFT,customerY+38,31,true);
  lines(c,customerRows,LEFT,customerY+85,25,34);
  lines(c,customerEmailRows,LEFT,customerY+85+customerRows.length*34,22,31,MUTED);

  const mx=648;
  text(c,input.kind==="offerte"?"OFFERTEDATUM":"FACTUURDATUM",mx,customerY,18,true,MUTED);
  text(c,input.issueDate,mx,customerY+27,25);
  if(input.kind==="offerte") {
    text(c,"GELDIG TOT",mx,customerY+91,18,true,MUTED);
    text(c,input.validUntil||"—",mx,customerY+121,25);
  } else {
    text(c,"DATUM WERKZAAMHEDEN",mx,customerY+91,18,true,MUTED);
    text(c,input.serviceDate||"—",mx,customerY+121,25);
    text(c,"VERVALDATUM",mx,customerY+175,18,true,MUTED);
    text(c,input.dueDate||"—",mx,customerY+205,25);
  }

  lines(c,jobTitleRows,LEFT,jobY,34,44,INK,true);
  c.fillStyle=header;c.fillRect(LEFT,tableY,RIGHT-LEFT,tableHeaderH);
  text(c,"WERKZAAMHEDEN",LEFT+15,tableY+16,23,true,isLem?"#eab93b":"#ffffff");
  text(c,"AANTAL",RIGHT-15,tableY+16,23,true,isLem?"#eab93b":"#ffffff","right");

  let y=rowStart;
  for(const row of prepared) {
    if(Math.floor((y-rowStart)/62)%2===0){c.fillStyle="#f7fafb";c.fillRect(LEFT,y,RIGHT-LEFT,row.height);}
    lines(c,row.description,LEFT+13,y+12,25,34);
    text(c,row.qty,RIGHT-13,y+17,24,false,INK,"right");
    horizontal(c,y+row.height-1,LINE,1);
    y+=row.height;
  }

  if(input.kind==="factuur") {
    text(c,"Totaal excl. btw",590,totalsY+10,23,false,MUTED);
    text(c,formatMoney(input.subtotal),RIGHT,totalsY+10,24,true,INK,"right");
    text(c,"Btw "+formatQuantity(input.vatRate)+"%",590,totalsY+58,23,false,MUTED);
    text(c,formatMoney(input.vatAmount),RIGHT,totalsY+58,24,true,INK,"right");
    horizontal(c,totalsY+114,header,3);
    text(c,"TOTAAL INCL. BTW",LEFT,totalsY+133,25,true,INK);
    text(c,formatMoney(input.total),RIGHT,totalsY+129,43,true,header,"right");
  } else {
    horizontal(c,totalsY,accent,4);
    text(c,"VASTE TOTAALPRIJS",LEFT,totalsY+22,29,true,INK);
    text(c,"incl. "+formatQuantity(input.vatRate)+"% btw",LEFT,totalsY+63,21,false,MUTED);
    text(c,formatMoney(input.total),RIGHT,totalsY+31,45,true,header,"right");
  }

  if(notesRows.length) {
    horizontal(c,notesY-5);
    text(c,"TOELICHTING",LEFT,notesY+18,21,true,MUTED);
    lines(c,notesRows,LEFT,notesY+56,23,33);
  }

  horizontal(c,footerY,accent,3);
  if(input.kind==="factuur") {
    text(c,"BETALINGSGEGEVENS",LEFT,footerY+21,22,true);
    text(c,"IBAN: "+input.company.iban,LEFT,footerY+56,25,true);
    text(c,"Ten name van "+input.company.name,LEFT,footerY+92,22);
    text(c,"Vermeld factuur "+input.number+" bij betaling.",LEFT,footerY+126,21,false,MUTED);
    if(input.paymentTermDays!==undefined) {
      text(c,"Betaaltermijn: "+input.paymentTermDays+" dagen",LEFT,footerY+161,20,false,MUTED);
    }
  } else {
    text(c,"AKKOORD MET DEZE OFFERTE?",LEFT,footerY+20,22,true);
    text(c,"Neem contact op met "+input.company.name+" om akkoord te geven.",LEFT,footerY+56,22);
    text(c,"De planning gebeurt in overleg.",LEFT,footerY+88,20,false,MUTED);
  }

  return canvas;
}

export async function createCustomerImageBlob(input:CustomerImageInput):Promise<Blob> {
  const canvas=drawCustomerImage(input);
  return new Promise<Blob>((resolve,reject)=>{
    if(typeof canvas.toBlob!=="function") {
      reject(new Error("PNG maken wordt niet ondersteund op dit apparaat."));
      return;
    }
    canvas.toBlob(blob=>{
      if(blob && blob.size>0) resolve(blob);
      else reject(new Error("PNG maken is mislukt. Probeer opnieuw of gebruik PRINT / PDF."));
    },"image/png");
  });
}
