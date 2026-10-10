import { timingSafeEqual } from "node:crypto";
import { site } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Line = { description: string; qty: number; unit: string; amountEx: number };
type Quote = {
  number: string;
  issueDate: string;
  validDays: number;
  title: string;
  customer: { name: string; address: string; email: string; phone: string };
  businessAddress: string;
  vatId: string;
  lines: Line[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  notes: string;
};
const clean = (x: unknown, limit = 300) => String(x ?? "").trim().slice(0, limit);
const esc = (x: unknown) => clean(x, 6000)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");
const euro = (n: number) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);
const round = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
const emailOkay = (x: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x);
const dateOkay = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && Number.isFinite(Date.parse(s + "T12:00:00Z"));

function safeEqual(input: string, secret: string) {
  const a = Buffer.from(input);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}
function dateNl(s: string) {
  return new Date(s + "T12:00:00Z").toLocaleDateString("nl-NL", { timeZone: "UTC" });
}
function moneyValid(x: unknown) {
  return typeof x === "number" && Number.isFinite(x) && x >= 0 && x <= 100000000;
}
function renderQuote(quote: Quote) {
  const validUntil = new Date(quote.issueDate + "T12:00:00Z");
  validUntil.setUTCDate(validUntil.getUTCDate() + quote.validDays);
  const until = validUntil.toLocaleDateString("nl-NL", {timeZone:"UTC"});
  const rows = quote.lines.map(line =>
    '<tr><td style="padding:12px 8px;border-bottom:1px solid #dbe1e4">' +
      esc(line.description) + '</td>' +
    '<td style="padding:12px 8px;text-align:right;border-bottom:1px solid #dbe1e4">' +
      esc(line.qty) + ' ' + esc(line.unit) + '</td>' +
    '<td style="padding:12px 8px;text-align:right;border-bottom:1px solid #dbe1e4">' +
      euro(line.amountEx) + '</td></tr>'
  ).join("");
  return '<!doctype html><html lang="nl"><body style="margin:0;background:#eff2f4;color:#0b141a;font:15px Arial,Helvetica,sans-serif">' +
    '<div style="max-width:760px;margin:auto;padding:24px 12px">' +
      '<div style="background:#08151c;color:#fff;padding:26px">' +
        '<div style="letter-spacing:2px;font-size:12px">LRS DAKTECHNIEK</div>' +
        '<h1 style="margin:12px 0 2px">Offerte ' + esc(quote.number) + '</h1>' +
        '<div>' + esc(quote.title) + '</div></div>' +
      '<div style="background:#fff;padding:26px">' +
        '<p>Beste ' + esc(quote.customer.name) + ',</p>' +
        '<p>Hierbij ontvangt u onze offerte voor de dakwerkzaamheden op ' + esc(quote.customer.address) + '.</p>' +
        '<p><strong>Offertedatum:</strong> ' + dateNl(quote.issueDate) + '<br>' +
        '<strong>Geldig tot en met:</strong> ' + until + '<br>' +
        '<strong>Van:</strong> ' + esc(site.name) + ' · ' + esc(quote.businessAddress) + '<br>' +
        '<strong>KvK:</strong> ' + esc(site.kvk) + ' · <strong>Btw-ID:</strong> ' + esc(quote.vatId) + '</p>' +
        '<table style="width:100%;border-collapse:collapse;margin-top:28px">' +
          '<thead><tr><th style="text-align:left;padding:10px 8px;border-bottom:2px solid #08151c">Omschrijving</th>' +
          '<th style="text-align:right;padding:10px 8px;border-bottom:2px solid #08151c">Aantal</th>' +
          '<th style="text-align:right;padding:10px 8px;border-bottom:2px solid #08151c">Bedrag excl. btw</th></tr></thead>' +
          '<tbody>' + rows + '</tbody></table>' +
        '<div style="max-width:340px;margin:22px 0 28px auto">' +
          '<p style="display:flex;justify-content:space-between"><span>Excl. btw</span><b>' + euro(quote.subtotal) + '</b></p>' +
          '<p style="display:flex;justify-content:space-between"><span>Btw ' + quote.vatRate + '%</span><b>' + euro(quote.vatAmount) + '</b></p>' +
          '<p style="display:flex;justify-content:space-between;border-top:2px solid #08151c;padding-top:12px;font-size:19px"><b>Totaal incl. btw</b><b>' + euro(quote.total) + '</b></p>' +
        '</div>' +
        (quote.notes ? '<p><strong>Toelichting:</strong><br>' + esc(quote.notes).replaceAll("\n", "<br>") + '</p>' : '') +
        '<p>Wilt u akkoord geven? Antwoord dan op deze e-mail. Na uw bevestiging plannen we de werkzaamheden in overleg.</p>' +
        '<p>Met vriendelijke groet,<br><strong>LRS Daktechniek</strong><br>' + esc(site.phoneDisplay) + '<br>' + esc(site.email) + '</p>' +
      '</div></div></body></html>';
}

