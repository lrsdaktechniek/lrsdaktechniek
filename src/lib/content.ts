export const site = {
  name: "LRS Daktechniek",
  url: "https://www.lrsdaktechniek.nl",
  phoneDisplay: "06 15283626",
  phoneHref: "+31615283626",
  whatsapp: "31615283626",
  email: "info@lrsdaktechniek.nl",
  kvk: "83217495",
  region: "Breda & omgeving",
  hours: "Maandag t/m vrijdag 08:00 – 16:00",
  shortHours: "Ma–vr 08:00 – 16:00"
} as const;

export const services = [
  {
    slug: "dakpannen",
    name: "Pannendaken",
    title: "Pannendak herstellen of vervangen",
    eyebrow: "Hellende daken",
    intro: "Van beschadigde dakpannen tot complete renovatie van folie, panlatten en dakpannen.",
    hero: "Niet automatisch alles vervangen. Eerst bepalen welke laag werkelijk aandacht nodig heeft.",
    symptoms: ["Gebroken of verschoven pannen","Lekkage rond nok, kilgoot, dakraam of schoorsteen","Terugkerende reparaties","Verouderde folie of panlatten"],
    checks: ["Dakpannen en nok","Folie en waterafvoer","Tengels en panlatten","Dakbeschot","Aansluitingen en isolatiemogelijkheid"]
  },
  {
    slug: "betumendaken",
    name: "Bitumen daken",
    title: "Bitumen dak herstellen of vernieuwen",
    eyebrow: "Platte daken",
    intro: "Bitumen voor aanbouwen, garages, schuren en dakkapellen in Breda en omgeving.",
    hero: "Overlagen als de basis goed is. Volledig vernieuwen wanneer de ondergrond daarom vraagt.",
    symptoms: ["Scheuren of open naden","Blazen of losliggende delen","Lekkage bij afvoer of rand","Meerdere oude reparaties"],
    checks: ["Bestaande daklaag","Ondergrond en vocht","Afschot en afvoer","Randen en doorvoeren","Warmdak-isolatie"]
  },
  {
    slug: "dak-lekkage",
    name: "Daklekkage",
    title: "Daklekkage opsporen en herstellen",
    eyebrow: "Diagnose & herstel",
    intro: "Eerst de bron vinden, daarna zo gericht mogelijk herstellen.",
    hero: "De vochtplek is niet altijd de plaats waar water binnenkomt.",
    symptoms: ["Vochtplek of verkleuring","Druppels na regen","Schimmel bij naden","Water langs balk of schoorsteen"],
    checks: ["Dakbedekking","Schoorsteen en lood","Dakramen en kilgoten","Bitumen naden en afvoer","Mogelijke waterroute"]
  },
  {
    slug: "dak-isolatie",
    name: "Dakisolatie",
    title: "Dakisolatie slim combineren met renovatie",
    eyebrow: "Comfort & dakopbouw",
    intro: "Dakisolatie voor hellende en platte daken als onderdeel van een kloppende totale dakopbouw.",
    hero: "Niet alleen dikker isoleren. Eerst zorgen dat de complete dakopbouw klopt.",
    symptoms: ["Renovatie staat gepland","Beperkt comfort boven","Oude isolatielaag","Plat dak wordt vernieuwd"],
    checks: ["Constructie","Vochttechniek","Dakranddetails","Combinatie met dakbedekking","Praktische isolatiedikte"]
  },
  {
    slug: "schoorsteen-verwijderen",
    name: "Schoorsteen verwijderen",
    title: "Schoorsteen verwijderen en dak herstellen",
    eyebrow: "Sloop & dakherstel",
    intro: "Niet gebruikte of problematische schoorstenen verwijderen en het dakvlak daarna waterdicht herstellen.",
    hero: "De schoorsteen weghalen is maar de helft. Het dak daarna goed sluiten is het eindwerk.",
    symptoms: ["Niet meer in gebruik","Lekkage rond lood of metselwerk","Slecht metselwerk","Moet weg bij renovatie"],
    checks: ["Afmetingen","Constructieve aansluiting","Dakbedekking","Nieuwe dakopbouw","Veilige materiaalafvoer"]
  }
] as const;

export type ServiceSlug = typeof services[number]["slug"];

