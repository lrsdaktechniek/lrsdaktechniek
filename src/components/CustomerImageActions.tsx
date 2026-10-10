"use client";

import { useEffect, useState } from "react";
import {
  createCustomerImageBlob,
  imageFilename,
  type CustomerImageInput,
} from "@/lib/customerDocumentImage";

/**
 * Eén bediening voor offerte én factuur op iPhone/Android/desktop.
 * Eerst PNG maken, daarna zonder asynchrone voorbewerking native delen.
 * Dit behoudt de user-gesture die iOS Safari voor navigator.share vereist.
 */
export function CustomerImageActions({
  data,
  disabled = false,
  validate,
  onExport,
}: {
  data: CustomerImageInput;
  disabled?: boolean;
  validate?: () => string | null;
  onExport?: () => void;
}) {
  const [creating,setCreating]=useState(false);
  const [message,setMessage]=useState("");
  const [generated,setGenerated]=useState<{
    fingerprint:string;
    blob:Blob;
    url:string;
  } | null>(null);
  const fingerprint=JSON.stringify(data);
  const current=generated?.fingerprint===fingerprint ? generated : null;
  const fileName=imageFilename(data);
  const kind=data.kind==="offerte" ? "OFFERTAFBEELDING" : "FACTUURAFBEELDING";

  useEffect(()=>{
    const url=generated?.url;
    return ()=>{if(url)URL.revokeObjectURL(url);};
  },[generated?.url]);

  async function make() {
    if(creating || disabled) return;
    const error=validate?.();
    if(error){setMessage(error);return;}
    setCreating(true);
    setMessage("");
    try {
      const blob=await createCustomerImageBlob(data);
      const url=URL.createObjectURL(blob);
      setGenerated({fingerprint,blob,url});
      setMessage((data.kind==="offerte"?"Offerte":"Factuur")+" is klaar als PNG. Tik nu op Opslaan of Delen.");
    } catch(error) {
      setMessage(error instanceof Error ? error.message : "Afbeelding maken is mislukt.");
    } finally {
      setCreating(false);
    }
  }

  function download() {
    if(!current || disabled){setMessage("Maak eerst de afbeelding van de actuele gegevens.");return;}
    const a=document.createElement("a");
    a.href=current.url;
    a.download=fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    onExport?.();
    setMessage("PNG opgeslagen of geopend. Op iPhone kun je ook DELEN / OPSLAAN gebruiken.");
  }

  async function share() {
    if(!current || disabled){setMessage("Maak eerst de afbeelding van de actuele gegevens.");return;}
    const file=new File([current.blob],fileName,{type:"image/png"});
    try {
      if(typeof navigator.share==="function" &&
        (!navigator.canShare || navigator.canShare({files:[file]}))) {
        // Native deelblad, inclusief 'Bewaar afbeelding' als iOS dit aanbiedt.
        await navigator.share({
          title:(data.kind==="offerte"?"Offerte ":"Factuur ")+data.number,
          files:[file],
        });
        onExport?.();
        setMessage("De afbeelding is gedeeld. Je kunt hem ook in Foto's bewaren.");
      } else {
        download();
        setMessage("Delen van afbeeldingen wordt op dit apparaat niet ondersteund; de PNG is opgeslagen.");
      }
    } catch(error) {
      if(error instanceof DOMException && error.name==="AbortError") return;
      setMessage("Delen lukte niet. Gebruik OPSLAAN PNG of open de volledige afbeelding.");
    }
  }

  return <section className="customer-png-panel no-print">
    <div className="customer-png-heading">
      <strong>{kind} · PNG</strong>
      <p>Maak een nette afbeelding die je direct kunt opslaan in Foto's, via WhatsApp sturen of mailen.</p>
    </div>
    <div className="customer-png-buttons">
      <button
        type="button"
        className="customer-png-generate"
        disabled={creating||disabled}
        onClick={make}
      >
        {creating?"AFBEELDING MAKEN…":(current?"↻ "+kind+" VERNIEUWEN":"📷 "+kind+" MAKEN")}
      </button>
      <button
        type="button"
        className="customer-png-save"
        disabled={!current||disabled||creating}
        onClick={download}
      >⬇ OPSLAAN PNG</button>
      <button
        type="button"
        className="customer-png-share"
        disabled={!current||disabled||creating}
        onClick={share}
      >↗ DELEN / FOTO'S</button>
    </div>
    {generated && !current && <p className="customer-png-warning">De gegevens zijn gewijzigd. Maak eerst een nieuwe afbeelding zodat de klant de juiste versie ontvangt.</p>}
    {message && <p className="customer-png-status" role="status" aria-live="polite">{message}</p>}
    {current && <div className="customer-png-preview">
      <a href={current.url} target="_blank" rel="noreferrer" aria-label={"Open "+data.kind+" als volledige afbeelding"}>
        <img src={current.url} alt={(data.kind==="offerte"?"Offerte ":"Factuur ")+data.number+" van "+data.company.name}/>
        <span>OPEN VOLLEDIGE AFBEELDING ↗</span>
      </a>
      <small><strong>{fileName}</strong><br/>iPhone: tik op DELEN / FOTO&apos;S en kies Bewaar afbeelding. Of houd de preview ingedrukt.</small>
    </div>}
  </section>;
}
