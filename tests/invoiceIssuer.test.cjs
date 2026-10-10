const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
const { timingSafeEqual } = require("node:crypto");

function loadTs(filename, imports={}) {
  const js = ts.transpileModule(fs.readFileSync(filename,"utf8"),{
    compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}
  }).outputText;
  const m={exports:{}};
  const requireLocal=name=>imports[name]??require(name);
  new Function("require","module","exports",js)(requireLocal,m,m.exports);
  return m.exports;
}
const issuers=loadTs("src/lib/invoiceIssuer.ts");
const invoiceApi=loadTs("src/app/api/factuur/route.ts",{
  "@/lib/invoiceIssuer":issuers,
});
const quoteApi=loadTs("src/app/api/dakofferte/route.ts",{
  "@/lib/invoiceIssuer":issuers,
  "@/lib/content":{site:{name:"LRS Daktechniek",kvk:"83217495",email:"info@lrsdaktechniek.nl",phoneDisplay:"06 15283626"}},
});

const lem=issuers.INVOICE_ISSUERS["allround-lem"];
const lrs=issuers.INVOICE_ISSUERS.lrs;
const makeInvoice=(issuer)=>({
  issuer,accessToken:"SECURE_INTERNAL_TEST",
  customer:{name:"Test Klant",address:"Klantstraat 1, 1234 AB Test",email:"klant@example.test"},
  business:{name:issuers.INVOICE_ISSUERS[issuer].name,address:"Sellerstraat 1, 1234 CD Test",
    email:"",phone:"",kvk:issuers.INVOICE_ISSUERS[issuer].kvk,
    vatId:issuers.INVOICE_ISSUERS[issuer].vatId,iban:issuers.INVOICE_ISSUERS[issuer].iban},
  invoice:{number:issuers.formatInvoiceNumber(issuer,7,2026),issueDate:"2026-10-10",serviceDate:"2026-10-08",title:"Dakrenovatie",paymentTermDays:14,notes:""},
  lines:[{description:"Dakrenovatie",unit:"opdracht",qty:1,amountEx:1000}],
  subtotal:1000,vatRate:21,vatAmount:210,total:1210
});
const makeQuote=(issuer)=>({
  accessToken:"SECURE_INTERNAL_TEST",
  quote:{issuer,number:"OFF-7",issueDate:"2026-10-10",validDays:30,
    title:"Dak renovatie",customer:{name:"Test Klant",address:"Klantstraat 1, 1234 AB Test",
      email:"klant@example.test",phone:""},
    businessAddress:"Sellerstraat 1, 1234 CD Test",vatId:issuers.INVOICE_ISSUERS[issuer].vatId,
    lines:[{description:"Dakpannen leggen",unit:"m²",qty:10,amountEx:1000}],
    subtotal:1000,vatRate:21,vatAmount:210,total:1210,notes:""},
});
async function post(url,payload,handler) {
  const r=new Request(url,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload)});
  return handler.POST(r);
}
async function withFakeResend(fn) {
  const oldEnv={...process.env};
  const oldFetch=global.fetch;
  const outgoing=[];
  try {
    process.env.OFFERTE_SECRET="SECURE_INTERNAL_TEST";
    process.env.RESEND_API_KEY="NO_REAL_API_KEY";
    process.env.FACTUUR_FROM_EMAIL="invoices@lrs-example.test";
    process.env.OFFERTE_FROM_EMAIL="quotes@lrs-example.test";
    process.env.ALLROUND_LEM_FROM_EMAIL="invoices@lem-example.test";
    global.fetch=async (url,opts)=>{
      assert.equal(url,"https://api.resend.com/emails");
      const body=JSON.parse(opts.body);
      outgoing.push(body);
      return {ok:true,json:async()=>({id:"mock-id"})};
    };
    return await fn(outgoing);
  } finally {
    global.fetch=oldFetch;
    process.env=oldEnv;
  }
}
test("De knoppen horen bij twee gescheiden juridische entiteiten",()=>{
  assert.equal(lrs.name,"LRS Daktechniek");
  assert.equal(lem.name,"Allround LEM");
  assert.equal(lem.kvk,"81296061");
  assert.equal(lem.vatId,"NL003557596B51");
  assert.equal(lem.iban,"NL46 INGB 0109 0156 49");
  assert.notEqual(lrs.vatId,lem.vatId);
  assert.notEqual(lrs.iban,lem.iban);
  assert.equal(issuers.issuerDefaults("allround-lem").businessAddress,"");
  assert.equal(issuers.formatInvoiceNumber("lrs",7,2026),"LRS-2026-0007");
  assert.equal(issuers.formatInvoiceNumber("allround-lem",7,2026),"LEM-2026-0007");
  const storage=new Map();
  const local={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)};
  assert.equal(issuers.pendingInvoiceNumber("allround-lem",local).split("-").at(2),"0001");
  issuers.registerInvoiceUsed("allround-lem","LEM-2026-0001",local);
  assert.equal(issuers.pendingInvoiceNumber("allround-lem",local),"LEM-2026-0002");
  assert.equal(issuers.pendingInvoiceNumber("lrs",local),"LRS-2026-0001");
});