export const serviceDetails: Record<ServiceSlug, {
  summary: string;
  topics: readonly { title: string; text: string }[];
  faq: readonly { question: string; answer: string }[];
  related: readonly { label: string; href: string }[];
}> = {
  dakpannen: {
    summary: "Een pannendak is meer dan alleen de zichtbare dakpan. De staat van nok, panlatten, tengels, folie, dakbeschot en aansluitingen bepaalt welke reparatie of renovatie logisch is.",
    topics: [
      { title: "Betonnen en keramische dakpannen", text: "Verschillende pansoorten hebben een eigen maatvoering, gewicht en verouderingsbeeld. Bij vervanging wordt daarom eerst gekeken welk type pan aanwezig is en wat technisch passend is." },
      { title: "Panlatten en tengels", text: "De pannen rusten op panlatten; tengels zorgen voor ruimte onder de panlatten en ondersteunen afvoer en ventilatie. Beschadiging of veroudering kan reden zijn om verder te kijken dan alleen de pannen." },
      { title: "Folie onder het pannendak", text: "De folie vormt een tweede waterkerende laag. Beschadigde of verouderde folie kan een rol spelen bij lekkages die niet direct vanaf de buitenzijde zichtbaar zijn." },
      { title: "Nokvorsten en aansluitingen", text: "Nok, kilgoot, dakraam en schoorsteen zijn belangrijke aansluitpunten. Juist daar kan water bij wind en slagregen een andere route nemen dan verwacht." },
      { title: "Dakbeschot", text: "Wanneer het dak wordt geopend kan de conditie van het dakbeschot worden beoordeeld. Plaatselijke schade vraagt niet automatisch om volledige vervanging." },
      { title: "Renovatie en isolatie combineren", text: "Als een pannendak toch wordt geopend, is dat een logisch moment om te beoordelen of verbetering van de isolatie praktisch in dezelfde dakopbouw kan worden meegenomen." }
    ],
    faq: [
      { question: "Moet bij een kapotte dakpan het hele dak worden vervangen?", answer: "Nee. Een plaatselijk probleem kan vaak plaatselijk worden hersteld. Pas wanneer meerdere lagen of grote delen van het dak verouderd of beschadigd zijn, wordt bredere renovatie logisch." },
      { question: "Waarom kan een pannendak lekken terwijl de pannen er goed uitzien?", answer: "Water kan binnenkomen via nok, lood, kilgoten, dakramen of onderliggende folie. De zichtbare pannen vertellen daarom niet altijd het hele verhaal." },
      { question: "Kan dakisolatie tegelijk met een pannendakrenovatie?", answer: "Dat kan een logisch moment zijn, maar de juiste oplossing hangt af van constructie, vochttechniek en de bestaande dakopbouw." }
    ],
    related: [
      { label: "Slimme lekkagecheck", href: "/dak-lekkage" },
      { label: "Dakisolatie", href: "/dak-isolatie" },
      { label: "Prijsindicatie", href: "/prijsindicatie" },
      { label: "Dakdekker Breda", href: "/dakdekker-breda" }
    ]
  },
  betumendaken: {
    summary: "Bij een plat bitumendak gaat het niet alleen om de bovenlaag. Ondergrond, naden, opstanden, afvoer, doorvoeren en eventuele isolatie bepalen of plaatselijk herstel, overlagen of vernieuwing logisch is.",
    topics: [
      { title: "Bitumen overlagen", text: "Overlagen kan alleen zinvol zijn wanneer de bestaande dakopbouw voldoende geschikt is. Een nieuwe laag over een slechte of vochtige ondergrond lost een onderliggend probleem niet op." },
      { title: "Nieuw bitumen dak", text: "Bij volledige vernieuwing kunnen bestaande lagen en details opnieuw worden opgebouwd. Randen, opstanden en doorvoeren horen daarbij net zo goed als het grote vlak." },
      { title: "Naden, scheuren en blazen", text: "Openstaande naden, scheuren en blaasvorming kunnen aanwijzingen zijn voor veroudering, beweging of vocht in de dakopbouw. De oorzaak bepaalt de juiste aanpak." },
      { title: "Hemelwaterafvoer", text: "Afvoer en afschot zijn essentieel op een plat dak. Stilstaand water of problemen rond een afvoer verdienen aparte aandacht." },
      { title: "Dakrand en doorvoeren", text: "Daktrim, opstanden, ventilatie- of rookgasdoorvoeren en andere details zijn veelvoorkomende controlepunten omdat hier verschillende materialen op elkaar aansluiten." },
      { title: "Warm dak", text: "Bij renovatie kan worden bekeken of een warmdak-opbouw met isolatie passend is. De complete laagopbouw moet daarbij bouwkundig en vochttechnisch kloppen." }
    ],
    faq: [
      { question: "Kan nieuw bitumen altijd over oud bitumen?", answer: "Nee. Eerst moet duidelijk zijn of de bestaande laag en ondergrond geschikt zijn. Vocht, slechte hechting of beschadigde onderlagen kunnen een andere aanpak nodig maken." },
      { question: "Zijn blazen in bitumen altijd een lekkage?", answer: "Niet automatisch. Blaasvorming is wel een reden om de dakopbouw en de omgeving ervan te controleren." },
      { question: "Waar ontstaan lekkages op een plat dak vaak?", answer: "Naden, afvoeren, dakranden, opstanden en doorvoeren zijn logische controlepunten, naast beschadiging van het dakvlak zelf." }
    ],
    related: [
      { label: "Slimme lekkagecheck", href: "/dak-lekkage" },
      { label: "Dakisolatie", href: "/dak-isolatie" },
      { label: "Prijsindicatie", href: "/prijsindicatie" },
      { label: "Dakdekker Breda", href: "/dakdekker-breda" }
    ]
  },
  "dak-lekkage": {
    summary: "Bij lekkage wordt geen reparatieprijs gegokt. De eerste stap is bepalen welk daktype, welke omstandigheden en welke aansluitingen relevant zijn. De vaste voorrijkosten zijn €75 excl. btw (€90,75 incl. btw).",
    topics: [
      { title: "Pannendak", text: "Pannen, nok, lood, kilgoot, dakraam en onderliggende folie kunnen allemaal een rol spelen. Water kan onder de dakbedekking verplaatsen voordat het binnen zichtbaar wordt." },
      { title: "Plat dak", text: "Bij bitumen zijn onder meer naden, scheuren, afvoeren, opstanden, dakranden en doorvoeren logische controlepunten." },
      { title: "Schoorsteen en lood", text: "Aansluitingen rond een schoorsteen bestaan uit meerdere materialen en voegen. Daardoor is de plek waar binnen vocht zichtbaar is niet altijd de plaats waar buiten water binnendringt." },
      { title: "Wind en slagregen", text: "Een lekkage die alleen bij bepaalde windrichting of hevige regen optreedt geeft andere informatie dan een continu vochtprobleem." }
    ],
    faq: [
      { question: "Wat kost het om LRS naar een daklekkage te laten kijken?", answer: "De vaste voorrijkosten zijn €75 excl. btw, oftewel €90,75 incl. btw. De reparatieprijs wordt pas besproken als duidelijk is wat de oorzaak en benodigde werkzaamheden zijn." },
      { question: "Waarom staat er geen vaste reparatieprijs voor lekkage?", answer: "Dezelfde vochtplek kan verschillende oorzaken hebben. Zonder de bron te kennen zou een vooraf berekende reparatieprijs schijnzekerheid geven." },
      { question: "Kan ik vooraf informatie en foto's sturen?", answer: "Ja. De slimme lekkagecheck maakt een samenvatting voor WhatsApp. Daarna kunt u foto's toevoegen, zodat LRS vóór het bezoek al meer context heeft." }
    ],
    related: [
      { label: "Pannendaken", href: "/dakpannen" },
      { label: "Bitumen daken", href: "/betumendaken" },
      { label: "Schoorsteen verwijderen", href: "/schoorsteen-verwijderen" },
      { label: "Dakdekker Breda", href: "/dakdekker-breda" }
    ]
  },
  "dak-isolatie": {
    summary: "Goede dakisolatie draait om de complete dakopbouw. Isolatiedikte alleen is niet genoeg: constructie, vochtgedrag, aansluiting en dakbedekking moeten samen kloppen.",
    topics: [
      { title: "Isolatie bij pannendakrenovatie", text: "Wanneer een hellend dak toch wordt geopend, kan worden beoordeeld of isolatie logisch kan worden gecombineerd met de renovatie." },
      { title: "Warmdak-opbouw plat dak", text: "Bij een plat dak kan isolatie onderdeel worden van een warmdak-opbouw. De positie van isolatie en dampremmende lagen moet passen bij de constructie." },
      { title: "Vochttechniek", text: "Een verkeerde laagopbouw kan vocht vasthouden. Daarom wordt niet alleen naar isolatiewaarde gekeken, maar naar de werking van de totale constructie." },
      { title: "Randen en aansluitingen", text: "Dakvoet, dakrand, opstanden en doorvoeren vragen aandacht om de isolatielaag technisch logisch aan te sluiten." }
    ],
    faq: [
      { question: "Is het slim om dakisolatie tegelijk met dakrenovatie te doen?", answer: "Dat kan efficiënt zijn omdat het dak toch wordt geopend, maar de juiste oplossing hangt af van de bestaande constructie." },
      { question: "Kan ieder plat dak als warm dak worden geïsoleerd?", answer: "Niet zonder beoordeling. De constructie, bestaande lagen, hoogte van randen en aansluitingen bepalen wat praktisch mogelijk is." },
      { question: "Waarom is vochttechniek belangrijk bij isolatie?", answer: "Omdat warme en koude zones invloed hebben op condensatie. De laagopbouw moet voorkomen dat vocht ongewenst in de constructie blijft zitten." }
    ],
    related: [
      { label: "Pannendaken", href: "/dakpannen" },
      { label: "Bitumen daken", href: "/betumendaken" },
      { label: "Prijsindicatie", href: "/prijsindicatie" },
      { label: "Dakdekker Breda", href: "/dakdekker-breda" }
    ]
  },
  "schoorsteen-verwijderen": {
    summary: "Een schoorsteen verwijderen is sloop én dakherstel. Na het gecontroleerd afbouwen moet de constructie worden gesloten en de dakopbouw weer waterdicht aansluiten.",
    topics: [
      { title: "Deel boven het dak", text: "Voor het zichtbare deel moet eerst duidelijk zijn hoe de schoorsteen aansluit op dakbedekking, lood en constructie." },
      { title: "Lood en aansluitingen", text: "Oud lood en aangrenzende dakdelen worden onderdeel van het herstel zodra de schoorsteen verdwijnt." },
      { title: "Constructief sluiten", text: "Na verwijdering blijft een opening in het dak achter. Die moet passend bij de bestaande constructie worden gesloten." },
      { title: "Dakbedekking herstellen", text: "Bij een pannendak worden onderliggende lagen, latten en pannen hersteld; bij andere daktypen geldt een passende nieuwe aansluiting." },
      { title: "Materiaal veilig afvoeren", text: "Metselwerk en andere vrijkomende materialen vragen om gecontroleerde afbouw en afvoer." }
    ],
    faq: [
      { question: "Is alleen het deel boven het dak verwijderen voldoende?", answer: "Dat hangt af van de situatie en het doel. Belangrijk is dat het resterende dakvlak constructief en waterdicht correct wordt hersteld." },
      { question: "Kan lekkage rond een schoorsteen reden zijn om hem te verwijderen?", answer: "Dat kan een overweging zijn wanneer de schoorsteen niet meer nodig is, maar eerst moet duidelijk zijn wat de technische oorzaak en gewenste eindsituatie is." },
      { question: "Wordt het dak na verwijderen weer met dakpannen gesloten?", answer: "Bij een pannendak wordt de opening passend bij de bestaande dakopbouw hersteld, inclusief de relevante onderlagen en dakbedekking." }
    ],
    related: [
      { label: "Slimme lekkagecheck", href: "/dak-lekkage" },
      { label: "Pannendaken", href: "/dakpannen" },
      { label: "Prijsindicatie", href: "/prijsindicatie" },
      { label: "Dakdekker Breda", href: "/dakdekker-breda" }
    ]
  }
};

