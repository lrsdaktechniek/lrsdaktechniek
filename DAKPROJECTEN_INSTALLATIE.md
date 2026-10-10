# LRS Daktechniek — Dakprojecten, offertes en facturen

## Wat is toegevoegd?
- Tweede tab op de bestaande privéroute: **Dakproject / offerte / factuur**.
- Catalogus met 33 dakwerkzaamheden: bitumen, pannendaken, zink- en loodwerk,
  dakpannen slijpen, vogelschroten vervangen, panlatten, nokvorsten, enzovoort.
- In te vullen m² / strekkende meters / aantallen én prijs per eenheid.
- Eigen werkzaamheden toevoegen; prijzen per klus aanpassen of opslaan als standaard.
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

    https://www.lrsdaktechniek.nl/offerte/<OFFERTE_SECRET>

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
- Standaardtarieven zijn bewust €0: vul je eigen verkoopprijzen in. Er zijn
  geen onbevestigde voorbeeldtarieven als officiële offertes gepresenteerd.
- Het formulier gebruikt één gekozen btw-percentage per offerte. Bij gemengde
  btw-tarieven of afwijkende btw-regels is aanvullende factuurlogica nodig.
- De aparte kosten voor de extra medewerker verschijnen niet op klantdocumenten;
  ze kunnen standaard wel in de totale verkoopprijs worden verwerkt.
- De software is lokaal gebouwd en gecontroleerd. Live e-maillevering en een
  werkende productieomgeving moeten na het deployen apart worden getest.
