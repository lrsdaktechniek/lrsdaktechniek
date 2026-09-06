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
type InvoiceSettings = {
  businessAddress: string;
  vatId: string;
  iban: string;
  paymentTermDays: number;
};

const VAT_DEFAULT = 21;
const DIFFICULT_DEFAULT = 10;
const STORAGE_BOOK = "lrs-internal-pricebook-v4-50repair";
const STORAGE_DRAFT = "lrs-internal-workorder-v5-smartstaffel";
const STORAGE_INVOICE_SETTINGS = "lrs-invoice-settings-v1";
const STORAGE_INVOICE_SEQUENCE = "lrs-invoice-sequence-v1";

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
const roundToFive = (value: number) => Math.max(0, Math.round(value / 5) * 5);

function isLinearUnit(unit: string) {
  return unit === "m²" || unit === "meter" || unit.includes("meter");
}

function extraUnitRate(item: CatalogItem, basePrice: number) {
  if (item.id === "repair-34") return 25; // extra dakpan tijdens dezelfde klus
  if (item.unit === "m²") return roundToFive(basePrice * 0.90);
  if (item.unit === "meter" || item.unit.includes("meter")) return roundToFive(basePrice * 0.75);
  if (["dakvlak", "plateau", "schoorsteen", "raam", "klus", "reparatievlak", "reparatieplek", "zeil"].includes(item.unit)) return roundToFive(basePrice * 0.72);
  if (item.category.startsWith("I ·")) return roundToFive(basePrice * 0.50);
  if (item.category.startsWith("II ·")) return roundToFive(basePrice * 0.55);
  if (item.category.startsWith("III ·")) return roundToFive(basePrice * 0.65);
  if (item.category.startsWith("IV ·")) return roundToFive(basePrice * 0.65);
  if (item.category.startsWith("V ·")) return roundToFive(basePrice * 0.50);
  if (item.category.startsWith("VI ·")) return roundToFive(basePrice * 0.60);
  return roundToFive(basePrice * 0.60);
}

function carryOnRate(item: CatalogItem, basePrice: number) {
  const extra = extraUnitRate(item, basePrice);
  if (item.id === "repair-34") return Math.max(extra, 50);
  let factor = 0.70;
  if (item.unit === "m²" || item.unit === "meter" || item.unit.includes("meter")) factor = 0.85;
  else if (["dakvlak", "plateau", "schoorsteen", "raam", "klus", "reparatievlak", "reparatieplek", "zeil"].includes(item.unit)) factor = 0.80;
  else if (item.category.startsWith("I ·")) factor = 0.65;
  else if (item.category.startsWith("II ·")) factor = 0.70;
  else if (item.category.startsWith("III ·")) factor = 0.75;
  else if (item.category.startsWith("IV ·")) factor = 0.75;
  else if (item.category.startsWith("V ·")) factor = 0.65;
  else if (item.category.startsWith("VI ·")) factor = 0.70;
  return Math.max(extra, roundToFive(basePrice * factor));
}

function rawSmartLineTotal(item: CatalogItem, qty: number, basePrice: number) {
  const safeQty = Math.max(0, Number(qty) || 0);
  if (safeQty <= 0) return 0;
  const firstQty = Math.min(1, safeQty);
  const extraQty = Math.max(0, safeQty - 1);
  return roundMoney(firstQty * basePrice + extraQty * extraUnitRate(item, basePrice));
}

