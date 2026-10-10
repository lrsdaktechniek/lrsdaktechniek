"use client";

import {
  INVOICE_BANK_ACCOUNTS,
  INVOICE_ISSUERS,
  type InvoiceIssuerId,
} from "@/lib/invoiceIssuer";

export function InvoiceBankPicker({
  issuer,
  value,
  onChange,
  disabled = false,
  compact = false,
}:{
  issuer: InvoiceIssuerId;
  value: string;
  onChange: (iban: string) => void;
  disabled?: boolean;
  compact?: boolean;
}) {
  const accounts=INVOICE_BANK_ACCOUNTS[issuer];
  const isLrs=issuer==="lrs";
  return <fieldset className={"invoice-bank-switch"+(compact?" compact":"")} disabled={disabled}>
    <legend>{compact ? "LRS · KIES BANKREKENING" : isLrs ? "KIES BANKREKENING VOOR DEZE LRS-FACTUUR" : "Bankrekening Allround LEM"}</legend>
    {isLrs && !compact && <p>Kies rekening 1 of 2. De rekening die je aanklikt verschijnt automatisch op de factuur, PDF en in de e-mail.</p>}
    <div className="invoice-bank-switch-options">
      {accounts.map(bank=>{
        const active=bank.iban===value;
        return <button
          type="button"
          key={bank.id}
          disabled={disabled}
          aria-pressed={active}
          className={"invoice-bank-switch-button"+(active?" selected":"")}
          onClick={()=>onChange(bank.iban)}
        >
          <span className="invoice-bank-switch-mark" aria-hidden="true">{active?"✓":"○"}</span>
          <span><strong>{bank.label}</strong><small>{bank.iban}</small></span>
        </button>;
      })}
    </div>
    {!compact && (isLrs ? (
      <small className="invoice-bank-switch-note">Let op: rekening 2 staat ook op het aangeleverde Allround LEM-voorbeeld. Controleer of deze rekening juridisch gebruikt mag worden voor een LRS-factuur.</small>
    ) : (
      <small className="invoice-bank-switch-note">De betaalrekening van Allround LEM blijft vast. Wissel bovenaan van bedrijf voor een LRS-factuur.</small>
    ))}
    {!compact && <strong className="invoice-bank-switch-current">Gekozen betaalrekening: {value || INVOICE_ISSUERS[issuer].iban}</strong>}
  </fieldset>;
}