export const locations = [
  ["dakdekker-breda","Breda","A"],
  ["dakdekker-prinsenbeek","Prinsenbeek","A"],
  ["dakdekker-terheijden","Terheijden","A"],
  ["dakdekker-etten-leur","Etten-Leur","A"],
  ["dakdekker-oosterhout","Oosterhout","A"],
  ["dakdekker-teteringen","Teteringen","B"],
  ["dakdekker-made","Made","B"],
  ["dakdekker-rijsbergen","Rijsbergen","B"],
  ["dakdekker-dongen","Dongen","C"],
  ["dakdekker-bavel","Bavel","C"],
  ["dakdekker-ulvenhout","Ulvenhout","C"],
  ["dakdekker-rijen","Rijen","C"],
  ["dakdekker-roosendaal","Roosendaal","C"],
  ["dakdekker-gilze","Gilze","C"],
  ["dakdekker-zundert","Zundert","C"]
] as const;

export const bredaPage = {
  title: "Dakdekker Breda",
  intro: "LRS Daktechniek werkt vanuit Breda aan pannendaken, bitumen daken, dakisolatie, daklekkages en het verwijderen van schoorstenen. U heeft rechtstreeks contact met de dakdekker die het werk uitvoert.",
  sections: [
    {
      title: "Dakwerk begint bij het type dak en de echte oorzaak",
      text: "Een losse dakpan vraagt om een andere aanpak dan verouderde folie, een lekkende aansluiting of een plat dak met openstaande naden. Daarom begint LRS niet met een standaardpakket, maar met de technische situatie."
    },
    {
      title: "Pannendaken in Breda",
      text: "Bij hellende daken wordt gekeken naar meer dan alleen de dakpan: nokvorsten, panlatten, tengels, folie, dakbeschot en aansluitingen rond dakraam, kilgoot en schoorsteen kunnen relevant zijn."
    },
    {
      title: "Bitumen en platte daken",
      text: "Bij platte daken zijn de staat van het dakvlak, naden, afvoer, opstanden, randen, doorvoeren en de onderliggende opbouw bepalend voor herstel, overlagen of volledige vernieuwing."
    },
    {
      title: "Daklekkage: eerst informatie verzamelen",
      text: "Voor lekkages heeft LRS een aparte slimme lekkagecheck. De klant kan vooraf daktype, zichtbare schade, omstandigheden, dakdetails, bereikbaarheid en volledig adres doorgeven. De vaste voorrijkosten bedragen €75 excl. btw (€90,75 incl. btw)."
    },
    {
      title: "Rechtstreeks contact",
      text: "De website is ingericht op korte lijnen. Geen callcenter of wisselende contactpersonen: vragen, prijsindicaties en lekkage-informatie gaan rechtstreeks naar LRS."
    }
  ],
  faq: [
    {
      question: "Welke dakwerkzaamheden doet LRS Daktechniek in Breda?",
      answer: "LRS richt zich op pannendaken, bitumen platte daken, dakisolatie, daklekkages en schoorsteen verwijderen."
    },
    {
      question: "Kan ik vooraf een prijsindicatie krijgen?",
      answer: "Voor verschillende dakwerkzaamheden is er een online prijsrekenmachine. Bij lekkage wordt geen reparatieprijs gegokt; daarvoor zijn alleen de vaste voorrijkosten vooraf bekend."
    },
    {
      question: "Wat zijn de voorrijkosten bij daklekkage?",
      answer: "De vaste voorrijkosten voor een lekkagebezoek bedragen €75 excl. btw, oftewel €90,75 incl. btw."
    },
    {
      question: "Werkt LRS alleen in Breda?",
      answer: "Nee. Het werkgebied omvat Breda en omliggende plaatsen zoals Prinsenbeek, Terheijden, Etten-Leur, Oosterhout, Teteringen en andere plaatsen in de regio."
    }
  ]
} as const;

