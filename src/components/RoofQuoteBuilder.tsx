"use client";

import { useEffect, useMemo, useState } from "react";
import { site } from "@/lib/content";
import { CATALOG, CATEGORIES, WorkLine, calculate, euro, formattedDay, localDay } from "@/lib/roofQuote";

type Project = {
  id: string;
  number: string;
  customer: string;
  address: string;
  email: string;
  phone: string;
  title: string;
  quoteDate: string;
  workDate: string;
  validityDays: number;
  publicNotes: string;
  privateNotes: string;
  items: WorkLine[];
  extraPersonEx: number;
  chargeExtraPerson: boolean;
  vatRate: number;
  sentSignature: string;
  acceptedSignature: string;
  acceptedAt: string;
  invoiceSentAt: string;
  invoiceNumber: string;
  invoiceDetails?: { issueDate: string; iban: string; paymentTermDays: number; businessAddress: string; vatId: string };
};
type InvoiceSettings = { businessAddress: string; vatId: string; iban: string; paymentTermDays: number };
type Archive = { activeId: string; projects: Project[] };

const PROJECTS_KEY = "lrs-roof-projects-v1";
const PRICE_KEY = "lrs-roof-unitprices-v1";
const QUOTE_SEQ = "lrs-roof-quote-sequence-v1";
const INVOICE_SETTINGS_KEY = "lrs-invoice-settings-v1";
const INVOICE_SEQ = "lrs-invoice-sequence-v1";
const INVOICE_USED = "lrs-invoice-issued-v1:";
const DEFAULT_SETTINGS: InvoiceSettings = {
  businessAddress: "Pietersberg 21, 4822 TS Breda",
  vatId: "NL003787454B48",
  iban: "NL69 INGB 0112 7815 51",
  paymentTermDays: 14,
};
const BANKS = [
  "NL69 INGB 0112 7815 51",
  "NL46 INGB 0109 0156 49",
];

