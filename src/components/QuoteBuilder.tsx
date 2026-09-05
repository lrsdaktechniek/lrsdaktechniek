"use client";

import { useEffect, useMemo, useState } from "react";
import { site } from "@/lib/content";

type CatalogItem = {
  id: string;
  number?: number;
  category: string;
  label: string;
  unit: string;
  defaultPriceEx: number;
  defaultQty?: number;
  note?: string;
  keywords?: string;
};

type SelectedLine = { id: string; qty: number };
type CustomLine = { id: string; description: string; qty: number; unit: string; priceEx: number };
type PriceBook = Record<string, number>;

const VAT_DEFAULT = 21;
const DIFFICULT_DEFAULT = 10;
const STORAGE_BOOK = "lrs-internal-pricebook-v4-50repair";
const STORAGE_DRAFT = "lrs-internal-workorder-v4-50repair";

const CATALOG: readonly CatalogItem[] = [
  { id: "travel", category: "Voorrijden", label: "Voorrijkosten", unit: "post", defaultPriceEx: 75, defaultQty: 1, note: "Vast LRS-tarief. Reparatietarieven hieronder zijn exclusief voorrijkosten." },
  { id: "referral-fee", category: "Voorrijden", label: "Opdrachttoeslag via opdrachtgever / tussenpersoon", unit: "post", defaultPriceEx: 50, defaultQty: 1, note: "Alleen aanvinken wanneer de klus via een opdrachtgever of tussenpersoon is binnengekomen. Wordt bovenop de klantprijs gerekend." },

  // I. Vloeibare afdichtingen, kitten & pasta's
  { id: "repair-01", number: 1, category: "I · Vloeibare afdichtingen, kitten & pasta's", label: "Bitumen reparatiekit spuiten", unit: "scheur", defaultPriceEx: 95, keywords: "bitumen kit scheur" },
  { id: "repair-02", number: 2, category: "I · Vloeibare afdichtingen, kitten & pasta's", label: "Bitumineuze koudlijm (blaas fixeren)", unit: "blaas", defaultPriceEx: 110, keywords: "bitumen koudlijm blaas" },
  { id: "repair-03", number: 3, category: "I · Vloeibare afdichtingen, kitten & pasta's", label: "MS-Polymeerkit (aansluitingen)", unit: "naad", defaultPriceEx: 85, keywords: "ms polymeer kit aansluiting naad" },
  { id: "repair-04", number: 4, category: "I · Vloeibare afdichtingen, kitten & pasta's", label: "Polysulfidekit (loodvoeg)", unit: "strekkende meter", defaultPriceEx: 120, keywords: "polysulfide loodvoeg lood kit" },
  { id: "repair-05", number: 5, category: "I · Vloeibare afdichtingen, kitten & pasta's", label: "Polyurethaan (PU) kit", unit: "doorvoer", defaultPriceEx: 85, keywords: "pu polyurethaan kit doorvoer" },
  { id: "repair-06", number: 6, category: "I · Vloeibare afdichtingen, kitten & pasta's", label: "Vloeibaar rubber coating", unit: "lokale reparatie", defaultPriceEx: 185, keywords: "rubber coating vloeibaar" },
  { id: "repair-07", number: 7, category: "I · Vloeibare afdichtingen, kitten & pasta's", label: "Acrylaatdakcoating", unit: "m²", defaultPriceEx: 35, keywords: "acrylaat dak coating" },
  { id: "repair-08", number: 8, category: "I · Vloeibare afdichtingen, kitten & pasta's", label: "2-Componenten PMMA-hars", unit: "hoekaansluiting", defaultPriceEx: 240, keywords: "pmma hars hoek aansluiting" },
  { id: "repair-09", number: 9, category: "I · Vloeibare afdichtingen, kitten & pasta's", label: "Siliconen noodkit", unit: "noodstop", defaultPriceEx: 70, keywords: "siliconen noodkit noodstop" },
  { id: "repair-10", number: 10, category: "I · Vloeibare afdichtingen, kitten & pasta's", label: "Zink- en koperkit", unit: "gootscheurtje", defaultPriceEx: 90, keywords: "zink koper kit goot" },

  // II. Tapes, membranen & patches
  { id: "repair-11", number: 11, category: "II · Tapes, membranen & patches", label: "Aluminium bitumen tape", unit: "reparatie", defaultPriceEx: 85, keywords: "aluminium bitumen tape" },
  { id: "repair-12", number: 12, category: "II · Tapes, membranen & patches", label: "EPDM-reparatietape (Splice Tape)", unit: "naad", defaultPriceEx: 115, keywords: "epdm splice tape" },
  { id: "repair-13", number: 13, category: "II · Tapes, membranen & patches", label: "Butyltape", unit: "meter", defaultPriceEx: 90, keywords: "butyl tape meter" },
  { id: "repair-14", number: 14, category: "II · Tapes, membranen & patches", label: "Zelfklevende EPDM-patch", unit: "stuk", defaultPriceEx: 125, keywords: "epdm patch" },
  { id: "repair-15", number: 15, category: "II · Tapes, membranen & patches", label: "PVC-reparatiestrook (föhnen)", unit: "lasnaad", defaultPriceEx: 165, keywords: "pvc reparatie strook föhnen lasnaad" },
  { id: "repair-16", number: 16, category: "II · Tapes, membranen & patches", label: "Glasvlies / Polyestervlies inbedden", unit: "zone", defaultPriceEx: 195, keywords: "glasvlies polyestervlies" },
  { id: "repair-17", number: 17, category: "II · Tapes, membranen & patches", label: "Zelfklevende dakbedekking (underlayment)", unit: "reparatievlak", defaultPriceEx: 205, keywords: "zelfklevende dakbedekking underlayment" },
  { id: "repair-18", number: 18, category: "II · Tapes, membranen & patches", label: "Gootreparatietape aanbrengen", unit: "strekkende meter", defaultPriceEx: 90, keywords: "goot reparatie tape" },
  { id: "repair-19", number: 19, category: "II · Tapes, membranen & patches", label: "Zelfklevende loodvervanger-tape", unit: "strook", defaultPriceEx: 125, keywords: "loodvervanger tape" },

  // III. Thermische en mechanische bitumenreparaties
  { id: "repair-20", number: 20, category: "III · Thermische & mechanische bitumenreparaties", label: "Bitumen strook branden", unit: "brandstrook", defaultPriceEx: 205, keywords: "bitumen branden strook" },
  { id: "repair-21", number: 21, category: "III · Thermische & mechanische bitumenreparaties", label: "Hetelucht-bitumenlassen", unit: "overlapping", defaultPriceEx: 215, keywords: "hetelucht bitumen lassen" },
  { id: "repair-22", number: 22, category: "III · Thermische & mechanische bitumenreparaties", label: "Blazen opensnijden en dichtbranden", unit: "blaas", defaultPriceEx: 155, keywords: "blaas opensnijden dichtbranden" },
  { id: "repair-23", number: 23, category: "III · Thermische & mechanische bitumenreparaties", label: "Mechanisch fixeren met rozetringen", unit: "zone", defaultPriceEx: 185, keywords: "mechanisch fixeren rozetringen" },
  { id: "repair-24", number: 24, category: "III · Thermische & mechanische bitumenreparaties", label: "Grindlaag verplaatsen en bitumen herstellen", unit: "reparatieplek", defaultPriceEx: 260, keywords: "grindlaag bitumen reparatie" },
  { id: "repair-25", number: 25, category: "III · Thermische & mechanische bitumenreparaties", label: "Loodsmelten / solderen (antiek lood)", unit: "klus", defaultPriceEx: 240, keywords: "lood smelten solderen antiek" },

  // IV. Aansluitingen, gevels & loodwerk
  { id: "repair-26", number: 26, category: "IV · Aansluitingen, gevels & loodwerk", label: "Loodslabben strak kloppen", unit: "gevelzijde", defaultPriceEx: 85, keywords: "lood slabben kloppen gevel" },
  { id: "repair-27", number: 27, category: "IV · Aansluitingen, gevels & loodwerk", label: "Loodvoeg uitslijpen en opnieuw invoegen", unit: "strekkende meter", defaultPriceEx: 75, keywords: "loodvoeg uitslijpen invoegen" },
  { id: "repair-28", number: 28, category: "IV · Aansluitingen, gevels & loodwerk", label: "Nieuwe loodslabben aanbrengen", unit: "strekkende meter", defaultPriceEx: 110, keywords: "nieuwe loodslabben" },
  { id: "repair-29", number: 29, category: "IV · Aansluitingen, gevels & loodwerk", label: "Loodvervanger plaatsen", unit: "strekkende meter", defaultPriceEx: 85, keywords: "loodvervanger plaatsen" },
  { id: "repair-30", number: 30, category: "IV · Aansluitingen, gevels & loodwerk", label: "Schoorsteen impregneren", unit: "schoorsteen", defaultPriceEx: 315, keywords: "schoorsteen impregneren" },
  { id: "repair-31", number: 31, category: "IV · Aansluitingen, gevels & loodwerk", label: "Schoorsteenplateau / betonhoed repareren", unit: "plateau", defaultPriceEx: 360, keywords: "schoorsteen plateau betonhoed" },
  { id: "repair-32", number: 32, category: "IV · Aansluitingen, gevels & loodwerk", label: "Dakraammanchet vervangen (Velux)", unit: "raam", defaultPriceEx: 195, keywords: "velux dakraam manchet" },
  { id: "repair-33", number: 33, category: "IV · Aansluitingen, gevels & loodwerk", label: "Spouwlood herstellen (diep in de muur)", unit: "strekkende meter", defaultPriceEx: 285, keywords: "spouwlood muur herstellen" },

  // V. Schuine daken & pannendaken
  { id: "repair-34", number: 34, category: "V · Schuine daken & pannendaken", label: "Gebroken dakpan vervangen", unit: "pan", defaultPriceEx: 95, keywords: "dakpan gebroken vervangen" },
  { id: "repair-35", number: 35, category: "V · Schuine daken & pannendaken", label: "Verschoven dakpannen rechtleggen", unit: "zone", defaultPriceEx: 85, keywords: "verschoven dakpan rechtleggen" },
  { id: "repair-36", number: 36, category: "V · Schuine daken & pannendaken", label: "Panlatten vernieuwen", unit: "strekkende meter", defaultPriceEx: 45, keywords: "panlat vernieuwen" },
  { id: "repair-37", number: 37, category: "V · Schuine daken & pannendaken", label: "Dampopen folie (onderdak) herstellen", unit: "gat", defaultPriceEx: 215, keywords: "dampopen folie onderdak gat" },
  { id: "repair-38", number: 38, category: "V · Schuine daken & pannendaken", label: "Nokvorsten vastleggen met Flexim", unit: "strekkende meter", defaultPriceEx: 60, keywords: "nokvorst flexim" },
  { id: "repair-39", number: 39, category: "V · Schuine daken & pannendaken", label: "Ondervorst / Ruiterrol vervangen", unit: "strekkende meter", defaultPriceEx: 50, keywords: "ondervorst ruiterrol" },
  { id: "repair-40", number: 40, category: "V · Schuine daken & pannendaken", label: "Hoekpannen (gevelpannen) verankeren", unit: "rij", defaultPriceEx: 165, keywords: "hoekpan gevelpan verankeren" },
  { id: "repair-41", number: 41, category: "V · Schuine daken & pannendaken", label: "Vogelwering / Panlatprofiel plaatsen", unit: "strekkende meter", defaultPriceEx: 35, keywords: "vogelwering panlatprofiel" },
  { id: "repair-42", number: 42, category: "V · Schuine daken & pannendaken", label: "Knelstrips monteren (muuraansluiting)", unit: "strekkende meter", defaultPriceEx: 45, keywords: "knelstrip muur aansluiting" },

  // VI. Afwatering, goten & noodgrepen
  { id: "repair-43", number: 43, category: "VI · Afwatering, goten & noodgrepen", label: "Zinken goot solderen", unit: "soldeernaad", defaultPriceEx: 185, keywords: "zinken goot solderen" },
  { id: "repair-44", number: 44, category: "VI · Afwatering, goten & noodgrepen", label: "EPDM-gootrenovatie (bekleden)", unit: "strekkende meter", defaultPriceEx: 75, keywords: "epdm goot renovatie bekleden" },
  { id: "repair-45", number: 45, category: "VI · Afwatering, goten & noodgrepen", label: "Bladvanger / Boldraadrooster plaatsen", unit: "afvoer", defaultPriceEx: 85, keywords: "bladvanger boldraadrooster afvoer" },
  { id: "repair-46", number: 46, category: "VI · Afwatering, goten & noodgrepen", label: "Stadsuitloop of kiezelbak vernieuwen", unit: "uitloop", defaultPriceEx: 195, keywords: "stadsuitloop kiezelbak" },
  { id: "repair-47", number: 47, category: "VI · Afwatering, goten & noodgrepen", label: "Nooddouche / Drain-systeem", unit: "afvoer", defaultPriceEx: 135, keywords: "nooddouche drain systeem" },
  { id: "repair-48", number: 48, category: "VI · Afwatering, goten & noodgrepen", label: "Afdekzeil (Tarp) met ballast plaatsen", unit: "zeil", defaultPriceEx: 195, keywords: "afdekzeil tarp ballast" },
  { id: "repair-49", number: 49, category: "VI · Afwatering, goten & noodgrepen", label: "Krimpfolie (Roof Wrapping)", unit: "dakvlak", defaultPriceEx: 1225, keywords: "krimpfolie roof wrapping dakvlak" },
  { id: "repair-50", number: 50, category: "VI · Afwatering, goten & noodgrepen", label: "Overlaag (nieuwe toplaag bitumen)", unit: "m²", defaultPriceEx: 45, keywords: "overlaag toplaag bitumen" },
] as const;

