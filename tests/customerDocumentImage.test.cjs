const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const ts=require("typescript");

const moduleJs=ts.transpileModule(
  fs.readFileSync("src/lib/customerDocumentImage.ts","utf8"),{
    compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}
  }
).outputText;
const moduleObj={exports:{}};
new Function("module","exports",moduleJs)(moduleObj,moduleObj.exports);
const {drawCustomerImage,validateCustomerImage,imageFilename,createCustomerImageBlob}=moduleObj.exports;

const base=(kind,issuer)=>({
  kind,issuer,
  company:{
    name:issuer==="lrs"?"LRS Daktechniek":"Allround LEM",
    address:"Pietersberg 21, 4822 TS Breda",
    kvk:issuer==="lrs"?"83217495":"81296061",
    vatId:issuer==="lrs"?"NL003787454B48":"NL003557596B51",
    phone:"06 12345678",email:"info@example.test",
    iban:issuer==="lrs"?"NL69 INGB 0112 7815 51":"NL46 INGB 0109 0156 49",
  },
  customer:{name:"Testklant",address:"Straat 99, 4800 AA Breda",email:"klant@example.test"},
  number:(issuer==="lrs"?"LRS":"LEM")+(kind==="offerte"?"-OFF-2026-0001":"-2026-0001"),
  title:"Complete dakrenovatie",
  issueDate:"10-10-2026",validUntil:"09-11-2026",serviceDate:"10-10-2026",
  dueDate:"24-10-2026",paymentTermDays:14,
  lines:[
    {description:"Zinkwerk repareren",qty:1,unit:"m¹"},
    {description:"Bitumen aanbrengen",qty:15,unit:"m²"},
    {description:"Steiger plaatsen",qty:1,unit:"post"},
  ],
  subtotal:2736.43,vatRate:21,vatAmount:574.65,total:3311.08,
  notes:"Werk volgens afspraak en onder passende weersomstandigheden.",
});
function fakeCanvas(){
  const written=[];
  const ctx={
    fillStyle:"",strokeStyle:"",font:"",textAlign:"left",textBaseline:"top",
    fillText(value){written.push(String(value));},
    fillRect(){},
    measureText(value){return {width:String(value).length*13};},
  };
  const canvas={
    width:0,height:0,written,
    getContext:()=>ctx,
    toBlob(callback,type){
      assert.equal(type,"image/png");
      callback(new Blob([Buffer.from([137,80,78,71,13,10,26,10,1])],{type:"image/png"}));
    }
  };
  return canvas;
}
test("Offerte heeft precies één geldbedrag, alleen eindtotaal",()=>{
  for(const issuer of ["lrs","allround-lem"]){
    const input=base("offerte",issuer);
    const canvas=fakeCanvas();
    const result=drawCustomerImage(input,()=>canvas);
    assert.equal(result,canvas);
    assert.equal(result.width,1100);
    assert.ok(result.height>=1470);
    assert.ok(result.height<10000);
    const money=canvas.written.filter(text=>text.includes("€"));
    assert.deepEqual(money,["€ 3.311,08"]);
    const all=canvas.written.join(" \n ");
    for(const word of ["Zinkwerk repareren","Bitumen aanbrengen","Steiger plaatsen","15 m²","AANTAL","VASTE TOTAALPRIJS"]) assert.match(all,new RegExp(word.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")));
    for(const amount of ["2.736,43","574,65","500,00","110,85"])assert.ok(!all.includes(amount),"los bedrag "+amount);
    assert.ok(!all.includes("BETALINGSGEGEVENS"));
  }
});

test("Factuur bevat fiscale BTW-bedragen en geselecteerde bank, geen losse regelprijzen",()=>{
  for(const issuer of ["lrs","allround-lem"]){
    const data=base("factuur",issuer);
    const canvas=fakeCanvas();
    drawCustomerImage(data,()=>canvas);
    const texts=canvas.written.join(" | ");
    assert.match(texts,/Totaal excl\. btw/);
    assert.match(texts,/Btw 21%/);
    assert.match(texts,/€ 2\.736,43/);
    assert.match(texts,/€ 574,65/);
    assert.match(texts,/€ 3\.311,08/);
    assert.match(texts,/BETALINGSGEGEVENS/);
    assert.match(texts,new RegExp(data.company.iban));
    assert.match(texts,/Steiger plaatsen/);
    assert.ok(!texts.includes("€ 500,00"));
  }
});

test("De afbeelding volgt ook LRS-rekening 2",()=>{
  const data=base("factuur","lrs");
  data.company.iban="NL46 INGB 0109 0156 49";
  const canvas=fakeCanvas();
  drawCustomerImage(data,()=>canvas);
  const texts=canvas.written.join(" | ");
  assert.match(texts,/NL46 INGB 0109 0156 49/);
  assert.ok(!texts.includes("NL69 INGB 0112 7815 51"));
});

test("PNG bestandsnamen zijn duidelijk, zonder dubbele LRS/LEM prefix",()=>{
  assert.equal(imageFilename(base("offerte","lrs")),"LRS-OFFERTE-2026-0001.png");
  assert.equal(imageFilename(base("offerte","allround-lem")),"LEM-OFFERTE-2026-0001.png");
  assert.equal(imageFilename(base("factuur","lrs")),"LRS-FACTUUR-2026-0001.png");
  assert.equal(imageFilename(base("factuur","allround-lem")),"LEM-FACTUUR-2026-0001.png");
});

test("Klant- en bedrijfsinformatie en BTW moeten geldig zijn",()=>{
  const data=base("offerte","lrs");
  assert.equal(validateCustomerImage(data),null);
  assert.match(validateCustomerImage({...data,customer:{...data.customer,name:""}}),/klantnaam/i);
  assert.match(validateCustomerImage({...data,company:{...data.company,address:""}}),/bedrijfsgegevens/i);
  assert.match(validateCustomerImage({...data,lines:[]}),/werkzaamheid/i);
  assert.match(validateCustomerImage({...data,total:0}),/totaal/i);
  const inv=base("factuur","lrs");
  assert.match(validateCustomerImage({...inv,company:{...inv.company,iban:""}}),/bankrekening/i);
  assert.match(validateCustomerImage({...inv,vatAmount:574}),/btw/i);
});

test("Lange tekst wordt afgebroken en past binnen een enkele iPhone PNG",()=>{
  const input=base("offerte","lrs");
  input.lines=Array.from({length:40},(_,i)=>({
    description:"Dakwerkzaamheid "+i+" — bijzondere technische verbinding en reparatie uitgevoerd op hoogte",
    qty:i+1,unit:"m²",
  }));
  const c=fakeCanvas();
  drawCustomerImage(input,()=>c);
  assert.ok(c.height>2300);
  assert.ok(c.height<=10000);
  const all=c.written.join(" ");
  assert.match(all,/Dakwerkzaamheid 39/);
  assert.match(all,/€ 3\.311,08/);
});

test("PNG blob kan zonder internet of externe afbeeldingen gemaakt worden",async()=>{
  const oldDoc=global.document;
  const canvas=fakeCanvas();
  global.document={createElement:()=>canvas};
  try {
    const blob=await createCustomerImageBlob(base("offerte","lrs"));
    assert.ok(blob instanceof Blob);
    assert.equal(blob.type,"image/png");
    assert.ok(blob.size>0);
  } finally {
    global.document=oldDoc;
  }
});

test("Gebruikersknoppen voor beide documenten en reparatie bestaan",()=>{
  const component=fs.readFileSync("src/components/CustomerImageActions.tsx","utf8");
  const roof=fs.readFileSync("src/components/RoofQuoteBuilder.tsx","utf8");
  const repair=fs.readFileSync("src/components/QuoteBuilder.tsx","utf8");
  assert.match(component,/navigator\.share\(/);
  assert.match(component,/download=fileName/);
  assert.match(component,/DELEN \/ FOTO/);
  assert.match(component,/OPSLAAN PNG/);
  assert.match(component,/generated\?\.fingerprint===fingerprint/);
  assert.match(roof,/<CustomerImageActions/);
  assert.match(roof,/invoicePreview \? invoiceImage : quoteImage/);
  assert.match(roof,/onExport=\{invoicePreview \? reserveExportedInvoice : undefined\}/);
  assert.match(repair,/<CustomerImageActions/);
  assert.match(repair,/repairOfferImage/);
  assert.match(repair,/FACTUURAFBEELDING MAKEN/);
  assert.match(repair,/OPSLAAN PNG/);
});