function defaultBook(): PriceBook {
  return Object.fromEntries(CATALOG.map(item => [item.id, item.defaultPriceEx]));
}

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function QuoteBuilder({ accessToken }: { accessToken: string }) {
  const [book, setBook] = useState<PriceBook>(defaultBook);
  const [vat, setVat] = useState(VAT_DEFAULT);
  const [showBook, setShowBook] = useState(false);
  const [bookSearch, setBookSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(categories[1] ?? categories[0] ?? "");
  const [workCategory, setWorkCategory] = useState("V · Schuine daken & pannendaken");
  const [workSearch, setWorkSearch] = useState("");
  const [showDetails, setShowDetails] = useState(false);

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
  const [customerEmail, setCustomerEmail] = useState("");
  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings>({
    businessAddress: "",
    vatId: "",
    iban: "",
    paymentTermDays: 14,
  });
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceBusy, setInvoiceBusy] = useState(false);
  const [invoiceStatus, setInvoiceStatus] = useState("");

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
        setCustomerEmail(draft.customerEmail ?? "");
      }
      const storedInvoiceSettings = localStorage.getItem(STORAGE_INVOICE_SETTINGS);
      if (storedInvoiceSettings) {
        const parsed = JSON.parse(storedInvoiceSettings) as Partial<InvoiceSettings>;
        setInvoiceSettings({
          businessAddress: parsed.businessAddress ?? "",
          vatId: parsed.vatId ?? "",
          iban: parsed.iban ?? "",
          paymentTermDays: Number(parsed.paymentTermDays ?? 14),
        });
      }
      const seq = Math.max(1, Number(localStorage.getItem(STORAGE_INVOICE_SEQUENCE) ?? "1") || 1);
      setInvoiceNumber(`LRS-${new Date().getFullYear()}-${String(seq).padStart(4,"0")}`);
    } catch {
      // Beschadigde lokale opslag mag de interne tool niet blokkeren.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_DRAFT, JSON.stringify({
      customer, address, customerEmail, jobTitle, workDate, notes, selected, customLines, hours, minutes, difficult, timerStartedAt,
    }));
  }, [customer, address, customerEmail, jobTitle, workDate, notes, selected, customLines, hours, minutes, difficult, timerStartedAt]);

  useEffect(() => {
    if (timerStartedAt === null) return;
    const id = window.setInterval(() => setTimerNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [timerStartedAt]);

  const liveTimerMinutes = timerStartedAt === null ? 0 : Math.max(0, (timerNow - timerStartedAt) / 60000);
  const selectedIds = useMemo(() => new Set(selected.map(line => line.id)), [selected]);
  const durationHours = Math.max(0, Number(hours) || 0) + Math.max(0, Math.min(59, Number(minutes) || 0)) / 60 + liveTimerMinutes / 60;

  const travelSelected = selectedIds.has("travel");
  const travelPrice = Number(book["travel"] ?? 75);

  const primaryRepairId = useMemo(() => {
    const repairs = selected.filter(line => line.id.startsWith("repair-"));
    if (repairs.length === 0) return null;
    return repairs
      .map(line => {
        const item = CATALOG.find(entry => entry.id === line.id)!;
        const basePrice = Number(book[item.id] ?? item.defaultPriceEx);
        return { id: line.id, score: rawSmartLineTotal(item, line.qty, basePrice) };
      })
      .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))[0]?.id ?? null;
  }, [selected, book]);

  const workLines = useMemo(() => selected.map(selection => {
    const item = CATALOG.find(entry => entry.id === selection.id)!;
    const basePriceEx = Number(book[item.id] ?? item.defaultPriceEx);
    const qty = Math.max(0, Number(selection.qty) || 0);

    if (!item.id.startsWith("repair-")) {
      return {
        key: item.id, number: item.number, description: item.label, qty, unit: item.unit,
        basePriceEx, firstRateEx: basePriceEx, extraRateEx: basePriceEx, lineTotalEx: roundMoney(qty * basePriceEx),
        known: basePriceEx > 0, pricingMode: "fixed" as const,
        rateLabel: `${euro(basePriceEx)} vaste post`,
      };
    }

    const extraRateEx = extraUnitRate(item, basePriceEx);
    const firstQty = Math.min(1, qty);
    const extraQty = Math.max(0, qty - 1);
    const isPrimary = item.id === primaryRepairId;
    const firstRateEx = isPrimary
      ? (travelSelected ? Math.max(0, basePriceEx - travelPrice) : basePriceEx)
      : carryOnRate(item, basePriceEx);
    const lineTotalEx = roundMoney(firstQty * firstRateEx + extraQty * extraRateEx);

    return {
      key: item.id, number: item.number, description: item.label, qty, unit: item.unit,
      basePriceEx, firstRateEx, extraRateEx, lineTotalEx, known: basePriceEx > 0,
      pricingMode: isPrimary ? "primary" as const : "carry" as const,
      rateLabel: isPrimary
        ? `${travelSelected ? "hoofdklus na €" + travelPrice.toFixed(0) + " startcorrectie" : "hoofdklus"} · extra ${euro(extraRateEx)}/${item.unit}`
        : `meeneemtarief ${euro(firstRateEx)} · extra ${euro(extraRateEx)}/${item.unit}`,
    };
  }), [selected, book, primaryRepairId, travelSelected, travelPrice]);

  const catalogSubtotal = useMemo(() => roundMoney(workLines.reduce((sum, line) => sum + line.lineTotalEx, 0)), [workLines]);
  const repairSubtotal = useMemo(() => roundMoney(workLines.filter(line => line.key.startsWith("repair-")).reduce((sum, line) => sum + line.lineTotalEx, 0)), [workLines]);
  const customSubtotal = useMemo(() => roundMoney(customLines.reduce((sum, line) => sum + (Number(line.qty) || 0) * (Number(line.priceEx) || 0), 0)), [customLines]);
  const baseSubtotal = roundMoney(catalogSubtotal + customSubtotal);

  // Bereikbaarheid wordt alleen over daadwerkelijk werk gerekend, niet over voorrij- of opdrachttoeslag.
  const difficultBase = roundMoney(repairSubtotal + customSubtotal);
  const difficultAmount = difficult ? roundMoney(difficultBase * difficultPct / 100) : 0;
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

  const repairCategories = useMemo(() => categories.filter(category => category !== "Voorrijden"), []);
  const filteredWorkItems = useMemo(() => {
    const query = workSearch.trim().toLowerCase();
    return CATALOG.filter(item => {
      if (!item.number) return false;
      if (query) return `${item.number} ${item.label} ${item.category} ${item.keywords ?? ""}`.toLowerCase().includes(query);
      return item.category === workCategory;
    });
  }, [workCategory, workSearch]);

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
    setCustomerEmail("");
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
    const visibleRepairs = workLines.filter(line => line.key.startsWith("repair-"));
    const lineText = [
      ...visibleRepairs.map(line => `- ${line.number ? `${line.number}. ` : ""}${line.description}: ${line.qty} ${line.unit}`),
      ...customLines.map(line => `- ${line.description || "Extra werkzaamheden"}: ${line.qty} ${line.unit}`),
    ];
    if (travelSelected) lineText.push("- Voorrij- en startkosten: verwerkt in het afgesproken totaal");
    if (difficult && difficultAmount > 0) lineText.push("- Moeilijke bereikbaarheid: verwerkt in het afgesproken totaal");

    return [
      `LRS Daktechniek — ${jobTitle}`,
      customer ? `Klant: ${customer}` : "",
      address ? `Adres: ${address}` : "",
      `Datum: ${new Date(`${workDate}T12:00:00`).toLocaleDateString("nl-NL")}`,
      durationHours > 0 ? `Tijd op locatie: ${Math.floor(durationHours)} uur ${Math.round((durationHours % 1) * 60)} min` : "",
      "",
      "Uitgevoerde werkzaamheden:",
      ...(lineText.length ? lineText : ["- Dakservice / controle volgens afspraak"]),
      "",
      `Subtotaal excl. btw: ${euro(subtotal)}`,
      `BTW ${vat}%: ${euro(vatAmount)}`,
      `Totaal incl. btw: ${euro(total)}`,
      notes ? `\nOpmerking: ${notes}` : "",
    ].filter(Boolean).join("\n");
  }, [jobTitle, customer, address, workDate, durationHours, workLines, customLines, travelSelected, difficult, difficultAmount, subtotal, vat, vatAmount, total, notes]);

  async function copyCustomerText() {
    if (unknownSelected.length > 0) return;
    await navigator.clipboard.writeText(customerText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }


  function saveInvoiceSettings(next: InvoiceSettings) {
    setInvoiceSettings(next);
    localStorage.setItem(STORAGE_INVOICE_SETTINGS, JSON.stringify(next));
  }

  async function sendInvoice() {
    setInvoiceStatus("");
    if (unknownSelected.length > 0) {
      setInvoiceStatus("Er staat nog een regel zonder prijs.");
      return;
    }
    if (!customer.trim() || !address.trim() || !customerEmail.trim()) {
      setInvoiceStatus("Vul klantnaam, volledig adres en e-mailadres in.");
      return;
    }
    if (!invoiceSettings.businessAddress.trim() || !invoiceSettings.vatId.trim()) {
      setInvoiceStatus("Vul eerst jouw bedrijfsadres en btw-id in bij Factuurinstellingen.");
      return;
    }
    if (!invoiceNumber.trim()) {
      setInvoiceStatus("Factuurnummer ontbreekt.");
      return;
    }

    const performedWork = [
      ...workLines
        .filter(line => line.key.startsWith("repair-"))
        .map(line => `${line.number ? `${line.number}. ` : ""}${line.description} (${line.qty} ${line.unit})`),
      ...customLines.map(line => `${line.description || "Extra werkzaamheden"} (${line.qty} ${line.unit})`),
    ];
    const invoiceDescription = [
      performedWork.length ? `Dakreparatie volgens werkbon: ${performedWork.join("; ")}` : "Dakservice / controle volgens werkbon",
      travelSelected ? "voorrij- en startkosten inbegrepen" : "",
      difficultAmount > 0 ? "bereikbaarheid verwerkt in totaal" : "",
    ].filter(Boolean).join(" · ");

    const invoiceLines = [{
      description: invoiceDescription,
      qty: 1,
      unit: "opdracht",
      amountEx: subtotal,
    }];

    setInvoiceBusy(true);
    try {
      const response = await fetch("/api/factuur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken,
          customer: { name: customer.trim(), address: address.trim(), email: customerEmail.trim() },
          business: {
            name: site.name,
            address: invoiceSettings.businessAddress.trim(),
            email: site.email,
            phone: site.phoneDisplay,
            kvk: site.kvk,
            vatId: invoiceSettings.vatId.trim(),
            iban: invoiceSettings.iban.trim(),
          },
          invoice: {
            number: invoiceNumber.trim(),
            issueDate: new Date().toISOString().slice(0,10),
            serviceDate: workDate,
            title: jobTitle,
            paymentTermDays: Math.max(0, Number(invoiceSettings.paymentTermDays) || 0),
            notes,
          },
          lines: invoiceLines,
          subtotal,
          vatRate: vat,
          vatAmount,
          total,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Factuur kon niet worden verstuurd.");

      const currentSeq = Math.max(1, Number(localStorage.getItem(STORAGE_INVOICE_SEQUENCE) ?? "1") || 1);
      const nextSeq = currentSeq + 1;
      localStorage.setItem(STORAGE_INVOICE_SEQUENCE, String(nextSeq));
      setInvoiceNumber(`LRS-${new Date().getFullYear()}-${String(nextSeq).padStart(4,"0")}`);
      setInvoiceStatus(`Factuur ${data.invoiceNumber || invoiceNumber} is verstuurd naar ${customerEmail}.`);
    } catch (error) {
      setInvoiceStatus(error instanceof Error ? error.message : "Factuur kon niet worden verstuurd.");
    } finally {
      setInvoiceBusy(false);
    }
  }

  return (
    <div className="internal-price-engine tap-engine">
      <header className="tap-topbar no-print">
        <div>
          <span className="internal-kicker">LRS · PRIVÉ PRIJSENGINE</span>
          <h1>Wat heb je gedaan?</h1>
          <p>Alleen aantikken. De prijs wordt direct opgeteld.</p>
        </div>
        <button className="tap-new" type="button" onClick={resetWorkOrder}>NIEUW</button>
      </header>

      <div className="tap-totalbar no-print">
        <div><span>TOTAAL KLANT INCL. BTW</span><strong>{euro(total)}</strong></div>
        <div className="tap-total-mini"><span>Excl.</span><b>{euro(subtotal)}</b><span>BTW</span><b>{euro(vatAmount)}</b></div>
      </div>

      <main className="tap-shell no-print">
        <section className="tap-section tap-fixed-costs">
          <div className="tap-section-head"><span>01</span><div><small>VASTE / EXTRA KOSTEN</small><h2>Eerst dit</h2></div></div>
          <div className="tap-toggle-grid">
            {CATALOG.filter(item => item.id === "travel" || item.id === "referral-fee").map(item => {
              const chosen = selected.find(line => line.id === item.id);
              const price = Number(book[item.id] ?? item.defaultPriceEx);
              return <button key={item.id} type="button" className={`tap-toggle ${chosen ? "selected" : ""}`} onClick={() => toggleItem(item)}>
                <span className="tap-checkmark">{chosen ? "✓" : "+"}</span>
                <span><strong>{item.label}</strong><small>{euro(price)} excl. btw</small></span>
              </button>;
            })}
            <button type="button" className={`tap-toggle ${difficult ? "selected" : ""}`} onClick={() => setDifficult(value => !value)}>
              <span className="tap-checkmark">{difficult ? "✓" : "+"}</span>
              <span><strong>Moeilijk bereikbaar</strong><small>+{difficultPct}% op subtotaal</small></span>
            </button>
          </div>
        </section>

        <div className="tap-pricing-note" style={{ margin: "0 0 24px", padding: "16px 18px", background: "#eef3f5", color: "#070a0d", display: "grid", gap: 6 }}>
          <strong>SLIMME KLUSPRIJS ACTIEF</strong>
          <span>€75 start/voorrijden wordt maar één keer gerekend. De hoofdreparatie krijgt automatisch de startcorrectie; extra aantallen en extra werkzaamheden krijgen een lager meeneemtarief.</span>
        </div>

        <section className="tap-section">
          <div className="tap-section-head"><span>02</span><div><small>WERKZAAMHEDEN</small><h2>Vink aan wat je hebt gedaan</h2></div></div>

          <div className="tap-search-wrap">
            <input value={workSearch} onChange={event => setWorkSearch(event.target.value)} placeholder="Zoek: dakpan, kit, lood, bitumen..." />
            {workSearch && <button type="button" onClick={() => setWorkSearch("")}>×</button>}
          </div>

          {!workSearch && <div className="tap-category-tabs">
            {repairCategories.map(category => <button type="button" key={category} className={workCategory === category ? "active" : ""} onClick={() => setWorkCategory(category)}>{category}</button>)}
          </div>}

          <div className="tap-repair-grid">
            {filteredWorkItems.map(item => {
              const chosen = selected.find(line => line.id === item.id);
              const price = Number(book[item.id] ?? item.defaultPriceEx);
              const variableQty = item.unit.includes("meter") || item.unit === "meter" || item.unit === "m²" || ["pan","stuk","gat","rij","afvoer","naad","blaas","doorvoer","strook","scheur","gevelzijde","raam","uitloop","dakvlak"].includes(item.unit);
              return <article key={item.id} className={`tap-repair-card ${chosen ? "selected" : ""}`}>
                <button type="button" className="tap-repair-select" onClick={() => toggleItem(item)}>
                  <span className="tap-repair-number">{String(item.number).padStart(2,"0")}</span>
                  <span className="tap-repair-copy"><strong>{item.label}</strong><small>Basis {euro(price)} · extra {euro(extraUnitRate(item, price))}/{item.unit}</small></span>
                  <span className="tap-repair-mark">{chosen ? "✓" : "+"}</span>
                </button>
                {chosen && variableQty && <div className="tap-qty-row">
                  <button type="button" onClick={() => setQty(item.id, Math.max(item.unit.includes("meter") || item.unit === "meter" || item.unit === "m²" ? 0.1 : 1, Number(chosen.qty) - (item.unit.includes("meter") || item.unit === "meter" || item.unit === "m²" ? 0.5 : 1)))}>−</button>
                  <label><span>Hoeveel {item.unit}?</span><input style={{ color: "#070a0d", background: "#ffffff", WebkitTextFillColor: "#070a0d", opacity: 1 }} type="number" min="0" step={item.unit.includes("meter") || item.unit === "meter" || item.unit === "m²" ? "0.1" : "1"} value={chosen.qty} onChange={event => setQty(item.id, Number(event.target.value))}/></label>
                  <button type="button" onClick={() => setQty(item.id, Number(chosen.qty) + (item.unit.includes("meter") || item.unit === "meter" || item.unit === "m²" ? 0.5 : 1))}>+</button>
                </div>}
              </article>;
            })}
          </div>
        </section>

        <section className="tap-section tap-selected-section">
          <div className="tap-section-head"><span>03</span><div><small>CONTROLE</small><h2>Dit staat nu op de bon</h2></div></div>
          {workLines.length === 0 && customLines.length === 0 ? <p className="tap-empty">Nog niets geselecteerd.</p> : <div className="tap-picked-list">
            {workLines.map(line => <div key={line.key}><span>{line.number ? `${line.number}. ` : ""}{line.description}<small>{line.qty} {line.unit} · {line.rateLabel}</small></span><strong>{euro(line.lineTotalEx)}</strong></div>)}
            {customLines.map(line => <div key={line.id}><span>{line.description || "Extra werkzaamheden"}<small>{line.qty} {line.unit} × {euro(line.priceEx)}</small></span><strong>{euro(line.qty * line.priceEx)}</strong></div>)}
            {difficultAmount > 0 && <div><span>Moeilijk bereikbaar<small>{difficultPct}% toeslag</small></span><strong>{euro(difficultAmount)}</strong></div>}
          </div>}
          <div className="tap-final-total">
            <p><span>Subtotaal excl. btw</span><strong>{euro(subtotal)}</strong></p>
            <p><span>BTW {vat}%</span><strong>{euro(vatAmount)}</strong></p>
            <p className="grand"><span>Totaal incl. btw</span><strong>{euro(total)}</strong></p>
          </div>
        </section>

        <section className="tap-section tap-details-section">
          <button className="tap-details-toggle" type="button" onClick={() => setShowDetails(value => !value)}>{showDetails ? "VERBERG KLANT / TIJD / PDF" : "KLANTGEGEVENS, TIJD OF PDF NODIG?"}<span>{showDetails ? "−" : "+"}</span></button>
          {showDetails && <div className="tap-details-body">
            <div className="internal-form-grid">
              <label><span>Klantnaam</span><input value={customer} onChange={event => setCustomer(event.target.value)} placeholder="Naam klant"/></label>
              <label><span>Volledig adres</span><input value={address} onChange={event => setAddress(event.target.value)} placeholder="Straat 1, 4811 AA Breda"/></label>
              <label><span>E-mail klant</span><input type="email" value={customerEmail} onChange={event => setCustomerEmail(event.target.value)} placeholder="klant@email.nl"/></label>
              <label><span>Datum</span><input type="date" value={workDate} onChange={event => setWorkDate(event.target.value)}/></label>
              <label><span>Titel</span><input value={jobTitle} onChange={event => setJobTitle(event.target.value)}/></label>
            </div>
            {address.trim() && <a className="internal-maps-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer">OPEN ADRES IN GOOGLE MAPS →</a>}

            <div className="tap-time-block">
              <div className="time-grid">
                <label><span>Uren</span><input type="number" min="0" step="1" value={hours} onChange={event => setHours(Number(event.target.value))}/></label>
                <label><span>Minuten</span><input type="number" min="0" max="59" step="5" value={minutes} onChange={event => setMinutes(Number(event.target.value))}/></label>
              </div>
              <div className="timer-control">
                <div><span className="internal-kicker">LIVE TIMER</span><strong>{timerStartedAt === null ? "NIET ACTIEF" : `${Math.floor(liveTimerMinutes / 60)}u ${Math.floor(liveTimerMinutes % 60)}m`}</strong></div>
                {timerStartedAt === null ? <button className="internal-btn ghost" type="button" onClick={startTimer}>START TIMER</button> : <button className="internal-btn" type="button" onClick={stopTimer}>STOP & OPSLAAN</button>}
              </div>
            </div>

            <button className="internal-add" type="button" onClick={addCustomLine}>+ EIGEN REGEL TOEVOEGEN</button>
            {customLines.map(line => <div className="custom-line" key={line.id}>
              <input className="custom-desc" value={line.description} onChange={event => setCustomLines(current => current.map(item => item.id === line.id ? { ...item, description: event.target.value } : item))} placeholder="Extra werkzaamheden"/>
              <input type="number" min="0" step="0.1" value={line.qty} onChange={event => setCustomLines(current => current.map(item => item.id === line.id ? { ...item, qty: Number(event.target.value) } : item))}/>
              <input value={line.unit} onChange={event => setCustomLines(current => current.map(item => item.id === line.id ? { ...item, unit: event.target.value } : item))}/>
              <input type="number" min="0" step="0.01" value={line.priceEx} onChange={event => setCustomLines(current => current.map(item => item.id === line.id ? { ...item, priceEx: Number(event.target.value) } : item))}/>
              <button type="button" onClick={() => setCustomLines(current => current.filter(item => item.id !== line.id))}>×</button>
            </div>)}
            <label className="internal-notes"><span>Opmerking</span><textarea rows={3} value={notes} onChange={event => setNotes(event.target.value)} placeholder="Bijzonderheden..."/></label>


            <section className="invoice-send-panel">
              <div className="invoice-send-head">
                <div><span className="internal-kicker">FACTUUR</span><h3>Factuur direct e-mailen</h3></div>
                <strong>{invoiceNumber || "—"}</strong>
              </div>
              <p className="invoice-help">De factuur vermeldt de werkelijk uitgevoerde werkzaamheden en één afgesproken totaal. Interne prijsopbouw en partnerafspraken worden niet als aparte klantregel getoond. Gebruik bij voorkeur één apparaat/browser voor de factuurnummerreeks.</p>

              <div className="invoice-settings-grid">
                <label><span>Factuurnummer</span><input value={invoiceNumber} onChange={event=>setInvoiceNumber(event.target.value)} placeholder="LRS-2026-0001"/></label>
                <label><span>Bedrijfsadres LRS</span><input value={invoiceSettings.businessAddress} onChange={event=>saveInvoiceSettings({...invoiceSettings,businessAddress:event.target.value})} placeholder="Straat + huisnummer, postcode Breda"/></label>
                <label><span>BTW-ID</span><input value={invoiceSettings.vatId} onChange={event=>saveInvoiceSettings({...invoiceSettings,vatId:event.target.value})} placeholder="NL123456789B01"/></label>
                <label><span>IBAN (optioneel)</span><input value={invoiceSettings.iban} onChange={event=>saveInvoiceSettings({...invoiceSettings,iban:event.target.value})} placeholder="NL00 BANK 0000 0000 00"/></label>
                <label><span>Betaaltermijn dagen</span><input type="number" min="0" value={invoiceSettings.paymentTermDays} onChange={event=>saveInvoiceSettings({...invoiceSettings,paymentTermDays:Number(event.target.value)})}/></label>
              </div>

              <button className="internal-btn invoice-send-button" type="button" onClick={sendInvoice} disabled={invoiceBusy || total <= 0}>
                {invoiceBusy ? "FACTUUR WORDT VERSTUURD..." : "FACTUUR VERSTUREN"}
              </button>
              {invoiceStatus && <p className="invoice-status">{invoiceStatus}</p>}
            </section>

            <div className="tap-detail-actions">
              <button className="internal-btn ghost" type="button" onClick={() => setShowBook(value => !value)}>PRIJSBOEK</button>
              <button className="internal-btn" type="button" disabled={unknownSelected.length > 0 || selected.length + customLines.length === 0} onClick={copyCustomerText}>{copied ? "GEKOPIEERD" : "KOPIEER KLANTBERICHT"}</button>
              <button className="internal-btn ghost" type="button" onClick={() => window.print()}>PRINT / PDF</button>
            </div>
          </div>}
        </section>
      </main>

      {showBook && <section className="pricebook-panel tap-pricebook no-print">
        <div className="pricebook-head"><div><span className="internal-kicker">ALLEEN INTERN</span><h2>Prijsboek</h2></div><button type="button" onClick={() => setShowBook(false)}>×</button></div>
        <label className="pricebook-search"><span>Zoeken</span><input value={bookSearch} onChange={event => setBookSearch(event.target.value)} placeholder="Nummer of werkzaamheden..."/></label>
        {!bookSearch && <div className="pricebook-tabs">{categories.map(category => <button type="button" key={category} className={category === activeCategory ? "active" : ""} onClick={() => setActiveCategory(category)}>{category}</button>)}</div>}
        <div className="pricebook-list">{filteredBookItems.map(item => <label key={item.id} className="pricebook-row"><div><strong>{item.number ? `${item.number}. ` : ""}{item.label}</strong><small>{item.id.startsWith("repair-") ? `Basis per ${item.unit} · extra ${euro(extraUnitRate(item, Number(book[item.id] ?? item.defaultPriceEx)))}/${item.unit} · meeneem ${euro(carryOnRate(item, Number(book[item.id] ?? item.defaultPriceEx)))}` : `per ${item.unit}`}</small></div><div className="price-ready"><span>€ excl.</span><input type="number" min="0" step="0.01" value={book[item.id] ?? 0} onChange={event => setBook(current => ({ ...current, [item.id]: Number(event.target.value) }))}/></div></label>)}</div>
        <div className="pricebook-savebar"><button className="internal-btn ghost" type="button" onClick={resetOfficialPrices}>HERSTEL STANDAARDPRIJZEN</button><button className="internal-btn" type="button" onClick={saveBook}>OPSLAAN</button></div>
      </section>}

      <section className="internal-print-document">
        <header><div><strong>LRS DAKTECHNIEK</strong><span>Breda & omgeving</span></div><div><span>{site.phoneDisplay}</span><span>{site.email}</span><span>KVK {site.kvk}</span></div></header>
        <div className="print-title"><small>WERKBON / PRIJSOVERZICHT</small><h1>{jobTitle}</h1></div>
        <dl className="print-customer"><div><dt>Klant</dt><dd>{customer || "—"}</dd></div><div><dt>Adres</dt><dd>{address || "—"}</dd></div><div><dt>Datum</dt><dd>{new Date(`${workDate}T12:00:00`).toLocaleDateString("nl-NL")}</dd></div><div><dt>Tijd op locatie</dt><dd>{durationHours > 0 ? `${Math.floor(durationHours)} uur ${Math.round((durationHours % 1) * 60)} min` : "—"}</dd></div></dl>
        <table><thead><tr><th>Uitgevoerde werkzaamheden</th><th>Aantal</th><th>Eenheid</th></tr></thead><tbody>
          {workLines.filter(line => line.key.startsWith("repair-")).map(line => <tr key={line.key}><td>{line.number ? `${line.number}. ` : ""}{line.description}</td><td>{line.qty}</td><td>{line.unit}</td></tr>)}
          {customLines.map(line => <tr key={line.id}><td>{line.description || "Extra werkzaamheden"}</td><td>{line.qty}</td><td>{line.unit}</td></tr>)}
          {travelSelected && <tr><td>Voorrij- en startkosten verwerkt in totaal</td><td>1</td><td>opdracht</td></tr>}
          {difficultAmount > 0 && <tr><td>Moeilijke bereikbaarheid verwerkt in totaal</td><td>1</td><td>opdracht</td></tr>}
        </tbody></table>
        <div className="print-totals"><p><span>Subtotaal excl. btw</span><strong>{euro(subtotal)}</strong></p><p><span>BTW {vat}%</span><strong>{euro(vatAmount)}</strong></p><p><span>Totaal incl. btw</span><strong>{euro(total)}</strong></p></div>
        {notes && <div className="print-notes"><strong>Opmerking</strong><p>{notes}</p></div>}
      </section>
    </div>
  );

}