export const articles = [
  {
    slug:"wanneer-pannendak-vervangen",
    title:"Wanneer moet een pannendak worden vervangen?",
    description:"Welke signalen wijzen op lokaal herstel en wanneer wordt een complete renovatie logischer?",
    sections:[
      ["Kijk verder dan alleen de dakpan","Een beschadigde pan kan lokaal worden vervangen. Wanneer ook folie, latten of aansluitingen hun functie verliezen, kan bredere renovatie logischer zijn."],
      ["Terugkerende reparaties zijn informatie","Steeds opnieuw andere plekken herstellen kan wijzen op bredere veroudering. Dat betekent nog niet automatisch volledig vervangen."],
      ["Renovatie kan een logisch isolatiemoment zijn","Wanneer het dak toch wordt geopend, kan tegelijk worden bekeken of isolatie praktisch en bouwkundig verstandig is."]
    ]
  },
  {
    slug:"bitumen-overlagen-of-vernieuwen",
    title:"Bitumen overlagen of volledig vernieuwen?",
    description:"Wanneer kan een nieuwe laag over het bestaande dak en wanneer is volledig vernieuwen verstandiger?",
    sections:[
      ["Overlagen vraagt een goede basis","Een nieuwe laag over een slechte of vochtige ondergrond lost het onderliggende probleem niet op."],
      ["Randen en doorvoeren zijn geen bijzaak","Veel problemen ontstaan bij afvoeren, opstanden, randen en doorvoeren."],
      ["Renovatie en isolatie combineren","Bij volledige vernieuwing kan een warmdak-opbouw worden bekeken."]
    ]
  },
  {
    slug:"daklekkage-bron-vinden",
    title:"Daklekkage: waarom zit de bron niet altijd boven de vochtplek?",
    description:"Water kan via verschillende dakdelen een route volgen. Goed herstel begint bij de echte bron.",
    sections:[
      ["Water volgt de makkelijkste route","Op een hellend dak kan water onder pannen of langs folie verschuiven. Bij platte daken kan hetzelfde via naden en randen gebeuren."],
      ["Aansluitingen verdienen aandacht","Schoorsteen, dakraam, kilgoot, doorvoeren en afvoeren zijn logische controlepunten."],
      ["Gericht herstel begint met diagnose","Eerst de vermoedelijke bron afbakenen voorkomt onnodig groot herstel."]
    ]
  },
  {
    slug:"dakisolatie-bij-renovatie",
    title:"Dakisolatie combineren met dakrenovatie",
    description:"Waarom een renovatie een logisch moment kan zijn om de isolatieopbouw mee te nemen.",
    sections:[
      ["Hellende en platte daken verschillen","De juiste isolatieopbouw is afhankelijk van de constructie."],
      ["Vochttechniek gaat vóór alleen dikte","Meer isolatie is niet automatisch beter wanneer de totale opbouw niet klopt."],
      ["Details bepalen de kwaliteit","Randen, naden, doorvoeren en aansluitingen moeten passen bij de nieuwe opbouw."]
    ]
  },
  {
    slug:"schoorsteen-verwijderen-dak-herstellen",
    title:"Schoorsteen verwijderen: wat gebeurt er met het dak?",
    description:"Na het slopen moet het dakvlak constructief en waterdicht worden hersteld.",
    sections:[
      ["Eerst de aansluiting begrijpen","Afmetingen, positie en constructie bepalen hoe veilig kan worden afgebouwd."],
      ["Gecontroleerd afbouwen","Sloopmateriaal moet beheersbaar worden verwijderd zonder onnodige belasting."],
      ["Het dakvlak opnieuw opbouwen","Na verwijdering moet de opening constructief worden gesloten en waterdicht aangesloten."]
    ]
  },
  {
    slug:"nokvorsten-los-lekkage",
    title:"Losse nokvorsten: wanneer wordt het een lekkagerisico?",
    description:"Wat de nok van een pannendak doet en waarom schade rond nokvorsten bij regen en wind aandacht verdient.",
    sections:[
      ["De nok is een aansluiting","Nokvorsten sluiten de twee dakvlakken bovenaan af. De aansluiting moet regen en wind kunnen weerstaan terwijl de dakopbouw blijft functioneren."],
      ["Los is niet hetzelfde als lek","Een losse of verouderde nokvorst betekent niet automatisch dat er al water binnendringt, maar is wel een logisch controlepunt bij schade of vochtproblemen."],
      ["Kijk ook naar de omgeving","Dakpannen, bevestiging, aansluitmateriaal en onderliggende waterkerende lagen bepalen samen hoe urgent herstel is."]
    ]
  },
  {
    slug:"dakfolie-onder-dakpannen",
    title:"Wat doet de folie onder dakpannen?",
    description:"Waarom onderdakfolie belangrijk is en waarom een pannendak er van buiten goed uit kan zien terwijl onderliggende lagen aandacht vragen.",
    sections:[
      ["Een tweede waterkerende laag","De dakpannen vangen het grootste deel van regen en wind op. Folie onder de pannen helpt doorgedrongen water gecontroleerd af te voeren."],
      ["Folie is niet onbeperkt zichtbaar","De conditie is van buiten vaak moeilijk volledig te beoordelen. Bij renovatie of gerichte opening kan meer duidelijk worden."],
      ["Aansluitingen zijn belangrijk","Dakvoet, doorvoeren, dakramen en andere details moeten logisch op de folie aansluiten om water naar buiten te leiden."]
    ]
  },
  {
    slug:"daklekkage-alleen-harde-regen-wind",
    title:"Waarom lekt een dak soms alleen bij harde regen of wind?",
    description:"Slagregen en windrichting kunnen water naar andere aansluitingen sturen dan tijdens normale regen.",
    sections:[
      ["Wind verandert de waterbelasting","Regen valt bij harde wind niet alleen van boven. Water kan tegen aansluitingen en onder overlappende delen worden gedrukt."],
      ["Het moment van lekkage is informatie","Als een probleem alleen bij een bepaalde windrichting optreedt, helpt dat om mogelijke intredepunten gerichter te onderzoeken."],
      ["Binnenplek en buitenbron verschillen","Water kan via folie, hout of constructiedelen een route afleggen voordat het binnen zichtbaar wordt."]
    ]
  },
  {
    slug:"bitumen-blazen-scheuren-naden",
    title:"Blazen, scheuren en open naden in bitumen: wat betekenen ze?",
    description:"Veelvoorkomende zichtbare signalen op een plat dak en waarom de oorzaak bepaalt welke reparatie logisch is.",
    sections:[
      ["Blaasvorming","Een blaas is een plaatselijke verheffing in de daklaag. De oorzaak en toestand van de omliggende dakbedekking bepalen of en hoe moet worden ingegrepen."],
      ["Scheuren","Scheuren kunnen ontstaan door veroudering, beweging of spanning. De lengte, plaats en ondergrond zijn relevant bij beoordeling."],
      ["Open naden","Een openstaande verbinding is een logisch aandachtspunt voor waterdichtheid, vooral rond randen, opstanden en details."]
    ]
  },
  {
    slug:"warm-dak-bitumen-isolatie",
    title:"Wat is een warm dak bij bitumen dakbedekking?",
    description:"Hoe isolatie onderdeel wordt van de dakopbouw en waarom randen, opstanden en vochttechniek mee moeten worden ontworpen.",
    sections:[
      ["Isolatie in de dakopbouw","Bij een warm dak ligt de isolatie aan de buitenzijde van de dragende constructie, onder de dakbedekking."],
      ["Details bepalen de uitvoerbaarheid","Dakrandhoogte, afvoer, opstanden en doorvoeren moeten passen bij de extra opbouwhoogte."],
      ["Geen losse isolatiekeuze","De dampremmende laag, isolatie en dakbedekking vormen samen één systeem en moeten daarom in samenhang worden beoordeeld."]
    ]
  }
] as const;


