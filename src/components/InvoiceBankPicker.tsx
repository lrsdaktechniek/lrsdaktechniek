"use client";

import {
  INVOICE_BANK_ACCOUNTS,
  INVOICE_ISSUERS,
  type InvoiceIssuerId,
  type InvoicePaymentMethod,
} from "@/lib/invoiceIssuer";

export function InvoiceBankPicker({
  issuer,
  value,
  paymentMethod,
  onChange,
  disabled = false,
  compact = false,
}:{
  issuer: InvoiceIssuerId;
  value: string;
  paymentMethod: InvoicePaymentMethod;
  onChange: (iban: string, paymentMethod: InvoicePaymentMethod) => void;
  disabled?: boolean;
  compact?: boolean;
}) {
  const accounts=INVOICE_BANK_ACCOUNTS[issuer];
  const isLrs=issuer==="lrs";
  const isCash=isLrs && paymentMethod==="cash";
  return <fieldset className={"invoice-bank-switch"+(compact?" compact":"")} disabled={disabled}>
    <legend>{compact ? "LRS · KIES BETAALWIJZE" : isLrs ? "KIES BETAALWIJZE VOOR DEZE LRS-FACTUUR" : "Bankrekening Allround LEM"}</legend>
    {isLrs && !compact && <p>Kies rekening 1, rekening 2 of Contant. De gekozen betaalwijze verschijnt automatisch op de factuur, PDF en in de e-mail.</p>}
    <div className="invoice-bank-switch-options">
      {accounts.map(bank=>{
        const active=!isCash && bank.iban===value;
        return <button
          type="button"
          key={bank.id}
          disabled={disabled}
          aria-pressed={active}
          className={"invoice-bank-switch-button"+(active?" selected":"")}
          onClick={()=>onChange(bank.iban,"bank")}
        >
          <span className="invoice-bank-switch-mark" aria-hidden="true">{active?"✓":"○"}</span>
          <span><strong>{bank.label}</strong><small>{bank.iban}</small></span>
        </button>;
      })}
      {isLrs && <button
        type="button"
        disabled={disabled}
        aria-pressed={isCash}
        className={"invoice-bank-switch-button cash"+(isCash?" selected":"")}
        onClick={()=>onChange(value || INVOICE_ISSUERS[issuer].iban,"cash")}
      >
        <span className="invoice-bank-switch-mark" aria-hidden="true">{isCash?"✓":"○"}</span>
        <span><strong>Contant</strong><small>Betaling in contanten</small></span>
      </button>}
    </div>
    {!compact && !isCash && (isLrs ? (
      <small className="invoice-bank-switch-note">Let op: rekening 2 staat ook op het aangeleverde Allround LEM-voorbeeld. Controleer of deze rekening juridisch gebruikt mag worden voor een LRS-factuur.</small>
    ) : (
      <small className="invoice-bank-switch-note">De betaalrekening van Allround LEM blijft vast. Wissel bovenaan van bedrijf voor een LRS-factuur.</small>
    ))}
    {!compact && <strong className="invoice-bank-switch-current">{isCash ? "Gekozen betaalwijze: Contant" : "Gekozen betaalrekening: "+(value || INVOICE_ISSUERS[issuer].iban)}</strong>}
  </fieldset>;
}