test("Allround LEM factuur bevat uitsluitend LEM KvK, btw, bank en afzender",async()=>{
  await withFakeResend(async outgoing=>{
    const response=await post("https://example.test/api/factuur",makeInvoice("allround-lem"),invoiceApi);
    assert.equal(response.status,200,await response.text());
    const email=outgoing.at(-1);
    assert.match(email.from,/Allround LEM <invoices@lem-example.test>/);
    assert.match(email.subject,/Allround LEM/);
    assert.match(email.html,/Allround LEM/);
    assert.match(email.html,/81296061/);
    assert.match(email.html,/NL003557596B51/);
    assert.match(email.html,/NL46 INGB 0109 0156 49/);
    assert.ok(!email.html.includes("83217495"));
    assert.ok(!email.html.includes("NL003787454B48"));
  });
});

test("LRS factuur zonder extra issuer-veld blijft LRS",async()=>{
  await withFakeResend(async outgoing=>{
    const p=makeInvoice("lrs");delete p.issuer;
    const response=await post("https://example.test/api/factuur",p,invoiceApi);
    assert.equal(response.status,200,await response.text());
    assert.equal(outgoing[0].from,"invoices@lrs-example.test");
    assert.match(outgoing[0].html,/83217495/);
    assert.match(outgoing[0].html,/NL69 INGB 0112 7815 51/);
    assert.ok(!outgoing[0].html.includes("81296061"));
  });
});

test("LRS gegevens onder LEM-knop worden door de server afgewezen",async()=>{
  await withFakeResend(async outgoing=>{
    const p=makeInvoice("lrs");p.issuer="allround-lem";
    const response=await post("https://example.test/api/factuur",p,invoiceApi);
    assert.equal(response.status,400);
    assert.equal(outgoing.length,0);
  });
});

test("Zonder afzonderlijke geverifieerde LEM-afzender wordt nooit via LRS verzonden",async()=>{
  await withFakeResend(async outgoing=>{
    delete process.env.ALLROUND_LEM_FROM_EMAIL;
    const response=await post("https://example.test/api/factuur",makeInvoice("allround-lem"),invoiceApi);
    assert.equal(response.status,503);
    assert.match((await response.json()).error,/ALLROUND_LEM_FROM_EMAIL/);
    assert.equal(outgoing.length,0);
  });
});

test("Allround LEM offerte heeft ook de correcte naam/afzender",async()=>{
  await withFakeResend(async outgoing=>{
    const response=await post("https://example.test/api/dakofferte",makeQuote("allround-lem"),quoteApi);
    assert.equal(response.status,200,await response.text());
    const msg=outgoing[0];
    assert.match(msg.subject,/Allround LEM/);
    assert.match(msg.from,/Allround LEM/);
    assert.match(msg.html,/81296061/);
    assert.match(msg.html,/NL003557596B51/);
    assert.ok(!msg.html.includes("83217495"));
  });
});

test("Beide werkbonnen bieden echt twee zichtbare afzenderknoppen",()=>{
  const picker=fs.readFileSync("src/components/InvoiceIssuerPicker.tsx","utf8");
  assert.match(picker,/INVOICE_ISSUER_IDS.map/);
  assert.match(picker,/aria-pressed/);
  const repair=fs.readFileSync("src/components/QuoteBuilder.tsx","utf8");
  const roof=fs.readFileSync("src/components/RoofQuoteBuilder.tsx","utf8");
  assert.match(repair,/<InvoiceIssuerPicker/);
  assert.match(roof,/<InvoiceIssuerPicker/);
  assert.match(repair,/issuer: invoiceIssuer/);
  assert.match(roof,/issuer,/);
});

test("Onvolledig Allround LEM factuuradres wordt geweigerd",async()=>{
  await withFakeResend(async outgoing=>{
    const p=makeInvoice("allround-lem");
    p.business.address="";
    const res=await post("https://example.test/api/factuur",p,invoiceApi);
    assert.equal(res.status,400);
    assert.equal(outgoing.length,0);
  });
});

test("Allround LEM offerte met LRS btw-nummer wordt geweigerd",async()=>{
  await withFakeResend(async outgoing=>{
    const p=makeQuote("allround-lem");
    p.quote.vatId=lrs.vatId;
    const res=await post("https://example.test/api/dakofferte",p,quoteApi);
    assert.equal(res.status,400);
    assert.equal(outgoing.length,0);
  });
});

test("Reparatiefactuur kan als factuur voor beide entiteiten worden afgedrukt",()=>{
  const repair=fs.readFileSync("src/components/QuoteBuilder.tsx","utf8");
  assert.match(repair,/function printCustomerInvoice/);
  assert.match(repair,/FACTUUR PRINT \/ PDF/);
  assert.match(repair,/printInvoiceMode\s*\?/);
  assert.match(repair,/invoiceBrand\.kvk/);
  assert.match(repair,/invoiceBrand\.iban/);
  assert.match(repair,/invoiceSentFor/);
});

test("Per afzender kiezen bewaart separate factuurinstellingen",()=>{
  const repair=fs.readFileSync("src/components/QuoteBuilder.tsx","utf8");
  const roof=fs.readFileSync("src/components/RoofQuoteBuilder.tsx","utf8");
  assert.match(repair,/INVOICE_ISSUERS\[chosen\]\.settingsKey/);
  assert.match(roof,/INVOICE_ISSUERS\[id\]\.settingsKey/);
  assert.match(roof,/invoiceDetails:\{issueDate/);
  assert.match(roof,/const isAccepted=Boolean\(project\?\.acceptedSignature/);
});
