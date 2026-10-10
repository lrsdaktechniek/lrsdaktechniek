// Draait met de bestaande TypeScript dependency, geen extra testframework nodig.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");

const source = fs.readFileSync("src/lib/roofQuote.ts", "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
}).outputText;
const mod = { exports: {} };
new Function("module", "exports", compiled)(mod, mod.exports);
const { calculate, CATALOG } = mod.exports;

test("Dakwerk catalogus heeft alle gevraagde werkzaamheden", () => {
  const full = CATALOG.map(row => row.description.toLowerCase()).join(" | ");
  for (const name of ["bitumen", "dakpannen", "zink", "vogelschroten", "slijpen"]) {
    assert.ok(full.includes(name), "Mist " + name);
  }
});

test("€300 extra man wordt verwerkt in totaal, niet als klantregel", () => {
  const lines = [
    {id:"pannendak",description:"Dakpannen leggen",unit:"m²",qty:20,priceEx:60},
    {id:"vogelschroten",description:"Vogelschroten vervangen",unit:"m¹",qty:10,priceEx:12},
  ];
  const p=calculate(lines,300,true,21);
  assert.equal(p.baseTotal,1320);
  assert.equal(p.surcharge,300);
  assert.equal(p.subtotal,1620);
  assert.equal(p.vat,340.2);
  assert.equal(p.total,1960.2);
  assert.equal(p.publicLines.reduce((s,row)=>s+row.amountEx,0),1620);
  assert.equal(p.publicLines.length,2);
  assert.ok(p.publicLines.every(row=>!row.description.toLowerCase().includes("extra man")));
});

test("Extra medewerker kan uitsluitend intern op de marge drukken", () => {
  const p=calculate([{id:"z",description:"Zinkreparatie",unit:"m¹",qty:5,priceEx:80}],300,false,21);
  assert.equal(p.subtotal,400);
  assert.equal(p.total,484);
  assert.equal(p.surcharge,0);
});

test("Onhandige bedragen worden exact in hele centen verdeeld", () => {
  const lines = Array.from({length:7},(_,i)=>({
    id:String(i),description:"Werk "+i,unit:"stuk",qty:1,priceEx:1.01
  }));
  const p=calculate(lines,0.05,true,21);
  assert.equal(p.subtotal,7.12);
  assert.equal(p.publicLines.reduce((s,l)=>Math.round((s+l.amountEx)*100)/100,0),7.12);
  assert.ok(p.publicLines.every(l=>l.amountEx>=1.01));
});

test("Lege werkbon berekent geen verborgen toeslag als offerte", () => {
  const p=calculate([],300,true,21);
  assert.equal(p.total,0);
  assert.equal(p.publicLines.length,0);
});
