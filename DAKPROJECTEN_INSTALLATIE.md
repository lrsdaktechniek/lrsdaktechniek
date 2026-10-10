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


## Twee factuurafzenders (10 oktober 2026)

Zowel bij REPARATIES als GROTE DAKWERKEN staan twee duidelijk zichtbare knoppen:
**LRS Daktechniek** en **Allround LEM**. Het gekozen bedrijf bepaalt op
offerte/factuur de juridische naam, KvK, btw-ID, ING-bankrekening, koptekst
en de zelfstandige factuurnummerreeks.

### LRS Daktechniek
- KvK: 83217495
- Btw-ID: NL003787454B48
- IBAN: NL69 INGB 0112 7815 51
- Factuurnummers: LRS-2026-0001, LRS-2026-0002, ...
- Bedrijfsadres vooringevuld vanuit de bestaande LRS-werkbon.

### Allround LEM
- KvK: 81296061 (overgenomen van voorbeeldfactuur)
- Btw-ID: NL003557596B51 (overgenomen van voorbeeldfactuur)
- IBAN: NL46 INGB 0109 0156 49 (overgenomen van voorbeeldfactuur)
- Factuurnummers: LEM-2026-0001, LEM-2026-0002, ...
- **Volledig factuuradres ontbreekt op de voorbeeldfoto** en moet eenmalig
  bij "Bedrijfsadres Allround LEM" worden ingevuld voordat een factuur/offerte
  afgedrukt, gedeeld of e-mailverzonden kan worden.
- Voeg desgewenst zakelijk contact-e-mailadres en telefoonnummer toe.
- Controleer voordat echte facturen worden verstuurd of deze KvK- en
  btw-gegevens nog actueel en juridisch juist zijn.

### E-mail vanuit juiste onderneming

Allround LEM krijgt NIET stilzwijgend de bestaande afzender van LRS.
Voor automatische e-mails moet Vercel beschikken over:
- RESEND_API_KEY
- ALLROUND_LEM_FROM_EMAIL: een door Resend geverifieerd verzendadres van
  Allround LEM, bijvoorbeeld een adres op een geverifieerd eigen domein.
- ALLROUND_LEM_REPLY_TO: optioneel apart antwoordadres.

Zonder ALLROUND_LEM_FROM_EMAIL geeft de applicatie een begrijpelijke fout
en wordt geen Allround-mail via een LRS-afzender verstuurd. PNG, print/PDF
en handmatig delen blijven wel mogelijk na het invullen van het volledige
verzendende bedrijfsadres.

Bestaande LRS-sender via FACTUUR_FROM_EMAIL en OFFERTE_FROM_EMAIL blijft
ongewijzigd. De Allround-bankrekening wordt niet meer op een LRS-factuur
toegestaan en andersom; de factuur-API controleert beide juridische IDs.

### Projecthistorie en bewijs

- Grote dakwerken bewaren de keuze per project; na een verzonden factuur
  blijft het project vergrendeld.
- Bestaande LRS-concepten en facturen zonder afzendercode blijven onder LRS
  vallen, zodat oude bonnen niet plots naar Allround veranderen.
- Een wijziging van factuurbedrijf aan een dakproject met akkoord maakt het
  oude akkoord ongeldig voor de nieuwe bedrijfsnaam.
- Bij de reparatiebon wordt na succesvol e-mailen dezelfde klus beschermd
  tegen een tweede verzending onder een andere bedrijfsnaam.
- Alleen lokale nummerreeksen per bedrijf: beide werkbonnen op één browser
  delen dezelfde reeks per juridische entiteit. Voor meerdere apparaten
  blijft een centrale boekhouding/factuurnummerdatabase aanbevolen.
- De print/PDF-knop in het factuurpaneel bij reparaties print nu specifiek
  de factuur van de geselecteerde onderneming, niet de LRS-werkbon.

Deze aanpassing is met unit- en mocke-mailtests gecontroleerd. Er worden
geen echte facturen naar klanten verstuurd tijdens tests.

## Klantdocumenten: één totaalbedrag en snelle bediening (10 oktober 2026)

- Grote dakwerkbon: bovenaan een **sticky keuze met precies twee knoppen**,
  LRS Daktechniek en Allround LEM. De bedrijfskeuze blijft zichtbaar als
  je door de werkbon en de klantdocumentpreview scrolt.
- De knop hoort in het **interne werkscherm**, niet in de offerte-PDF die
  een klant ziet. De bedrijfsnaam, KvK, btw-ID en IBAN wisselen mee.
- Bij **offertes** staan nog wel werkzaamheden en hoeveelheden, maar
  **geen eenheidsprijzen, kortingsregels, toeslagen, regelsubtotalen of
  btw-subtotaal**. Alleen de definitieve totaalprijs incl. btw staat eronder.
  Dit geldt voor scherm, print/PDF, kopieertekst en rechtstreeks e-mailen.
- Bij **facturen** zijn de werkzaamheden en aantallen eveneens zonder
  afzonderlijke regelprijzen. Onderin blijven de fiscale grondslag
  (exclusief btw), het btw-bedrag en het te betalen eindtotaal zichtbaar
  voor de administratieve eisen aan facturen.
- Reparatiebon-facturen in PNG/print en bij e-mail hebben geen bedragen
  naast individuele werkregels; totaal en btw blijven in het slotblok.
- Interne calculatie, prijzen per m², volumevoordeel en extra personeel
  blijven voor medewerkers gewoon beschikbaar. Zij verschijnen niet als
  afzonderlijke posten op klantdocumenten.
- Grote dakprojecten hebben een **eigen werk invoeren**-formulier met
  omschrijving, hoeveelheid, m²/meter/stuk/uur/post en prijs per eenheid.
  Na VOEG WERK TOE telt het bedrag automatisch mee in de berekening.
- Reparatiebon heeft bij de werkzaamheden een extra snelknop
  **EIGEN WERK INVOEREN MET PRIJS** naar het bestaande invoerpaneel.
- Klantoffertes namens Allround LEM krijgen bij nieuwe projecten
  automatisch het visuele nummer LEM-OFF-jaar-volgnummer.
  De bestaande interne projecthistorie blijft ongewijzigd.

Vóór het versturen van echte facturen moet het volledige
factuuradres van Allround LEM en een eventueel geverifieerd
e-mailadres als afzender nog worden ingesteld. Projecten en
factuurnummers blijven lokaal opgeslagen (niet cloudbreed).
