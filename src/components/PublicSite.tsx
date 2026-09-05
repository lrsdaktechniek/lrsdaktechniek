"use client";

import Link from "next/link";
import {
  FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  articles,
  articleBySlug,
  bredaPage,
  locationBySlug,
  locations,
  projectBySlug,
  projects,
  serviceBySlug,
  serviceDetails,
  services,
  site,
  whatsapp,
} from "@/lib/content";

type LayerId = "tile" | "batten" | "counter" | "membrane" | "deck" | "insulation";

type ServiceVisual = {
  angle: string;
  layers: LayerId[];
  material: string;
  details: string[];
};

const serviceVisuals: Record<string, ServiceVisual> = {
  dakpannen: { angle: "40°", layers: ["tile", "batten", "counter"], material: "MAT-01", details: ["A", "B"] },
  betumendaken: { angle: "3°", layers: ["membrane", "deck", "insulation"], material: "MAT-03", details: ["D"] },
  "dak-lekkage": { angle: "40°", layers: ["membrane", "deck"], material: "MAT-06", details: ["A", "B", "C", "D"] },
  "dak-isolatie": { angle: "40°", layers: ["insulation", "membrane"], material: "MAT-05", details: ["B"] },
  "schoorsteen-verwijderen": { angle: "90°", layers: ["tile", "membrane", "deck"], material: "MAT-06", details: ["C"] },
};

const layerData: Array<{ id: LayerId; code: string; name: string; note: string }> = [
  { id: "tile", code: "L01", name: "Dakpan", note: "Buitenste laag die regen en wind opvangt." },
  { id: "batten", code: "L02", name: "Panlat", note: "Draagt de dakpannen en bepaalt de latafstand." },
  { id: "counter", code: "L03", name: "Tengel", note: "Creëert ventilatie en waterafvoer onder de latten." },
  { id: "membrane", code: "L04", name: "Folie", note: "Secundaire waterkerende laag onder de dakbedekking." },
  { id: "deck", code: "L05", name: "Dakbeschot", note: "Constructieve ondergrond van de dakopbouw." },
  { id: "insulation", code: "L06", name: "Isolatie", note: "Thermische laag; opbouw moet vochttechnisch kloppen." },
];

const jouwWebAssets = {
  original:
    "https://primary.jwwb.nl/public/n/o/p/temp-uvukeikpledfyiineqcq/img_0708-high.jpg?enable-io=true&width=2200",
  logo:
    "https://primary.jwwb.nl/public/n/o/p/temp-uvukeikpledfyiineqcq/img_0708-high.jpg?enable-io=true&width=520",
} as const;

const editorialImages = {
  hero: jouwWebAssets.original,
  slate: jouwWebAssets.original,
  terracotta: jouwWebAssets.original,
} as const;


function Waterline() {
  const progressRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = progressRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    let frame = 0;
    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / max));
      path.style.strokeDashoffset = `${length * (1 - progress)}`;
      frame = 0;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="waterline-shell" aria-hidden="true">
      <svg viewBox="0 0 120 1000" preserveAspectRatio="none">
        <path className="waterline-base" d="M60 0 L60 180 L78 245 L60 310 L60 520 L46 600 L60 680 L60 1000" />
        <path ref={progressRef} className="waterline-progress" d="M60 0 L60 180 L78 245 L60 310 L60 520 L46 600 L60 680 L60 1000" />
      </svg>
    </div>
  );
}

function Header() {
  return (
    <>
      <div className="utility-bar">
        <div className="shell utility-inner">
          <span className="annotation">DAKDEKKER / BREDA E.O.</span>
          <div className="utility-data">
            <span className="annotation">{site.shortHours}</span>
            <a className="mono" href={`tel:${site.phoneHref}`}>{site.phoneDisplay}</a>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="shell header-inner">
          <Link href="/" className="wordmark brand-with-original" aria-label="LRS Daktechniek homepage">
            <span className="original-logo-frame">
              <img src={jouwWebAssets.logo} alt="LRS Daktechniek" />
            </span>
            <span className="brand-text-fallback"><strong>LRS</strong><span>DAKTECHNIEK</span></span>
          </Link>
          <nav className="desktop-nav" aria-label="Hoofdnavigatie">
            <Link href="/diensten">Diensten</Link>
            <Link href="/dakcheck">Dakcheck</Link>
            <Link href="/prijsindicatie">Prijsindicatie</Link>
            <Link href="/werkgebied">Werkgebied</Link>
            <Link href="/blog-s">Kennisbank</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <a className="header-phone mono" href={`tel:${site.phoneHref}`}>{site.phoneDisplay}</a>
          <details className="mobile-menu">
            <summary aria-label="Menu openen"><span/><span/></summary>
            <div className="mobile-menu-panel">
              {["diensten","dakcheck","prijsindicatie","werkgebied","blog-s","contact"].map((slug) => (
                <Link key={slug} href={`/${slug}`}>{slug === "blog-s" ? "Kennisbank" : slug.charAt(0).toUpperCase()+slug.slice(1)}</Link>
              ))}
              <a className="mono" href={`tel:${site.phoneHref}`}>{site.phoneDisplay}</a>
            </div>
          </details>
        </div>
      </header>
    </>
  );
}

function SectionIndex({ n, label, dark=false }: { n: string; label: string; dark?: boolean }) {
  return <div className={`section-index ${dark ? "on-dark" : ""}`}><span className="mono">{n}</span><span className="annotation">{label}</span></div>;
}

function DimensionLine({ value, dark=false }: { value: string; dark?: boolean }) {
  return <div className={`dimension-line ${dark ? "on-dark" : ""}`}><i/><span className="mono">{value}</span><i/></div>;
}

function Hero() {
  return (
    <section className="hero-photo-v3">
      <div className="hero-photo-layer" aria-hidden="true">
        <img src={editorialImages.hero} alt="" fetchPriority="high" />
        <div className="hero-photo-shade"/>
      </div>

      <svg className="hero-waterproof-line" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
        <line x1="0" y1="735" x2="1600" y2="120"/>
        <line className="hero-angle-tick" x1="1214" y1="247" x2="1247" y2="277"/>
      </svg>

      <div className="shell hero-photo-content">
        <div className="hero-photo-copy">
          <SectionIndex n="01" label="BREDA E.O." dark/>
          <p className="annotation hero-code">LRS / DAKWERK / DIRECT CONTACT</p>
          <h1><span>DAKDEKKER BREDA</span> LRS DAKTECHNIEK</h1>
          <p className="hero-statement">U spreekt de dakdekker die het werk uitvoert.</p>

          <div className="hero-actions-v3">
            <Link className="btn hero-primary" href="/prijsindicatie">PRIJSINDICATIE</Link>
            <a className="hero-phone mono" href={`tel:${site.phoneHref}`}>{site.phoneDisplay}</a>
          </div>

          <Link className="hero-dakcheck-link" href="/dakcheck">
            Ik weet niet wat er nodig is <span>→</span>
          </Link>
        </div>

        <div className="hero-spec-panel">
          <span className="annotation">ORIGINEEL LRS-BEELD / JOUWWEB</span>
          <div className="hero-spec-row"><span>HELLING</span><strong className="mono">40°</strong></div>
          <div className="hero-spec-row"><span>REGIO</span><strong>BREDA E.O.</strong></div>
          <div className="hero-spec-row"><span>CONTACT</span><strong>DIRECT MET LRS</strong></div>
          <small>Origineel beeld uit de bestaande LRS JouwWeb-site. Niet als nieuw projectbewijs gepresenteerd.</small>
        </div>
      </div>
    </section>
  );
}

const situations = [
  ["Er lekt water", "DAKLEKKAGE", "Gericht brononderzoek", "/dak-lekkage"],
  ["Pannen liggen los of zijn beschadigd", "PANNENDAK", "Inspectie op locatie", "/dakpannen"],
  ["Mijn platte dak wordt oud", "BITUMEN", "Opbouw beoordelen", "/betumendaken"],
  ["Het blijft koud onder het dak", "DAKISOLATIE", "Opbouw en vocht controleren", "/dak-isolatie"],
  ["De schoorsteen gebruik ik niet meer", "SCHOORSTEEN", "Verwijderen + dak sluiten", "/schoorsteen-verwijderen"],
  ["Ik weet niet wat er aan de hand is", "DAKCHECK", "Stap voor stap bepalen", "/dakcheck"],
] as const;

