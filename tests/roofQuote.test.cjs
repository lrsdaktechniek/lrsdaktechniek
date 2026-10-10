const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const ts=require("typescript");
const source=fs.readFileSync("src/lib/roofQuote.ts","utf8");
const compiled=ts.transpileModule(source,{
  compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}
}).outputText;
const mod={exports:{}};
new Function("module","exports",compiled)(mod,mod.exports);
const {calculate,CATALOG,DEFAULT_PRICES,MIN_ROOF_JOB_EX,volumeRate}=mod.exports;
const work=(id,qty,priceEx,unit="m²")=>({id,description:"Dakwerk "+id,unit,qty,priceEx});

test("Elke standaardwerkzaamheid heeft direct een geldige vaste prijs",()=>{
  assert.ok(CATALOG.length>=33);
  assert.equal(new Set(CATALOG.map(item=>item.id)).size,CATALOG.length);
  for(const item of CATALOG) {
    assert.ok(item.defaultPriceEx>0 && Number.isFinite(item.defaultPriceEx),item.id);
    assert.equal(DEFAULT_PRICES[item.id],item.defaultPriceEx);
  }
  for(const name of ["bitumen","dakpannen","zink","vogelschroten","slijpen"])
    assert.ok(CATALOG.some(item=>item.description.toLowerCase().includes(name)),name);
});

test("Interne hoofdprijzen passen bij de openbare LRS-bandbreedtes",()=>{
  const bands=[
    ["bitumen",70,126],["overlagen",56,77],["warmdak",126,210],
    ["pannen-beton",56,98],["pannen-keramisch",84,140],
    ["pannen-renovatie",91,154]
  ];
  for (const [id,min,max] of bands) {
    const incl=DEFAULT_PRICES[id]*1.21;
    assert.ok(incl>=min&&incl<=max,id+" heeft "+incl+" buiten openbare prijsband");
  }
});

test("Staffels verlagen uitsluitend de meters boven drempels",()=>{
  assert.equal(volumeRate(1,"m²"),1);
  assert.equal(volumeRate(10,"m²"),10);
  assert.equal(volumeRate(30,"m²"),10+20*.96);
  assert.equal(volumeRate(100,"m²"),10+20*.96+45*.91+25*.86);
  assert.equal(volumeRate(5,"m¹"),5);
  assert.equal(volumeRate(15,"m¹"),5+10*.96);
  assert.equal(volumeRate(100,"uur"),100); // geen korting op uren
  assert.equal(volumeRate(3,"post"),3); // geen korting op vaste posten
});

test("Meer m² geeft altijd een hoger totaal en lagere gemiddelde m²-prijs",()=>{
  const p=(qty)=>calculate([work("bitumen",qty,95)],0,false,21);
  let previous=0;
  for(let qty=1;qty<=225;qty++) {
    const actual=p(qty);
    assert.ok(actual.subtotal>=previous,"Totaal daalde bij "+qty+"m²");
    previous=actual.subtotal;
    assert.ok(actual.internalLines[0].afterStaffelEx>=actual.internalLines[0].baseEx*.82-.01);
  }
  assert.ok(p(100).subtotal/100<p(10).subtotal/10);
  assert.equal(p(10).minimumCharge,0);
});

test("Grotere aantallen zinkwerk blijven monotone tarieven",()=>{
  let old=0;
  for(let qty=1;qty<=150;qty++){
    const result=calculate([work("zink-goot",qty,94,"m¹")],0,false,21);
    assert.ok(result.subtotal>=old,"Daling bij "+qty+" meter");
    old=result.subtotal;
  }
});

test("Meer soorten werkzaamheden geeft beperkt meeneemvoordeel",()=>{
  const one=calculate([work("bitumen",50,95)],0,false,21);
  const two=calculate([work("bitumen",50,95),work("vogelschroten",15,29,"m¹")],0,false,21);
  assert.equal(one.combineDiscount,0);
  assert.ok(two.combineDiscount>0);
  assert.ok(two.subtotal>one.subtotal);
  assert.ok(two.combineDiscount<two.baseTotal*.06);
});

