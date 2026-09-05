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
  locationBySlug,
  locations,
  serviceBySlug,
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
          <Link href="/" className="wordmark" aria-label="LRS Daktechniek homepage">
            <strong>LRS</strong><span>DAKTECHNIEK</span>
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
    <section className="hero-v2">
      <div className="hero-tonal-step" aria-hidden="true"/>
      <svg className="hero-roof-line" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
        <line x1="0" y1="760" x2="1600" y2="90"/>
        <line className="hero-angle-tick" x1="1220" y1="230" x2="1250" y2="260"/>
      </svg>
      <div className="shell hero-content">
        <div className="hero-copy">
          <SectionIndex n="01" label="BREDA E.O." dark/>
          <p className="annotation hero-code">LRS / DAKWERK / DIRECT CONTACT</p>
          <h1>LRS <span>DAKTECHNIEK</span></h1>
          <p className="hero-statement">U spreekt de dakdekker die het werk uitvoert.</p>
        </div>
        <div className="hero-angle mono">40°</div>
        <div className="hero-action-zone">
          <DimensionLine value="VOLGENDE STAP" dark/>
          <div className="hero-actions-v2">
            <Link className="btn primary-dark" href="/prijsindicatie">PRIJSINDICATIE</Link>
            <a className="phone-action mono" href={`tel:${site.phoneHref}`}>{site.phoneDisplay}</a>
          </div>
          <div className="hero-subroute">
            <Link href="/dakcheck">Ik weet niet wat er nodig is → Dakcheck</Link>
          </div>
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
  const visible = only?.length ? detailSpecs.filter(([letter])=>only.includes(letter)) : detailSpecs;
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

function WorkAreaSchematic() {
  const core = locations.filter((l)=>l[2]==="A").slice(0,5);
  const ring = locations.filter((l)=>l[2]!=="A").slice(0,8);
  return (
    <div className="survey-map" aria-label="Schematische weergave van het werkgebied rond Breda">
      <div className="survey-caption"><span className="annotation">SCHEMATISCHE WERKREGIO</span><span className="mono">BREDA / NOORD-BRABANT</span></div>
      <svg viewBox="0 0 900 520" aria-hidden="true">
        <path d="M92 375 215 240 390 260 470 128 650 185 790 95"/>
        <path d="M120 105 235 205 390 160 520 282 710 242 815 365"/>
        <circle cx="430" cy="260" r="54"/><circle cx="430" cy="260" r="4" className="survey-core"/>
        {["170,190","270,330","535,160","605,325","735,205","690,390","335,120","155,390"].map((p)=><circle key={p} cx={p.split(",")[0]} cy={p.split(",")[1]} r="3"/>)}
      </svg>
      <div className="survey-labels"><div className="survey-core-label"><strong>BREDA</strong><span className="annotation">KERNREGIO</span></div>{core.filter((x)=>x[1]!=="Breda").map((l)=><Link href={`/${l[0]}`} key={l[0]}>{l[1]}</Link>)}</div>
      <div className="survey-ring">{ring.map((l)=><Link href={`/${l[0]}`} key={l[0]}>{l[1]}</Link>)}</div>
    </div>
  );
}

