# LRS Daktechniek — Dakprojecten, offertes en facturen

## Wat is toegevoegd?
- Tweede tab op de bestaande privéroute: **Dakproject / offerte / factuur**.
- Catalogus met 38 dakwerkzaamheden: bitumen, pannendaken, zink- en loodwerk,
  dakpannen slijpen, vogelschroten vervangen, panlatten, nokvorsten, enzovoort.
- Vaste standaardtarieven voor alle cataloguswerkzaamheden. Je hoeft alleen de m²,
  strekkende meters of aantallen in te vullen; plus- en minknoppen staan direct
  bij de aangetikte tegel én in het opdrachtenoverzicht.
- Tarieven sluiten voor de hoofdtypen aan op de bestaande openbare LRS-richtbanden.
  Overige werkzaamheden hebben voorgestelde interne starttarieven: controleer
  materiaal, veiligheid, bereikbaarheid en marge voor een bindende offerte.
- Staffel per REGEL (niet als plotselinge korting over alle vorige meters):
  m² 0–10 100%, 10–30 96%, 30–75 91%, daarna 86%;
  strekkende meters 0–5 100%, 5–15 96%, 15–40 91%, daarna 86%;
  stuks na eerste stuk 97%, 93% en minimaal 89% per volgende stuks.
- Extra verschillende werkzaamheden krijgen op de tweede en volgende
  relevante regels 3% tot 6% meeneemvoordeel. Per regel is de korting
  begrensd op maximaal 18% van de vaste basisprijs.
- Minimum dakproject €195 excl. btw, verwerkt in bestaande klantregels.
  Gebruik de aparte reparatiewerkbon voor losse kleine reparaties.
- Eigen werkzaamheden toevoegen; prijzen per klus of in het prijsboek wijzigen.
- Zowel de reparatiewerkbon als de dakprojecten heeft een opvallende
  **NIEUWE KLUS**-knop die leeg begint.
- Intern veld voor een extra medewerker/onderaannemer, bijvoorbeeld € 300 excl. btw.
  Standaard wordt dit bedrag **verborgen doorberekend in de zichtbare werkregels**.
  Het wordt nooit als aparte regel of met een interne omschrijving naar de klant gestuurd.
- Automatisch totaal excl. btw + btw + incl. btw, offertepreview, printen als PDF.
- Offerte versturen per e-mail via bestaande Resend-configuratie.
- Handmatig akkoord van klant registreren. Na wijzigingen vervalt het akkoord.
- Factuur per e-mail sturen met het bestaande LRS-factuursysteem.
- Lokale projectlijst zodat een offerte later weer geopend kan worden.

## Installeren
Bestandsstructuur in de ZIP komt overeen met het project.
Gebruik bij voorkeur **LRS-Dakprojecten.patch** op een schone kopie van
lrsdaktechniek/lrsdaktechniek:

    git apply --check LRS-Dakprojecten.patch
    git apply LRS-Dakprojecten.patch
    npm install
    npm run typecheck
    npm run build
    node --test tests/roofQuote.test.cjs

Let op: test eerst voordat je de wijzigingen in de hoofdbranch zet.

## Inloggen
Bestaande beveiligde pagina blijft:

    https://lrsdaktechniek.vercel.app/offerte/<OFFERTE_SECRET>

Je bestaande reparatiewerkbon staat op tab 1, de dakprojecten op tab 2.
De secret mag niet worden gedeeld met klanten. Alleen klantenoffertes
versturen; geen links naar het interne scherm.

## Benodigde variabelen in Vercel
    OFFERTE_SECRET
    RESEND_API_KEY
    FACTUUR_FROM_EMAIL    (geverifieerde afzender)
    OFFERTE_FROM_EMAIL    (optioneel; anders FACTUUR_FROM_EMAIL)
    FACTUUR_REPLY_TO      (optioneel)

Offerte-e-mails en factuur-e-mails gaan alleen de deur uit wanneer de Resend-
afzender en sleutel correct zijn ingesteld. HTML e-mail wordt verstuurd;
er wordt geen PDF als e-mailbijlage gegenereerd. Via PRINT / PDF kun je zelf
PDF-bestanden maken.

## Belangrijke beperkingen
- Een klant kan niet online ondertekenen: jij markeert akkoord *handmatig* nadat
  je diens bevestiging bijvoorbeeld per WhatsApp of e-mail ontvangen hebt.
- Projecten, akkoordstatussen, prijsboek en nummers staan momenteel in
  browser-localStorage. Ze worden NIET centraal opgeslagen of tussen apparaten
  gesynchroniseerd. Maak een PDF-back-up en bewaar akkoordbewijs.
- Factuurnummering is daarom niet wereldwijd gegarandeerd uniek bij gebruik
  van meerdere apparaten. Controleer de boekhouding.
- Alle catalogusregels hebben ingevulde vaste interne starttarieven. Deze zijn niet door een kostprijsaudit goedgekeurd: controleer je werkelijke materiaalkosten en marge. Eigen extra werkregels beginnen wel op €0 totdat je ze zelf invult.
- Bestaande verzonden offertes en facturen houden de oude rekenmethode. Concepten worden naar de nieuwe prijsstaffel gemigreerd; begin een nieuwe klus voor nieuwe instellingen.
- Het formulier gebruikt één gekozen btw-percentage per offerte. Bij gemengde
  btw-tarieven of afwijkende btw-regels is aanvullende factuurlogica nodig.
- De aparte kosten voor de extra medewerker verschijnen niet op klantdocumenten;
  ze kunnen standaard wel in de totale verkoopprijs worden verwerkt.
- Na publicatie moet de Vercel-deployment nog gecontroleerd worden; de publieke domeinnaam www.lrsdaktechniek.nl verwijst niet per se naar deze Vercel-app. Test echte e-mailbezorging eerst met eigen adres.
