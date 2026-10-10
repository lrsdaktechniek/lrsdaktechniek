"use client";

import { useEffect, useMemo, useState } from "react";
import { site } from "@/lib/content";
import { InvoiceIssuerPicker } from "@/components/InvoiceIssuerPicker";
import { INVOICE_ISSUERS, issuerDefaults, normalizeIssuerSettings, pendingInvoiceNumber, registerInvoiceUsed, type InvoiceIssuerId, type IssuerSettings } from "@/lib/invoiceIssuer";
import { CATALOG, CATEGORIES, DEFAULT_PRICES, MIN_ROOF_JOB_EX, WorkLine, calculate, euro, formattedDay, localDay } from "@/lib/roofQuote";

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
  issuer?: InvoiceIssuerId;
  pricingMode?: "legacy" | "staffel-v2";
  invoiceDetails?: { issueDate: string; iban: string; paymentTermDays: number; businessAddress: string; vatId: string; contactEmail?: string; phone?: string };
};
type Archive = { activeId: string; projects: Project[] };

const PROJECTS_KEY = "lrs-roof-projects-v1";
const PRICE_KEY = "lrs-roof-unitprices-v1";
const QUOTE_SEQ = "lrs-roof-quote-sequence-v1";


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
    sentSignature:"",acceptedSignature:"",acceptedAt:"",invoiceSentAt:"",invoiceNumber:"",issuer:"lrs",pricingMode:"staffel-v2",
  };
}
function nextInvoiceNumber(issuer: InvoiceIssuerId) {
  try { return pendingInvoiceNumber(issuer,localStorage); }
  catch { return INVOICE_ISSUERS[issuer].invoicePrefix + "-" + new Date().getFullYear() + "-0001"; }
}
function markInvoiceUsed(issuer:InvoiceIssuerId,number:string) {
  try { registerInvoiceUsed(issuer,number,localStorage); }
  catch { /* nummers blijven lokaal: controleer ze in de boekhouding */ }
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
  const [prices,setPrices]=useState<Record<string,number>>({...DEFAULT_PRICES});
  const [billingSettings,setBillingSettings]=useState<Record<InvoiceIssuerId,IssuerSettings>>({lrs:issuerDefaults("lrs"),"allround-lem":issuerDefaults("allround-lem")});
  const [category,setCategory]=useState(CATEGORIES[0]);
  const [search,setSearch]=useState("");
  const [showBook,setShowBook]=useState(false);
  const [busy,setBusy]=useState<""|"quote"|"invoice">("");
  const [notice,setNotice]=useState("");
  const [preview,setPreview]=useState<"quote"|"invoice">("quote");
  const [printQueued,setPrintQueued]=useState(false);
  const [ownDescription,setOwnDescription]=useState("");
  const [ownQty,setOwnQty]=useState("1");
  const [ownUnit,setOwnUnit]=useState("post");
  const [ownPrice,setOwnPrice]=useState("");

  useEffect(()=>{
    try {
      const rawPrices=JSON.parse(localStorage.getItem(PRICE_KEY) || "{}") as Record<string,number>;
      const storedPrices=(rawPrices && typeof rawPrices==="object" && !Array.isArray(rawPrices)) ? rawPrices : {};
      const validPrices=Object.fromEntries(Object.entries(storedPrices).filter(([,value])=>typeof value==="number" && Number.isFinite(value) && value>0));
      const finalPrices={...DEFAULT_PRICES,...validPrices};
      setPrices(finalPrices);
      const stored=JSON.parse(localStorage.getItem(PROJECTS_KEY) || "null") as Archive | null;
      if (stored && Array.isArray(stored.projects) && stored.projects.length) {
        const good=stored.projects.filter(row=>row && typeof row.id==="string" && Array.isArray(row.items)).slice(0,200);
        // Bestaande verzonden offertes en facturen mogen NIET herberekend worden.
        // Alleen concepten migreren naar het nieuwe prijsboek en staffels.
        const migrated=good.map(row=>{
          const protectedOffer=Boolean(row.sentSignature || row.acceptedSignature || row.invoiceSentAt);
          return {
            ...row,
            pricingMode:row.pricingMode ?? (protectedOffer?"legacy" as const:"staffel-v2" as const),
            items:protectedOffer?row.items:row.items.map(line=>({
              ...line,priceEx:line.priceEx>0?line.priceEx:(finalPrices[line.id]??0),
            }))
          };
        });
        if (migrated.length) {
          setProjects(migrated);
          setActiveId(migrated.some(row=>row.id===stored.activeId)?stored.activeId:migrated[0].id);
        } else {
          const fresh=makeProject();setProjects([fresh]);setActiveId(fresh.id);
        }
      } else {
        const fresh=makeProject();setProjects([fresh]);setActiveId(fresh.id);
      }
      const storedLrs=JSON.parse(localStorage.getItem(INVOICE_ISSUERS.lrs.settingsKey) || "null") as Partial<IssuerSettings> | null;
      const storedLem=JSON.parse(localStorage.getItem(INVOICE_ISSUERS["allround-lem"].settingsKey) || "null") as Partial<IssuerSettings> | null;
      setBillingSettings({
        lrs:normalizeIssuerSettings("lrs",storedLrs),
        "allround-lem":normalizeIssuerSettings("allround-lem",storedLem),
      });
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
    try {
      for (const id of ["lrs","allround-lem"] as const) {
        localStorage.setItem(INVOICE_ISSUERS[id].settingsKey,JSON.stringify(billingSettings[id]));
      }
    } catch {}
  },[billingSettings,ready]);
  useEffect(()=>{
    if (!printQueued) return;
    const timer=window.setTimeout(()=>window.print(),100);
    const onAfter=()=>setPrintQueued(false);
    window.addEventListener("afterprint",onAfter);
    return ()=>{window.clearTimeout(timer);window.removeEventListener("afterprint",onAfter);};
  },[printQueued,preview]);

  const project=projects.find(row=>row.id===activeId);
  const issuer:InvoiceIssuerId=project?.issuer??"lrs";
  const company=INVOICE_ISSUERS[issuer];
  const quoteNumber = issuer === "allround-lem" && project?.number.startsWith("LRS-OFF-")
    ? project.number.replace("LRS-OFF-", "LEM-OFF-") : (project?.number ?? "");
  const settings=billingSettings[issuer];
  function updateSettings(change:(prev:IssuerSettings)=>IssuerSettings) {
    setBillingSettings(current=>({...current,[issuer]:normalizeIssuerSettings(issuer,change(current[issuer]))}));
  }
  function changeIssuer(next:InvoiceIssuerId) {
    if (next===issuer || !project || project.invoiceSentAt || busy) return;
    edit({issuer:next});
    setPreview("quote");
    setNotice("De offerte en factuur worden nu op naam van "+INVOICE_ISSUERS[next].name+" opgesteld. Controleer het bedrijfsadres.");
  }
  const pricing=useMemo(()=>project
    ? calculate(project.items,project.extraPersonEx,project.chargeExtraPerson,project.vatRate,project.pricingMode??"legacy")
    : calculate([],0,false,21),[project]);
  // Dit object bevat uitsluitend klantgegevens. Interne kosten/notities verlaten de browser nooit.
  const quote=useMemo(()=>project?{
    number:quoteNumber,title:project.title.trim(),issueDate:project.quoteDate,
    validDays:project.validityDays,
    customer:{name:project.customer.trim(),address:project.address.trim(),email:project.email.trim(),phone:project.phone.trim()},
    businessAddress:settings.businessAddress.trim(),vatId:settings.vatId.trim(),
    lines:pricing.publicLines,subtotal:pricing.subtotal,vatRate:project.vatRate,
    vatAmount:pricing.vat,total:pricing.total,notes:project.publicNotes.trim(),
    ...(issuer==="allround-lem" ? {issuer,contactEmail:settings.contactEmail.trim(),phone:settings.phone.trim()} : {}),
  }:null,[project,settings.businessAddress,settings.vatId,settings.contactEmail,settings.phone,pricing,issuer,quoteNumber]);
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
    if (!project || locked || busy) return;
    const existing=project.items.some(row=>row.id===id);
    if(existing) {
      edit({items:project.items.filter(row=>row.id!==id)});
      return;
    }
    if(project.items.length>=50)return;
    const item=CATALOG.find(row=>row.id===id);
    if(!item)return;
    // Eén hoofdtype per dak: voorkom dubbel tellen van beton/keramisch/compleet.
    const withoutAlternative=item.pack
      ? project.items.filter(row=>CATALOG.find(entry=>entry.id===row.id)?.pack!==item.pack)
      : project.items;
    edit({items:[...withoutAlternative,{
      id:item.id,description:item.description,qty:1,unit:item.unit,
      priceEx:Number(prices[id] ?? item.defaultPriceEx),
    }]});
  }
  function newProject() {
    if (projects.length>=200) {setNotice("Maximaal 200 lokale projecten. Archiveer eerst je gegevens.");return;}
    const fresh=makeProject();
    setProjects(rows=>[fresh,...rows]);
    setActiveId(fresh.id);
    setNotice("Nieuw project aangemaakt en automatisch lokaal opgeslagen.");
    setPreview("quote");
    setSearch("");
    setCategory(CATEGORIES[0]);
    setShowBook(false);
    setOwnDescription("");
    setOwnQty("1");
    setOwnUnit("post");
    setOwnPrice("");
  }
  function addOwnWork() {
    if (!project || locked || busy) return;
    if (project.items.length >= 50) {setNotice("Maximaal 50 werkzaamheden per offerte.");return;}
    const desc=ownDescription.trim();
    const qty=safeNum(ownQty,100000);
    const price=safeNum(ownPrice);
    if (!desc || !(qty>0) || !(price>0)) {
      setNotice("Vul een omschrijving, hoeveelheid en verkoopprijs boven € 0 in voor je eigen werk.");
      return;
    }
    edit({items:[...project.items, {id:"own-"+uuid(),description:desc,qty,unit:ownUnit,priceEx:price}]});
    setOwnDescription("");setOwnQty("1");setOwnUnit("post");setOwnPrice("");
    setNotice("Eigen werkzaamheid toegevoegd aan de calculatie. De klant ziet alleen het eindtotaal.");
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
    if (!settings.businessAddress.trim()) return "Vul het volledige factuuradres van "+company.name+" in bij de factuurinstellingen.";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(project.quoteDate) || !/^\d{4}-\d{2}-\d{2}$/.test(project.workDate)) return "Vul de datums in.";
    if (!Number.isInteger(project.validityDays) || project.validityDays<1 || project.validityDays>90) return "Geldigheid moet tussen 1 en 90 dagen liggen.";
    if (!project.items.length) return "Selecteer minimaal één dakwerkzaamheid.";
    if (project.items.length>50) return "Maximaal 50 regels per offerte.";
    if (project.items.some(row=>!row.description.trim()||!row.unit.trim()||
      !Number.isFinite(row.qty)||row.qty<=0||!Number.isFinite(row.priceEx)||row.priceEx<=0)) {
      return "Vul bij iedere geselecteerde regel een geldige hoeveelheid en eenheidsprijs in. Gebruik eventueel PRIJSBOEK.";
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
      company.name+" · Offerte "+quoteNumber,
      project.title, "Klant: "+project.customer,
      "Adres: "+project.address,
      "",
      ...pricing.publicLines.map(line=>"- "+line.description+" ("+line.qty+" "+line.unit+")"),
      "",
      "Vaste totaalprijs incl. "+project.vatRate+"% btw: "+euro(pricing.total),
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
      setNotice("Offerte "+quoteNumber+" verstuurd naar "+project.email+". Een klant kan per e-mail akkoord geven.");
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
    if (!settings.businessAddress.trim()) {
      setNotice("Vul eerst het volledige factuuradres van "+company.name+" in.");return;
    }
    if (!window.confirm("Factuur voor "+euro(pricing.total)+" aan "+project.email+" versturen?")) return;
    const invoiceNumber=project.invoiceNumber || nextInvoiceNumber(issuer);
    const issuedOn=localDay();
    setBusy("invoice");setNotice("");
    try {
      const response=await fetch("/api/factuur",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          accessToken,
          issuer,
          customer:{name:project.customer.trim(),address:project.address.trim(),email:project.email.trim()},
          business:{
            name:company.name,address:settings.businessAddress.trim(),
            email:settings.contactEmail.trim(),phone:settings.phone.trim(),kvk:company.kvk,
            vatId:company.vatId,iban:company.iban,
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
      markInvoiceUsed(issuer,invoiceNumber);
      setProjects(rows=>rows.map(row=>row.id===project.id?{
        ...row,invoiceNumber,invoiceSentAt:new Date().toISOString(),
        invoiceDetails:{issueDate:issuedOn,iban:company.iban,paymentTermDays:settings.paymentTermDays,businessAddress:settings.businessAddress.trim(),vatId:company.vatId,contactEmail:settings.contactEmail,phone:settings.phone}
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
  const invoiceNumber=project.invoiceNumber || nextInvoiceNumber(issuer);
  const invoicePreview=preview==="invoice" && (isAccepted||locked);
  const invoiceBill=invoicePreview && project.invoiceDetails ? {...issuerDefaults(issuer),...project.invoiceDetails} : settings;
  const invoiceIssueDate=project.invoiceDetails?.issueDate || localDay();

  return (
    <div className="roof-engine">
      <header className="roof-header roof-no-print">
        <div>
          <small>LRS DAKTECHNIEK · INTERNE PROJECTCALCULATOR</small>
          <h1>Dakprojecten & offertes</h1>
          <p>Bitumen, pannendaken, zinkwerk en kleine onderdelen op één offerte.</p>
        </div>
<div className="roof-header-actions"><button type="button" className="roof-header-new" disabled={Boolean(busy)} onClick={newProject}>+ NIEUWE KLUS · LEEG BEGINNEN</button><div className="roof-header-total"><span>KLANTTOTAAL INCL. BTW</span><strong>{euro(pricing.total)}</strong></div></div>
      </header>

      <div className="issuer-quick-switch roof-no-print">
        <InvoiceIssuerPicker compact value={issuer} onChange={changeIssuer} disabled={locked||Boolean(busy)}/>
      </div>
      <main className="roof-layout roof-no-print">
        <section className="roof-card roof-archive">
          <div className="roof-section-head"><h2>Project kiezen</h2><span className="roof-badge">{status}</span></div>
          <div className="roof-project-picker">
            <label><span>Opgeslagen dakprojecten</span>
              <select value={activeId} onChange={event=>{setActiveId(event.target.value);setNotice("");setPreview("quote");}}>
                {projects.map(row=><option key={row.id} value={row.id}>{row.issuer==="allround-lem"?row.number.replace("LRS-OFF-","LEM-OFF-"):row.number} · {row.customer || row.title}</option>)}
              </select>
            </label>
<button type="button" className="roof-btn primary" disabled={Boolean(busy)} onClick={newProject}>+ NIEUWE KLUS</button>
            <button type="button" className="roof-btn secondary" onClick={removeProject} disabled={Boolean(busy)}>VERWIJDER</button>
          </div>
          <p className="roof-hint">Automatisch opgeslagen in deze browser, niet centraal. Maak voor belangrijke offertes ook een PDF-back-up. Offertenummers en factuurnummers zijn alleen lokaal gesynchroniseerd.</p>

        </section>

        <section className="roof-card">
          <div className="roof-section-head"><h2>1. Klant & dak</h2><small>{quoteNumber}</small></div>
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
<div className="roof-section-head"><h2>2. Tik aan wat je gaat doen</h2><small>{project.items.length} werkzaamheden</small></div><p className="roof-hint roof-top-intro">Alle werkzaamheden hebben al een vaste prijs per m², meter of stuk. Je hoeft alleen aan te tikken en het aantal in te vullen. Prijzen zijn excl. btw.</p>
          <label className="roof-search"><span>Zoek werkzaamheden</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Bitumen, pannen slijpen, vogelschroten, zink..."/></label>
          {!search && <div className="roof-categories">{CATEGORIES.map(c=><button type="button" key={c} className={category===c?"active":""} onClick={()=>setCategory(c)}>{c}</button>)}</div>}
          <div className="roof-catalog">
            {listed.map(item=>{
              const picked=project.items.find(line=>line.id===item.id);
              const step=picked&&["m²","m¹","meter","strekkende meter","uur"].includes(picked.unit)?0.5:1;
              const minQty=step===0.5?0.1:1;
              return <article className={picked?"roof-chosen":""} key={item.id}>
                <button className="roof-catalog-toggle" type="button" disabled={locked||Boolean(busy)||(!picked&&project.items.length>=50)} onClick={()=>addLine(item.id)}>
                  <b>{picked?"✓":"+"}</b><span>{item.description}<small>{euro(prices[item.id]??item.defaultPriceEx)} / {item.unit} excl. btw {picked?"· geselecteerd":""}</small></span>
                </button>
                {picked&&<div className="roof-catalog-inline-qty">
                  <button type="button" aria-label={"Minder "+item.description} disabled={locked||Boolean(busy)} onClick={()=>updateLine(picked.id,{qty:Math.max(minQty,Math.round((picked.qty-step)*10)/10)})}>−</button>
                  <label><span>Aantal {picked.unit}</span><input type="number" inputMode="decimal" aria-label={"Aantal "+item.description} min={minQty} max="100000" step={step===0.5?"0.1":"1"} disabled={locked||Boolean(busy)} value={picked.qty} onChange={event=>updateLine(picked.id,{qty:safeNum(event.target.value,100000)})}/></label>
                  <button type="button" aria-label={"Meer "+item.description} disabled={locked||Boolean(busy)} onClick={()=>updateLine(picked.id,{qty:Math.min(100000,Math.round((picked.qty+step)*10)/10)})}>+</button>
                </div>}
              </article>;
            })}
            {listed.length===0&&<p>Geen werkzaamheden gevonden. Voeg hieronder een eigen regel toe.</p>}
          </div>

          <section className="roof-own-work" id="roof-own-work">
            <h3>+ Eigen werkzaamheden met prijs toevoegen</h3>
            <p>Staat een klus niet in de lijst? Vul hem hier handmatig in. De prijs telt intern mee, maar wordt niet apart op de offerte of factuur getoond.</p>
            <div className="roof-own-grid">
              <label className="roof-own-description"><span>Wat ga je doen?</span><input type="text" value={ownDescription} maxLength={180} disabled={locked||Boolean(busy)} onChange={e=>setOwnDescription(e.target.value)} placeholder="Bijv. Steiger plaatsen of speciale dakreparatie"/></label>
              <label><span>Aantal</span><input type="number" min="0.1" step="0.1" inputMode="decimal" value={ownQty} disabled={locked||Boolean(busy)} onChange={e=>setOwnQty(e.target.value)}/></label>
              <label><span>Eenheid</span><select value={ownUnit} disabled={locked||Boolean(busy)} onChange={e=>setOwnUnit(e.target.value)}><option value="post">post</option><option value="m²">m²</option><option value="m¹">meter</option><option value="stuk">stuk</option><option value="uur">uur</option></select></label>
              <label><span>Prijs per eenheid excl. btw</span><input type="number" min="0.01" step="0.01" inputMode="decimal" value={ownPrice} disabled={locked||Boolean(busy)} onChange={e=>setOwnPrice(e.target.value)} placeholder="€ 0,00"/></label>
              <button className="roof-btn primary roof-own-submit" type="button" onClick={addOwnWork} disabled={locked||Boolean(busy)}>+ VOEG WERK TOE</button>
            </div>
          </section>
          <div className="roof-section-head roof-lines-title"><h3>Ingevulde werkzaamheden</h3><small>Alle bedragen intern · klant ziet één totaal</small></div>
<p className="roof-hint">Vul alleen de aantallen of meters in; de rest wordt automatisch berekend. Klein werk kent een minimumprojecttarief van {euro(MIN_ROOF_JOB_EX)} excl. btw.</p>
          {!project.items.length&&<p className="roof-empty">Nog geen werkzaamheden geselecteerd. Tik hierboven aan wat je gaat doen.</p>}
          <div className="roof-rows">
            {project.items.map(line=>{
              const detail=pricing.internalLines.find(row=>row.id===line.id);
              const step=["m²","m¹","meter","strekkende meter","uur"].includes(line.unit)?0.5:1;
              const minQty=step===0.5?0.1:1;
              const saving=(detail?.volumeDiscountEx??0)+(detail?.combineDiscountEx??0);
              return <div className="roof-work-row" key={line.id}>
                <div className="roof-row-main">
                  <strong>{line.description||"Eigen werkregel"}</strong>
                  <small>Vast tarief: <b>{euro(line.priceEx)}</b> / {line.unit} excl. btw</small>
                  {saving>0&&<small className="roof-savings">Staffel-/meeneemvoordeel: −{euro(saving)}</small>}
                </div>
                <div className="roof-count-control">
                  <button type="button" aria-label={"Minder "+line.description} disabled={locked||Boolean(busy)} onClick={()=>updateLine(line.id,{qty:Math.max(minQty,Math.round((line.qty-step)*10)/10)})}>−</button>
                  <label><span>Hoeveel {line.unit}?</span>
                    <input aria-label={"Aantal "+line.description} type="number" inputMode="decimal" min={minQty} max="100000" step={step===0.5?"0.1":"1"} value={line.qty} disabled={locked||Boolean(busy)} onChange={e=>updateLine(line.id,{qty:safeNum(e.target.value,100000)})}/>
                  </label>
                  <button type="button" aria-label={"Meer "+line.description} disabled={locked||Boolean(busy)} onClick={()=>updateLine(line.id,{qty:Math.min(100000,Math.round((line.qty+step)*10)/10)})}>+</button>
                </div>
                <div className="roof-row-result"><small>Bedrag klant excl. btw</small><strong>{euro(detail?.customerEx??0)}</strong></div>
                <button type="button" className="roof-remove" aria-label={"Verwijder "+line.description} disabled={locked||Boolean(busy)} onClick={()=>edit({items:project.items.filter(row=>row.id!==line.id)})}>×</button>
                <details className="roof-row-advanced">
                  <summary>Omschrijving of tarief voor deze klus aanpassen (optioneel)</summary>
                  <div className="roof-row-advanced-fields">
                    <label><span>Omschrijving</span><input value={line.description} maxLength={180} disabled={locked||Boolean(busy)} onChange={e=>updateLine(line.id,{description:e.target.value})}/></label>
                    <label><span>Eenheid</span><input value={line.unit} maxLength={30} disabled={locked||Boolean(busy)} onChange={e=>updateLine(line.id,{unit:e.target.value})}/></label>
                    <label><span>Prijs per eenheid excl. btw</span><input type="number" inputMode="decimal" min="0" max="1000000" step="0.01" value={line.priceEx} disabled={locked||Boolean(busy)} onChange={e=>updateLine(line.id,{priceEx:safeNum(e.target.value)})}/></label>
                  </div>
                </details>
              </div>;
            })}
          </div>
          <div className="roof-add-actions">


            <button className="roof-btn secondary" type="button" onClick={()=>setShowBook(v=>!v)}>{showBook?"SLUIT PRIJSBOEK":"BEKIJK / WIJZIG PRIJSBOEK"}</button>
          </div>
          {showBook&&<div className="roof-pricebook">
            <h3>Vaste eenheidsprijzen (alleen intern)</h3>
            <p className="roof-hint">Deze standaardtarieven zijn ingevuld vanuit de bestaande LRS-prijsbanden voor grote daktypen en voorlopige interne tariefvoorstellen voor details. Controleer ze op materiaal, bereikbaarheid en je gewenste marge. Prijswijzigingen hier gelden ook voor het huidige niet-gefactureerde project.</p>
            <button type="button" className="roof-btn secondary" disabled={!project.items.length||locked} onClick={saveAsStandardPrices}>TARIEVEN VAN DEZE KLUS ALS STANDAARD BEWAREN</button>
            {CATALOG.map(item=><label key={item.id}><span>{item.description} <small>per {item.unit}</small></span>
              <input type="number" min="0" step="0.01" disabled={locked||Boolean(busy)} value={Number(prices[item.id]??item.defaultPriceEx)} onChange={e=>{
                const value=safeNum(e.target.value);
                setPrices(current=>({...current,[item.id]:value}));
                if(!locked) setProjects(rows=>rows.map(row=>row.id===project.id ? {
                  ...row,items:row.items.map(line=>line.id===item.id?{...line,priceEx:value}:line)
                } : row));
              }}/>
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
            <span>Basis volgens vaste tarieven</span><strong>{euro(pricing.baseTotal)}</strong>
            <span>Voordeel grotere aantallen</span><strong>−{euro(pricing.volumeDiscount)}</strong>
            <span>Meeneemvoordeel extra werkzaamheden</span><strong>−{euro(pricing.combineDiscount)}</strong>
            {pricing.minimumCharge>0&&<><span>Minimumbedrag voor kleine dakklus</span><strong>+{euro(pricing.minimumCharge)}</strong></>}
            <span>Extra personeelskosten in klantprijs verwerkt</span><strong>+{euro(pricing.surcharge)}</strong>
            <span>Interne personeelskosten</span><strong>{euro(project.extraPersonEx)}</strong>
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
            <div><strong>03 · Factuur van {company.name}</strong><p>Pas na akkoord kun je de factuur naar het klantadres e-mailen. De prijzen blijven gelijk aan de goedgekeurde offerte.</p>
              <div className="roof-fields">
                <label><span>Bedrijfsadres {company.name} *</span><input value={settings.businessAddress} disabled={locked||Boolean(busy)} onChange={e=>updateSettings(s=>({...s,businessAddress:e.target.value}))} placeholder="Straat, huisnummer, postcode en plaats"/></label>
                <label><span>KvK / btw-ID (vast per bedrijf)</span><input readOnly value={company.kvk+" · "+company.vatId}/></label>
                <label><span>Bankrekening van {company.name}</span><input readOnly value={company.iban}/></label>
                <label><span>Betaaltermijn (dagen)</span><input type="number" min="0" max="365" disabled={locked||Boolean(busy)} value={settings.paymentTermDays} onChange={e=>updateSettings(s=>({...s,paymentTermDays:safeNum(e.target.value,365)}))}/></label>
                <label><span>Zakelijk contact-e-mailadres (optioneel)</span><input type="email" value={settings.contactEmail} disabled={locked||Boolean(busy)} onChange={e=>updateSettings(s=>({...s,contactEmail:e.target.value}))} placeholder="contact@bedrijf.nl"/></label>
                <label><span>Telefoon bedrijf (optioneel)</span><input value={settings.phone} disabled={locked||Boolean(busy)} onChange={e=>updateSettings(s=>({...s,phone:e.target.value}))} placeholder="06..."/></label>
              </div>
              {issuer==="allround-lem"&&<p className="roof-hint">Voor direct e-mailen vanuit Allround LEM is een eigen geverifieerde afzender (ALLROUND_LEM_FROM_EMAIL) nodig in Vercel. PDF/print blijft beschikbaar.</p>}
              <p className="roof-hint">Factuurnummer {company.name}: <b>{invoiceNumber}</b>. Iedere onderneming heeft een eigen lokale nummerreeks, gedeeld met de reparatiebon op deze browser. Controleer unieke nummers in je boekhouding.</p>
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

      <article className={"roof-document"+(issuer==="allround-lem"?" allround-lem":"")} aria-label={invoicePreview?"Factuur voor klant":"Offerte voor klant"}>
        <header>
          <div><small>{issuer==="allround-lem"?"ALLROUND LEM · DAKWERK EN ONDERHOUD":"DAKTECHNIEK · BREDA EN OMGEVING"}</small><h1>{company.name.toUpperCase()}</h1><span>{invoiceBill.businessAddress}</span>{(invoiceBill.phone||invoiceBill.contactEmail)&&<span>{[invoiceBill.phone,invoiceBill.contactEmail].filter(Boolean).join(" · ")}</span>}<span>KvK {company.kvk} · Btw-ID {invoiceBill.vatId}</span></div>
          <div className="roof-doc-title"><h2>{invoicePreview?"FACTUUR":"OFFERTE"}</h2><strong>{invoicePreview?invoiceNumber:quoteNumber}</strong></div>
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
          <thead><tr><th>Werkzaamheden</th><th>Aantal / meters</th></tr></thead>
          <tbody>{pricing.publicLines.map((line,index)=><tr key={index}><td>{line.description}</td><td>{line.qty.toLocaleString("nl-NL")} {line.unit}</td></tr>)}</tbody>
        </table>
        <div className="roof-doc-totals">
          {invoicePreview && <div className="roof-doc-tax"><span>Subtotaal excl. btw</span><b>{euro(pricing.subtotal)}</b></div>}
          {invoicePreview && <div className="roof-doc-tax"><span>Btw {project.vatRate}%</span><b>{euro(pricing.vat)}</b></div>}
          <div className="grand"><strong>{invoicePreview?"Totaal te betalen incl. btw":"Vaste totaalprijs incl. "+project.vatRate+"% btw"}</strong><strong>{euro(pricing.total)}</strong></div>
        </div>
        {project.publicNotes.trim()&&<div className="roof-doc-notes"><b>Toelichting</b><p>{project.publicNotes}</p></div>}
        {invoicePreview?<div className="roof-doc-footer"><strong>Betalingsgegevens</strong><p>Betaling binnen {invoiceBill.paymentTermDays} dagen op {invoiceBill.iban} t.n.v. {company.name}.<br/>Onder vermelding van factuur {invoiceNumber}.</p></div>:
          <div className="roof-doc-footer"><strong>Akkoord op deze offerte?</strong><p>Reageer op deze offerte {settings.contactEmail?"via "+settings.contactEmail:"bij "+company.name} of neem telefonisch contact met ons op. De werkzaamheden worden in overleg ingepland.</p></div>}
      </article>
    </div>
  );
}