function uuid() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()) + "-" + Math.random().toString(36).slice(2,10);
}
function safeNum(value: string, max = 1000000) {
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? Math.min(n,max) : 0;
}
function nextQuoteNumber() {
  let sequence = 1;
  try {
    sequence = Math.max(1, Number(localStorage.getItem(QUOTE_SEQ)) || 1);
    localStorage.setItem(QUOTE_SEQ, String(sequence + 1));
  } catch { /* private browsing: backup may be unavailable */ }
  return "LRS-OFF-" + new Date().getFullYear() + "-" + String(sequence).padStart(4,"0");
}
function makeProject(): Project {
  return {
    id:uuid(), number:nextQuoteNumber(),
    customer:"",address:"",email:"",phone:"",title:"Dakwerkzaamheden",
    quoteDate:localDay(),workDate:localDay(),validityDays:30,
    publicNotes:"",privateNotes:"",items:[],extraPersonEx:0,chargeExtraPerson:true,vatRate:21,
    sentSignature:"",acceptedSignature:"",acceptedAt:"",invoiceSentAt:"",invoiceNumber:"",
  };
}
function nextInvoiceNumber() {
  let seq=1;
  try { seq = Math.max(1, Number(localStorage.getItem(INVOICE_SEQ)) || 1); } catch {}
  return "LRS-" + new Date().getFullYear() + "-" + String(seq).padStart(4,"0");
}
function markInvoiceUsed(number:string) {
  try {
    if (localStorage.getItem(INVOICE_USED + number)) return;
    localStorage.setItem(INVOICE_USED + number,new Date().toISOString());
    const seq=Math.max(1,Number(localStorage.getItem(INVOICE_SEQ)) || 1);
    if (number === "LRS-" + new Date().getFullYear() + "-" + String(seq).padStart(4,"0")) {
      localStorage.setItem(INVOICE_SEQ,String(seq + 1));
    }
  } catch { /* nummer blijft in project opgeslagen */ }
}
function validEmail(email:string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
function dateAdd(date:string,days:number) {
  const d=new Date(date + "T12:00:00Z");
  if (Number.isNaN(d.valueOf())) return "—";
  d.setUTCDate(d.getUTCDate()+days);
  return d.toLocaleDateString("nl-NL",{timeZone:"UTC"});
}

export function RoofQuoteBuilder({accessToken}:{accessToken:string}) {
  const [projects,setProjects]=useState<Project[]>([]);
  const [activeId,setActiveId]=useState("");
  const [ready,setReady]=useState(false);
  const [prices,setPrices]=useState<Record<string,number>>({});
  const [settings,setSettings]=useState<InvoiceSettings>(DEFAULT_SETTINGS);
  const [category,setCategory]=useState(CATEGORIES[0]);
  const [search,setSearch]=useState("");
  const [showBook,setShowBook]=useState(false);
  const [busy,setBusy]=useState<""|"quote"|"invoice">("");
  const [notice,setNotice]=useState("");
  const [preview,setPreview]=useState<"quote"|"invoice">("quote");
  const [printQueued,setPrintQueued]=useState(false);

  useEffect(()=>{
    try {
      const stored=JSON.parse(localStorage.getItem(PROJECTS_KEY) || "null") as Archive | null;
      if (stored && Array.isArray(stored.projects) && stored.projects.length) {
        const good=stored.projects.filter(row=>row && typeof row.id==="string" && Array.isArray(row.items)).slice(0,200);
        if (good.length) {
          setProjects(good);
          setActiveId(good.some(row=>row.id===stored.activeId)?stored.activeId:good[0].id);
        } else {
          const fresh=makeProject();setProjects([fresh]);setActiveId(fresh.id);
        }
      } else {
        const fresh=makeProject();setProjects([fresh]);setActiveId(fresh.id);
      }
      const savedPrices=JSON.parse(localStorage.getItem(PRICE_KEY) || "{}");
      if (savedPrices && typeof savedPrices==="object") setPrices(savedPrices);
      const savedSettings=JSON.parse(localStorage.getItem(INVOICE_SETTINGS_KEY) || "null") as Partial<InvoiceSettings> | null;
      if (savedSettings) setSettings({...DEFAULT_SETTINGS,...savedSettings});
    } catch {
      const fresh=makeProject();setProjects([fresh]);setActiveId(fresh.id);
    }
    setReady(true);
  },[]);

  useEffect(()=>{
    if (!ready) return;
    try { localStorage.setItem(PROJECTS_KEY,JSON.stringify({activeId,projects})); }
    catch { /* browseropslag niet beschikbaar */ }
  },[activeId,projects,ready]);
  useEffect(()=>{
    if (!ready) return;
    try {localStorage.setItem(PRICE_KEY,JSON.stringify(prices));}
    catch {}
  },[prices,ready]);
  useEffect(()=>{
    if (!ready) return;
    try {localStorage.setItem(INVOICE_SETTINGS_KEY,JSON.stringify(settings));}
    catch {}
  },[settings,ready]);
  useEffect(()=>{
    if (!printQueued) return;
    const timer=window.setTimeout(()=>window.print(),100);
    const onAfter=()=>setPrintQueued(false);
    window.addEventListener("afterprint",onAfter);
    return ()=>{window.clearTimeout(timer);window.removeEventListener("afterprint",onAfter);};
  },[printQueued,preview]);

  const project=projects.find(row=>row.id===activeId);
  const pricing=useMemo(()=>project
    ? calculate(project.items,project.extraPersonEx,project.chargeExtraPerson,project.vatRate)
    : calculate([],0,false,21),[project]);
  // Dit object bevat uitsluitend klantgegevens. Interne kosten/notities verlaten de browser nooit.
  const quote=useMemo(()=>project?{
    number:project.number,title:project.title.trim(),issueDate:project.quoteDate,
    validDays:project.validityDays,
    customer:{name:project.customer.trim(),address:project.address.trim(),email:project.email.trim(),phone:project.phone.trim()},
    businessAddress:settings.businessAddress.trim(),vatId:settings.vatId.trim(),
    lines:pricing.publicLines,subtotal:pricing.subtotal,vatRate:project.vatRate,
    vatAmount:pricing.vat,total:pricing.total,notes:project.publicNotes.trim(),
  }:null,[project,settings.businessAddress,settings.vatId,pricing]);
  const signature=quote?JSON.stringify(quote):"";
  const isAccepted=Boolean(project?.acceptedSignature && project.acceptedSignature===signature);
  const isSent=Boolean(project?.sentSignature && project.sentSignature===signature);
  const locked=Boolean(project?.invoiceSentAt);
  const listed=CATALOG.filter(item=>{
    const q=search.trim().toLowerCase();
    return q ? (item.description+" "+item.category).toLowerCase().includes(q) : item.category===category;
  });

  function edit(patch:Partial<Project>) {
    if (!project || locked || busy) return;
    setProjects(rows=>rows.map(row=>row.id===project.id?{...row,...patch}:row));
    setNotice("");
  }
  function updateLine(id:string,patch:Partial<WorkLine>) {
    if (!project) return;
    edit({items:project.items.map(row=>row.id===id?{...row,...patch}:row)});
  }
  function addLine(id:string) {
    if (!project || locked || busy || project.items.length>=50 || project.items.some(row=>row.id===id)) return;
    const item=CATALOG.find(row=>row.id===id);
    if (!item) return;
    edit({items:[...project.items,{id:item.id,description:item.description,qty:1,unit:item.unit,priceEx:Number(prices[id])||0}]});
  }
  function newProject() {
    if (projects.length>=200) {setNotice("Maximaal 200 lokale projecten. Archiveer eerst je gegevens.");return;}
    const fresh=makeProject();
    setProjects(rows=>[fresh,...rows]);
    setActiveId(fresh.id);
    setNotice("Nieuw project aangemaakt en automatisch lokaal opgeslagen.");
    setPreview("quote");
  }
  function removeProject() {
    if (!project || !window.confirm("Project "+project.number+" verwijderen? Deze actie kan niet worden teruggedraaid.")) return;
    const remain=projects.filter(row=>row.id!==project.id);
    if (remain.length) {setProjects(remain);setActiveId(remain[0].id);}
    else {const fresh=makeProject();setProjects([fresh]);setActiveId(fresh.id);}
    setNotice("Project verwijderd.");
    setPreview("quote");
  }
  function saveAsStandardPrices() {
    if (!project) return;
    setPrices(previous=>({...previous,...Object.fromEntries(project.items
      .filter(row=>!row.id.startsWith("own-")&&row.priceEx>0)
      .map(row=>[row.id,row.priceEx]))}));
    setNotice("De ingevulde eenheidsprijzen zijn opgeslagen voor nieuwe projecten op dit apparaat.");
  }
  function checkQuote(withEmail:boolean) {
    if (!project||!quote) return "Geen dakproject geselecteerd.";
    if (!project.customer.trim() || !project.address.trim()) return "Vul klantnaam en volledig adres in.";
    if (withEmail && !validEmail(project.email)) return "Vul een geldig e-mailadres van de klant in.";
    if (!project.title.trim()) return "Vul een projectomschrijving in.";
    if (!settings.businessAddress.trim() || !settings.vatId.trim()) return "Vul je bedrijfsgegevens in.";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(project.quoteDate) || !/^\d{4}-\d{2}-\d{2}$/.test(project.workDate)) return "Vul de datums in.";
    if (!Number.isInteger(project.validityDays) || project.validityDays<1 || project.validityDays>90) return "Geldigheid moet tussen 1 en 90 dagen liggen.";
    if (!project.items.length) return "Selecteer minimaal één dakwerkzaamheid.";
    if (project.items.length>50) return "Maximaal 50 regels per offerte.";
    if (project.items.some(row=>!row.description.trim()||!row.unit.trim()||
      !Number.isFinite(row.qty)||row.qty<=0||!Number.isFinite(row.priceEx)||row.priceEx<=0)) {
      return "Vul bij iedere geselecteerde regel omschrijving, aantal en verkoopprijs in (boven € 0).";
    }
    if (pricing.total<=0 || pricing.total>100000000) return "Het totaalbedrag is ongeldig.";
    return "";
  }

  function print(mode:"quote"|"invoice") {
    const error=checkQuote(false);
    if (error) {setNotice(error);return;}
    if (mode==="invoice" && !isAccepted && !locked) {setNotice("Markeer eerst dat de klant akkoord heeft gegeven.");return;}
    setPreview(mode);
    setPrintQueued(true);
  }
  async function copyQuote() {
    if (!project) return;
    const error=checkQuote(false);
    if (error) {setNotice(error);return;}
    const text=[
      "LRS Daktechniek · Offerte "+project.number,
      project.title, "Klant: "+project.customer,
      "Adres: "+project.address,
      "",
      ...pricing.publicLines.map(line=>"- "+line.description+" ("+line.qty+" "+line.unit+"): "+euro(line.amountEx)),
      "",
      "Subtotaal excl. btw: "+euro(pricing.subtotal),
      "Btw "+project.vatRate+"%: "+euro(pricing.vat),
      "Totaal incl. btw: "+euro(pricing.total),
      "Geldig tot: "+dateAdd(project.quoteDate,project.validityDays),
      project.publicNotes,
    ].filter(Boolean).join("\n");
    try {await navigator.clipboard.writeText(text);setNotice("Klantofferte gekopieerd, zonder interne personeelskosten.");}
    catch {setNotice("Kopiëren lukte niet. Gebruik PRINT / PDF.");}
  }
  async function sendQuote() {
    if (!project||!quote) return;
    const error=checkQuote(true);
    if (error) {setNotice(error);return;}
    if (isSent && !window.confirm("Deze offerte is al verstuurd. Toch nogmaals e-mailen?")) return;
    setBusy("quote");setNotice("");
    try {
      const response=await fetch("/api/dakofferte",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({accessToken,quote}),
      });
      const result=await response.json().catch(()=>({}));
      if (!response.ok) throw new Error(result.error || "Offerte versturen is mislukt.");
      setProjects(rows=>rows.map(row=>row.id===project.id?{...row,sentSignature:signature}:row));
      setNotice("Offerte "+project.number+" verstuurd naar "+project.email+". Een klant kan per e-mail akkoord geven.");
    } catch(error) {
      setNotice(error instanceof Error?error.message:"Offerte verzenden is mislukt.");
    } finally {setBusy("");}
  }
  function markAccepted() {
    if (!project) return;
    const error=checkQuote(false);
    if (error) {setNotice(error);return;}
    if (!window.confirm("Heb je aantoonbaar akkoord van deze klant op dit bedrag en deze werkzaamheden?")) return;
    edit({acceptedSignature:signature,acceptedAt:new Date().toISOString()});
    setNotice("Akkoord handmatig vastgelegd voor exact deze offerte. Nu kun je de factuur sturen.");
  }
  async function sendInvoice() {
    if (!project||!quote||locked) return;
    const error=checkQuote(true);
    if (error) {setNotice(error);return;}
    if (!isAccepted) {setNotice("Leg eerst het akkoord vast. Na wijzigingen is een nieuw akkoord nodig.");return;}
    if (!settings.iban.trim() || !settings.businessAddress.trim() || !settings.vatId.trim()) {
      setNotice("Vul factuuradres, btw-ID en IBAN in.");return;
    }
    if (!window.confirm("Factuur voor "+euro(pricing.total)+" aan "+project.email+" versturen?")) return;
    const invoiceNumber=project.invoiceNumber || nextInvoiceNumber();
    const issuedOn=localDay();
    setBusy("invoice");setNotice("");
    try {
      const response=await fetch("/api/factuur",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          accessToken,
          customer:{name:project.customer.trim(),address:project.address.trim(),email:project.email.trim()},
          business:{
            name:site.name,address:settings.businessAddress.trim(),
            email:site.email,phone:site.phoneDisplay,kvk:site.kvk,
            vatId:settings.vatId.trim(),iban:settings.iban.trim(),
          },
          invoice:{
            number:invoiceNumber,issueDate:issuedOn,serviceDate:project.workDate,
            title:project.title.trim(),
            paymentTermDays:Math.max(0,Math.min(365,settings.paymentTermDays)),
            notes:project.publicNotes.trim(),
          },
          lines:pricing.publicLines,
          subtotal:pricing.subtotal,vatRate:project.vatRate,vatAmount:pricing.vat,total:pricing.total,
        }),
      });
      const result=await response.json().catch(()=>({}));
      if (!response.ok) throw new Error(result.error || "Factuur versturen is mislukt.");
      markInvoiceUsed(invoiceNumber);
      setProjects(rows=>rows.map(row=>row.id===project.id?{
        ...row,invoiceNumber,invoiceSentAt:new Date().toISOString(),
        invoiceDetails:{issueDate:issuedOn,iban:settings.iban.trim(),paymentTermDays:settings.paymentTermDays,businessAddress:settings.businessAddress.trim(),vatId:settings.vatId.trim()}
      }:row));
      setNotice("Factuur "+invoiceNumber+" is verstuurd naar "+project.email+". Het project is nu vergrendeld.");
    } catch(error) {
      setNotice(error instanceof Error?error.message:"Factuur versturen is mislukt.");
    } finally {setBusy("");}
  }

  if (!ready || !project || !quote) {
    return <div className="roof-engine"><p className="roof-loading">Dakprojecten worden geopend...</p></div>;
  }
  const status=locked?"GEFACTUREERD":isAccepted?"KLANT AKKOORD":isSent?"OFFERTE VERSTUURD":"CONCEPT";
  const invoiceNumber=project.invoiceNumber || nextInvoiceNumber();
  const invoicePreview=preview==="invoice" && (isAccepted||locked);
  const invoiceBill=invoicePreview && project.invoiceDetails ? project.invoiceDetails : settings;
  const invoiceIssueDate=project.invoiceDetails?.issueDate || localDay();

  return (
    <div className="roof-engine">
      <header className="roof-header roof-no-print">
        <div>
          <small>LRS DAKTECHNIEK · INTERNE PROJECTCALCULATOR</small>
          <h1>Dakprojecten & offertes</h1>
          <p>Bitumen, pannendaken, zinkwerk en kleine onderdelen op één offerte.</p>
        </div>
        <div className="roof-header-total"><span>KLANTTOTAAL INCL. BTW</span><strong>{euro(pricing.total)}</strong></div>
      </header>

      <main className="roof-layout roof-no-print">
        <section className="roof-card roof-archive">
          <div className="roof-section-head"><h2>Project kiezen</h2><span className="roof-badge">{status}</span></div>
          <div className="roof-project-picker">
            <label><span>Opgeslagen dakprojecten</span>
              <select value={activeId} onChange={event=>{setActiveId(event.target.value);setNotice("");setPreview("quote");}}>
                {projects.map(row=><option key={row.id} value={row.id}>{row.number} · {row.customer || row.title}</option>)}
              </select>
            </label>
            <button type="button" className="roof-btn primary" onClick={newProject}>+ NIEUW DAKPROJECT</button>
            <button type="button" className="roof-btn secondary" onClick={removeProject} disabled={Boolean(busy)}>VERWIJDER</button>
          </div>
          <p className="roof-hint">Automatisch opgeslagen in deze browser, niet centraal. Maak voor belangrijke offertes ook een PDF-back-up. Offertenummers en factuurnummers zijn alleen lokaal gesynchroniseerd.</p>
        </section>

        <section className="roof-card">
          <div className="roof-section-head"><h2>1. Klant & dak</h2><small>{project.number}</small></div>
          <div className="roof-fields">
            <label><span>Klantnaam *</span><input value={project.customer} maxLength={180} disabled={locked||Boolean(busy)} onChange={e=>edit({customer:e.target.value})} placeholder="Naam klant"/></label>
            <label><span>E-mailadres klant</span><input type="email" value={project.email} maxLength={300} disabled={locked||Boolean(busy)} onChange={e=>edit({email:e.target.value})} placeholder="naam@email.nl"/></label>
            <label className="wide"><span>Volledig werkadres *</span><input value={project.address} maxLength={300} disabled={locked||Boolean(busy)} onChange={e=>edit({address:e.target.value})} placeholder="Straat 1, 4811 AA Breda"/></label>
            <label><span>Telefoonnummer (optioneel)</span><input value={project.phone} maxLength={60} disabled={locked||Boolean(busy)} onChange={e=>edit({phone:e.target.value})} placeholder="06..."/></label>
            <label><span>Titel offerte *</span><input value={project.title} maxLength={160} disabled={locked||Boolean(busy)} onChange={e=>edit({title:e.target.value})} placeholder="Vervangen pannendak"/></label>
            <label><span>Offertedatum</span><input type="date" value={project.quoteDate} disabled={locked||Boolean(busy)} onChange={e=>edit({quoteDate:e.target.value})}/></label>
            <label><span>Datum uitvoering / levering</span><input type="date" value={project.workDate} disabled={locked||Boolean(busy)} onChange={e=>edit({workDate:e.target.value})}/></label>
            <label><span>Offerte geldig (dagen)</span><input type="number" min="1" max="90" step="1" value={project.validityDays} disabled={locked||Boolean(busy)} onChange={e=>edit({validityDays:safeNum(e.target.value,90)})}/></label>
            <label><span>Btw-tarief voor deze offerte</span>
              <select value={project.vatRate} disabled={locked||Boolean(busy)} onChange={e=>edit({vatRate:Number(e.target.value)})}>
                <option value={21}>21% btw</option><option value={9}>9% btw (alleen indien toegestaan)</option><option value={0}>0% btw (alleen indien toegestaan)</option>
              </select>
            </label>
          </div>
          <p className="roof-hint">Controleer het juiste btw-tarief per soort werk. Dit formulier gebruikt één btw-tarief voor alle regels.</p>
        </section>

        <section className="roof-card">
          <div className="roof-section-head"><h2>2. Werkzaamheden toevoegen</h2><small>{project.items.length} regels</small></div>
          <label className="roof-search"><span>Zoek werkzaamheden</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Bitumen, pannen slijpen, vogelschroten, zink..."/></label>
          {!search && <div className="roof-categories">{CATEGORIES.map(c=><button type="button" key={c} className={category===c?"active":""} onClick={()=>setCategory(c)}>{c}</button>)}</div>}
          <div className="roof-catalog">
            {listed.map(item=>{
              const chosen=project.items.some(line=>line.id===item.id);
              return <button key={item.id} type="button" disabled={chosen||locked||Boolean(busy)||project.items.length>=50} onClick={()=>addLine(item.id)}>
                <b>{chosen?"✓":"+"}</b><span>{item.description}<small>per {item.unit} · {prices[item.id]>0 ? euro(prices[item.id])+" standaard excl. btw":"eigen tarief invullen"}</small></span>
              </button>;
            })}
            {listed.length===0&&<p>Geen werkzaamheden gevonden. Voeg hieronder een eigen regel toe.</p>}
          </div>

          <div className="roof-section-head roof-lines-title"><h3>Ingevulde werkzaamheden</h3><small>Alle bedragen excl. btw</small></div>
          {!project.items.length&&<p className="roof-empty">Kies hierboven één of meer werkzaamheden. Vul daarna de hoeveelheid en verkoopprijs per eenheid in.</p>}
          <div className="roof-rows">
            {project.items.map(line=><div className="roof-work-row" key={line.id}>
              <label className="name"><span>Omschrijving</span><input value={line.description} maxLength={180} disabled={locked||Boolean(busy)} onChange={e=>updateLine(line.id,{description:e.target.value})}/></label>
              <label><span>Aantal</span><input type="number" inputMode="decimal" min="0.01" max="100000" step="0.1" value={line.qty} disabled={locked||Boolean(busy)} onChange={e=>updateLine(line.id,{qty:safeNum(e.target.value,100000)})}/></label>
              <label><span>Eenheid</span><input value={line.unit} maxLength={30} disabled={locked||Boolean(busy)} onChange={e=>updateLine(line.id,{unit:e.target.value})}/></label>
              <label><span>Prijs / eenheid (€)</span><input type="number" inputMode="decimal" min="0" max="1000000" step="0.01" value={line.priceEx} disabled={locked||Boolean(busy)} onChange={e=>updateLine(line.id,{priceEx:safeNum(e.target.value)})}/></label>
              <div className="roof-line-total"><small>Regelbedrag</small><strong>{euro(line.qty*line.priceEx)}</strong></div>
              <button type="button" className="roof-remove" aria-label={"Verwijder "+line.description} disabled={locked||Boolean(busy)} onClick={()=>edit({items:project.items.filter(row=>row.id!==line.id)})}>×</button>
            </div>)}
          </div>
          <div className="roof-add-actions">
            <button className="roof-btn secondary" type="button" disabled={locked||Boolean(busy)||project.items.length>=50} onClick={()=>{
              const id="own-"+uuid();
              edit({items:[...project.items,{id,description:"",unit:"post",qty:1,priceEx:0}]});
            }}>+ EIGEN WERKREGEL</button>
            <button className="roof-btn secondary" type="button" disabled={locked||Boolean(busy)||!project.items.length} onClick={saveAsStandardPrices}>BEWAAR DEZE TARIEVEN ALS STANDAARD</button>
            <button className="roof-btn secondary" type="button" onClick={()=>setShowBook(v=>!v)}>{showBook?"SLUIT PRIJSBOEK":"BEKIJK / WIJZIG PRIJSBOEK"}</button>
          </div>
          {showBook&&<div className="roof-pricebook">
            <h3>Standaardprijzen voor nieuwe projecten</h3>
            <p className="roof-hint">De prijzen beginnen op € 0 zodat er geen onbevestigde marktprijzen in klantoffertes terechtkomen. Stel hier je eigen tarieven in.</p>
            {CATALOG.map(item=><label key={item.id}><span>{item.description} <small>per {item.unit}</small></span>
              <input type="number" min="0" step="0.01" value={Number(prices[item.id])||0} onChange={e=>setPrices(current=>({...current,[item.id]:safeNum(e.target.value)}))}/>
            </label>)}
          </div>}
        </section>

        <section className="roof-card roof-private">
          <div className="roof-section-head"><h2>3. Extra man / kosten</h2><span className="roof-badge private">ALLEEN INTERN</span></div>
          <p>Bijvoorbeeld € 300 voor een extra medewerker of onderaannemer. Zijn naam en de aparte kostenregel komen niet op de klantofferte of factuur.</p>
          <div className="roof-fields">
            <label><span>Extra personeelskosten (€ excl. btw)</span><input type="number" inputMode="decimal" min="0" max="1000000" step="0.01" value={project.extraPersonEx} disabled={locked||Boolean(busy)} onChange={e=>edit({extraPersonEx:safeNum(e.target.value)})}/></label>
            <label className="roof-check"><input type="checkbox" checked={project.chargeExtraPerson} disabled={locked||Boolean(busy)} onChange={e=>edit({chargeExtraPerson:e.target.checked})}/><span>Dit bedrag meenemen in klantprijs, verborgen verdeeld over de werkregels</span></label>
            <label className="wide"><span>Interne notities (nooit klantdocument)</span><textarea rows={2} value={project.privateNotes} maxLength={2000} disabled={locked||Boolean(busy)} onChange={e=>edit({privateNotes:e.target.value})} placeholder="Inkoop, materiaal, inzet extra man..."/></label>
            <label className="wide"><span>Toelichting voor klant (wel zichtbaar)</span><textarea rows={2} value={project.publicNotes} maxLength={1600} disabled={locked||Boolean(busy)} onChange={e=>edit({publicNotes:e.target.value})} placeholder="Uitgangspunten, planning, bijzonderheden..."/></label>
          </div>
          <div className="roof-internal-math">
            <span>Basis verkoopwerk</span><strong>{euro(pricing.baseTotal)}</strong>
            <span>Verborgen in klantregels doorberekend</span><strong>{euro(pricing.surcharge)}</strong>
            <span>Interne extra personeelskosten</span><strong>{euro(project.extraPersonEx)}</strong>
          </div>
          {!project.chargeExtraPerson&&project.extraPersonEx>0&&<p className="roof-warning">Let op: de extra personeelskosten worden nu NIET bij de klantprijs opgeteld. Ze gaan dus van je marge af.</p>}
        </section>

        <section className="roof-card roof-totals">
          <div className="roof-section-head"><h2>4. Prijs voor de klant</h2><small>Geen interne kosten zichtbaar</small></div>
          <div className="roof-sum"><span>Subtotaal excl. btw</span><b>{euro(pricing.subtotal)}</b><span>Btw {project.vatRate}%</span><b>{euro(pricing.vat)}</b></div>
          <div className="roof-grand"><span>TOTAAL OFFERTE INCL. BTW</span><strong>{euro(pricing.total)}</strong></div>
          {project.acceptedSignature&&!isAccepted&&!locked&&<p className="roof-warning">De offerte is gewijzigd na het akkoord. Laat de klant opnieuw bevestigen voordat je factureert.</p>}
        </section>

        <section className="roof-card">
          <div className="roof-section-head"><h2>5. Offerte → akkoord → factuur</h2><span className="roof-badge">{status}</span></div>
          <div className="roof-action-steps">
            <div><strong>01 · Offerte</strong><p>Stuur de offerte per e-mail of print hem als PDF. De klant ziet alleen de uiteindelijke werkprijzen.</p>
              <div className="roof-buttons">
                <button type="button" className="roof-btn primary" disabled={Boolean(busy)||locked} onClick={sendQuote}>{busy==="quote"?"VERSTUREN...":isSent?"OFFERTE OPNIEUW E-MAILEN":"OFFERTE E-MAILEN"}</button>
                <button type="button" className="roof-btn secondary" onClick={()=>print("quote")}>PRINT / PDF</button>
                <button type="button" className="roof-btn secondary" onClick={copyQuote}>KOPIEER TEKST</button>
              </div>
            </div>
            <div><strong>02 · Klant akkoord</strong><p>Heeft de klant schriftelijk of mondeling bevestigd? Leg het akkoord hier handmatig vast. Bewaar bewijs van het akkoord zelf.</p>
              <button type="button" className="roof-btn secondary" disabled={Boolean(busy)||locked||isAccepted} onClick={markAccepted}>{isAccepted?"✓ AKKOORD VASTGELEGD":"KLANT AKKOORD VASTLEGGEN"}</button>
              {project.acceptedAt&&isAccepted&&<small>Vastgelegd: {new Date(project.acceptedAt).toLocaleString("nl-NL")}</small>}
            </div>
            <div><strong>03 · Factuur</strong><p>Pas na akkoord kun je de factuur naar het klantadres e-mailen. De prijzen blijven gelijk aan de goedgekeurde offerte.</p>
              <div className="roof-fields">
                <label><span>Bedrijfsadres op offerte/factuur</span><input value={settings.businessAddress} onChange={e=>setSettings(s=>({...s,businessAddress:e.target.value}))}/></label>
                <label><span>Btw-ID</span><input value={settings.vatId} onChange={e=>setSettings(s=>({...s,vatId:e.target.value}))}/></label>
                <label><span>Bankrekening voor factuur</span>
                  <select value={settings.iban} onChange={e=>setSettings(s=>({...s,iban:e.target.value}))}>
                    {BANKS.map(iban=><option key={iban} value={iban}>{iban}</option>)}
                  </select>
                </label>
                <label><span>Betaaltermijn (dagen)</span><input type="number" min="0" max="365" value={settings.paymentTermDays} onChange={e=>setSettings(s=>({...s,paymentTermDays:safeNum(e.target.value,365)}))}/></label>
              </div>
              <p className="roof-hint">Factuurnummer: <b>{invoiceNumber}</b>. De nummering wordt gedeeld met de reparatiewerkbon op deze browser; controleer unieke nummers in je boekhouding.</p>
              <div className="roof-buttons">
                <button type="button" className="roof-btn primary" disabled={Boolean(busy)||!isAccepted||locked} onClick={sendInvoice}>{locked?"✓ FACTUUR VERSTUURD":busy==="invoice"?"VERSTUREN...":"FACTUUR E-MAILEN"}</button>
                <button type="button" className="roof-btn secondary" disabled={!isAccepted&&!locked} onClick={()=>print("invoice")}>FACTUUR PRINT / PDF</button>
              </div>
            </div>
          </div>
          {notice&&<div className="roof-notice" role="status" aria-live="polite">{notice}</div>}
        </section>

        <section className="roof-card roof-preview-wrap">
          <div className="roof-section-head"><h2>Klantdocument bekijken</h2>
            <div className="roof-buttons"><button type="button" className="roof-btn secondary" onClick={()=>setPreview("quote")}>OFFERTESCHERM</button><button type="button" className="roof-btn secondary" disabled={!isAccepted&&!locked} onClick={()=>setPreview("invoice")}>FACTUURSCHERM</button></div>
          </div>
          <p className="roof-hint">Onderstaande weergave bevat nooit de interne kosten voor het extra mannetje of interne notities.</p>
        </section>
      </main>

      <article className="roof-document" aria-label={invoicePreview?"Factuur voor klant":"Offerte voor klant"}>
        <header>
          <div><small>DAKTECHNIEK · BREDA EN OMGEVING</small><h1>LRS DAKTECHNIEK</h1><span>{invoiceBill.businessAddress}</span><span>{site.phoneDisplay} · {site.email}</span><span>KvK {site.kvk} · Btw-ID {invoiceBill.vatId}</span></div>
          <div className="roof-doc-title"><h2>{invoicePreview?"FACTUUR":"OFFERTE"}</h2><strong>{invoicePreview?invoiceNumber:project.number}</strong></div>
        </header>
        <div className="roof-doc-client">
          <div><b>Aan</b><strong>{project.customer||"—"}</strong><span>{project.address||"—"}</span>{project.email&&<span>{project.email}</span>}</div>
          <div><b>{invoicePreview?"Factuurdatum":"Offertedatum"}</b><span>{invoicePreview?formattedDay(invoiceIssueDate):formattedDay(project.quoteDate)}</span>
            {invoicePreview?<><b>Datum werkzaamheden</b><span>{formattedDay(project.workDate)}</span><b>Vervaldatum</b><span>{dateAdd(invoiceIssueDate,invoiceBill.paymentTermDays)}</span></>
              :<><b>Offerte geldig tot</b><span>{dateAdd(project.quoteDate,project.validityDays)}</span></>}
          </div>
        </div>
        <h3>{project.title||"Dakwerkzaamheden"}</h3>
        <table>
          <thead><tr><th>Werkzaamheden</th><th>Aantal</th><th>Bedrag excl. btw</th></tr></thead>
          <tbody>{pricing.publicLines.map((line,index)=><tr key={index}><td>{line.description}</td><td>{line.qty.toLocaleString("nl-NL")} {line.unit}</td><td>{euro(line.amountEx)}</td></tr>)}</tbody>
        </table>
        <div className="roof-doc-totals"><div><span>Subtotaal excl. btw</span><b>{euro(pricing.subtotal)}</b></div><div><span>Btw {project.vatRate}%</span><b>{euro(pricing.vat)}</b></div><div className="grand"><strong>Totaal incl. btw</strong><strong>{euro(pricing.total)}</strong></div></div>
        {project.publicNotes.trim()&&<div className="roof-doc-notes"><b>Toelichting</b><p>{project.publicNotes}</p></div>}
        {invoicePreview?<div className="roof-doc-footer"><strong>Betalingsgegevens</strong><p>Betaling binnen {invoiceBill.paymentTermDays} dagen op {invoiceBill.iban} t.n.v. LRS Daktechniek.<br/>Onder vermelding van factuur {invoiceNumber}.</p></div>:
          <div className="roof-doc-footer"><strong>Akkoord op deze offerte?</strong><p>Reageer op deze offerte via {site.email} of neem telefonisch contact met ons op. De werkzaamheden worden in overleg ingepland.</p></div>}
      </article>
    </div>
  );
}