function SituationRouter() {
  return (
    <section className="situation-zone dark-zone">
      <div className="shell">
        <SectionIndex n="02" label="SITUATIE" dark/>
        <div className="section-heading split-heading dark-heading">
          <h2>Begin bij wat u ziet.</h2>
          <p>U hoeft geen technische diagnose te kennen. Kies de situatie die het dichtst in de buurt komt.</p>
        </div>
        <div className="situation-table">
          {situations.map(([human, technical, result, href], i) => (
            <Link href={href} key={human} className="situation-row">
              <span className="mono row-index">{String(i+1).padStart(2,"0")}</span>
              <strong>{human}</strong>
              <span className="annotation technical-label">{technical}</span>
              <span className="row-result">{result}</span>
              <span className="row-arrow">↗</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function RoofAssembly({ focus=[] }: { focus?: LayerId[] }) {
  const initial = focus[0] ?? "membrane";
  const [active, setActive] = useState<LayerId>(initial);
  const activeLayer = layerData.find((x) => x.id === active)!;

  const isOn = (id: LayerId) => active === id || focus.includes(id);

  return (
    <div className="assembly-layout">
      <div className="assembly-drawing">
        <div className="drawing-title"><span className="annotation">PRINCIPE / HELLEND DAK</span><span className="mono">SCHAAL 1:10</span></div>
        <svg viewBox="0 0 900 600" role="img" aria-label="Technische doorsnede van een hellend dak">
          <defs>
            <pattern id="tilePattern" width="32" height="18" patternUnits="userSpaceOnUse"><path d="M0 16 Q8 5 16 16 T32 16" fill="none"/></pattern>
            <pattern id="insPattern" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M0 11 6 2 12 20 18 2 22 11" fill="none"/></pattern>
          </defs>
          <g className="assembly-base-lines">
            <polygon className={`layer-shape ${isOn("insulation") ? "is-active" : ""}`} points="180,455 690,170 730,205 220,490" />
            <polygon className={`layer-shape ${isOn("deck") ? "is-active" : ""}`} points="165,430 675,145 690,170 180,455" />
            <polygon className={`layer-shape layer-thin ${isOn("membrane") ? "is-active" : ""}`} points="155,413 665,128 675,145 165,430" />
            <g className={isOn("counter") ? "is-active-stroke" : ""}>
              {[0,100,200,300,400].map((n)=><line key={n} x1={230+n} y1={385-n*.56} x2={245+n} y2={410-n*.56}/>)}
            </g>
            <g className={isOn("batten") ? "is-active-stroke" : ""}>
              {[0,55,110,165,220,275,330,385].map((n)=><line key={n} x1={205+n} y1={385-n*.56} x2={265+n} y2={420-n*.56}/>)}
            </g>
            <polygon className={`tile-roof ${isOn("tile") ? "is-active-stroke" : ""}`} points="130,365 640,80 670,125 160,410" fill="url(#tilePattern)"/>
            <polygon className={`insulation-pattern ${isOn("insulation") ? "is-active-stroke" : ""}`} points="225,488 730,205 770,250 265,533" fill="url(#insPattern)"/>
          </g>
          <g className="drawing-dimensions">
            <line x1="120" y1="545" x2="770" y2="180"/><line x1="116" y1="536" x2="124" y2="554"/><line x1="766" y1="171" x2="774" y2="189"/>
            <rect x="420" y="352" width="96" height="28"/><text x="468" y="371" textAnchor="middle">40° / OPBOUW</text>
          </g>
        </svg>
        <div className="detail-bubble bubble-a mono">A</div>
        <div className="detail-bubble bubble-b mono">B</div>
      </div>
      <div className="layer-register">
        <p className="annotation">LAGENREGISTER</p>
        {layerData.map((layer) => (
          <button key={layer.id} onClick={() => setActive(layer.id)} className={active === layer.id ? "layer-row active" : "layer-row"}>
            <span className="mono layer-code">{layer.code}</span>
            <span><strong>{layer.name}</strong><small>{active === layer.id ? layer.note : "Bekijk laag"}</small></span>
            <span className="layer-state mono">{active === layer.id ? "ACTIEF" : "+"}</span>
          </button>
        ))}
        <div className="active-layer-note">
          <span className="annotation">ACTIEVE LAAG</span>
          <strong>{activeLayer.name}</strong>
          <p>{activeLayer.note}</p>
        </div>
      </div>
    </div>
  );
}

const materials = [
  ["MAT-01", "KERAMISCHE DAKPAN", "typ-pan", "dakbedekking"],
  ["MAT-02", "BETONPAN", "typ-concrete", "dakbedekking"],
  ["MAT-03", "BITUMEN TOPLAAG", "typ-bitumen", "platte daken"],
  ["MAT-04", "PANLAT VUREN", "typ-wood", "draaglaag"],
  ["MAT-05", "ISOLATIE", "typ-insulation", "thermische laag"],
  ["MAT-06", "METAALAANSLUITING", "typ-metal", "detailwerk"],
] as const;

function MaterialState() {
  return (
    <div className="material-state">
      {materials.map(([code,name,pattern,role]) => (
        <article key={code} className="material-cell">
          <div className={`material-swatch ${pattern}`} aria-hidden="true"/>
          <div className="material-meta"><span className="mono material-code">{code}</span><strong>{name}</strong><small>{role}</small></div>
          <DimensionLine value="MATERIAALSTAAT"/>
        </article>
      ))}
    </div>
  );
}

function MeasuredArea({ area=50, dark=false }: { area?: number; dark?: boolean }) {
  const sideA = Math.max(4, Math.sqrt(Math.max(1, area)) * 1.15);
  const sideB = Math.max(3, area / sideA);
  return (
    <div className={`measured-area ${dark ? "on-dark" : ""}`}>
      <div className="measure-top"><i/><span className="mono">{sideA.toFixed(1)} M</span><i/></div>
      <div className="measure-box"><span className="mono">{area.toFixed(0)} M²</span><div className="measure-hatch"/></div>
      <div className="measure-side"><i/><span className="mono">{sideB.toFixed(1)} M</span><i/></div>
    </div>
  );
}

function PrincipleGraphic({ kind }: { kind: "tile" | "leak" | "bitumen" | "chimney" }) {
  if (kind === "tile") return <svg viewBox="0 0 400 220" aria-hidden="true"><path d="M40 160 190 72 350 160"/><path className="failure" d="M183 76 203 95 186 110"/><path d="M65 160h260"/><path d="M95 143h195"/></svg>;
  if (kind === "leak") return <svg viewBox="0 0 400 220" aria-hidden="true"><path d="M45 75h300v80H45z"/><path d="M120 75v80M280 75v80"/><path className="failure" d="M210 74c0 35-28 44-28 82 0 20 8 33 18 46"/><circle className="failure-fill" cx="210" cy="74" r="6"/></svg>;
  if (kind === "bitumen") return <svg viewBox="0 0 400 220" aria-hidden="true"><path d="M45 75h310"/><path d="M45 92h310"/><path d="M45 118h310"/><path d="M45 153h310"/><path className="failure" d="M165 75h110"/><path d="M170 55 190 75M270 55 250 75"/></svg>;
  return <svg viewBox="0 0 400 220" aria-hidden="true"><path d="M40 155 180 85 360 155"/><rect x="205" y="35" width="72" height="112"/><path d="M190 146h105"/><path className="failure" d="M194 138h108"/><path d="M211 147v20M271 147v20"/></svg>;
}

function NotNeededSection() {
  const items = [
    { title:"Eén gebroken pan betekent geen nieuw dak.", kind:"tile" as const, inspect:"VERVANGEN", keep:"panlat · tengel · folie · beschot" },
    { title:"Een vochtplek betekent niet dat het hele dak slecht is.", kind:"leak" as const, inspect:"ONDERZOEKEN", keep:"dakvlak buiten het faalpunt" },
    { title:"Een oude bitumenlaag hoeft niet altijd verwijderd.", kind:"bitumen" as const, inspect:"BEOORDELEN", keep:"hechting · vocht · ondergrond" },
  ];
  return (
    <div className="not-needed-grid">
      {items.map((item,i)=>(
        <article className="principle-card failure-card" key={item.title}>
          <div className="principle-head"><span className="annotation">PRINCIPEDETAIL — NIET PROJECTGEBONDEN</span><span className="mono">F{String(i+1).padStart(2,"0")}</span></div>
          <PrincipleGraphic kind={item.kind}/>
          <h3>{item.title}</h3>
          <dl><div><dt className="annotation">{item.inspect}</dt><dd>alleen het werkelijke probleem</dd></div><div><dt className="annotation">BEHOUDEN</dt><dd>{item.keep}</dd></div></dl>
        </article>
      ))}
    </div>
  );
}

const detailSpecs = [
  ["A","NOKAANSLUITING","tile","Aansluiting, bevestiging en waterkering rond de nok."],
  ["B","DAKVOET","leak","Afvoerroute aan de onderzijde van de dakopbouw."],
  ["C","SCHOORSTEENAANSLUITING","chimney","Overgang tussen metselwerk, aansluiting en dakvlak."],
  ["D","BITUMEN AFVOER","bitumen","Detail bij naad, afvoer en opstand van een plat dak."],
] as const;

function PrincipleDetails({ only }: { only?: string[] }) {
  const visible = only?.length ? detailSpecs.filter(([letter])=>only.includes(letter)) : [...detailSpecs];
  return (
    <div className="principle-grid">
      {visible.map(([letter,title,kind,note]) => (
        <article className="principle-card" key={letter}>
          <div className="principle-head"><span className="annotation">PRINCIPEDETAIL — NIET PROJECTGEBONDEN</span><span className="detail-bubble static mono">{letter}</span></div>
          <PrincipleGraphic kind={kind}/>
          <div className="principle-copy"><span className="mono">DETAIL {letter} / SCHAAL N.T.S.</span><h3>{title}</h3><p>{note}</p></div>
        </article>
      ))}
    </div>
  );
}

function SingleContactTable() {
  const steps = ["Aanvraag","Inspectie op locatie","Offerte","Uitvoering","Oplevering"];
  return <div className="single-contact-table">{steps.map((step,i)=><div key={step}><span className="mono">{String(i+1).padStart(2,"0")}</span><strong>{step}</strong><span className="annotation">AANSPREEKPUNT</span><b>LRS</b></div>)}</div>;
}

function RealWorkAreaMap() {
  const areaNames = locations.map((l) => l[1]);
  return (
    <div className="real-workarea-map">
      <div className="real-map-frame">
        <iframe
          title="Werkgebied LRS Daktechniek rond Breda"
          src="https://www.openstreetmap.org/export/embed.html?bbox=4.4700%2C51.4100%2C4.9800%2C51.7200&layer=mapnik&marker=51.5719%2C4.7683"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="real-map-badge">
          <span className="premium-kicker on-dark">WERKGEBIED</span>
          <strong>Breda & omgeving</strong>
          <small>Interactieve kaart · centrum op Breda</small>
        </div>
      </div>
      <div className="real-map-copy">
        <span className="premium-kicker">ACTIEF WERKGEBIED</span>
        <h2>Werkgebied rond Breda.</h2>
        <p>
          LRS Daktechniek werkt vanuit Breda in de omliggende plaatsen. De kaart hieronder
          toont de echte regio; de plaatsnamen zijn direct gekoppeld aan hun eigen pagina.
        </p>
        <div className="real-map-places">
          {areaNames.map((name) => <span key={name}>{name}</span>)}
        </div>
      </div>
    </div>
  );
}

function EditorialMaterialBand() {
  return (
    <section className="editorial-material-band work-zone">
      <div className="shell editorial-material-grid">
        <figure className="editorial-photo editorial-photo-large">
          <img src={editorialImages.slate} alt="Origineel LRS Daktechniek beeld uit de JouwWeb-site" loading="lazy"/>
          <figcaption><span className="annotation">ORIGINEEL LRS-BEELD / JOUWWEB</span><strong>Textuur, ritme en detaillering.</strong></figcaption>
        </figure>
        <figure className="editorial-photo editorial-photo-small">
          <img src={editorialImages.terracotta} alt="Origineel LRS Daktechniek beeld uit de JouwWeb-site" loading="lazy"/>
          <figcaption><span className="annotation">ORIGINEEL LRS-BEELD / JOUWWEB</span><strong>Het dak moet er ook strak uitzien.</strong></figcaption>
        </figure>
        <div className="editorial-note">
          <span className="mono">02A</span>
          <p className="annotation">BEELD + TECHNIEK</p>
          <h2>Niet alleen tekenen. Ook materiaal laten voelen.</h2>
          <p>De technische lijnen blijven de identiteit dragen, maar het beeld komt nu uit de bestaande LRS JouwWeb-site in plaats van uit een stockbibliotheek. We presenteren het niet als een nieuw of verzonnen project.</p>
        </div>
      </div>
    </section>
  );
}


function PremiumHomeServices() {
  return (
    <section className="premium-services-section">
      <div className="shell">
        <div className="premium-section-head">
          <div>
            <span className="premium-kicker">ONZE DIENSTEN</span>
            <h2>Alles aan uw dak.<br/><em>Eén aanspreekpunt.</em></h2>
          </div>
          <p>
            Van een losse pan tot een compleet dak. U krijgt direct duidelijkheid over
            wat er nodig is en met wie u spreekt.
          </p>
        </div>

        <div className="premium-service-rail">
          {services.map((service, index) => (
            <Link className="premium-service-row" href={`/${service.slug}`} key={service.slug}>
              <span className="premium-service-index mono">{String(index + 1).padStart(2, "0")}</span>
              <div className="premium-service-main">
                <small>{service.eyebrow}</small>
                <h3>{service.name}</h3>
                <p>{service.intro}</p>
              </div>
              <span className="premium-service-arrow">↗</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function PremiumImageStory() {
  return (
    <section className="premium-image-story">
      <div className="premium-image-story-media">
        <img
          src={editorialImages.slate}
          alt="LRS Daktechniek"
          loading="lazy"
        />
      </div>
      <div className="premium-image-story-overlay"/>
      <div className="shell premium-image-story-content">
        <span className="premium-kicker on-dark">LRS DAKTECHNIEK · BREDA</span>
        <h2>Geen doorschuiven.<br/>Geen onduidelijkheid.</h2>
        <p>
          U spreekt rechtstreeks met LRS. Van de eerste vraag tot de uitvoering blijft
          de lijn kort en duidelijk.
        </p>
        <div className="premium-image-facts">
          <div><span>01</span><strong>Direct contact</strong></div>
          <div><span>02</span><strong>Duidelijke prijsroute</strong></div>
          <div><span>03</span><strong>Breda & omgeving</strong></div>
        </div>
      </div>
    </section>
  );
}

function HomeIssueRouter() {
  return (
    <section className="premium-issue-section">
      <div className="shell">
        <div className="premium-section-head">
          <div>
            <span className="premium-kicker">WAT SPEELT ER?</span>
            <h2>Begin bij wat u ziet.<br/><em>Wij vertalen het naar dakwerk.</em></h2>
          </div>
          <p>U hoeft zelf geen technische diagnose te stellen.</p>
        </div>

        <div className="premium-issue-grid">
          {situations.map(([human, technical, result, href], index) => (
            <Link href={href} className="premium-issue-card" key={human}>
              <div className="premium-issue-top">
                <span className="mono">{String(index + 1).padStart(2, "0")}</span>
                <span>↗</span>
              </div>
              <h3>{human}</h3>
              <div className="premium-issue-meta">
                <span>{technical}</span>
                <small>{result}</small>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomePriceSpotlight() {
  return (
    <section className="premium-price-section">
      <div className="shell premium-price-grid">
        <div className="premium-price-copy">
          <span className="premium-kicker">PRIJSINDICATIE</span>
          <h2>Geen “vanaf-prijs” die nergens op slaat.</h2>
          <p>
            Vul daktype, werkzaamheden, oppervlakte en bereikbaarheid in. De calculator
            rekent direct een prijsband uit, inclusief btw.
          </p>
          <Link className="premium-cta" href="/prijsindicatie">
            BEREKEN MIJN PRIJS <span>→</span>
          </Link>
        </div>

        <div className="premium-calc-preview">
          <div className="premium-calc-top">
            <span>ONLINE REKENMACHINE</span>
            <b className="mono">LIVE</b>
          </div>
          <div className="premium-calc-line">
            <span>TYPE DAK</span><strong>PANNENDAK / BITUMEN</strong>
          </div>
          <div className="premium-calc-line">
            <span>OPPERVLAKTE</span><strong className="mono">M²</strong>
          </div>
          <div className="premium-calc-line">
            <span>BEREIKBAARHEID</span><strong>GOED · NORMAAL · MOEILIJK</strong>
          </div>
          <div className="premium-calc-result">
            <small>UITKOMST</small>
            <strong>Direct een prijsband</strong>
            <span>excl. + incl. 21% btw</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function PremiumWhyLRS() {
  const points = [
    ["01", "Eerst kijken wat echt nodig is", "Geen complete renovatie adviseren als gericht herstel voldoende is."],
    ["02", "Rechtstreeks contact", "Geen grote organisatie of wisselende aanspreekpunten tussen aanvraag en uitvoering."],
    ["03", "Duidelijkheid vooraf", "Een prijsroute, duidelijke uitleg en een logische vervolgstap voordat het werk begint."],
  ];

  return (
    <section className="premium-why-section">
      <div className="shell">
        <div className="premium-section-head">
          <div>
            <span className="premium-kicker">WAAROM LRS</span>
            <h2>Rust in een branche<br/><em>waar vertrouwen alles is.</em></h2>
          </div>
        </div>
        <div className="premium-why-grid">
          {points.map(([n, title, copy]) => (
            <article key={n}>
              <span className="mono">{n}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Home() {
  return (
    <>
      <Hero/>

      <section className="premium-trust-strip">
        <div className="shell">
          <div><span className="mono">01</span><strong>Direct met LRS</strong><small>één aanspreekpunt</small></div>
          <div><span className="mono">02</span><strong>Dakwerk in Breda</strong><small>en omliggende plaatsen</small></div>
          <div><span className="mono">03</span><strong>Prijsindicatie online</strong><small>direct inzicht in kosten</small></div>
        </div>
      </section>

      <PremiumHomeServices/>
      <PremiumImageStory/>
      <HomeIssueRouter/>
      <HomePriceSpotlight/>
      <PremiumWhyLRS/>

      <section className="premium-contact-section">
        <div className="shell premium-contact-grid">
          <div>
            <span className="premium-kicker">ÉÉN AANSPREEKPUNT</span>
            <h2>Van eerste vraag<br/>tot oplevering.</h2>
            <p>
              U hoeft niet telkens opnieuw uw verhaal uit te leggen. De contactlijn blijft
              kort en praktisch.
            </p>
            <a className="premium-phone mono" href={`tel:${site.phoneHref}`}>{site.phoneDisplay}</a>
          </div>
          <SingleContactTable/>
        </div>
      </section>

      <section className="dark-zone premium-area-section">
        <div className="shell">
          <div className="premium-section-head dark">
            <div>
              <span className="premium-kicker on-dark">WERKGEBIED</span>
              <h2>Breda als basis.<br/><em>De regio eromheen.</em></h2>
            </div>
            <p>Bekijk de plaatsen waar LRS Daktechniek actief is.</p>
          </div>
          <RealWorkAreaMap/>
        </div>
      </section>
    </>
  );
}

function PageHero({ eyebrow, title, lead, angle="40°" }: { eyebrow: string; title: string; lead?: string; angle?: string }) {
  return (
    <section className="premium-page-hero">
      <div className="premium-page-hero-media">
        <img src={editorialImages.slate} alt="" aria-hidden="true" loading="eager"/>
        <div className="premium-page-hero-shade"/>
      </div>
      <div className="shell premium-page-hero-content">
        <div>
          <span className="premium-kicker on-dark">{eyebrow}</span>
          <h1>{title}</h1>
          {lead && <p>{lead}</p>}
          <div className="premium-page-actions">
            <Link className="premium-cta light" href="/prijsindicatie">PRIJSINDICATIE <span>→</span></Link>
            <a className="premium-page-phone mono" href={`tel:${site.phoneHref}`}>{site.phoneDisplay}</a>
          </div>
        </div>
        <div className="premium-angle-card">
          <span className="mono">{angle}</span>
          <small>DAKDETAIL</small>
        </div>
      </div>
    </section>
  );
}

function CTA({ title="Niet zeker wat uw dak nodig heeft?" }: { title?: string }) {
  return <section className="cta-v2"><div><p className="annotation">VOLGENDE STAP</p><h2>{title}</h2><p>Start met de Dakcheck, vraag een prijsindicatie op of neem direct contact op.</p></div><div className="cta-actions-v2"><Link className="btn primary-dark" href="/dakcheck">START DAKCHECK</Link><Link className="text-action" href="/prijsindicatie">Prijsindicatie →</Link><a className="mono" href={`tel:${site.phoneHref}`}>{site.phoneDisplay}</a></div></section>;
}

function LeakagePage() {
  const [roofType, setRoofType] = useState("Pannendak");
  const [visibleAt, setVisibleAt] = useState("Plafond / zolder");
  const [trigger, setTrigger] = useState("Bij harde of langdurige regen");
  const [outsideSign, setOutsideSign] = useState("Niet bekend");
  const [roofDetail, setRoofDetail] = useState("Geen / weet ik niet");
  const [access, setAccess] = useState("Normaal bereikbaar");
  const [urgency, setUrgency] = useState("Actief maar beheersbaar");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [intakeReady, setIntakeReady] = useState(false);

  const calloutExVat = 75;
  const calloutInclVat = calloutExVat * 1.21;
  const euro = (value:number) => new Intl.NumberFormat("nl-NL", { style:"currency", currency:"EUR", minimumFractionDigits:2 }).format(value);

  const leakRoute = useMemo(() => {
    if (urgency === "Water druppelt nu binnen" || urgency === "Gevolgschade neemt toe") {
      return {
        code: "PRIORITEIT / ACTIEVE LEKKAGE",
        title: "Actieve waterinloop eerst lokaliseren",
        copy: "De eerste prioriteit is bepalen waar het water binnenkomt en verdere gevolgschade beperken. De uiteindelijke herstelprijs hangt af van de gevonden oorzaak.",
      };
    }
    if (trigger === "Ook zonder regen") {
      return {
        code: "OORZAAK EERST BEVESTIGEN",
        title: "Niet automatisch een daklek aannemen",
        copy: "Vocht zonder regen kan ook samenhangen met condens, leidingwerk of een andere vochtbron. Eerst wordt bepaald of het probleem daadwerkelijk uit het dak komt.",
      };
    }
    if (visibleAt === "Meerdere plekken" || roofDetail === "Meerdere aansluitingen") {
      return {
        code: "BREED LEKKAGEONDERZOEK",
        title: "Meerdere mogelijke intredepunten",
        copy: "Omdat het vocht op meerdere plekken zichtbaar is of meerdere aansluitingen aanwezig zijn, is een bredere controle logischer dan één plek direct repareren.",
      };
    }
    if (
      visibleAt === "Muur / schoorsteen" ||
      roofDetail === "Schoorsteen aanwezig" ||
      roofDetail === "Kilgoot aanwezig" ||
      roofDetail === "Dakraam / doorvoer aanwezig" ||
      outsideSign === "Probleem bij schoorsteen of lood"
    ) {
      return {
        code: "AANSLUITING / DAKDETAIL",
        title: "Waarschijnlijk eerst een aansluiting controleren",
        copy: "De opgegeven situatie wijst naar een detailzone zoals lood, schoorsteen, kilgoot, dakraam of doorvoer. Zulke aansluitingen vragen een andere controle dan het gewone dakvlak.",
      };
    }
    if (
      outsideSign === "Kapotte / verschoven pan" ||
      outsideSign === "Scheur / blaas in bitumen" ||
      outsideSign === "Probleem bij afvoer of dakrand"
    ) {
      return {
        code: "WAARSCHIJNLIJK LOKAAL DAKPROBLEEM",
        title: "Er is al een concreet aandachtspunt zichtbaar",
        copy: "De ingevulde informatie geeft een duidelijke plek om als eerste te controleren. Pas op locatie kan worden bevestigd of dit ook werkelijk de oorzaak van de lekkage is.",
      };
    }
    return {
      code: "GERICHT LEKKAGEONDERZOEK",
      title: "De bron is vooraf nog niet betrouwbaar vast te stellen",
      copy: "De lekkagecheck beperkt het zoekgebied, maar er is nog geen betrouwbare reden om vooraf een reparatieprijs te noemen. De oorzaak wordt eerst op locatie vastgesteld.",
    };
  }, [urgency, trigger, visibleAt, roofDetail, outsideSign]);

  const firstChecks = useMemo(() => {
    const checks:string[] = [];
    if (roofType === "Pannendak") checks.push("dakpannen, nok en folie");
    if (roofType === "Bitumen / plat dak") checks.push("naden, opstanden en afvoer");
    if (roofDetail === "Schoorsteen aanwezig") checks.push("lood, voegen en schoorsteenaansluiting");
    if (roofDetail === "Kilgoot aanwezig") checks.push("kilgoot en aansluitende dakvlakken");
    if (roofDetail === "Dakraam / doorvoer aanwezig") checks.push("dakraam of doorvoer rondom");
    if (outsideSign === "Probleem bij afvoer of dakrand") checks.push("afvoer en dakrand");
    if (!checks.length) checks.push("waarschijnlijke waterintrede en omliggende dakdetails");
    return checks;
  }, [roofType, roofDetail, outsideSign]);

  const mapsUrl = address.trim()
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.trim())}`
    : "";

  const leakageWhatsapp = whatsapp([
    "Hallo LRS Daktechniek, ik wil een daklekkage laten beoordelen.",
    `Daktype: ${roofType}`,
    `Waar zichtbaar: ${visibleAt}`,
    `Wanneer lekt het: ${trigger}`,
    `Wat is buiten zichtbaar: ${outsideSign}`,
    `Dakdetail: ${roofDetail}`,
    `Bereikbaarheid: ${access}`,
    `Urgentie: ${urgency}`,
    `Adres: ${address || "nog niet ingevuld"}`,
    mapsUrl ? `Google Maps: ${mapsUrl}` : "Google Maps: adres nog niet ingevuld",
    notes ? `Extra uitleg: ${notes}` : "Extra uitleg: geen",
    `Slimme voorinschatting: ${leakRoute.code} — ${leakRoute.title}`,
    `Eerst controleren: ${firstChecks.join(", ")}`,
    `Voorrijkosten: ${euro(calloutExVat)} excl. btw / ${euro(calloutInclVat)} incl. btw`,
    "Reparatieprijs: pas na vaststelling van de oorzaak, vóór uitvoering bespreken.",
    "Ik kan in WhatsApp eventueel foto's van de lekkage meesturen.",
  ].join("\n"));

  const causes = [
    ["01", "Kapotte of verschoven dakpannen", "Wind, ouderdom of een beschadigde pan kan water onder de dakbedekking laten komen."],
    ["02", "Nokvorsten en aansluitingen", "Losse nokvorsten, verouderde mortel of aansluitdetails kunnen bij slagregen water doorlaten."],
    ["03", "Schoorsteen, lood en kilgoot", "Lekkages ontstaan vaak bij loodslabben, voegen, schoorsteenaansluitingen of een vervuilde of beschadigde kilgoot."],
    ["04", "Bitumen en platte daken", "Scheurtjes, blazen, open naden, afvoeren en dakdoorvoeren zijn veelvoorkomende aandachtspunten."],
    ["05", "Dakvoet, folie en onderliggende lagen", "Water kan elders binnendringen en pas meters verder zichtbaar worden aan de binnenzijde."],
    ["06", "Condens of vochtprobleem", "Niet iedere vochtplek is een lekkage. Daarom wordt eerst gekeken naar de waarschijnlijke bron."],
  ];

  const process = [
    ["01", "Vooraf uitvragen", "Daktype, zichtbare plek, weersomstandigheden, dakdetails, bereikbaarheid en het volledige adres zijn vóór vertrek bekend."],
    ["02", "Voorrijden", `De vaste voorrijkosten bedragen ${euro(calloutExVat)} excl. btw / ${euro(calloutInclVat)} incl. btw.`],
    ["03", "Oorzaak vaststellen", "Op locatie wordt bepaald waar het water waarschijnlijk binnendringt en welk herstel daarvoor nodig is."],
    ["04", "Prijs vóór herstel", "De reparatieprijs wordt besproken zodra de oorzaak duidelijk is. Extra werk wordt niet stilzwijgend uitgevoerd."],
  ];

  const intakeGroups = [
    {label:"01 / DAKTYPE", value:roofType, set:setRoofType, options:["Pannendak","Bitumen / plat dak","Anders / weet ik niet"]},
    {label:"02 / WAAR ZIET U HET WATER?", value:visibleAt, set:setVisibleAt, options:["Plafond / zolder","Muur / schoorsteen","Dakrand / aanbouw","Rond dakraam / doorvoer","Meerdere plekken"]},
    {label:"03 / WANNEER LEKT HET?", value:trigger, set:setTrigger, options:["Bij harde of langdurige regen","Bij regen + wind","Na een storm","Ook zonder regen","Onregelmatig / weet ik niet"]},
    {label:"04 / WAT ZIET U BUITEN?", value:outsideSign, set:setOutsideSign, options:["Niet bekend","Kapotte / verschoven pan","Probleem bij schoorsteen of lood","Scheur / blaas in bitumen","Probleem bij afvoer of dakrand","Anders"]},
    {label:"05 / DAKDETAIL", value:roofDetail, set:setRoofDetail, options:["Geen / weet ik niet","Schoorsteen aanwezig","Kilgoot aanwezig","Dakraam / doorvoer aanwezig","Meerdere aansluitingen"]},
    {label:"06 / BEREIKBAARHEID", value:access, set:setAccess, options:["Goed bereikbaar","Normaal bereikbaar","Moeilijk bereikbaar"]},
    {label:"07 / URGENTIE", value:urgency, set:setUrgency, options:["Actief maar beheersbaar","Water druppelt nu binnen","Gevolgschade neemt toe","Terugkerend probleem","Controle / twijfel"]},
  ];

  return <>
    <section className="leak-hero">
      <div className="leak-hero-media"><img src={editorialImages.hero} alt="Daklekkage en dakcontrole door LRS Daktechniek"/></div>
      <div className="leak-hero-shade"/>
      <div className="shell leak-hero-content">
        <span className="premium-kicker on-dark">DAKLEKKAGE · BREDA E.O.</span>
        <h1>Daklekkage?<br/><em>Eerst weten wat er speelt.</em></h1>
        <p>Een reparatieprijs vooraf noemen is bij lekkage vaak niet eerlijk: de vochtplek binnen kan meters van de echte oorzaak liggen. Wat wél vooraf vaststaat zijn de voorrijkosten.</p>
        <div className="leak-hero-actions">
          <a className="btn hero-primary" href={`tel:${site.phoneHref}`}>BEL DIRECT</a>
          <a className="btn leak-secondary-action" href="#lekkage-intake">DOE DE LEKKAGECHECK</a>
        </div>
        <div className="leak-hero-price">
          <span>VASTE VOORRIJKOSTEN</span>
          <strong className="mono">€75 EXCL. BTW</strong>
          <small>€90,75 incl. 21% btw · reparatieprijs pas nadat de oorzaak duidelijk is</small>
        </div>
      </div>
    </section>

    <section id="lekkage-intake" className="leak-intake-section">
      <div className="shell">
        <div className="premium-section-head leak-intake-head">
          <div><span className="premium-kicker">SLIMME LEKKAGECHECK</span><h2>Geen gokprijs.<br/><em>Wel een betere voorinschatting.</em></h2></div>
          <p>De check gebruikt uw antwoorden niet om een reparatieprijs te verzinnen. Hij bepaalt welke lekkageroute het meest logisch is en welke delen LRS als eerste moet controleren.</p>
        </div>

        <div className="leak-intake-layout">
          <div className="leak-intake-form">
            {intakeGroups.map((group)=><fieldset key={group.label} className="leak-intake-group">
              <legend className="mono">{group.label}</legend>
              <div className="leak-intake-options">
                {group.options.map((option)=><button type="button" key={option} className={`leak-intake-choice ${group.value===option?"active":""}`} onClick={()=>{group.set(option);setIntakeReady(false)}}>{option}</button>)}
              </div>
            </fieldset>)}

            <div className="leak-intake-fields">
              <label><span className="mono">08 / VOLLEDIG ADRES</span><input value={address} onChange={(e)=>{setAddress(e.target.value);setIntakeReady(false)}} placeholder="Bijv. Pietersberg 21, 4822 TS Breda" autoComplete="street-address"/></label>
              <label><span className="mono">09 / EXTRA UITLEG</span><textarea rows={5} value={notes} onChange={(e)=>{setNotes(e.target.value);setIntakeReady(false)}} placeholder="Bijv. sinds gisteren, alleen bij zuidwestenwind, vochtplek naast schoorsteen..."/></label>
            </div>

            <button type="button" className="btn leak-intake-submit" onClick={()=>setIntakeReady(true)}>MAAK MIJN VOORINSCHATTING</button>
          </div>

          <aside className="leak-intake-summary">
            <span className="premium-kicker on-dark">SLIMME VOORINSCHATTING</span>
            <div className="leak-route-box">
              <small className="mono">{leakRoute.code}</small>
              <h3>{leakRoute.title}</h3>
              <p>{leakRoute.copy}</p>
            </div>
            <dl>
              <div><dt>Daktype</dt><dd>{roofType}</dd></div>
              <div><dt>Zichtbaar bij</dt><dd>{visibleAt}</dd></div>
              <div><dt>Moment</dt><dd>{trigger}</dd></div>
              <div><dt>Dakdetail</dt><dd>{roofDetail}</dd></div>
              <div><dt>Urgentie</dt><dd>{urgency}</dd></div>
              <div><dt>Adres</dt><dd>{address || "Nog invullen"}</dd></div>
            </dl>
            <div className="leak-first-checks">
              <small className="mono">EERST CONTROLEREN</small>
              <p>{firstChecks.join(" · ")}</p>
            </div>
            {mapsUrl && <a className="btn leak-map-link" href={mapsUrl} target="_blank" rel="noreferrer">OPEN ADRES IN GOOGLE MAPS</a>}
            <div className="leak-intake-price">
              <small>VOORRIJKOSTEN</small>
              <strong className="mono">{euro(calloutExVat)} EXCL.</strong>
              <span>{euro(calloutInclVat)} incl. 21% btw</span>
            </div>
            <ul className="leak-intake-includes">
              <li>Geen reparatieprijs gokken vóórdat de oorzaak bekend is</li>
              <li>Herstelprijs wordt vóór uitvoering besproken</li>
              <li>Foto's kunnen na openen van WhatsApp worden meegestuurd</li>
            </ul>
            {intakeReady && <a className="btn leak-whatsapp-submit" href={leakageWhatsapp} target="_blank" rel="noreferrer">STUUR VOORINSCHATTING VIA WHATSAPP</a>}
          </aside>
        </div>
      </div>
    </section>

    <section className="leak-price-section leak-transparency-section">
      <div className="shell">
        <div className="premium-section-head">
          <div><span className="premium-kicker">TRANSPARANTE KOSTEN</span><h2>Wat vooraf vaststaat.<br/><em>En wat nog niet.</em></h2></div>
          <p>Bij een lekkage is de oorzaak bepalend voor de herstelprijs. Daarom scheidt LRS de vaste kosten van de kosten die pas na beoordeling betrouwbaar kunnen worden bepaald.</p>
        </div>
        <div className="leak-price-table">
          <div className="head"><span>ONDERDEEL</span><span>PRIJS / REGEL</span><span>WANNEER</span></div>
          <div><strong>Voorrijkosten</strong><span className="mono">€75 EXCL. / €90,75 INCL.</span><span>Voor het aanrijden naar de lekkagelocatie</span></div>
          <div><strong>Online lekkagecheck</strong><span className="mono">€0</span><span>Vooraf invullen om de situatie beter in beeld te krijgen</span></div>
          <div><strong>Onderzoek en herstel</strong><span>NA BEOORDELING</span><span>Afhankelijk van oorzaak, bereikbaarheid, materiaal en omvang</span></div>
          <div><strong>Extra werkzaamheden</strong><span>ALTIJD EERST AKKOORD</span><span>Geen aanvullende werkzaamheden zonder dat de prijs is besproken</span></div>
        </div>
        <p className="leak-price-footnote">De voorrijkosten zijn de enige vaste lekkagekosten die vooraf op de website worden genoemd. Een reparatiebedrag tonen we pas wanneer voldoende duidelijk is wat er daadwerkelijk gerepareerd moet worden.</p>
      </div>
    </section>

    <section className="leak-intro-section">
      <div className="shell leak-intro-grid">
        <div>
          <span className="premium-kicker">WAT KAN ER LEKKEN?</span>
          <h2>De vochtplek binnen hoeft niet de ingang buiten te zijn.</h2>
          <p>Water volgt constructies, folie, balken en naden. Daarom wordt niet alleen gekeken naar de plek waar u binnen vocht ziet.</p>
        </div>
        <div className="leak-cause-grid">
          {causes.map(([n,title,copy])=><article key={n}><span className="mono">{n}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </div>
    </section>

    <section className="leak-dark-section">
      <div className="shell leak-dark-grid">
        <div>
          <span className="premium-kicker on-dark">ZO WERKT HET</span>
          <h2>Van melding naar duidelijke herstelprijs.</h2>
          <p>De lekkagecheck maakt het bezoek gerichter. Daarna wordt de oorzaak vastgesteld en pas dan wordt een passende herstelprijs besproken.</p>
        </div>
        <div className="leak-process-list">
          {process.map(([n,title,copy])=><div key={n}><span className="mono">{n}</span><div><strong>{title}</strong><p>{copy}</p></div></div>)}
        </div>
      </div>
    </section>

    <section className="leak-roof-types">
      <div className="shell">
        <div className="premium-section-head">
          <div><span className="premium-kicker">HELLEND & PLAT</span><h2>Per daktype andere<br/><em>aandachtspunten.</em></h2></div>
          <p>De lekkagecheck helpt vooraf bepalen welke onderdelen bij uw daktype logisch zijn om als eerste te controleren.</p>
        </div>
        <div className="leak-roof-grid">
          <article><span className="mono">01</span><h3>Pannendak</h3><p>Dakpannen, nokvorsten, folie, dakvoet, lood, schoorsteen, kilgoten, dakramen en aansluitingen.</p><Link className="leak-inline-action" href="/dakpannen">BEKIJK PANNENDAKEN →</Link></article>
          <article><span className="mono">02</span><h3>Bitumen / plat dak</h3><p>Naden, scheuren, blazen, hemelwaterafvoer, opstanden, dakranden, kimmen en doorvoeren.</p><Link className="leak-inline-action" href="/betumendaken">BEKIJK BITUMEN →</Link></article>
        </div>
      </div>
    </section>

    <section className="leak-now-section">
      <div className="shell leak-now-grid">
        <div><span className="premium-kicker">TOT HET BEZOEK</span><h2>Beperk gevolgschade zonder risico te nemen.</h2></div>
        <div className="leak-now-list">
          <p><strong>01</strong> Vang binnendringend water op en bescherm vloer, plafond en meubels.</p>
          <p><strong>02</strong> Maak foto's van de vochtplek en, alleen als dat veilig kan, van de buitenzijde. U kunt die via WhatsApp meesturen.</p>
          <p><strong>03</strong> Ga niet zelf een nat, glad of beschadigd dak op.</p>
          <p><strong>04</strong> Noteer of de lekkage samenhangt met windrichting, langdurige regen, storm of een specifieke dakzone.</p>
        </div>
      </div>
    </section>

    <div className="shell premium-service-cta-wrap"><CTA title="Daklekkage laten beoordelen?"/></div>
  </>;
}

function ServicePage({ slug }: { slug: string }) {
  const service = serviceBySlug(slug)!;
  const visual = serviceVisuals[slug] ?? serviceVisuals.dakpannen;
  const detail = serviceDetails[slug as keyof typeof serviceDetails];

  return <>
    <PageHero
      eyebrow={`${service.eyebrow} · BREDA E.O.`}
      title={service.title}
      lead={service.hero}
      angle={visual.angle}
    />

    <section className="premium-service-intro">
      <div className="shell premium-service-intro-grid">
        <div>
          <span className="premium-kicker">WANNEER CONTROLEREN?</span>
          <h2>{service.intro}</h2>
          <p>{detail.summary}</p>
        </div>
        <div className="premium-symptom-list">
          {service.symptoms.map((item, index) => (
            <div key={item}>
              <span className="mono">{String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="premium-service-photo-block">
      <div className="shell premium-service-photo-grid">
        <figure>
          <img src={editorialImages.terracotta} alt={`${service.name} - LRS Daktechniek Breda`} loading="lazy"/>
          <figcaption>LRS DAKTECHNIEK · BREDA E.O.</figcaption>
        </figure>
        <div>
          <span className="premium-kicker">CONTROLEPUNTEN</span>
          <h2>Waar we technisch naar kijken.</h2>
          <div className="premium-check-register">
            {service.checks.map((item, index) => (
              <div key={item}>
                <span className="mono">{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="seo-depth-section">
      <div className="shell">
        <div className="premium-section-head">
          <div>
            <span className="premium-kicker">TECHNISCHE UITLEG</span>
            <h2>Wat bij {service.name.toLowerCase()} werkelijk verschil maakt.</h2>
          </div>
          <p>Geen losse SEO-tekst, maar onderwerpen die bij beoordeling, herstel en renovatie daadwerkelijk relevant zijn.</p>
        </div>
        <div className="seo-topic-grid">
          {detail.topics.map((topic, index) => (
            <article key={topic.title} className="seo-topic-card">
              <span className="mono">{String(index + 1).padStart(2, "0")}</span>
              <h3>{topic.title}</h3>
              <p>{topic.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="premium-technical-section">
      <div className="shell">
        <div className="premium-section-head">
          <div>
            <span className="premium-kicker">DAKOPBOUW</span>
            <h2>Techniek wanneer<br/><em>u die wilt zien.</em></h2>
          </div>
          <p>De relevante lagen voor deze dienst zijn gemarkeerd. Tik op een laag voor uitleg.</p>
        </div>
        <RoofAssembly focus={visual.layers}/>
      </div>
    </section>

    <section className="seo-faq-section">
      <div className="shell seo-faq-layout">
        <div>
          <span className="premium-kicker">VEELGESTELDE VRAGEN</span>
          <h2>{service.name} duidelijk uitgelegd.</h2>
        </div>
        <div className="seo-faq-list">
          {detail.faq.map((item, index) => (
            <details key={item.question}>
              <summary><span className="mono">{String(index + 1).padStart(2, "0")}</span>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>

    <section className="seo-related-section">
      <div className="shell">
        <span className="premium-kicker">VERDER KIJKEN</span>
        <div className="seo-related-links">
          {detail.related.map(item => <Link key={item.href} href={item.href}>{item.label}<span>→</span></Link>)}
        </div>
      </div>
    </section>

    <div className="shell premium-service-cta-wrap">
      <CTA title={`${service.name} bespreken?`}/>
    </div>
  </>;
}

const dakcheckIssues = ["Lekkage","Pannendak","Bitumen / plat dak","Dakisolatie","Schoorsteen","Ik weet het niet"];
const dakcheckRoofs = ["Hellend","Plat","Weet ik niet"];
const dakcheckUrgency = ["Actief lekkageprobleem","Binnen enkele weken","Oriëntatie / onderhoud"];

function Dakcheck() {
  const [step,setStep]=useState(0);
  const [issue,setIssue]=useState("");
  const [roof,setRoof]=useState("");
  const [urgency,setUrgency]=useState("");
  const issueLow = issue.toLowerCase();
  const route = issueLow.includes("lekk") ? "/dak-lekkage" : issueLow.includes("pannen") ? "/dakpannen" : issueLow.includes("bitumen") ? "/betumendaken" : issueLow.includes("isolatie") ? "/dak-isolatie" : issueLow.includes("schoorsteen") ? "/schoorsteen-verwijderen" : "/contact";
  const complete = Boolean(issue && roof && urgency);

  const choose = (value:string) => {
    if(step===0) setIssue(value);
    if(step===1) setRoof(value);
    if(step===2) setUrgency(value);
    setStep((s)=>Math.min(3,s+1));
  };
  const choices = step===0 ? dakcheckIssues : step===1 ? dakcheckRoofs : dakcheckUrgency;
  const question = step===0 ? "Wat speelt er?" : step===1 ? "Welk daktype ziet u?" : "Hoe urgent is het?";

  return <>
    <PageHero eyebrow="DAKCHECK-RAPPORT" title="Van wat u ziet naar een logische volgende stap." lead="Geen diagnose op afstand. Wel een helder rapport op basis van uw antwoorden."/>
    <section className="work-zone section-block"><div className="shell dakcheck-v2-grid">
      <div className="dakcheck-question">
        <SectionIndex n={`0${Math.min(step+1,4)}`} label="DAKCHECK"/>
        {step<3 ? <><p className="annotation">VRAAG {step+1} / 3</p><h2>{question}</h2><div className="check-options">{choices.map((x)=><button key={x} onClick={()=>choose(x)}>{x}<span>→</span></button>)}</div></> : <><p className="annotation">RAPPORT COMPLEET</p><h2>Uw route staat klaar.</h2><p>Controleer rechts wat u heeft ingevuld. U kunt direct naar de relevante dienst of de samenvatting via WhatsApp sturen.</p><button className="text-button" onClick={()=>setStep(0)}>Antwoorden aanpassen</button></>}
      </div>
      <aside className="workticket" aria-label="Dakcheck rapport">
        <div className="workticket-head"><span className="annotation">DAKCHECK-RAPPORT</span><span className="mono">LIVE</span></div>
        <div className="ticket-row"><span className="annotation">ONDERWERP</span><strong>{issue || "—"}</strong></div>
        <div className="ticket-row"><span className="annotation">DAKTYPE</span><strong>{roof || "—"}</strong></div>
        <div className="ticket-row"><span className="annotation">URGENTIE</span><strong>{urgency || "—"}</strong></div>
        <div className="ticket-progress"><span style={{width:`${Math.min(100, ((Boolean(issue)?1:0)+(Boolean(roof)?1:0)+(Boolean(urgency)?1:0))/3*100)}%`}}/></div>
        {complete && <div className="ticket-actions"><Link className="btn primary-light" href={route}>BEKIJK ROUTE</Link><a className="text-action" href={whatsapp(`Hallo LRS, ik heb de Dakcheck gedaan.\nOnderwerp: ${issue}\nDaktype: ${roof}\nUrgentie: ${urgency}`)} target="_blank" rel="noreferrer">Stuur samenvatting via WhatsApp →</a></div>}
      </aside>
    </div></section>
  </>;
}

type CalculatorRoof = "pannendak" | "bitumen";
type CalculatorAccess = "goed" | "normaal" | "moeilijk";
type PriceSource = "LRS" | "ONLINE_RICHTPRIJS";
type PriceRule = {
  mode: "perM2" | "fixed";
  minIncl: number;
  maxIncl: number;
  source: PriceSource;
  note: string;
};

const pannendakWorks = [
  ["pannen-beton", "Dakpannen wisselen – beton/sneldek"],
  ["pannen-keramisch", "Dakpannen wisselen – keramisch"],
  ["pannen-renovatie", "Complete pannendak-renovatie"],
  ["pannen-isolatie", "Dakisolatie onder pannendak"],
  ["pannen-lekkage", "Lekkage pannendak"],
  ["pannen-schoorsteen-kil", "Schoorsteenlekkage / kilgoot"],
] as const;

const bitumenWorks = [
  ["bitumen-overlagen", "Bitumen dak overlagen"],
  ["bitumen-nieuw", "Nieuw bitumen dak"],
  ["bitumen-warmdak", "Warm dak – isolatie + bitumen"],
  ["bitumen-kleinvlak", "Plat dak dakkapel, garage of schuur"],
  ["bitumen-lekkage", "Lekkage plat dak"],
] as const;

/*
 * Publieke prijsindicatie:
 * - Alle online prijsbanden zijn ten opzichte van de vorige calculatorbasis met 40% verhoogd.
 * - Lekkage toont uitsluitend de bekende voorrijkosten: €75 excl. btw / €90,75 incl. btw.
 * - Overige regels blijven marktgerichte richtindicaties en worden niet als bindende offerte gepresenteerd.
 */
const PUBLIC_PRICE_RULES: Record<string, PriceRule> = {
  "pannen-beton": {
    mode: "perM2",
    minIncl: 56,
    maxIncl: 98,
    source: "ONLINE_RICHTPRIJS",
    note: "Richtband betonpannen inclusief materiaal, arbeid en btw.",
  },
  "pannen-keramisch": {
    mode: "perM2",
    minIncl: 84,
    maxIncl: 140,
    source: "ONLINE_RICHTPRIJS",
    note: "Richtband keramische dakpannen inclusief materiaal, arbeid en btw.",
  },
  "pannen-renovatie": {
    mode: "perM2",
    minIncl: 91,
    maxIncl: 154,
    source: "ONLINE_RICHTPRIJS",
    note: "Richtband voor complete renovatie van een schuin pannendak.",
  },
  "pannen-isolatie": {
    mode: "perM2",
    minIncl: 46.2,
    maxIncl: 91,
    source: "ONLINE_RICHTPRIJS",
    note: "Richtband voor dakisolatie wanneer dit met pannendakwerk wordt gecombineerd.",
  },
  "pannen-lekkage": {
    mode: "fixed",
    minIncl: 90.75,
    maxIncl: 90.75,
    source: "LRS",
    note: "Voorrijkosten voor lekkagebezoek. Herstelprijs wordt pas na vaststelling van de oorzaak besproken.",
  },
  "pannen-schoorsteen-kil": {
    mode: "fixed",
    minIncl: 90.75,
    maxIncl: 90.75,
    source: "LRS",
    note: "Voorrijkosten voor lekkagebezoek bij schoorsteen of kilgoot. Herstelprijs volgt na beoordeling.",
  },
  "bitumen-overlagen": {
    mode: "perM2",
    minIncl: 56,
    maxIncl: 77,
    source: "ONLINE_RICHTPRIJS",
    note: "Richtband voor een nieuwe bitumenlaag wanneer de bestaande basis bruikbaar is.",
  },
  "bitumen-nieuw": {
    mode: "perM2",
    minIncl: 70,
    maxIncl: 126,
    source: "ONLINE_RICHTPRIJS",
    note: "Richtband voor nieuwe/vervangende bitumen dakbedekking.",
  },
  "bitumen-warmdak": {
    mode: "perM2",
    minIncl: 126,
    maxIncl: 210,
    source: "ONLINE_RICHTPRIJS",
    note: "Samengestelde richtband voor isolatie plus bitumen dakopbouw.",
  },
  "bitumen-kleinvlak": {
    mode: "perM2",
    minIncl: 70,
    maxIncl: 126,
    source: "ONLINE_RICHTPRIJS",
    note: "Richtband voor bitumen op dakkapel, garage, aanbouw of schuur.",
  },
  "bitumen-lekkage": {
    mode: "fixed",
    minIncl: 90.75,
    maxIncl: 90.75,
    source: "LRS",
    note: "Voorrijkosten voor lekkagebezoek aan plat dak. Herstelprijs wordt pas na vaststelling van de oorzaak besproken.",
  },
};

const CHIMNEY_REMOVE_MARKET_INCL = { min: 2100, max: 3500 } as const;
const DIFFICULT_ACCESS_FACTOR = 1.1;

function PricePage() {
  const [roofType, setRoofType] = useState<CalculatorRoof>("pannendak");
  const [workId, setWorkId] = useState("pannen-beton");
  const [chimney, setChimney] = useState("nee");
  const [area, setArea] = useState("40");
  const [access, setAccess] = useState<CalculatorAccess>("normaal");
  const [submitted, setSubmitted] = useState(false);

  const works = roofType === "pannendak" ? pannendakWorks : bitumenWorks;
  const work = works.find(([id]) => id === workId) ?? works[0];
  const areaNumber = Math.max(1, Number(area) || 1);
  const rule = PUBLIC_PRICE_RULES[workId];
  const isLeakageWork = ["pannen-lekkage", "pannen-schoorsteen-kil", "bitumen-lekkage"].includes(workId);

  const roundToFive = (value: number) => Math.round(value / 5) * 5;
  const accessFactor = !isLeakageWork && access === "moeilijk" ? DIFFICULT_ACCESS_FACTOR : 1;

  let minInclVat = isLeakageWork
    ? 90.75
    : rule.mode === "perM2" ? rule.minIncl * areaNumber : rule.minIncl;
  let maxInclVat = isLeakageWork
    ? 90.75
    : rule.mode === "perM2" ? rule.maxIncl * areaNumber : rule.maxIncl;

  if (!isLeakageWork && chimney === "ja") {
    minInclVat += CHIMNEY_REMOVE_MARKET_INCL.min;
    maxInclVat += CHIMNEY_REMOVE_MARKET_INCL.max;
  }

  if (!isLeakageWork) {
    minInclVat = roundToFive(minInclVat * accessFactor);
    maxInclVat = roundToFive(maxInclVat * accessFactor);
  }

  const minExVat = isLeakageWork ? 75 : roundToFive(minInclVat / 1.21);
  const maxExVat = isLeakageWork ? 75 : roundToFive(maxInclVat / 1.21);

  function changeRoof(value: CalculatorRoof) {
    setRoofType(value);
    const first = value === "pannendak" ? pannendakWorks[0][0] : bitumenWorks[0][0];
    setWorkId(first);
    setSubmitted(false);
  }

  function formatEuro(value: number) {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }

  const sourceLabel = isLeakageWork
    ? "LRS VOORRIJKOSTEN LEKKAGE"
    : rule.source === "LRS"
      ? "LRS ONLINE PRIJSINDICATIE"
      : "LRS ONLINE REKENBAND";

  const whatsappText = isLeakageWork
    ? [
        "Hallo LRS Daktechniek, ik wil een daklekkage laten beoordelen.",
        `Type dak: ${roofType === "pannendak" ? "Pannendak" : "Bitumen / plat dak"}`,
        `Situatie: ${work[1]}`,
        `Bereikbaarheid: ${access}`,
        "Voorrijkosten: €75 excl. btw / €90,75 incl. btw",
        "Ik begrijp dat de herstelprijs pas na vaststelling van de oorzaak wordt besproken.",
      ].join("\n")
    : [
        "Hallo LRS Daktechniek, ik heb de prijsindicatie ingevuld.",
        `Type dak: ${roofType === "pannendak" ? "Pannendak" : "Bitumen / plat dak"}`,
        `Werk: ${work[1]}`,
        `Schoorsteen verwijderen: ${chimney === "ja" ? "Ja" : "Nee"}`,
        `Oppervlakte: ${areaNumber} m²`,
        `Bereikbaarheid: ${access}`,
        `Online indicatie: ${formatEuro(minInclVat)} – ${formatEuro(maxInclVat)} incl. btw`,
        `Basis: ${sourceLabel}`,
      ].join("\n");

  return (
    <>
      <PageHero
        eyebrow="PRIJSINDICATIE / REKENMACHINE"
        title="Bereken direct een prijsband voor uw dak."
        lead="Voor planbaar dakwerk rekent de calculator direct een prijsband. Bij lekkage tonen we alleen de vaste voorrijkosten en verwijzen we naar de slimme lekkagecheck."
      />

      <section className="work-zone section-block">
        <div className="shell calculator-v3-shell">
          <div className="calculator-v3-intro">
            <SectionIndex n="01" label="INVOER"/>
            <p className="annotation">PRIJSINDICATIE DAKWERK</p>
            <h2>{isLeakageWork ? "Bij lekkage eerst de oorzaak, dan de herstelprijs." : "Direct inzicht in de verwachte kosten."}</h2>
            <p>
              {isLeakageWork
                ? "Voor een daklekkage is vooraf alleen de vaste voorrijkost betrouwbaar bekend. De reparatieprijs hangt af van de werkelijke oorzaak en wordt daarom pas na beoordeling besproken."
                : "Kies het type dak, de werkzaamheden, het aantal vierkante meters en de bereikbaarheid. De rekenmachine verwerkt deze gegevens direct tot een duidelijke prijsband, inclusief btw."}
            </p>
          </div>

          <form
            className="calculator-v3-form"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            <div className="calculator-field-grid">
              <label>
                <span className="annotation">01 / TYPE DAK</span>
                <select
                  value={roofType}
                  onChange={(event) => changeRoof(event.target.value as CalculatorRoof)}
                >
                  <option value="pannendak">Pannendak</option>
                  <option value="bitumen">Bitumen / plat dak</option>
                </select>
              </label>

              <label>
                <span className="annotation">02 / SOORT WERK</span>
                <select
                  value={workId}
                  onChange={(event) => {
                    setWorkId(event.target.value);
                    setSubmitted(false);
                  }}
                >
                  {[...works].map(([id, label]) => (
                    <option key={id} value={id}>{label}</option>
                  ))}
                </select>
              </label>

              {!isLeakageWork && <label>
                <span className="annotation">03 / SCHOORSTEEN VERWIJDEREN</span>
                <select
                  value={chimney}
                  onChange={(event) => {
                    setChimney(event.target.value);
                    setSubmitted(false);
                  }}
                >
                  <option value="nee">Nee</option>
                  <option value="ja">Ja, meenemen in indicatie</option>
                </select>
              </label>}

              {!isLeakageWork && <label>
                <span className="annotation">04 / OPPERVLAKTE DAK</span>
                <div className="calculator-number">
                  <input
                    type="number"
                    min="1"
                    inputMode="numeric"
                    value={area}
                    onChange={(event) => {
                      setArea(event.target.value);
                      setSubmitted(false);
                    }}
                    placeholder="Bijv. 40"
                  />
                  <span className="mono">M²</span>
                </div>
              </label>}

              <label className="calculator-wide">
                <span className="annotation">{isLeakageWork ? "03" : "05"} / BEREIKBAARHEID</span>
                <select
                  value={access}
                  onChange={(event) => {
                    setAccess(event.target.value as CalculatorAccess);
                    setSubmitted(false);
                  }}
                >
                  <option value="goed">Goed bereikbaar</option>
                  <option value="normaal">Normaal bereikbaar</option>
                  <option value="moeilijk">Moeilijk bereikbaar</option>
                </select>
              </label>
            </div>

            <div className="calculator-live-preview">
              <span className="annotation">{isLeakageWork ? "VASTE VOORRIJKOSTEN" : "HUIDIGE REKENBAND / INCL. BTW"}</span>
              <strong className="mono">
                {isLeakageWork ? `${formatEuro(75)} EXCL. / ${formatEuro(90.75)} INCL.` : `${formatEuro(minInclVat)} – ${formatEuro(maxInclVat)}`}
              </strong>
              <small>{isLeakageWork ? "Reparatieprijs volgt pas na vaststelling van de oorzaak" : sourceLabel}</small>
            </div>

            <button className="btn calculator-submit" type="submit">
              {isLeakageWork ? "BEKIJK LEKKAGEROUTE" : "PRIJSINDICATIE BEREKENEN"}
            </button>
          </form>

          <aside className="calculator-v3-visual">
            <MeasuredArea area={isLeakageWork ? 1 : areaNumber}/>
          </aside>
        </div>
      </section>

      {submitted && (
        <section className="calculator-result-zone" aria-live="polite">
          <div className="shell calculator-result-v3">
            <div>
              <span className="annotation">UITKOMST / {roofType.toUpperCase()}</span>
              <h2>{work[1]}</h2>
              <dl className="calculator-summary">
                {!isLeakageWork && <div><dt>OPPERVLAKTE</dt><dd className="mono">{areaNumber} M²</dd></div>}
                <div><dt>BEREIKBAARHEID</dt><dd>{access}</dd></div>
                {!isLeakageWork && <div><dt>SCHOORSTEEN</dt><dd>{chimney === "ja" ? "Ja" : "Nee"}</dd></div>}
                <div><dt>REKENMODEL</dt><dd>{sourceLabel}</dd></div>
              </dl>
            </div>

            <div className="calculator-price-panel">
              {isLeakageWork ? <>
                <span className="annotation">VASTE VOORRIJKOSTEN</span>
                <strong className="mono">€75 EXCL. BTW</strong>
                <p><span className="mono">€90,75 incl. 21% btw</span></p>
                <p>De herstelprijs wordt niet vooraf gegokt. Eerst wordt de oorzaak van de lekkage vastgesteld; daarna wordt de prijs besproken vóór uitvoering.</p>
                <Link className="btn primary-light" href="/dak-lekkage#lekkage-intake">DOE DE SLIMME LEKKAGECHECK</Link>
              </> : <>
                <span className="annotation">PRIJSINDICATIE INCL. 21% BTW</span>
                <strong className="mono">{formatEuro(minInclVat)} – {formatEuro(maxInclVat)}</strong>
                <p>Excl. btw: <span className="mono">{formatEuro(minExVat)} – {formatEuro(maxExVat)}</span>.</p>
                <p>{rule.note}</p>
                {access === "moeilijk" && <p className="calculator-model-note">In het online model is voor moeilijke bereikbaarheid een correctie van 10% meegenomen.</p>}
                {chimney === "ja" && <p className="calculator-model-note">Voor het verwijderen van het deel boven het dak plus dakherstel is een richtband meegenomen. De constructieve situatie kan de uiteindelijke prijs wijzigen.</p>}
                <p className="calculator-disclaimer">De prijsindicatie is gebaseerd op de gekozen werkzaamheden en invoer. Afwijkende dakdetails, verborgen schade of extra werkzaamheden worden vooraf besproken.</p>
              </>}

              <a className="btn primary-light" href={whatsapp(whatsappText)} target="_blank" rel="noreferrer">
                {isLeakageWork ? "STUUR LEKKAGEAANVRAAG" : "STUUR DEZE BEREKENING"}
              </a>
            </div>
          </div>
        </section>
      )}

      <section className="paper-deep-zone section-block calculator-explain">
        <div className="shell">
          <SectionIndex n="02" label="PRIJSBASIS"/>
          <div className="section-heading split-heading">
            <div>
              <p className="annotation">TRANSPARANT REKENMODEL</p>
              <h2>{isLeakageWork ? "Bij lekkage noemen we alleen wat we zeker weten." : "De calculator geeft een directe prijsband."}</h2>
            </div>
            <div>
              <p>{isLeakageWork ? "De vaste voorrijkosten zijn €75 excl. btw. De herstelprijs verschijnt bewust niet als automatische schatting, omdat de oorzaak eerst betrouwbaar moet worden vastgesteld." : "De rekenmachine combineert het gekozen werk met oppervlakte, bereikbaarheid en eventuele aanvullende werkzaamheden."}</p>
              <p>De invoer kan direct via WhatsApp worden doorgestuurd, zodat de situatie vooraf duidelijker is.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Contact() {
  const [name,setName]=useState(""); const [place,setPlace]=useState(""); const [text,setText]=useState("");
  const message=useMemo(()=>`Hallo LRS Daktechniek.\nNaam: ${name}\nPlaats: ${place}\nSituatie: ${text}`,[name,place,text]);
  function submit(e:FormEvent){e.preventDefault(); window.open(whatsapp(message),"_blank","noopener,noreferrer");}
  return <>
    <PageHero eyebrow="CONTACT / DIRECTE LIJN" title="Geen callcenter. Gewoon LRS." lead="Foto’s kunnen helpen, maar zijn niet nodig om uw vraag te stellen."/>
    <section className="work-zone section-block"><div className="shell contact-v2-grid"><div><SectionIndex n="01" label="AANVRAAG"/><p className="annotation">DIRECT CONTACT</p><h2>Vertel kort wat u ziet.</h2><a className="contact-number mono" href={`tel:${site.phoneHref}`}>{site.phoneDisplay}</a><p>{site.hours}</p></div><form className="technical-form" onSubmit={submit}><label><span className="annotation">NAAM</span><input required value={name} onChange={e=>setName(e.target.value)}/></label><label><span className="annotation">WOONPLAATS</span><input required value={place} onChange={e=>setPlace(e.target.value)}/></label><label><span className="annotation">SITUATIE</span><textarea required rows={6} value={text} onChange={e=>setText(e.target.value)}/></label><button className="btn primary-light">OPEN IN WHATSAPP</button></form></div></section>
  </>;
}

function WorkArea() {
  return <>
    <PageHero eyebrow="WERKGEBIED / BREDA E.O." title="Breda en de regio eromheen." lead="Bekijk het echte werkgebied van LRS Daktechniek op de kaart."/>
    <section className="work-zone section-block workarea-real-section">
      <div className="shell">
        <RealWorkAreaMap/>
        <div className="location-register real-location-register">
          {locations.map((l,i)=><Link key={l[0]} href={`/${l[0]}`}><span className="mono">{String(i+1).padStart(2,"0")}</span><strong>{l[1]}</strong><span>Bekijk plaats ↗</span></Link>)}
        </div>
      </div>
    </section>
  </>;
}

function BredaPage() {
  return <>
    <PageHero
      eyebrow="DAKDEKKER BREDA · LRS DAKTECHNIEK"
      title={bredaPage.title}
      lead={bredaPage.intro}
      angle="40°"
    />

    <section className="breda-intro-section">
      <div className="shell breda-intro-grid">
        <div>
          <span className="premium-kicker">LOKAAL DAKWERK</span>
          <h2>Van lekkage tot complete dakopbouw.</h2>
          <p>De zoekterm “dakdekker Breda” zegt nog niets over wat er technisch nodig is. Daarom koppelt deze pagina de lokale route direct aan de vijf werkzaamheden van LRS.</p>
        </div>
        <div className="breda-service-links">
          {services.map((service, index) => (
            <Link href={`/${service.slug}`} key={service.slug}>
              <span className="mono">{String(index + 1).padStart(2, "0")}</span>
              <div><small>{service.eyebrow}</small><strong>{service.name}</strong></div>
              <span>→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>

    <section className="seo-depth-section">
      <div className="shell">
        <div className="premium-section-head">
          <div>
            <span className="premium-kicker">DAKDEKKER BREDA</span>
            <h2>Wat LRS in Breda concreet doet.</h2>
          </div>
          <p>De inhoud hieronder maakt duidelijk waar LRS voor wordt ingeschakeld en hoe de technische route per dakprobleem verschilt.</p>
        </div>
        <div className="seo-topic-grid breda-topic-grid">
          {bredaPage.sections.map((section, index) => (
            <article className="seo-topic-card" key={section.title}>
              <span className="mono">{String(index + 1).padStart(2, "0")}</span>
              <h3>{section.title}</h3>
              <p>{section.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="breda-action-section">
      <div className="shell breda-action-grid">
        <Link href="/dak-lekkage" className="breda-action-card">
          <span className="premium-kicker">LEKKAGE</span>
          <h3>Vooraf al informatie doorgeven.</h3>
          <p>Gebruik de slimme lekkagecheck, vul het volledige adres in en stuur de technische samenvatting direct naar LRS.</p>
          <strong>START LEKKAGECHECK →</strong>
        </Link>
        <Link href="/prijsindicatie" className="breda-action-card">
          <span className="premium-kicker">PRIJS</span>
          <h3>Online prijsindicatie voor dakwerk.</h3>
          <p>Voor werkzaamheden die vooraf op oppervlakte en gekozen werksoort kunnen worden berekend.</p>
          <strong>OPEN REKENMACHINE →</strong>
        </Link>
      </div>
    </section>

    <section className="seo-faq-section">
      <div className="shell seo-faq-layout">
        <div>
          <span className="premium-kicker">VRAGEN OVER DAKWERK IN BREDA</span>
          <h2>Duidelijk vóór u contact opneemt.</h2>
        </div>
        <div className="seo-faq-list">
          {bredaPage.faq.map((item, index) => (
            <details key={item.question}>
              <summary><span className="mono">{String(index + 1).padStart(2, "0")}</span>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>

    <section className="dark-zone breda-area-section">
      <div className="shell">
        <div className="premium-section-head dark">
          <div><span className="premium-kicker on-dark">BREDA & OMGEVING</span><h2>Werkgebied op de echte kaart.</h2></div>
          <p>Breda is de basis. Bekijk ook de omliggende plaatsen die binnen het LRS-werkgebied zijn opgenomen.</p>
        </div>
        <RealWorkAreaMap/>
        <div className="seo-related-links dark-links">
          {locations.filter(location => location[0] !== "dakdekker-breda").slice(0, 8).map(location => (
            <Link key={location[0]} href={`/${location[0]}`}>Dakdekker {location[1]}<span>→</span></Link>
          ))}
        </div>
      </div>
    </section>

    <div className="shell premium-service-cta-wrap"><CTA title="Dakwerk in Breda bespreken?"/></div>
  </>;
}

function ProjectsIndex() {
  return <>
    <PageHero
      eyebrow="PROJECTEN · ECHT WERK"
      title="Projectarchief van LRS."
      lead="Hier worden alleen echte LRS-projecten gepubliceerd met controleerbare werkzaamheden en eigen projectmateriaal."
    />
    <section className="work-zone section-block">
      <div className="shell">
        {projects.length === 0 ? (
          <div className="projects-empty">
            <span className="premium-kicker">GEEN FICTIEVE CASES</span>
            <h2>De structuur staat klaar. Alleen echt werk komt hier te staan.</h2>
            <p>Nieuwe projecten worden pas gepubliceerd wanneer plaats, type dak, werkzaamheden en geschikt projectmateriaal beschikbaar zijn. Zo blijft het archief betrouwbaar.</p>
            <Link className="premium-cta" href="/contact">DAKWERK BESPREKEN <span>→</span></Link>
          </div>
        ) : (
          <div className="project-grid">
            {projects.map(project => (
              <Link href={`/projecten/${project.slug}`} key={project.slug} className="project-card">
                <span className="premium-kicker">{project.place}</span>
                <h2>{project.title}</h2>
                <p>{project.summary}</p>
                <strong>BEKIJK PROJECT →</strong>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  </>;
}

function ProjectPage({slug}:{slug:string}) {
  const project = projectBySlug(slug)!;
  return <>
    <PageHero eyebrow={`PROJECT · ${project.place.toUpperCase()}`} title={project.title} lead={project.summary}/>
    <section className="work-zone section-block">
      <article className="shell project-detail">
        <dl>
          {project.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
        </dl>
        {project.sections.map((section, index) => (
          <section key={section.title}>
            <span className="mono">{String(index + 1).padStart(2, "0")}</span>
            <div><h2>{section.title}</h2><p>{section.text}</p></div>
          </section>
        ))}
      </article>
    </section>
  </>;
}

function ReviewPage() {
  const googleMaps = "https://www.google.com/maps/search/?api=1&query=LRS%20Daktechniek%20Breda";
  return <>
    <PageHero
      eyebrow="BEOORDELEN"
      title="Hoe was het dakwerk?"
      lead="Een eerlijke beoordeling helpt andere mensen in Breda en omgeving bij het kiezen van een dakdekker."
    />
    <section className="review-page-section">
      <div className="shell review-page-grid">
        <div>
          <span className="premium-kicker">GOOGLE</span>
          <h2>Deel uw ervaring met LRS Daktechniek.</h2>
          <p>Beschrijf gerust welk dakwerk is uitgevoerd en wat u van contact, uitleg en uitvoering vond. Een beoordeling hoeft niet lang te zijn.</p>
        </div>
        <div className="review-action-card">
          <span className="mono">01</span>
          <h3>Open LRS in Google Maps</h3>
          <p>Daar kunt u het bedrijfsprofiel openen en, wanneer Google de optie toont, een beoordeling achterlaten.</p>
          <a className="premium-cta" href={googleMaps} target="_blank" rel="noreferrer">OPEN GOOGLE MAPS <span>→</span></a>
        </div>
      </div>
    </section>
  </>;
}

function LocalPage({slug}:{slug:string}) {
  const l=locationBySlug(slug)!;
  return <><PageHero eyebrow="WERKGEBIED" title={`Dakdekker ${l.name}`} lead={`LRS Daktechniek voor pannendaken, bitumen, isolatie, lekkage en schoorsteenwerk in ${l.name} en de regio Breda.`}/><section className="work-zone section-block"><div className="shell"><SectionIndex n="01" label="DIENSTEN"/><div className="service-register">{services.map((s,i)=><Link key={s.slug} href={`/${s.slug}`}><span className="mono">{String(i+1).padStart(2,"0")}</span><div><small className="annotation">{s.eyebrow}</small><strong>{s.name}</strong></div><span>↗</span></Link>)}</div></div></section><div className="shell"><CTA title={`Dakwerk in ${l.name} bespreken?`}/></div></>;
}

function BlogIndex() {
  return <><PageHero eyebrow="KENNISBANK" title="Dakvragen duidelijk uitgelegd."/><section className="work-zone section-block"><div className="shell article-register">{articles.map((a,i)=><Link key={a.slug} href={`/blog-s/${a.slug}`}><span className="mono">{String(i+1).padStart(2,"0")}</span><div><span className="annotation">KENNISBANK</span><h2>{a.title}</h2><p>{a.description}</p></div><span>↗</span></Link>)}</div></section></>;
}

function Article({slug}:{slug:string}) {
  const a=articleBySlug(slug)!;
  return <><PageHero eyebrow="KENNISBANK" title={a.title} lead={a.description}/><section className="work-zone section-block"><article className="shell article-body-v2">{[...a.sections].map(([h,b],i)=><section key={h}><span className="mono">{String(i+1).padStart(2,"0")}</span><div><h2>{h}</h2><p>{b}</p></div></section>)}</article></section></>;
}

function About() {
  return <><PageHero eyebrow="OVER LRS" title="Korte lijnen. Duidelijk dakwerk." lead="LRS Daktechniek werkt vanuit Breda en kiest voor direct contact en begrijpelijke uitleg."/><section className="work-zone section-block"><div className="shell contact-proof-grid"><div><SectionIndex n="01" label="WERKWIJZE"/><p className="annotation">ÉÉN CONTACTLIJN</p><h2>De uitvoering hoeft niet door vijf lagen communicatie.</h2><p>De website is daarom net zo opgebouwd als de werkwijze: duidelijk, technisch en zonder onnodige tussenstappen.</p></div><SingleContactTable/></div></section></>;
}

function ServicesIndex(){return <><PageHero eyebrow="DIENSTEN" title="Van gericht herstel tot complete renovatie."/><section className="work-zone section-block"><div className="shell service-register">{services.map((s,i)=><Link key={s.slug} href={`/${s.slug}`}><span className="mono">{String(i+1).padStart(2,"0")}</span><div><small className="annotation">{s.eyebrow}</small><strong>{s.title}</strong><p>{s.intro}</p></div><span>↗</span></Link>)}</div></section></>}

function Privacy(){return <><PageHero eyebrow="PRIVACY" title="Privacyverklaring"/><section className="work-zone section-block"><div className="shell article-body-v2"><section><span className="mono">01</span><div><h2>Contactgegevens</h2><p>Contactgegevens worden verwerkt wanneer u die zelf verstrekt om uw vraag of opdracht te behandelen.</p></div></section><section><span className="mono">02</span><div><h2>Contact</h2><p>U kunt contact opnemen via {site.email}.</p></div></section><section><span className="mono">03</span><div><h2>Projectgegevens</h2><p>Klantadressen worden niet automatisch als openbare content gepubliceerd.</p></div></section></div></section></>}

function Footer() {
  return <footer className="site-footer-v2">
    <div className="shell footer-contact-zone">
      <SectionIndex n="10" label="CONTACT" dark/>
      <div><p className="annotation">VOLGENDE STAP</p><h2>Uw dak bespreken?</h2></div>
      <div className="footer-actions"><a className="btn primary-dark" href={`tel:${site.phoneHref}`}>BEL LRS</a><a className="footer-phone mono" href={`tel:${site.phoneHref}`}>{site.phoneDisplay}</a><a href={`mailto:${site.email}`}>{site.email}</a></div>
    </div>
    <div className="shell title-block">
      <div className="title-brand"><strong>LRS DAKTECHNIEK</strong><span className="annotation">DIGITAAL DAKDOCUMENT</span></div>
      <dl>
        <div><dt>ONDERWERP</dt><dd>Dakwerk Breda e.o.</dd></div>
        <div><dt>BLAD</dt><dd className="mono">01 / 01</dd></div>
        <div><dt>DATUM</dt><dd className="mono">{new Date().getFullYear()}</dd></div>
        <div><dt>UITGEVOERD DOOR</dt><dd>LRS Daktechniek</dd></div>
        <div><dt>TELEFOON</dt><dd className="mono">{site.phoneDisplay}</dd></div>
        <div><dt>KVK</dt><dd className="mono">{site.kvk}</dd></div>
      </dl>
    </div>
    <div className="shell legal-row"><span>© {new Date().getFullYear()} LRS Daktechniek</span>{projects.length > 0 && <Link href="/projecten">Projecten</Link>}<Link href="/beoordelen">Beoordelen</Link><Link href="/privacyverklaring">Privacy</Link><span>{site.hours}</span></div>
  </footer>;
}

function NotFound(){return <section className="notfound-v2"><div className="shell"><span className="mono">404</span><h1>Deze pagina bestaat niet.</h1><Link className="btn primary-dark" href="/">TERUG NAAR HOME</Link></div></section>}

export function PublicSite({segments}:{segments:string[]}) {
  const path=segments.join("/");
  let view:ReactNode;
  if(!path) view=<Home/>;
  else if(path==="diensten") view=<ServicesIndex/>;
  else if(path==="dakcheck") view=<Dakcheck/>;
  else if(path==="prijsindicatie") view=<PricePage/>;
  else if(path==="dak-lekkage") view=<LeakagePage/>;
  else if(path==="projecten") view=<ProjectsIndex/>;
  else if(segments[0]==="projecten" && segments[1] && projectBySlug(segments[1])) view=<ProjectPage slug={segments[1]}/>;
  else if(path==="beoordelen") view=<ReviewPage/>;
  else if(path==="contact") view=<Contact/>;
  else if(path==="werkgebied") view=<WorkArea/>;
  else if(path==="over-ons") view=<About/>;
  else if(path==="privacyverklaring") view=<Privacy/>;
  else if(path==="blog-s") view=<BlogIndex/>;
  else if(segments[0]==="blog-s" && segments[1] && articleBySlug(segments[1])) view=<Article slug={segments[1]}/>;
  else if(serviceBySlug(path)) view=<ServicePage slug={path}/>;
  else if(path==="dakdekker-breda") view=<BredaPage/>;
  else if(locationBySlug(path)) view=<LocalPage slug={path}/>;
  else view=<NotFound/>;

  return <>
    <Waterline/>
    <Header/>
    <main id="main">{view}</main>
    <Footer/>
    <div className="mobile-contact-bar"><a href={`tel:${site.phoneHref}`}>BEL</a><Link href="/prijsindicatie">PRIJSINDICATIE</Link></div>
  </>;
}
