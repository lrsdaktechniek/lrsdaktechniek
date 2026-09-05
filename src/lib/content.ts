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
  }
] as const;

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