const categories = Array.from(new Set(CATALOG.map(item => item.category)));
const euro = (value: number) => new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(value || 0);
const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

function defaultBook(): PriceBook {
  return Object.fromEntries(CATALOG.map(item => [item.id, item.defaultPriceEx]));
}

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function QuoteBuilder() {
  const [book, setBook] = useState<PriceBook>(defaultBook);
  const [vat, setVat] = useState(VAT_DEFAULT);
  const [showBook, setShowBook] = useState(false);
  const [bookSearch, setBookSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(categories[1] ?? categories[0] ?? "");

  const [customer, setCustomer] = useState("");
  const [address, setAddress] = useState("");
  const [jobTitle, setJobTitle] = useState("Werkbon dakreparatie");
  const [workDate, setWorkDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");

  const [selected, setSelected] = useState<SelectedLine[]>([{ id: "travel", qty: 1 }]);
  const [customLines, setCustomLines] = useState<CustomLine[]>([]);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [difficult, setDifficult] = useState(false);
  const [difficultPct, setDifficultPct] = useState(DIFFICULT_DEFAULT);
  const [copied, setCopied] = useState(false);
  const [timerStartedAt, setTimerStartedAt] = useState<number | null>(null);
  const [timerNow, setTimerNow] = useState(Date.now());

  useEffect(() => {
    try {
      const storedBook = localStorage.getItem(STORAGE_BOOK);
      if (storedBook) {
        const parsed = JSON.parse(storedBook) as { prices?: PriceBook; vat?: number; difficultPct?: number };
        setBook({ ...defaultBook(), ...(parsed.prices ?? {}) });
        if (typeof parsed.vat === "number") setVat(parsed.vat);
        if (typeof parsed.difficultPct === "number") setDifficultPct(parsed.difficultPct);
      }
      const storedDraft = localStorage.getItem(STORAGE_DRAFT);
      if (storedDraft) {
        const draft = JSON.parse(storedDraft);
        setCustomer(draft.customer ?? "");
        setAddress(draft.address ?? "");
        setJobTitle(draft.jobTitle ?? "Werkbon dakreparatie");
        setWorkDate(draft.workDate ?? new Date().toISOString().slice(0, 10));
        setNotes(draft.notes ?? "");
        setSelected(Array.isArray(draft.selected) && draft.selected.length > 0 ? draft.selected : [{ id: "travel", qty: 1 }]);
        setCustomLines(Array.isArray(draft.customLines) ? draft.customLines : []);
        setHours(Number(draft.hours ?? 0));
        setMinutes(Number(draft.minutes ?? 0));
        setDifficult(Boolean(draft.difficult));
        setTimerStartedAt(typeof draft.timerStartedAt === "number" ? draft.timerStartedAt : null);
      }
    } catch {
      // Beschadigde lokale opslag mag de interne tool niet blokkeren.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_DRAFT, JSON.stringify({
      customer, address, jobTitle, workDate, notes, selected, customLines, hours, minutes, difficult, timerStartedAt,
    }));
  }, [customer, address, jobTitle, workDate, notes, selected, customLines, hours, minutes, difficult, timerStartedAt]);

  useEffect(() => {
    if (timerStartedAt === null) return;
    const id = window.setInterval(() => setTimerNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [timerStartedAt]);

  const liveTimerMinutes = timerStartedAt === null ? 0 : Math.max(0, (timerNow - timerStartedAt) / 60000);
  const selectedIds = useMemo(() => new Set(selected.map(line => line.id)), [selected]);
  const durationHours = Math.max(0, Number(hours) || 0) + Math.max(0, Math.min(59, Number(minutes) || 0)) / 60 + liveTimerMinutes / 60;

  const workLines = useMemo(() => selected.map(selection => {
    const item = CATALOG.find(entry => entry.id === selection.id)!;
    const priceEx = Number(book[item.id] ?? item.defaultPriceEx);
    return {
      key: item.id,
      number: item.number,
      description: item.label,
      qty: Math.max(0, Number(selection.qty) || 0),
      unit: item.unit,
      priceEx,
      known: priceEx > 0,
    };
  }), [selected, book]);

  const baseSubtotal = useMemo(() => {
    const catalogTotal = workLines.reduce((sum, line) => sum + line.qty * line.priceEx, 0);
    const customTotal = customLines.reduce((sum, line) => sum + (Number(line.qty) || 0) * (Number(line.priceEx) || 0), 0);
    return roundMoney(catalogTotal + customTotal);
  }, [workLines, customLines]);

  const difficultAmount = difficult ? roundMoney(baseSubtotal * difficultPct / 100) : 0;
  const subtotal = roundMoney(baseSubtotal + difficultAmount);
  const vatAmount = roundMoney(subtotal * vat / 100);
  const total = roundMoney(subtotal + vatAmount);

  const unknownSelected = useMemo(() => {
    const unknownCatalog = workLines.filter(line => !line.known).map(line => line.description);
    const unknownCustom = customLines.filter(line => (Number(line.priceEx) || 0) <= 0).map(line => line.description || "Eigen regel");
    return [...unknownCatalog, ...unknownCustom];
  }, [workLines, customLines]);

  const filteredBookItems = useMemo(() => {
    const q = bookSearch.trim().toLowerCase();
    return CATALOG.filter(item => {
      if (q) return `${item.label} ${item.category} ${item.keywords ?? ""} ${item.number ?? ""}`.toLowerCase().includes(q);
      return item.category === activeCategory;
    });
  }, [bookSearch, activeCategory]);

  function saveBook() {
    localStorage.setItem(STORAGE_BOOK, JSON.stringify({ prices: book, vat, difficultPct }));
    setShowBook(false);
  }

  function resetOfficialPrices() {
    if (!window.confirm("Alle 50 reparatietarieven en voorrijkosten terugzetten naar de aangeleverde standaardprijzen?")) return;
    setBook(defaultBook());
    setVat(VAT_DEFAULT);
    setDifficultPct(DIFFICULT_DEFAULT);
    localStorage.setItem(STORAGE_BOOK, JSON.stringify({ prices: defaultBook(), vat: VAT_DEFAULT, difficultPct: DIFFICULT_DEFAULT }));
  }

  function toggleItem(item: CatalogItem) {
    setSelected(current => {
      const exists = current.some(line => line.id === item.id);
      if (exists) return current.filter(line => line.id !== item.id);
      return [...current, { id: item.id, qty: item.defaultQty ?? 1 }];
    });
  }

  function setQty(id: string, qty: number) {
    setSelected(current => current.map(line => line.id === id ? { ...line, qty } : line));
  }

  function startTimer() {
    if (timerStartedAt !== null) return;
    const now = Date.now();
    setTimerNow(now);
    setTimerStartedAt(now);
  }

  function stopTimer() {
    if (timerStartedAt === null) return;
    const elapsedMinutes = Math.max(0, Math.round((Date.now() - timerStartedAt) / 60000));
    const existingMinutes = Math.max(0, Number(hours) || 0) * 60 + Math.max(0, Number(minutes) || 0);
    const totalMinutes = existingMinutes + elapsedMinutes;
    setHours(Math.floor(totalMinutes / 60));
    setMinutes(totalMinutes % 60);
    setTimerStartedAt(null);
    setTimerNow(Date.now());
  }

  function addCustomLine() {
    setCustomLines(current => [...current, { id: uid("custom"), description: "", qty: 1, unit: "post", priceEx: 0 }]);
  }

  function resetWorkOrder() {
    if (!window.confirm("Nieuwe werkbon starten? De huidige selectie wordt gewist.")) return;
    setCustomer("");
    setAddress("");
    setJobTitle("Werkbon dakreparatie");
    setWorkDate(new Date().toISOString().slice(0, 10));
    setNotes("");
    setSelected([{ id: "travel", qty: 1 }]);
    setCustomLines([]);
    setHours(0);
    setMinutes(0);
    setDifficult(false);
    setTimerStartedAt(null);
    setTimerNow(Date.now());
    localStorage.removeItem(STORAGE_DRAFT);
  }

  const customerText = useMemo(() => {
    const lineText = [
      ...workLines.map(line => `- ${line.number ? `${line.number}. ` : ""}${line.description}: ${line.qty} ${line.unit} × ${euro(line.priceEx)} = ${euro(line.qty * line.priceEx)} excl. btw`),
      ...customLines.map(line => `- ${line.description || "Extra werkzaamheden"}: ${line.qty} ${line.unit} × ${euro(line.priceEx)} = ${euro(line.qty * line.priceEx)} excl. btw`),
    ];
    if (difficult && difficultAmount > 0) lineText.push(`- Toeslag moeilijke bereikbaarheid (${difficultPct}%): ${euro(difficultAmount)} excl. btw`);

    return [
      `LRS Daktechniek — ${jobTitle}`,
      customer ? `Klant: ${customer}` : "",
      address ? `Adres: ${address}` : "",
      `Datum: ${new Date(`${workDate}T12:00:00`).toLocaleDateString("nl-NL")}`,
      durationHours > 0 ? `Tijd op locatie: ${Math.floor(durationHours)} uur ${Math.round((durationHours % 1) * 60)} min` : "",
      "",
      "Uitgevoerde werkzaamheden:",
      ...lineText,
      "",
      `Subtotaal excl. btw: ${euro(subtotal)}`,
      `BTW ${vat}%: ${euro(vatAmount)}`,
      `Totaal incl. btw: ${euro(total)}`,
      notes ? `\nOpmerking: ${notes}` : "",
    ].filter(Boolean).join("\n");
  }, [jobTitle, customer, address, workDate, durationHours, workLines, customLines, difficult, difficultAmount, difficultPct, subtotal, vat, vatAmount, total, notes]);

  async function copyCustomerText() {
    if (unknownSelected.length > 0) return;
    await navigator.clipboard.writeText(customerText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="internal-price-engine">
      <header className="internal-topbar no-print">
        <div>
          <span className="internal-kicker">LRS · PRIVÉ · 50 REPARATIETARIEVEN</span>
          <h1>Werkbon & prijsengine</h1>
          <p>Voorrijkosten staan standaard aan. Vink alleen aan wat je werkelijk hebt uitgevoerd; de tool rekent meteen het klantbedrag uit.</p>
        </div>
        <div className="internal-top-actions">
          <button className="internal-btn ghost" type="button" onClick={() => setShowBook(value => !value)}>PRIJSBOEK</button>
          <button className="internal-btn ghost" type="button" onClick={resetWorkOrder}>NIEUWE WERKBON</button>
          <button className="internal-btn" type="button" onClick={() => window.print()}>PDF / PRINT</button>
        </div>
      </header>

      {showBook && (
        <section className="internal-pricebook no-print">
          <div className="internal-panel-head">
            <div><span className="internal-kicker">50 VASTE REPARATIEPRIJZEN</span><h2>Intern prijsboek</h2><p>Alle bedragen zijn excl. btw. De 50 reparatietarieven zijn excl. voorrijkosten.</p></div>
            <button className="internal-close" type="button" onClick={() => setShowBook(false)}>×</button>
          </div>
          <div className="pricebook-settings">
            <label><span>BTW %</span><input type="number" min="0" step="0.1" value={vat} onChange={event => setVat(Number(event.target.value))}/></label>
            <label><span>Moeilijk bereikbaar %</span><input type="number" min="0" step="0.1" value={difficultPct} onChange={event => setDifficultPct(Number(event.target.value))}/></label>
            <label className="pricebook-search"><span>Zoeken</span><input value={bookSearch} onChange={event => setBookSearch(event.target.value)} placeholder="nummer, pan, kit, lood, bitumen..."/></label>
          </div>
          {!bookSearch && <div className="pricebook-tabs">{categories.map(category => <button type="button" key={category} className={category === activeCategory ? "active" : ""} onClick={() => setActiveCategory(category)}>{category}</button>)}</div>}
          <div className="pricebook-list">
            {filteredBookItems.map(item => (
              <label key={item.id} className="pricebook-row">
                <div><strong>{item.number ? `${item.number}. ` : ""}{item.label}</strong><small>per {item.unit}</small>{item.note && <em>{item.note}</em>}</div>
                <div className={Number(book[item.id] ?? 0) > 0 ? "price-ready" : "price-missing"}>
                  <span>€ excl.</span>
                  <input type="number" min="0" step="0.01" value={book[item.id] ?? 0} onChange={event => setBook(current => ({ ...current, [item.id]: Number(event.target.value) }))}/>
                </div>
              </label>
            ))}
          </div>
          <div className="pricebook-savebar">
            <p>De standaardprijzen komen uit jouw aangeleverde 50-puntenlijst. Je kunt ze later intern aanpassen; wijzigingen worden alleen in deze browser opgeslagen.</p>
            <div className="internal-top-actions"><button className="internal-btn ghost" type="button" onClick={resetOfficialPrices}>HERSTEL STANDAARDPRIJZEN</button><button className="internal-btn" type="button" onClick={saveBook}>PRIJSBOEK OPSLAAN</button></div>
          </div>
        </section>
      )}

      <div className="internal-layout">
        <main className="internal-workspace no-print">
          <section className="internal-card customer-card">
            <div className="internal-section-title"><span>01</span><div><small>KLANT / KLUS</small><h2>Werkbon</h2></div></div>
            <div className="internal-form-grid">
              <label><span>Klantnaam</span><input value={customer} onChange={event => setCustomer(event.target.value)} placeholder="Naam klant"/></label>
              <label><span>Volledig adres</span><input value={address} onChange={event => setAddress(event.target.value)} placeholder="Straat 1, 4811 AA Breda"/></label>
              <label><span>Datum</span><input type="date" value={workDate} onChange={event => setWorkDate(event.target.value)}/></label>
              <label><span>Titel</span><input value={jobTitle} onChange={event => setJobTitle(event.target.value)}/></label>
            </div>
            {address.trim() && <a className="internal-maps-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer">OPEN ADRES IN GOOGLE MAPS →</a>}
          </section>

          <section className="internal-card">
            <div className="internal-section-title"><span>02</span><div><small>UITGEVOERD</small><h2>Vink werkzaamheden aan</h2></div></div>
            <div className="work-category-stack">
              {categories.map(category => (
                <details key={category} open={category === "Voorrijden" || category === "V · Schuine daken & pannendaken"}>
                  <summary>{category}<span>{CATALOG.filter(item => item.category === category && selectedIds.has(item.id)).length || ""}</span></summary>
                  <div className="work-check-grid">
                    {CATALOG.filter(item => item.category === category).map(item => {
                      const chosen = selected.find(line => line.id === item.id);
                      const price = Number(book[item.id] ?? item.defaultPriceEx);
                      return (
                        <div key={item.id} className={`work-check-row ${chosen ? "selected" : ""} ${chosen && price <= 0 ? "missing-price" : ""}`}>
                          <label className="work-check-main">
                            <input type="checkbox" checked={Boolean(chosen)} onChange={() => toggleItem(item)}/>
                            <span><strong>{item.number ? `${item.number}. ` : ""}{item.label}</strong><small>{euro(price)} excl. / {item.unit}</small></span>
                          </label>
                          {chosen && <label className="work-qty"><span>Aantal</span><input type="number" min="0" step={item.unit.includes("meter") || item.unit === "m²" ? "0.1" : "1"} value={chosen.qty} onChange={event => setQty(item.id, Number(event.target.value))}/><em>{item.unit}</em></label>}
                        </div>
                      );
                    })}
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section className="internal-card">
            <div className="internal-section-title"><span>03</span><div><small>TIJD</small><h2>Hoe lang was je bezig?</h2></div></div>
            <p className="internal-help">De tijd wordt geregistreerd voor jouw werkbon. De 50 handelingstarieven worden niet nogmaals met een uurtarief verhoogd.</p>
            <div className="time-grid">
              <label><span>Uren</span><input type="number" min="0" step="1" value={hours} onChange={event => setHours(Number(event.target.value))}/></label>
              <label><span>Minuten</span><input type="number" min="0" max="59" step="5" value={minutes} onChange={event => setMinutes(Number(event.target.value))}/></label>
              <label className="toggle-card"><input type="checkbox" checked={difficult} onChange={event => setDifficult(event.target.checked)}/><span><strong>Moeilijke bereikbaarheid</strong><small>Voegt {difficultPct}% toe aan het berekende bedrag.</small></span></label>
            </div>
            <div className="timer-control">
              <div><span className="internal-kicker">LIVE TIMER</span><strong>{timerStartedAt === null ? "NIET ACTIEF" : `${Math.floor(liveTimerMinutes / 60)}u ${Math.floor(liveTimerMinutes % 60)}m`}</strong></div>
              {timerStartedAt === null ? <button className="internal-btn ghost" type="button" onClick={startTimer}>START TIMER</button> : <button className="internal-btn" type="button" onClick={stopTimer}>STOP & OPSLAAN</button>}
            </div>
          </section>

          <section className="internal-card">
            <div className="internal-section-title"><span>04</span><div><small>EXTRA</small><h2>Eigen regels</h2></div></div>
            <p className="internal-help">Alleen voor werkzaamheden die buiten de 50 vaste reparatieopties vallen.</p>
            <div className="custom-lines">
              {customLines.map(line => (
                <div className="custom-line" key={line.id}>
                  <input className="custom-desc" value={line.description} onChange={event => setCustomLines(current => current.map(item => item.id === line.id ? { ...item, description: event.target.value } : item))} placeholder="Bijv. extra materiaal"/>
                  <input type="number" min="0" step="0.1" value={line.qty} onChange={event => setCustomLines(current => current.map(item => item.id === line.id ? { ...item, qty: Number(event.target.value) } : item))}/>
                  <input value={line.unit} onChange={event => setCustomLines(current => current.map(item => item.id === line.id ? { ...item, unit: event.target.value } : item))}/>
                  <input type="number" min="0" step="0.01" value={line.priceEx} onChange={event => setCustomLines(current => current.map(item => item.id === line.id ? { ...item, priceEx: Number(event.target.value) } : item))}/>
                  <button type="button" onClick={() => setCustomLines(current => current.filter(item => item.id !== line.id))}>×</button>
                </div>
              ))}
            </div>
            <button className="internal-add" type="button" onClick={addCustomLine}>+ EIGEN REGEL TOEVOEGEN</button>
            <label className="internal-notes"><span>Interne / klantopmerking</span><textarea rows={4} value={notes} onChange={event => setNotes(event.target.value)} placeholder="Bijzonderheden, oorzaak, advies..."/></label>
          </section>
        </main>

        <aside className="internal-summary">
          <div className="internal-summary-sticky">
            <span className="internal-kicker">LIVE TOTAAL</span>
            <h2>{jobTitle || "Werkbon"}</h2>
            {durationHours > 0 && <p className="duration-readout">Tijd op locatie <strong>{Math.floor(durationHours)}u {Math.round((durationHours % 1) * 60)}m</strong></p>}

            <div className="summary-lines">
              {workLines.map(line => <div key={line.key}><span>{line.number ? `${line.number}. ` : ""}{line.description}<small>{line.qty} {line.unit} × {euro(line.priceEx)}</small></span><strong>{euro(line.qty * line.priceEx)}</strong></div>)}
              {customLines.map(line => <div key={line.id}><span>{line.description || "Eigen regel"}<small>{line.qty} {line.unit} × {euro(line.priceEx)}</small></span><strong>{euro(line.qty * line.priceEx)}</strong></div>)}
              {difficultAmount > 0 && <div><span>Moeilijk bereikbaar<small>{difficultPct}% toeslag</small></span><strong>{euro(difficultAmount)}</strong></div>}
            </div>

            {unknownSelected.length > 0 && <div className="price-alert"><strong>{unknownSelected.length} prijs{unknownSelected.length === 1 ? "" : "en"} ontbreekt</strong><p>{unknownSelected.slice(0, 5).join(", ")}{unknownSelected.length > 5 ? "…" : ""}</p></div>}

            <div className="summary-totals">
              <p><span>Subtotaal excl.</span><strong>{euro(subtotal)}</strong></p>
              <p><span>BTW {vat}%</span><strong>{euro(vatAmount)}</strong></p>
              <p className="summary-grand"><span>Totaal incl.</span><strong>{euro(total)}</strong></p>
            </div>

            <div className="summary-actions no-print">
              <button className="internal-btn" type="button" disabled={unknownSelected.length > 0 || selected.length + customLines.length === 0} onClick={copyCustomerText}>{copied ? "GEKOPIEERD" : "KOPIEER KLANTBERICHT"}</button>
              <button className="internal-btn ghost" type="button" onClick={() => window.print()}>PRINT / PDF</button>
            </div>
          </div>
        </aside>
      </div>

      <section className="internal-print-document">
        <header><div><strong>LRS DAKTECHNIEK</strong><span>Breda & omgeving</span></div><div><span>{site.phoneDisplay}</span><span>{site.email}</span><span>KVK {site.kvk}</span></div></header>
        <div className="print-title"><small>WERKBON / PRIJSOVERZICHT</small><h1>{jobTitle}</h1></div>
        <dl className="print-customer"><div><dt>Klant</dt><dd>{customer || "—"}</dd></div><div><dt>Adres</dt><dd>{address || "—"}</dd></div><div><dt>Datum</dt><dd>{new Date(`${workDate}T12:00:00`).toLocaleDateString("nl-NL")}</dd></div><div><dt>Tijd op locatie</dt><dd>{durationHours > 0 ? `${Math.floor(durationHours)} uur ${Math.round((durationHours % 1) * 60)} min` : "—"}</dd></div></dl>
        <table><thead><tr><th>Werkzaamheden</th><th>Aantal</th><th>Eenheid</th><th>Prijs excl.</th><th>Totaal excl.</th></tr></thead><tbody>
          {workLines.map(line => <tr key={line.key}><td>{line.number ? `${line.number}. ` : ""}{line.description}</td><td>{line.qty}</td><td>{line.unit}</td><td>{euro(line.priceEx)}</td><td>{euro(line.qty * line.priceEx)}</td></tr>)}
          {customLines.map(line => <tr key={line.id}><td>{line.description}</td><td>{line.qty}</td><td>{line.unit}</td><td>{euro(line.priceEx)}</td><td>{euro(line.qty * line.priceEx)}</td></tr>)}
          {difficultAmount > 0 && <tr><td>Moeilijk bereikbaar ({difficultPct}%)</td><td>1</td><td>post</td><td>{euro(difficultAmount)}</td><td>{euro(difficultAmount)}</td></tr>}
        </tbody></table>
        <div className="print-totals"><p><span>Subtotaal excl. btw</span><strong>{euro(subtotal)}</strong></p><p><span>BTW {vat}%</span><strong>{euro(vatAmount)}</strong></p><p><span>Totaal incl. btw</span><strong>{euro(total)}</strong></p></div>
        {notes && <div className="print-notes"><strong>Opmerking</strong><p>{notes}</p></div>}
      </section>
    </div>
  );
}