export type SpecialtyPage = {
  slug: string;
  parentService: ServiceSlug;
  title: string;
  eyebrow: string;
  intro: string;
  summary: string;
  topics: readonly { title: string; text: string }[];
  faq: readonly { question: string; answer: string }[];
  related: readonly { label: string; href: string }[];
};

export const specialtyPages: readonly SpecialtyPage[] = [
  {
    slug: "dakpannen-vervangen-breda",
    parentService: "dakpannen",
    title: "Dakpannen vervangen in Breda",
    eyebrow: "PANNENDAK · VERVANGEN",
    intro: "Wanneer losse reparaties niet meer logisch zijn, kan het vervangen van dakpannen onderdeel worden van een bredere dakrenovatie.",
    summary: "Bij dakpannen vervangen gaat het niet alleen om de zichtbare pannen. Type pan, panlatten, tengels, folie, nok en aansluitingen bepalen of alleen de bedekking of een groter deel van de dakopbouw aandacht nodig heeft.",
    topics: [
      { title: "Beton of keramiek", text: "De bestaande maatvoering en het type dakpan zijn bepalend voor een technisch passende vervanging. Betonnen sneldekpannen en keramische pannen verschillen in gewicht, vorm, maatvoering en verouderingsbeeld." },
      { title: "Onderliggende lagen", text: "Wanneer de pannen van het dak gaan, ontstaat zicht op panlatten, tengels, folie en dakbeschot. Dat is het moment om te beoordelen welke lagen nog goed functioneren en welke niet." },
      { title: "Nok, kilgoot en aansluitingen", text: "Een nieuw dakvlak is pas logisch wanneer de aansluitdetails ook waterdicht en technisch passend worden uitgevoerd. Nokvorsten, kilgoten, dakramen en schoorsteenaansluitingen horen daarom bij dezelfde beoordeling." },
      { title: "Isolatie combineren", text: "Als het pannendak toch wordt geopend kan tegelijk worden bekeken of dakisolatie praktisch in dezelfde werkzaamheden kan worden meegenomen." },
    ],
    faq: [
      { question: "Kunnen alleen de dakpannen worden vervangen?", answer: "Dat kan wanneer de onderliggende lagen nog in goede staat zijn. Daarom is eerst beoordelen belangrijker dan automatisch alle lagen vernieuwen." },
      { question: "Moeten oude panlatten altijd mee worden vervangen?", answer: "Niet automatisch. De staat, maatvoering en geschiktheid voor de gekozen dakpan bepalen of hergebruik technisch logisch is." },
      { question: "Kan ik vooraf een prijsindicatie krijgen?", answer: "Voor pannendakwerk kan de online prijsindicatie een eerste bandbreedte geven op basis van type werk, oppervlakte en bereikbaarheid." },
    ],
    related: [
      { label: "Pannendaken", href: "/dakpannen" },
      { label: "Dakfolie vervangen", href: "/dakfolie-vervangen-breda" },
      { label: "Nokvorsten repareren", href: "/nokvorsten-repareren-breda" },
      { label: "Prijsindicatie", href: "/prijsindicatie" },
    ],
  },
  {
    slug: "nokvorsten-repareren-breda",
    parentService: "dakpannen",
    title: "Nokvorsten repareren in Breda",
    eyebrow: "PANNENDAK · NOK",
    intro: "Losse, beschadigde of slecht aansluitende nokvorsten kunnen bij wind en slagregen een kwetsbaar punt van het pannendak worden.",
    summary: "De nok vormt de hoogste aansluiting van twee dakvlakken. Niet alleen de nokvorst zelf, maar ook bevestiging, onderliggende aansluiting en omliggende dakpannen bepalen welk herstel nodig is.",
    topics: [
      { title: "Losse nokvorsten", text: "Beweging, verouderde bevestiging of oude mortel kan ervoor zorgen dat nokvorsten niet meer goed vastliggen. Losse delen vragen om beoordeling voordat wind of water meer schade veroorzaakt." },
      { title: "Mortel en mechanische bevestiging", text: "Oudere nokken kunnen anders zijn opgebouwd dan moderne droge noksystemen. De bestaande uitvoering bepaalt welke herstelmethode technisch passend is." },
      { title: "Lekkage rond de nok", text: "Water dat bij de nok binnenkomt kan via folie of constructiedelen verplaatsen. De vochtplek binnen hoeft daardoor niet rechtstreeks onder de beschadigde nok te zitten." },
      { title: "Plaatselijk of complete nok", text: "Eén beschadigde nokvorst hoeft niet te betekenen dat de volledige nok moet worden vernieuwd. De staat van de rest van de nok bepaalt de omvang." },
    ],
    faq: [
      { question: "Is één losse nokvorst direct een groot probleem?", answer: "Niet altijd, maar een losliggend deel kan door wind verder bewegen en is daarom verstandig om tijdig te laten beoordelen." },
      { question: "Kan een noklekkage alleen bij harde wind optreden?", answer: "Ja. Slagregen en windrichting kunnen water op plekken brengen die bij normale regen droog blijven." },
      { question: "Kunnen nokvorsten plaatselijk worden gerepareerd?", answer: "Dat kan wanneer de rest van de nok technisch nog in voldoende staat is." },
    ],
    related: [
      { label: "Pannendaken", href: "/dakpannen" },
      { label: "Slimme lekkagecheck", href: "/dak-lekkage" },
      { label: "Dakpannen vervangen", href: "/dakpannen-vervangen-breda" },
      { label: "Dakdekker Breda", href: "/dakdekker-breda" },
    ],
  },
  {
    slug: "dakfolie-vervangen-breda",
    parentService: "dakpannen",
    title: "Dakfolie vervangen in Breda",
    eyebrow: "PANNENDAK · WATERKERING",
    intro: "Dakfolie onder de pannen is een belangrijke tweede waterkerende laag en kan bij veroudering of beschadiging een rol spelen bij terugkerende lekkage.",
    summary: "Folie is niet zichtbaar zolang het pannendak gesloten blijft. Bij terugkerende lekkage of renovatie kan juist deze laag relevant zijn, samen met panlatten, tengels, dakvoet en aansluitingen.",
    topics: [
      { title: "Functie van dakfolie", text: "De folie voert water dat onder de dakpannen komt naar beneden en beschermt de constructie als secundaire waterkering." },
      { title: "Beschadiging en veroudering", text: "Scheuren, gaten, slechte aansluitingen of een verouderde folie kunnen ervoor zorgen dat water niet meer gecontroleerd wordt afgevoerd." },
      { title: "Dakvoet en overlappingen", text: "Niet alleen het grote vlak telt. Overlappingen, dakvoet en aansluitingen rond doorvoeren en dakramen bepalen of de waterroute klopt." },
      { title: "Combineren met renovatie", text: "Omdat dakfolie onder de panlatten en dakpannen ligt, wordt volledige vervanging meestal logisch gecombineerd met werkzaamheden waarbij het dak toch wordt geopend." },
    ],
    faq: [
      { question: "Kun je dakfolie vervangen zonder dakpannen te verwijderen?", answer: "Voor volledige vervanging moet de relevante dakopbouw worden geopend. Een plaatselijke reparatie kan soms beperkter zijn, afhankelijk van de plek." },
      { question: "Kan kapotte folie lekkage veroorzaken?", answer: "Ja, maar lekkage kan ook via andere aansluitingen ontstaan. Daarom wordt eerst gekeken naar de vermoedelijke waterroute." },
      { question: "Moeten panlatten dan ook worden vervangen?", answer: "Niet automatisch. Wanneer het dak openligt kan hun staat worden beoordeeld en wordt bepaald wat technisch nodig is." },
    ],
    related: [
      { label: "Pannendaken", href: "/dakpannen" },
      { label: "Dakpannen vervangen", href: "/dakpannen-vervangen-breda" },
      { label: "Slimme lekkagecheck", href: "/dak-lekkage" },
      { label: "Dakisolatie", href: "/dak-isolatie" },
    ],
  },
  {
    slug: "bitumen-overlagen-breda",
    parentService: "betumendaken",
    title: "Bitumen dak overlagen in Breda",
    eyebrow: "PLAT DAK · OVERLAGEN",
    intro: "Een bestaande bitumenlaag overlagen kan een efficiënte renovatieroute zijn, maar alleen wanneer de bestaande ondergrond daarvoor technisch geschikt is.",
    summary: "Overlagen betekent niet simpelweg een nieuwe laag bovenop ieder oud dak. Vocht, hechting, afvoer, opstanden, dakranden en doorvoeren moeten eerst voldoende geschikt zijn.",
    topics: [
      { title: "Bestaande ondergrond", text: "De oude daklaag moet voldoende stabiel en geschikt zijn om een nieuwe laag verantwoord op aan te brengen. Losse delen of vochtproblemen kunnen een andere aanpak nodig maken." },
      { title: "Naden en details", text: "Bij renovatie verdienen naden, dakranden, opstanden en doorvoeren minstens zoveel aandacht als het grote dakvlak." },
      { title: "Afvoer en afschot", text: "Stilstaand water en slecht functionerende afvoer kunnen de levensduur van een dakopbouw beïnvloeden. Daarom wordt ook gekeken hoe water van het dak wordt afgevoerd." },
      { title: "Wanneer niet overlagen", text: "Wanneer onderliggende lagen slecht zijn, vocht opgesloten zit of de dakopbouw onvoldoende betrouwbaar is, kan volledig vernieuwen logischer zijn." },
    ],
    faq: [
      { question: "Kan ieder bitumen dak worden overlaagd?", answer: "Nee. De bestaande laag en ondergrond moeten eerst geschikt blijken." },
      { question: "Worden dakranden en afvoeren ook meegenomen?", answer: "Die details horen bij de beoordeling omdat juist daar verschillende materialen en waterstromen samenkomen." },
      { question: "Kan ik een online prijsindicatie berekenen?", answer: "Ja. In de prijsindicatie staat een aparte route voor bitumen overlagen op basis van oppervlakte en bereikbaarheid." },
    ],
    related: [
      { label: "Bitumen daken", href: "/betumendaken" },
      { label: "Bitumen dak vervangen", href: "/bitumen-dak-vervangen-breda" },
      { label: "Warm dak met bitumen", href: "/warm-dak-bitumen-breda" },
      { label: "Prijsindicatie", href: "/prijsindicatie" },
    ],
  },
  {
    slug: "bitumen-dak-vervangen-breda",
    parentService: "betumendaken",
    title: "Bitumen dak vervangen in Breda",
    eyebrow: "PLAT DAK · VERNIEUWEN",
    intro: "Wanneer alleen een nieuwe toplaag niet logisch is, kan het platte dak verder worden geopend en opnieuw worden opgebouwd.",
    summary: "Bij volledige vernieuwing kan niet alleen de bitumenlaag, maar ook de staat van ondergrond, isolatie, afvoer en randdetails worden meegenomen.",
    topics: [
      { title: "Oude lagen beoordelen", text: "Meerdere oude lagen, slechte hechting, terugkerende reparaties of vocht kunnen redenen zijn om verder te kijken dan alleen een nieuwe toplaag." },
      { title: "Ondergrond", text: "Een nieuwe dakbedekking functioneert alleen goed op een geschikte ondergrond. Beschadigde of vochtige delen moeten daarom worden meegenomen in de beoordeling." },
      { title: "Randen, opstanden en doorvoeren", text: "Een vernieuwd dakvlak moet logisch aansluiten op daktrim, muren, lichtkoepels, afvoeren en andere doorvoeren." },
      { title: "Isolatie als onderdeel van renovatie", text: "Wanneer het dak toch volledig wordt vernieuwd kan een warmdak-opbouw worden onderzocht, mits constructie en detaillering daarvoor geschikt zijn." },
    ],
    faq: [
      { question: "Wanneer is volledig vervangen beter dan overlagen?", answer: "Bij slechte of vochtige onderlagen, veel oude lagen of onbetrouwbare details kan volledige vernieuwing logischer zijn." },
      { question: "Moet isolatie altijd mee?", answer: "Niet automatisch. Wel is volledige renovatie een logisch moment om te beoordelen of isolatie kan worden verbeterd." },
      { question: "Geldt dezelfde aanpak voor garage, aanbouw en dakkapel?", answer: "De principes zijn vergelijkbaar, maar oppervlak, dakrand, afvoer en aansluitingen verschillen per dak." },
    ],
    related: [
      { label: "Bitumen daken", href: "/betumendaken" },
      { label: "Bitumen overlagen", href: "/bitumen-overlagen-breda" },
      { label: "Warm dak met bitumen", href: "/warm-dak-bitumen-breda" },
      { label: "Daklekkage", href: "/dak-lekkage" },
    ],
  },
  {
    slug: "warm-dak-bitumen-breda",
    parentService: "dak-isolatie",
    title: "Warm dak met bitumen in Breda",
    eyebrow: "PLAT DAK · ISOLATIE",
    intro: "Bij een warm dak ligt de isolatie aan de buitenzijde van de dragende constructie, onder de dakbedekking.",
    summary: "Een warmdak-opbouw vraagt om samenhang tussen dampremmende laag, isolatie, bitumen, afvoer, opstanden en dakrandhoogte. Alleen extra isolatie toevoegen is daarom niet genoeg.",
    topics: [
      { title: "Laagopbouw", text: "De dragende constructie, dampremmende laag, isolatie en dakbedekking vormen samen één systeem. De volgorde en aansluiting zijn belangrijk voor vochtgedrag en duurzaamheid." },
      { title: "Opstanden en dakrand", text: "Extra isolatiedikte verandert de hoogte van het dakpakket. Dakranden, dorpels, afvoeren en opstanden moeten daar technisch op aansluiten." },
      { title: "Afvoer", text: "Na aanpassing van de dakopbouw moet regenwater nog steeds goed naar de afvoer kunnen lopen. Afschot en hoogteverschillen horen daarom bij het ontwerp." },
      { title: "Combineren met bitumenvernieuwing", text: "Een volledige renovatie van het platte dak is een logisch moment om te beoordelen of een warmdak-opbouw praktisch uitvoerbaar is." },
    ],
    faq: [
      { question: "Is een warm dak altijd mogelijk?", answer: "Nee. Constructie, beschikbare hoogte, dakranddetails en aansluitingen bepalen wat technisch uitvoerbaar is." },
      { question: "Waarom ligt de isolatie bovenop de constructie?", answer: "Bij een warm dak blijft de dragende constructie aan de warme zijde van de isolatie, maar de complete vochttechnische opbouw moet wel kloppen." },
      { question: "Kan dit tegelijk met nieuw bitumen?", answer: "Dat is juist een logisch moment om beide onderdelen als één dakopbouw te beoordelen." },
    ],
    related: [
      { label: "Dakisolatie", href: "/dak-isolatie" },
      { label: "Bitumen daken", href: "/betumendaken" },
      { label: "Bitumen dak vervangen", href: "/bitumen-dak-vervangen-breda" },
      { label: "Prijsindicatie", href: "/prijsindicatie" },
    ],
  },
  {
    slug: "schoorsteen-lekkage-breda",
    parentService: "dak-lekkage",
    title: "Schoorsteenlekkage in Breda",
    eyebrow: "LEKKAGE · SCHOORSTEEN",
    intro: "Vocht rond een schoorsteen kan via lood, voegen, aansluitingen of omliggende dakdelen binnenkomen en hoeft niet rechtstreeks onder de zichtbare schade te zitten.",
    summary: "Een schoorsteen vormt een onderbreking in het dakvlak. Daardoor komen metselwerk, lood, dakpannen of bitumen, voegen en soms een kilgoot of andere aansluiting dicht bij elkaar samen.",
    topics: [
      { title: "Loodslabben", text: "Lood vormt de waterdichte overgang tussen schoorsteen en dakbedekking. Scheuren, slechte aansluiting of beweging kan aanleiding zijn voor gericht herstel." },
      { title: "Voeg- en metselwerk", text: "Vocht kan ook via verweerd voegwerk of beschadigd metselwerk binnendringen. De zichtbare plek binnen vertelt niet altijd welk onderdeel buiten de oorzaak is." },
      { title: "Dakpannen en aansluitingen", text: "Pannen rond de schoorsteen moeten logisch aansluiten en water afvoeren. Beschadigde pannen of onderliggende folie kunnen eveneens een rol spelen." },
      { title: "Eerst oorzaak, dan prijs", text: "Omdat meerdere onderdelen dezelfde vochtklacht kunnen veroorzaken, geeft LRS vooraf geen verzonnen reparatiebedrag. De vaste voorrijkosten zijn €75 excl. btw." },
    ],
    faq: [
      { question: "Wat kost een bezoek voor schoorsteenlekkage?", answer: "De vaste voorrijkosten zijn €75 excl. btw (€90,75 incl. btw). Reparatiekosten worden pas besproken nadat duidelijk is wat werkelijk moet worden hersteld." },
      { question: "Is lood altijd de oorzaak?", answer: "Nee. Ook voegen, metselwerk, dakpannen, folie of een andere aansluiting kunnen relevant zijn." },
      { question: "Kan ik vooraf foto's sturen?", answer: "Ja. Vul eerst de slimme lekkagecheck in en voeg daarna foto's toe in WhatsApp. Dat geeft LRS vóór het bezoek meer context." },
    ],
    related: [
      { label: "Slimme lekkagecheck", href: "/dak-lekkage" },
      { label: "Schoorsteen verwijderen", href: "/schoorsteen-verwijderen" },
      { label: "Pannendaken", href: "/dakpannen" },
      { label: "Dakdekker Breda", href: "/dakdekker-breda" },
    ],
  },
];

export type Project = {
  slug: string;
  title: string;
  place: string;
  serviceSlug: ServiceSlug;
  summary: string;
  facts: readonly { label: string; value: string }[];
  sections: readonly { title: string; text: string }[];
  imageUrls: readonly string[];
};

export const projects: readonly Project[] = [];

export function whatsapp(message="Hallo LRS Daktechniek, ik heb een vraag over mijn dak.") {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function serviceBySlug(slug:string) {
  return services.find(s => s.slug === slug);
}
export function locationBySlug(slug:string) {
  const row = locations.find(l => l[0] === slug);
  return row ? { slug: row[0], name: row[1], tier: row[2] } : undefined;
}
export function articleBySlug(slug:string) {
  return articles.find(a => a.slug === slug);
}
export function specialtyBySlug(slug:string) {
  return specialtyPages.find(page => page.slug === slug);
}

export function projectBySlug(slug:string) {
  return projects.find(p => p.slug === slug);
}
