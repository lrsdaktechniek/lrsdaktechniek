"use client";

import { useState } from "react";
import { QuoteBuilder } from "@/components/QuoteBuilder";
import { RoofQuoteBuilder } from "@/components/RoofQuoteBuilder";

export function PrivateWorkOrders({accessToken}:{accessToken:string}) {
  const [mode,setMode]=useState<"repair"|"roof">("repair");
  return (
    <>
      <nav className="private-work-nav no-print" aria-label="Interne werkbonnen">
        <span>LRS · WERKBONNEN EN OFFERTECALCULATIE</span>
        <button type="button" className={mode==="repair"?"active":""} onClick={()=>setMode("repair")}>Reparaties / werkbon</button>
        <button type="button" className={mode==="roof"?"active":""} onClick={()=>setMode("roof")}>Dakproject / offerte / factuur</button>
      </nav>
      {mode==="repair" ? <QuoteBuilder accessToken={accessToken}/> : <RoofQuoteBuilder accessToken={accessToken}/>}
    </>
  );
}
