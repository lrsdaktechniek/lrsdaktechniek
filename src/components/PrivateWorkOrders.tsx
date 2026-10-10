"use client";

import { useEffect, useState } from "react";
import { QuoteBuilder } from "@/components/QuoteBuilder";
import { RoofQuoteBuilder } from "@/components/RoofQuoteBuilder";

/**
 * Herken oude, nog geopende iPhone-/browser-tabs na een deployment.
 * Bestaande reparatiedrafts en dakprojecten zijn lokaal automatisch opgeslagen.
 * Niet automatisch herladen midden tijdens een offerte: de gebruiker kiest zelf.
 */
export function PrivateWorkOrders({
  accessToken, deployedVersion,
}:{
  accessToken:string;
  deployedVersion:string;
}) {
  const [mode,setMode]=useState<"repair"|"roof">("repair");
  const [newVersion,setNewVersion]=useState(false);

  useEffect(()=>{
    let inactive=false;
    let checking=false;
    async function checkVersion() {
      if (checking || inactive) return;
      checking=true;
      try {
        const response=await fetch("/api/werkbon-versie?_="+Date.now(),{
          cache:"no-store",credentials:"same-origin",
        });
        if (!response.ok) return;
        const data=await response.json() as {version?:string};
        if (!inactive && typeof data.version==="string" && data.version!==deployedVersion) {
          setNewVersion(true);
        }
      } catch {
        // Als de verbinding tijdelijk wegvalt, blijft de werkbon bruikbaar.
      } finally {checking=false;}
    }

    // Bij terugkeer naar de tab of elke minuut controleren.
    const onVisible=()=>{if (document.visibilityState==="visible")void checkVersion();};
    const timer=window.setInterval(()=>void checkVersion(),60000);
    document.addEventListener("visibilitychange",onVisible);
    window.addEventListener("focus",checkVersion);
    void checkVersion();
    return ()=>{
      inactive=true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange",onVisible);
      window.removeEventListener("focus",checkVersion);
    };
  },[deployedVersion]);

  function loadNewestVersion() {
    // Harde navigatie met unieke query voorkomt het terughalen van oude
    // Next.js client-JavaScript of een oude pagina vanuit browserhistorie.
    const url=new URL(window.location.href);
    url.searchParams.set("werkbon-versie",String(Date.now()));
    window.location.assign(url.toString());
  }

  return (
    <>
      <nav className="private-work-nav no-print" aria-label="Interne werkbonnen">
        <span>LRS · WERKBONNEN EN OFFERTECALCULATIE</span>
        <span className="private-work-release-badge">KLANTDOCUMENT: ALLEEN EINDTOTAAL</span>
        <button type="button" className={mode==="repair"?"active":""} onClick={()=>setMode("repair")}>Reparaties / werkbon</button>
        <button type="button" className={mode==="roof"?"active":""} onClick={()=>setMode("roof")}>Dakproject / offerte / factuur</button>
        <button type="button" className="private-work-reload" onClick={loadNewestVersion} aria-label="Nieuwe werkbonversie volledig laden">↻ Vernieuw versie</button>
      </nav>
      {newVersion && <aside className="private-work-update no-print" role="status" aria-live="polite">
        <strong>Er is een nieuwe werkbonversie beschikbaar.</strong>
        <span>Je kunt de nieuwste opmaak laden. Concepten worden op dit apparaat automatisch opgeslagen.</span>
        <button type="button" onClick={loadNewestVersion}>LAAD NIEUWE VERSIE ↻</button>
      </aside>}
      {mode==="repair" ? <QuoteBuilder accessToken={accessToken}/> : <RoofQuoteBuilder accessToken={accessToken}/>}
    </>
  );
}
