"use client";

import { INVOICE_ISSUER_IDS, INVOICE_ISSUERS, type InvoiceIssuerId } from "@/lib/invoiceIssuer";

export function InvoiceIssuerPicker({
  value, onChange, disabled = false, compact = false,
}: {
  value: InvoiceIssuerId;
  onChange: (issuer: InvoiceIssuerId) => void;
  disabled?: boolean;
  compact?: boolean;
}) {
  return <section className={"invoice-issuer-picker"+(compact?" compact":"")} aria-label="Kies het bedrijf op de offerte of factuur">
    <div className="issuer-picker-heading">
      <strong>{compact ? "FACTUUR / OFFERTE VAN" : "Factuur versturen namens"}</strong>
      {!compact && <span>Kies het juiste bedrijf — btw, KvK en bankrekening wisselen automatisch.</span>}
    </div>
    <div className="issuer-picker-options">
      {INVOICE_ISSUER_IDS.map(id => {
        const company = INVOICE_ISSUERS[id];
        const selected = value === id;
        return <button
          key={id}
          type="button"
          className={"issuer-picker-option "+(selected?"is-selected ":"")+(id==="allround-lem"?"is-lem":"is-lrs")}
          disabled={disabled}
          aria-pressed={selected}
          onClick={() => onChange(id)}
        >
          <span className="issuer-radio" aria-hidden="true">{selected ? "✓" : ""}</span>
          <span className="issuer-picker-content">
            <strong>{company.name}</strong>
            {!compact && <small>KvK {company.kvk} · IBAN {company.iban}</small>}
          </span>
        </button>;
      })}
    </div>
    {!compact && value === "allround-lem" && <p className="issuer-picker-note">
      Gegevens uit je voorbeeldfactuur: controleer het KvK-/btw-nummer en vul het adres van Allround LEM eenmalig in.
    </p>}
  </section>;
}