test("Het kortingsplafond per werkregel bedraagt 18 procent",()=>{
  const lines=Array.from({length:12},(_,i)=>work(String(i),300,100,"m²"));
  const result=calculate(lines,0,false,21);
  assert.ok(result.internalLines.every(line=>line.afterStaffelEx>=line.baseEx*.82-.01));
});

test("Minimumbedrag beschermt kleine dakprojecten en verschijnt niet als aparte klantregel",()=>{
  const result=calculate([work("vogelschroten",1,29,"m¹")],0,false,21);
  assert.equal(result.subtotal,MIN_ROOF_JOB_EX);
  assert.equal(result.minimumCharge,MIN_ROOF_JOB_EX-29);
  assert.equal(result.publicLines.length,1);
  assert.equal(result.publicLines[0].amountEx,MIN_ROOF_JOB_EX);
});

test("Extra man €300 verwerkt, maar geen aparte factuurregel",()=>{
  const lines=[work("bitumen",20,95),work("vogelschroten",10,29,"m¹")];
  const without=calculate(lines,0,false,21);
  const withPerson=calculate(lines,300,true,21);
  assert.equal(withPerson.subtotal-without.subtotal,300);
  assert.equal(withPerson.publicLines.length,2);
  assert.equal(withPerson.publicLines.reduce((s,l)=>s+l.amountEx,0),withPerson.subtotal);
  assert.ok(withPerson.publicLines.every(l=>!l.description.toLowerCase().includes("man")));
  assert.equal(calculate(lines,300,false,21).subtotal,without.subtotal);
});

test("Ronding in centen blijft exact inclusief BTW",()=>{
  const lines=Array.from({length:15},(_,i)=>work("line"+i,12.5,14.13,"m¹"));
  const r=calculate(lines,0.05,true,21);
  assert.equal(Math.round(r.publicLines.reduce((s,l)=>s+l.amountEx,0)*100),Math.round(r.subtotal*100));
  assert.equal(Math.round((r.subtotal+r.vat)*100),Math.round(r.total*100));
});

test("Reeds aan klant verstuurde legacy offertes behouden hun oude berekening",()=>{
  const lines=[work("bitumen",20,60),work("vogelschroten",10,12,"m¹")];
  const old=calculate(lines,300,true,21,"legacy");
  assert.equal(old.baseTotal,1320);
  assert.equal(old.subtotal,1620);
  assert.equal(old.total,1960.2);
  assert.equal(old.combineDiscount,0);
  assert.equal(old.minimumCharge,0);
});

test("Geen werk geeft geen kunstmatige factuur of minimum",()=>{
  const result=calculate([],300,true,21);
  assert.equal(result.total,0);
  assert.equal(result.minimumCharge,0);
  assert.equal(result.publicLines.length,0);
});

test("In beide werkbonnen kan een nieuwe, echt lege klus worden gestart",()=>{
  const repair=fs.readFileSync("src/components/QuoteBuilder.tsx","utf8");
  const roof=fs.readFileSync("src/components/RoofQuoteBuilder.tsx","utf8");
  assert.ok(repair.includes("setSelected([]); // NIEUWE KLUS"));
  assert.ok(repair.includes("NIEUWE KLUS · LEEG"));
  assert.ok(roof.includes("NIEUWE KLUS · LEEG BEGINNEN"));
  assert.ok(roof.includes("items:[]"));
});

test("Ook zeer kleine decimalen veroorzaken nooit NaN of Infinity",()=>{
  const tiny=calculate([work("tiny",0.01,0.01,"m²")],0.01,true,21);
  assert.ok(Number.isFinite(tiny.subtotal));
  assert.ok(Number.isFinite(tiny.vat));
  assert.ok(Number.isFinite(tiny.total));
  assert.equal(tiny.publicLines.length,1);
  assert.ok(tiny.total>=MIN_ROOF_JOB_EX);
});

test("Lege reparatiewerkbon blijft leeg na wisselen van tab",()=>{
  const source=fs.readFileSync("src/components/QuoteBuilder.tsx","utf8");
  assert.ok(source.includes("setSelected(Array.isArray(draft.selected) ? draft.selected"));
});
