/**
 * Two independently billed legal issuers. Defaults from the LRS code and
 * an Allround LEM example invoice supplied by the owner.
 *
 * IMPORTANT: Allround's registered seller address and sender email were
 * not present in the example. Do not silently substitute the LRS address
 * or sender email. Ask for the seller address before invoicing and use a
 * distinct verified email source for actual automated delivery.
 */
export type InvoiceIssuerId = "lrs" | "allround-lem";

export type IssuerSettings = {
  businessAddress: string;
  vatId: string;
  iban: string;
  paymentTermDays: number;
  contactEmail: string;
  phone: string;
};

export const INVOICE_ISSUERS = {
  lrs: {
    id: "lrs",
    name: "LRS Daktechniek",
    kvk: "83217495",
    vatId: "NL003787454B48",
    iban: "NL69 INGB 0112 7815 51",
    defaultAddress: "Pietersberg 21, 4822 TS Breda",
    contactEmail: "info@lrsdaktechniek.nl",
    phone: "06 15283626",
    invoicePrefix: "LRS",
    sequenceKey: "lrs-invoice-sequence-v1",
    usedPrefix: "lrs-invoice-issued-v1:",
    settingsKey: "lrs-invoice-settings-v1",
  },
  "allround-lem": {
    id: "allround-lem",
    name: "Allround LEM",
    kvk: "81296061",
    vatId: "NL003557596B51",
    iban: "NL46 INGB 0109 0156 49",
    defaultAddress: "",
    contactEmail: "",
    phone: "",
    invoicePrefix: "LEM",
    sequenceKey: "allround-lem-invoice-sequence-v1",
    usedPrefix: "allround-lem-invoice-issued-v1:",
    settingsKey: "allround-lem-invoice-settings-v1",
  },
} as const;

export const INVOICE_ISSUER_IDS: readonly InvoiceIssuerId[] = ["lrs", "allround-lem"];
export function parseIssuer(value: unknown): InvoiceIssuerId | null {
  if (value === undefined || value === null || value === "") return "lrs";
  if (value === "lrs" || value === "allround-lem") return value;
  return null;
}
export function issuerDefaults(issuer: InvoiceIssuerId): IssuerSettings {
  const info = INVOICE_ISSUERS[issuer];
  return {
    businessAddress: info.defaultAddress,
    vatId: info.vatId,
    iban: info.iban,
    paymentTermDays: 14,
    contactEmail: info.contactEmail,
    phone: info.phone,
  };
}
export function normalizeIssuerSettings(
  issuer: InvoiceIssuerId,
  saved?: Partial<IssuerSettings> | null
): IssuerSettings {
  const base = issuerDefaults(issuer);
  return {
    businessAddress: typeof saved?.businessAddress === "string" && saved.businessAddress.trim()
      ? saved.businessAddress : base.businessAddress,
    // Legal identity and banking always follow the selected company; the old
    // repair tool allowed selecting the Allround account on an LRS invoice.
    vatId: base.vatId,
    iban: base.iban,
    paymentTermDays: Number.isFinite(saved?.paymentTermDays) && (saved?.paymentTermDays ?? -1) >= 0
      ? Math.min(365, Math.floor(saved!.paymentTermDays!)) : 14,
    contactEmail: typeof saved?.contactEmail === "string" ? saved.contactEmail : base.contactEmail,
    phone: typeof saved?.phone === "string" ? saved.phone : base.phone,
  };
}
export function formatInvoiceNumber(issuer: InvoiceIssuerId, seq: number, year: number): string {
  const safeSeq = Number.isFinite(seq) && seq >= 1 ? Math.floor(seq) : 1;
  const safeYear = Number.isInteger(year) && year >= 2020 && year <= 2100 ? year : new Date().getFullYear();
  return INVOICE_ISSUERS[issuer].invoicePrefix + "-" + safeYear + "-" + String(safeSeq).padStart(4, "0");
}
export function pendingInvoiceNumber(issuer: InvoiceIssuerId, storage: Pick<Storage, "getItem">): string {
  const key = INVOICE_ISSUERS[issuer].sequenceKey;
  const seq = Math.max(1, Number(storage.getItem(key)) || 1);
  return formatInvoiceNumber(issuer, seq, new Date().getFullYear());
}
export function registerInvoiceUsed(issuer: InvoiceIssuerId, number: string, storage: Pick<Storage, "getItem" | "setItem">) {
  const info = INVOICE_ISSUERS[issuer];
  const usedKey = info.usedPrefix + number;
  if (storage.getItem(usedKey)) return;
  storage.setItem(usedKey, new Date().toISOString());
  const seq = Math.max(1, Number(storage.getItem(info.sequenceKey)) || 1);
  if (number === formatInvoiceNumber(issuer, seq, new Date().getFullYear())) {
    storage.setItem(info.sequenceKey, String(seq + 1));
  }
}
export function validateIssuerBusiness(
  issuer: InvoiceIssuerId,
  business: {name?:string; kvk?:string; vatId?:string; iban?:string}
): boolean {
  const info = INVOICE_ISSUERS[issuer];
  const compact = (s: string | undefined) => (s ?? "").replace(/\s+/g, "").toUpperCase();
  return business.name === info.name && compact(business.kvk) === compact(info.kvk)
    && compact(business.vatId) === compact(info.vatId)
    && compact(business.iban) === compact(info.iban);
}
