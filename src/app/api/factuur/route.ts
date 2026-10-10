import { timingSafeEqual } from "node:crypto";
import { INVOICE_ISSUERS, parseIssuer, validateIssuerBusiness, type InvoiceIssuerId } from "@/lib/invoiceIssuer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type InvoiceLine = {
  description: string;
  qty: number;
  unit: string;
  amountEx: number;
};

type InvoicePayload = {
  accessToken?: string;
  issuer?: InvoiceIssuerId;
  customer?: { name?: string; address?: string; email?: string };
  business?: { name?: string; address?: string; email?: string; phone?: string; kvk?: string; vatId?: string; iban?: string };
  invoice?: { number?: string; issueDate?: string; serviceDate?: string; title?: string; paymentTermDays?: number; notes?: string };
  lines?: InvoiceLine[];
  subtotal?: number;
  vatRate?: number;
  vatAmount?: number;
  total?: number;
};

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

function esc(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function euro(value: unknown) {
  const n = Number(value) || 0;
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const secret = process.env.OFFERTE_SECRET;
  if (!secret) return Response.json({ error: "OFFERTE_SECRET ontbreekt in Vercel." }, { status: 500 });
  if (Number(request.headers.get("content-length") || 0) > 100000) {
    return Response.json({ error: "Factuuraanvraag te groot." }, { status: 413 });
  }

  let body: InvoicePayload;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  if (!body.accessToken || !safeEqual(body.accessToken, secret)) {
    return Response.json({ error: "Geen toegang." }, { status: 403 });
  }

  const issuer = parseIssuer(body.issuer);
  if (!issuer) return Response.json({ error: "Onbekend factuurbedrijf." }, { status: 400 });
  const company = INVOICE_ISSUERS[issuer];
  const customer = body.customer ?? {};
  const business = body.business ?? {};
  const invoice = body.invoice ?? {};
  const lines = Array.isArray(body.lines) ? body.lines : [];

  const customerEmail = String(customer.email ?? "").trim();
  if (!customer.name || !customer.address || !isEmail(customerEmail)) {
    return Response.json({ error: "Klantnaam, volledig adres en geldig e-mailadres zijn verplicht." }, { status: 400 });
  }
  if (!business.address?.trim() || !validateIssuerBusiness(issuer, business)) {
    return Response.json({ error: "Factuurbedrijf, KvK, btw-ID of IBAN komen niet overeen met de gekozen afzender. Vul ook het volledige bedrijfsadres in." }, { status: 400 });
  }
  if (!invoice.number || !invoice.issueDate || !invoice.serviceDate) {
    return Response.json({ error: "Factuurnummer, factuurdatum en leverdatum zijn verplicht." }, { status: 400 });
  }
  if (lines.length === 0 || lines.length > 50 || Number(body.total) <= 0) {
    return Response.json({ error: "De factuur bevat geen geldige werkzaamheden of bedrag." }, { status: 400 });
  }
  const money = (value: unknown) => typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100000000;
  const round = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
  if (!lines.every(line => !!line && !!line.description?.trim() && !!line.unit?.trim() &&
      Number.isFinite(line.qty) && line.qty > 0 && money(line.amountEx) && line.amountEx > 0) ||
      ![0,9,21].includes(Number(body.vatRate)) ||
      !money(body.subtotal) || !money(body.vatAmount) || !money(body.total) ||
      Math.abs(round(lines.reduce((sum, line) => sum + line.amountEx, 0)) - Number(body.subtotal)) > 0.01 ||
      Math.abs(round(Number(body.subtotal) * Number(body.vatRate) / 100) - Number(body.vatAmount)) > 0.01 ||
      Math.abs(round(Number(body.subtotal) + Number(body.vatAmount)) - Number(body.total)) > 0.01) {
    return Response.json({ error: "Factuurregels, btw of totaalbedragen komen niet overeen." }, { status: 400 });
  }
  const resendKey = process.env.RESEND_API_KEY;
  const preferredSender = issuer === "allround-lem" ? process.env.ALLROUND_LEM_FROM_EMAIL : process.env.FACTUUR_FROM_EMAIL;
  if (!resendKey || !preferredSender) {
    return Response.json({
      error: issuer === "allround-lem"
        ? "Allround LEM is nog niet gekoppeld aan een geverifieerde e-mailafzender. Stel ALLROUND_LEM_FROM_EMAIL en RESEND_API_KEY in op Vercel."
        : "E-mail is nog niet ingesteld. Stel FACTUUR_FROM_EMAIL en RESEND_API_KEY in op Vercel."
    }, { status: 503 });
  }
  const from = issuer === "allround-lem" && !preferredSender.includes("<")
    ? company.name + " <" + preferredSender + ">" : preferredSender;
  const replyTo = issuer === "allround-lem"
    ? (process.env.ALLROUND_LEM_REPLY_TO || (isEmail(String(business.email ?? "")) ? business.email : undefined))
    : (process.env.FACTUUR_REPLY_TO || "info@lrsdaktechniek.nl");

  const rows = lines.map((line) => `
    <tr>
      <td style="padding:10px 8px;border-bottom:1px solid #dfe5e8">${esc(line.description)}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #dfe5e8;text-align:right">${esc(line.qty)} ${esc(line.unit)}</td>
    </tr>
  `).join("");

  const due = new Date(`${invoice.issueDate}T12:00:00`);
  due.setDate(due.getDate() + Math.max(0, Number(invoice.paymentTermDays) || 0));
  const dueText = due.toLocaleDateString("nl-NL");

  const html = `<!doctype html>
<html lang="nl">
<body style="margin:0;background:#eef3f5;font-family:Arial,Helvetica,sans-serif;color:#070a0d">
  <div style="max-width:760px;margin:0 auto;padding:28px 16px">
    <div style="background:${issuer === "allround-lem" ? "#efb735" : "#070a0d"};color:${issuer === "allround-lem" ? "#111" : "#fff"};padding:28px">
      <div style="font-size:12px;letter-spacing:2px">${esc(company.name.toUpperCase())}</div>
      <h1 style="margin:10px 0 0;font-size:32px">Factuur ${esc(invoice.number)}</h1>
    </div>
    <div style="background:#fff;padding:28px">
      <table style="width:100%;border-collapse:collapse;margin-bottom:28px">
        <tr>
          <td style="vertical-align:top;width:50%;padding-right:18px">
            <strong>Van</strong><br>
            ${esc(business.name)}<br>
            ${esc(business.address)}<br>
            KVK ${esc(business.kvk)}<br>
            BTW-ID ${esc(business.vatId)}<br>
            ${esc(business.phone)}<br>
            ${esc(business.email)}
          </td>
          <td style="vertical-align:top;width:50%">
            <strong>Aan</strong><br>
            ${esc(customer.name)}<br>
            ${esc(customer.address)}<br>
            ${esc(customerEmail)}
          </td>
        </tr>
      </table>

      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <tr><td><strong>Factuurdatum</strong></td><td>${esc(new Date(`${invoice.issueDate}T12:00:00`).toLocaleDateString("nl-NL"))}</td></tr>
        <tr><td><strong>Datum werkzaamheden</strong></td><td>${esc(new Date(`${invoice.serviceDate}T12:00:00`).toLocaleDateString("nl-NL"))}</td></tr>
        <tr><td><strong>Betaaltermijn</strong></td><td>${esc(dueText)}</td></tr>
      </table>

      <h2 style="font-size:20px">${esc(invoice.title || "Dakwerkzaamheden")}</h2>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr>
            <th style="padding:10px 8px;text-align:left;border-bottom:2px solid #070a0d">Werkzaamheden</th>
            <th style="padding:10px 8px;text-align:right;border-bottom:2px solid #070a0d">Aantal / meters</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <div style="margin:28px 0 0 auto;max-width:340px">
        <div style="display:flex;justify-content:space-between;padding:6px 0"><span>Subtotaal excl. btw</span><strong>${esc(euro(body.subtotal))}</strong></div>
        <div style="display:flex;justify-content:space-between;padding:6px 0"><span>BTW ${esc(body.vatRate)}%</span><strong>${esc(euro(body.vatAmount))}</strong></div>
        <div style="display:flex;justify-content:space-between;padding:12px 0;border-top:2px solid #070a0d;font-size:20px"><span>Totaal incl. btw</span><strong>${esc(euro(body.total))}</strong></div>
      </div>

      ${business.iban ? `<p style="margin-top:28px"><strong>Betaling:</strong> ${esc(business.iban)} o.v.v. ${esc(invoice.number)}</p>` : ""}
      ${invoice.notes ? `<p style="margin-top:20px"><strong>Opmerking:</strong><br>${esc(invoice.notes).replaceAll("\n","<br>")}</p>` : ""}
      <p style="margin-top:32px;color:#60707a;font-size:13px">${esc(company.name)}</p>
    </div>
  </div>
</body>
</html>`;

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [customerEmail],
      reply_to: replyTo,
      subject: `Factuur ${invoice.number} · ${company.name}`,
      html,
    }),
  });

  const result = await resendResponse.json().catch(() => ({}));
  if (!resendResponse.ok) {
    return Response.json({ error: result?.message || "E-mailprovider heeft de factuur geweigerd." }, { status: 502 });
  }

  return Response.json({ ok: true, invoiceNumber: invoice.number, emailId: result?.id ?? null });
}
