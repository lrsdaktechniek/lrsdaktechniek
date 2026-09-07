export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RepairRequestPayload = {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  repairId?: string;
  repair?: string;
  qty?: number;
  unit?: string;
  access?: "normaal" | "moeilijk";
  lowIncl?: number;
  highIncl?: number;
  note?: string;
  website?: string;
};

function esc(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clean(value: unknown, max = 250) {
  return String(value ?? "").trim().slice(0, max);
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

function money(value: unknown) {
  const n = Number(value) || 0;
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(n);
}

export async function POST(request: Request) {
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.AANVRAAG_FROM_EMAIL || process.env.FACTUUR_FROM_EMAIL;
  const to = "info@lrsdaktechniek.nl";

  if (!resendKey || !from) {
    return Response.json(
      { error: "De e-mailkoppeling is nog niet volledig ingesteld." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  const origin = request.headers.get("origin");
  if (origin) {
    const requestOrigin = new URL(request.url).origin;
    if (origin !== requestOrigin) {
      return Response.json(
        { error: "Ongeldige herkomst van de aanvraag." },
        { status: 403, headers: { "Cache-Control": "no-store" } },
      );
    }
  }

  let body: RepairRequestPayload;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Ongeldige aanvraag." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  // Simpele honeypot tegen automatische formulierbots.
  // We geven bewust een succesantwoord zodat bots geen feedback krijgen.
  if (clean(body.website, 200)) {
    return Response.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const name = clean(body.name, 100);
  const phone = clean(body.phone, 40);
  const email = clean(body.email, 160).toLowerCase();
  const address = clean(body.address, 220);
  const repair = clean(body.repair, 180);
  const repairId = clean(body.repairId, 80);
  const unit = clean(body.unit, 40);
  const note = clean(body.note, 1200);
  const qty = Math.max(1, Math.min(10000, Number(body.qty) || 1));
  const access = body.access === "moeilijk" ? "moeilijk" : "normaal";
  const lowIncl = Number(body.lowIncl);
  const highIncl = Number(body.highIncl);

  if (!name || !phone || !email || !address || !repair) {
    return Response.json(
      { error: "Naam, telefoon, e-mail, volledig adres en reparatie zijn verplicht." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (!isEmail(email)) {
    return Response.json(
      { error: "Vul een geldig e-mailadres in." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (!isPhone(phone)) {
    return Response.json(
      { error: "Vul een geldig telefoonnummer in." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (!Number.isFinite(lowIncl) || !Number.isFinite(highIncl) || lowIncl <= 0 || highIncl < lowIncl) {
    return Response.json(
      { error: "De berekende reparatie-indicatie is ongeldig." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const receivedAt = new Date().toLocaleString("nl-NL", {
    timeZone: "Europe/Amsterdam",
    dateStyle: "full",
    timeStyle: "short",
  });

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const subjectPlace = address.split(",").slice(-1)[0]?.trim() || address;
  const subject = `Nieuwe reparatieaanvraag · ${repair} · ${subjectPlace}`.slice(0, 180);

  const html = `<!doctype html>
<html lang="nl">
<body style="margin:0;background:#eef3f5;font-family:Arial,Helvetica,sans-serif;color:#070a0d">
  <div style="max-width:760px;margin:0 auto;padding:28px 16px">
    <div style="background:#070a0d;color:#fff;padding:28px">
      <div style="font-size:12px;letter-spacing:2px;color:#b6a27b">LRS DAKTECHNIEK · WEBSITE</div>
      <h1 style="margin:10px 0 0;font-size:30px">Nieuwe reparatieaanvraag</h1>
    </div>

    <div style="background:#fff;padding:28px">
      <div style="padding:18px;background:#eef3f5;border-left:4px solid #294b5e;margin-bottom:26px">
        <div style="font-size:12px;letter-spacing:1px;color:#526b7a">ONLINE RICHTPRIJS INCL. BTW</div>
        <div style="font-size:28px;font-weight:700;margin-top:5px">${esc(money(lowIncl))} – ${esc(money(highIncl))}</div>
      </div>

      <h2 style="font-size:20px;margin:0 0 12px">Klantgegevens</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:28px">
        <tr><td style="padding:8px 0;width:175px;color:#60707a">Naam</td><td style="padding:8px 0"><strong>${esc(name)}</strong></td></tr>
        <tr><td style="padding:8px 0;color:#60707a">Telefoon</td><td style="padding:8px 0"><a href="tel:${esc(phone)}" style="color:#070a0d">${esc(phone)}</a></td></tr>
        <tr><td style="padding:8px 0;color:#60707a">E-mail</td><td style="padding:8px 0"><a href="mailto:${esc(email)}" style="color:#070a0d">${esc(email)}</a></td></tr>
        <tr><td style="padding:8px 0;color:#60707a">Adres</td><td style="padding:8px 0"><strong>${esc(address)}</strong><br><a href="${esc(mapsUrl)}" style="font-size:13px;color:#294b5e">Open in Google Maps</a></td></tr>
      </table>

      <h2 style="font-size:20px;margin:0 0 12px">Reparatie</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:28px">
        <tr><td style="padding:8px 0;width:175px;color:#60707a">Werk</td><td style="padding:8px 0"><strong>${esc(repair)}</strong></td></tr>
        <tr><td style="padding:8px 0;color:#60707a">Hoeveelheid</td><td style="padding:8px 0">${esc(qty)} ${esc(unit)}</td></tr>
        <tr><td style="padding:8px 0;color:#60707a">Bereikbaarheid</td><td style="padding:8px 0">${access === "moeilijk" ? "Moeilijk bereikbaar" : "Normaal bereikbaar"}</td></tr>
        <tr><td style="padding:8px 0;color:#60707a">Indicatie</td><td style="padding:8px 0"><strong>${esc(money(lowIncl))} – ${esc(money(highIncl))} incl. 21% btw</strong></td></tr>
        ${repairId ? `<tr><td style="padding:8px 0;color:#60707a">Code</td><td style="padding:8px 0">${esc(repairId)}</td></tr>` : ""}
      </table>

      ${note ? `<h2 style="font-size:20px;margin:0 0 10px">Opmerking klant</h2><div style="padding:16px;background:#f7f8f8;white-space:pre-wrap;margin-bottom:28px">${esc(note)}</div>` : ""}

      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:24px">
        <a href="tel:${esc(phone)}" style="display:inline-block;padding:13px 18px;background:#070a0d;color:#fff;text-decoration:none;font-weight:700">BEL KLANT</a>
        <a href="mailto:${esc(email)}" style="display:inline-block;padding:13px 18px;border:1px solid #070a0d;color:#070a0d;text-decoration:none;font-weight:700">MAIL KLANT</a>
      </div>

      <p style="margin-top:30px;color:#60707a;font-size:13px">Ontvangen via lrsdaktechniek.nl op ${esc(receivedAt)}.</p>
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
      to: [to],
      reply_to: email,
      subject,
      html,
    }),
  });

  const result = await resendResponse.json().catch(() => ({}));
  if (!resendResponse.ok) {
    return Response.json(
      { error: result?.message || "De e-mailprovider heeft de aanvraag geweigerd." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }

  return Response.json(
    { ok: true, emailId: result?.id ?? null },
    { headers: { "Cache-Control": "no-store" } },
  );
}