function Home() {
  return (
    <>
      <Hero/>
      <SituationRouter/>

      <section className="work-zone section-block">
        <div className="shell">
          <SectionIndex n="03" label="DAKOPBOUW"/>
          <div className="section-heading split-heading"><div><p className="annotation">TECHNISCHE DOORSNEDE</p><h2>Een dak is een systeem van lagen.</h2></div><p>Niet automatisch alles vervangen. Eerst bepalen welke laag werkelijk aandacht nodig heeft.</p></div>
          <RoofAssembly/>
        </div>
      </section>

      <section className="paper-deep-zone section-block">
        <div className="shell">
          <SectionIndex n="04" label="MATERIAALSTAAT"/>
          <div className="section-heading split-heading"><div><p className="annotation">MATERIALEN / OPBOUW</p><h2>Materiaal als technische informatie.</h2></div><p>Geen decoratieve stockfoto’s. Elke arcering verwijst naar een werkelijk onderdeel van het dak.</p></div>
          <MaterialState/>
        </div>
      </section>

      <section className="work-zone section-block">
        <div className="shell price-home-grid">
          <div>
            <SectionIndex n="05" label="PRIJSINDICATIE"/>
            <p className="annotation">OPGEMETEN VLAK</p>
            <h2>Een bedrag wanneer dat verantwoord kan.</h2>
            <p className="body-large">Voor daklekkage is de huidige openbare indicatie <span className="mono">€242 – €423,50</span> incl. btw. Grotere werkzaamheden blijven maatwerk.</p>
            <DimensionLine value="GEEN LOKPRIJS"/>
            <Link className="btn primary-light" href="/prijsindicatie">OPEN PRIJSINDICATIE</Link>
          </div>
          <MeasuredArea area={50}/>
        </div>
      </section>

      <section className="work-zone section-block section-rule-top">
        <div className="shell">
          <SectionIndex n="06" label="TERUGHOUDEND ADVIES"/>
          <div className="section-heading split-heading"><div><p className="annotation">WANNEER NIET ALLES NODIG IS</p><h2>Eerst vaststellen wat er werkelijk aan de hand is.</h2></div><p>De oxide markering hieronder laat alleen het mogelijke faalpunt zien. Niet automatisch het hele dak.</p></div>
          <NotNeededSection/>
        </div>
      </section>

      <section className="paper-deep-zone section-block">
        <div className="shell">
          <SectionIndex n="07" label="PRINCIPEDETAILS"/>
          <div className="section-heading split-heading"><div><p className="annotation">TECHNISCHE UITLEG</p><h2>Vier details die vaak het verschil maken.</h2></div><p>Deze tekeningen zijn educatief en niet gekoppeld aan een uitgevoerd project.</p></div>
          <PrincipleDetails/>
        </div>
      </section>

      <section className="work-zone section-block">
        <div className="shell contact-proof-grid">
          <div>
            <SectionIndex n="08" label="ÉÉN AANSPREEKPUNT"/>
            <p className="annotation">WERKWIJZE</p>
            <h2>Van eerste vraag tot oplevering: LRS.</h2>
            <p>Geen callcenter als uitgangspunt van de klantreis. U houdt één duidelijke contactlijn.</p>
            <a className="contact-number mono" href={`tel:${site.phoneHref}`}>{site.phoneDisplay}</a>
          </div>
          <SingleContactTable/>
        </div>
      </section>

      <section className="dark-zone section-block">
        <div className="shell">
          <SectionIndex n="09" label="WERKGEBIED" dark/>
          <div className="section-heading split-heading dark-heading"><div><p className="annotation">BREDA & OMGEVING</p><h2>Lokale focus, zonder fictieve vestigingen.</h2></div><p>De kaart is schematisch. De plaatsnamen verwijzen naar de bestaande werkgebiedpagina’s.</p></div>
          <WorkAreaSchematic/>
        </div>
      </section>
    </>
  );
}

function PageHero({ eyebrow, title, lead, angle="40°" }: { eyebrow: string; title: string; lead?: string; angle?: string }) {
  return <section className="page-hero-v2"><div className="shell page-hero-inner"><div><p className="annotation">{eyebrow}</p><h1>{title}</h1>{lead && <p className="page-lead">{lead}</p>}</div><div className="page-angle"><DimensionLine value={angle}/></div></div></section>;
}

function CTA({ title="Niet zeker wat uw dak nodig heeft?" }: { title?: string }) {
  return <section className="cta-v2"><div><p className="annotation">VOLGENDE STAP</p><h2>{title}</h2><p>Start met de Dakcheck, vraag een prijsindicatie op of neem direct contact op.</p></div><div className="cta-actions-v2"><Link className="btn primary-dark" href="/dakcheck">START DAKCHECK</Link><Link className="text-action" href="/prijsindicatie">Prijsindicatie →</Link><a className="mono" href={`tel:${site.phoneHref}`}>{site.phoneDisplay}</a></div></section>;
}