export async function POST(request: Request) {
  const secret = process.env.OFFERTE_SECRET;
  if (!secret) return Response.json({error:"OFFERTE_SECRET ontbreekt."}, {status:500});
  if (Number(request.headers.get("content-length") || 0) > 75000) {
    return Response.json({error:"Aanvraag te groot."}, {status:413});
  }
  let payload: {accessToken?:unknown; quote?:unknown};
  try { payload = await request.json(); }
  catch { return Response.json({error:"Ongeldige aanvraag."},{status:400}); }
  if (typeof payload?.accessToken !== "string" || !safeEqual(payload.accessToken, secret)) {
    return Response.json({error:"Geen toegang."},{status:403});
  }
  if (!payload.quote || typeof payload.quote !== "object" || Array.isArray(payload.quote)) {
    return Response.json({error:"Offerte ontbreekt."},{status:400});
  }
  const raw = payload.quote as Record<string,unknown>;
  const customer = (raw.customer && typeof raw.customer === "object") ? raw.customer as Record<string,unknown> : {};
  const linesRaw = Array.isArray(raw.lines) ? raw.lines : [];
  const quote: Quote = {
    number:clean(raw.number,50), issueDate:clean(raw.issueDate,10),
    validDays:Number(raw.validDays), title:clean(raw.title,160),
    customer: {
      name:clean(customer.name,180), address:clean(customer.address,300),
      email:clean(customer.email,300), phone:clean(customer.phone,60),
    },
    businessAddress:clean(raw.businessAddress,300),
    vatId:clean(raw.vatId,80),
    lines:linesRaw.slice(0,50).map((line:Record<string,unknown>)=>({
      description:clean(line?.description,180),
      unit:clean(line?.unit,40),
      qty:Number(line?.qty),
      amountEx:Number(line?.amountEx),
    })),
    subtotal:Number(raw.subtotal), vatRate:Number(raw.vatRate),
    vatAmount:Number(raw.vatAmount), total:Number(raw.total),
    notes:clean(raw.notes,1600),
  };
  if (!quote.number || !quote.title || !dateOkay(quote.issueDate) ||
      !Number.isInteger(quote.validDays) || quote.validDays < 1 || quote.validDays > 90 ||
      !quote.customer.name || !quote.customer.address || !emailOkay(quote.customer.email) ||
      !quote.businessAddress || !quote.vatId) {
    return Response.json({error:"Vul offertedatum, klantgegevens en bedrijfsgegevens correct in."},{status:400});
  }
  if (linesRaw.length<1 || linesRaw.length>50 || ![0,9,21].includes(quote.vatRate) ||
      quote.lines.some(l=>!l.description || !l.unit || !Number.isFinite(l.qty) ||
        l.qty<=0 || l.qty>100000 || !moneyValid(l.amountEx) || l.amountEx===0)) {
    return Response.json({error:"Werkregels of btw-tarief zijn ongeldig."},{status:400});
  }
  if (![quote.subtotal,quote.vatAmount,quote.total].every(moneyValid) ||
    Math.abs(round(quote.lines.reduce((s,l)=>s+l.amountEx,0))-quote.subtotal)>0.01 ||
    Math.abs(round(quote.subtotal*quote.vatRate/100)-quote.vatAmount)>0.01 ||
    Math.abs(round(quote.subtotal+quote.vatAmount)-quote.total)>0.01) {
    return Response.json({error:"Offertebedragen sluiten niet aan."},{status:400});
  }

  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.OFFERTE_FROM_EMAIL || process.env.FACTUUR_FROM_EMAIL;
  if (!resendKey || !from) {
    return Response.json({error:"Stel RESEND_API_KEY en OFFERTE_FROM_EMAIL (of FACTUUR_FROM_EMAIL) in op Vercel."},{status:503});
  }
  try {
    const response = await fetch("https://api.resend.com/emails",{
      method:"POST",
      headers:{Authorization:"Bearer "+resendKey,"Content-Type":"application/json"},
      body:JSON.stringify({
        from,to:[quote.customer.email],
        reply_to:process.env.FACTUUR_REPLY_TO || site.email,
        subject:"Offerte "+quote.number+" · LRS Daktechniek",
        html:renderQuote(quote),
      }),
    });
    const result = await response.json().catch(()=>({}));
    if (!response.ok) {
      const message=(result && typeof result.message==="string") ? result.message : "E-mailprovider heeft de offerte geweigerd.";
      return Response.json({error:message},{status:502});
    }
    return Response.json({ok:true,number:quote.number,emailId:result.id ?? null});
  } catch {
    return Response.json({error:"Verzenden niet gelukt; controleer de e-mailkoppeling."},{status:502});
  }
}