function ServicePage({ slug }: { slug: string }) {
  const service = serviceBySlug(slug)!;
  const visual = serviceVisuals[slug] ?? serviceVisuals.dakpannen;
  return <>
    <PageHero eyebrow={`${service.eyebrow} / ${visual.material}`} title={service.title} lead={service.hero} angle={visual.angle}/>
    <section className="work-zone section-block"><div className="shell service-signal-grid"><div><SectionIndex n="01" label="SIGNALEN"/><p className="annotation">WANNEER CONTROLEREN</p><h2>{service.intro}</h2></div><div className="signal-register">{service.symptoms.map((x,i)=><div key={x}><span className="mono">{String(i+1).padStart(2,"0")}</span><strong>{x}</strong></div>)}</div></div></section>
    <section className="paper-deep-zone section-block"><div className="shell"><SectionIndex n="02" label="DAKOPBOUW"/><div className="section-heading split-heading"><div><p className="annotation">TECHNISCHE FOCUS</p><h2>Welke lagen verdienen hier aandacht?</h2></div><p>De relevante lagen zijn vooraf gemarkeerd; tik op een laag voor uitleg.</p></div><RoofAssembly focus={visual.layers}/></div></section>
    <section className="work-zone section-block"><div className="shell"><SectionIndex n="03" label="DETAILS"/><PrincipleDetails only={visual.details}/></div></section>
    <section className="work-zone section-block section-rule-top"><div className="shell compact-check-list"><div><p className="annotation">CONTROLEPUNTEN</p><h2>Wat wordt bekeken?</h2></div><div>{service.checks.map((x,i)=><div key={x}><span className="mono">{String(i+1).padStart(2,"0")}</span><strong>{x}</strong></div>)}</div></div></section>
    <div className="shell"><CTA title={`${service.name} bespreken?`}/></div>
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

function PricePage() {
  const [type,setType]=useState("Daklekkage");
  const [area,setArea]=useState(50);
  const isLeak=type==="Daklekkage";
  const options = ["Daklekkage","Pannendak","Bitumen","Dakisolatie","Schoorsteen"];
  return <>
    <PageHero eyebrow="PRIJSINDICATIE / OPGEMETEN VLAK" title="Geen lokprijs. Wel een bruikbare richting." lead="Alleen bekende prijsregels worden als bedrag getoond. Onbekende werkzaamheden blijven maatwerk."/>
    <section className="work-zone section-block"><div className="shell price-engine-v2">
      <div className="price-controls">
        <SectionIndex n="01" label="INVOER"/>
        <p className="annotation">CATEGORIE</p>
        <div className="material-choice-list">{options.map((x)=><button key={x} className={type===x?"active":""} onClick={()=>setType(x)}><span>{x}</span><span className="mono">{type===x?"ACTIEF":"+"}</span></button>)}</div>
        <label className="area-input"><span className="annotation">OPPERVLAKTE</span><div><input type="number" min="1" value={area} onChange={(e)=>setArea(Math.max(1,Number(e.target.value)||1))}/><span className="mono">M²</span></div></label>
      </div>
      <div className="price-drawing-panel"><MeasuredArea area={area}/><div className="price-output"><span className="annotation">INDICATIE</span><strong className={isLeak?"mono":""}>{isLeak?"€242 – €423,50":"Prijs op maat"}</strong><small>{isLeak?"incl. 21% btw · huidige openbare indicatie":"geen verzonnen standaardbedrag"}</small></div><a className="btn primary-light" href={whatsapp(`Hallo LRS, prijsindicatie: ${type}, circa ${area} m²`)} target="_blank" rel="noreferrer">BESPREEK DEZE SELECTIE</a></div>
    </div></section>
  </>;
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
  return <><PageHero eyebrow="WERKGEBIED / BREDA E.O." title="Breda en de regio eromheen." lead="Lokale focus zonder fictieve vestigingen."/><section className="dark-zone section-block"><div className="shell"><WorkAreaSchematic/><div className="location-register">{locations.map((l,i)=><Link key={l[0]} href={`/${l[0]}`}><span className="mono">{String(i+1).padStart(2,"0")}</span><strong>{l[1]}</strong><span>↗</span></Link>)}</div></div></section></>;
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
  return <><PageHero eyebrow="KENNISBANK" title={a.title} lead={a.description}/><section className="work-zone section-block"><article className="shell article-body-v2">{a.sections.map(([h,b],i)=><section key={h}><span className="mono">{String(i+1).padStart(2,"0")}</span><div><h2>{h}</h2><p>{b}</p></div></section>)}</article></section></>;
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
    <div className="shell legal-row"><span>© {new Date().getFullYear()} LRS Daktechniek</span><Link href="/privacyverklaring">Privacy</Link><span>{site.hours}</span></div>
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
  else if(path==="contact") view=<Contact/>;
  else if(path==="werkgebied") view=<WorkArea/>;
  else if(path==="over-ons") view=<About/>;
  else if(path==="privacyverklaring") view=<Privacy/>;
  else if(path==="blog-s") view=<BlogIndex/>;
  else if(segments[0]==="blog-s" && segments[1] && articleBySlug(segments[1])) view=<Article slug={segments[1]}/>;
  else if(serviceBySlug(path)) view=<ServicePage slug={path}/>;
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
