"use client";

import Link from "next/link";
import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { articles, articleBySlug, locationBySlug, locations, serviceBySlug, services, site, whatsapp } from "@/lib/content";

function Header() {
  return (
    <>
      <div className="utility-bar">
        <div className="container utility-inner">
          <span>DAKDEKKER BREDA & OMGEVING</span>
          <div><span>{site.shortHours}</span><a href={`tel:${site.phoneHref}`}>{site.phoneDisplay}</a></div>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="brand">
            <span className="brand-mark compact"><span>LRS</span><i /></span>
            <span className="brand-copy"><strong>Daktechniek</strong><small>Breda & omgeving</small></span>
          </Link>
          <nav className="desktop-nav">
            <Link href="/diensten">Diensten</Link>
            <Link href="/dakcheck">Dakcheck</Link>
            <Link href="/dak-lekkage">Daklekkage</Link>
            <Link href="/werkgebied">Werkgebied</Link>
            <Link href="/blog-s">Kennisbank</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <Link className="button header-cta" href="/prijsindicatie">Prijsindicatie</Link>
          <details className="mobile-menu">
            <summary><span/><span/><span/></summary>
            <div className="mobile-menu-panel">
              <nav>
                {[
                  ["/diensten","Diensten"],["/dakcheck","Dakcheck"],["/dak-lekkage","Daklekkage"],
                  ["/werkgebied","Werkgebied"],["/blog-s","Kennisbank"],["/contact","Contact"]
                ].map(([href,label])=><Link key={href} href={href}>{label}<b>↗</b></Link>)}
              </nav>
              <Link className="button button-full" href="/prijsindicatie">Prijsindicatie</Link>
            </div>
          </details>
        </div>
      </header>
    </>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <div className="brand brand-dark">
            <span className="brand-mark compact"><span>LRS</span><i /></span>
            <span className="brand-copy"><strong>Daktechniek</strong><small>Breda & omgeving</small></span>
          </div>
          <p>Direct contact voor dakwerk in Breda en omliggende plaatsen.</p>
          <a className="footer-phone" href={`tel:${site.phoneHref}`}>{site.phoneDisplay}</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </div>
        <div><h3>Diensten</h3><div className="footer-links">{services.map(s=><Link key={s.slug} href={`/${s.slug}`}>{s.name}</Link>)}</div></div>
        <div><h3>Kerngebied</h3><div className="footer-links">{locations.filter(l=>l[2]==="A").map(l=><Link key={l[0]} href={`/${l[0]}`}>{l[1]}</Link>)}</div></div>
        <div><h3>LRS</h3><div className="footer-links"><Link href="/over-ons">Over ons</Link><Link href="/prijsindicatie">Prijsindicatie</Link><Link href="/blog-s">Kennisbank</Link><Link href="/contact">Contact</Link></div><p className="footer-meta">KVK {site.kvk}<br/>{site.hours}</p></div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} LRS Daktechniek</span><span>Uw dak duidelijk.</span></div>
    </footer>
  );
}

function CTA({title="Niet zeker wat uw dak nodig heeft?"}:{title?:string}) {
  return <section className="mega-cta"><div><p className="eyebrow light">VOLGENDE STAP</p><h2>{title}</h2><p>Begin met de Dakcheck of neem direct contact op. Foto’s zijn niet verplicht.</p></div><div className="mega-cta-actions"><Link className="button button-light" href="/dakcheck">Doe de Dakcheck</Link><Link className="button button-outline-light" href="/prijsindicatie">Prijsindicatie</Link><a href={whatsapp()} target="_blank">WhatsApp ↗</a><a href={`tel:${site.phoneHref}`}>{site.phoneDisplay}</a></div></section>;
}

function RoofScrollLine() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      setProgress(Math.min(1, Math.max(0, window.scrollY / max)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="roof-scroll-line" aria-hidden="true">
      <svg viewBox="0 0 180 1200" preserveAspectRatio="none">
        <path
          className="roof-scroll-base"
          d="M142 0 L142 110 L74 168 L142 226 L142 355 L94 395 L142 435 L142 565 L58 634 L142 703 L142 830 L88 875 L142 920 L142 1200"
        />
        <path
          className="roof-scroll-active"
          pathLength="1"
          style={{ strokeDasharray: 1, strokeDashoffset: 1 - progress }}
          d="M142 0 L142 110 L74 168 L142 226 L142 355 L94 395 L142 435 L142 565 L58 634 L142 703 L142 830 L88 875 L142 920 L142 1200"
        />
      </svg>
      <span className="roof-scroll-caption">DAKLIJN / LRS</span>
    </div>
  );
}

function Home() {
  return (
    <>
      <RoofScrollLine />

      <section className="v4-hero">
        <div className="v4-hero-glow" aria-hidden="true" />
        <div className="container v4-hero-shell">
          <div className="v4-hero-main">
            <div className="v4-hero-index">
              <span>01 / LRS DAKTECHNIEK</span>
              <span>BREDA · NOORD-BRABANT</span>
            </div>

            <h1>
              Uw dak.
              <span>Goed gedaan.</span>
            </h1>

            <p className="v4-hero-lead">
              Pannendaken, bitumen, isolatie, lekkages en schoorsteenwerk. Eén aanspreekpunt,
              een duidelijke technische route en geen onnodige ruis.
            </p>

            <div className="v4-hero-actions">
              <Link className="v4-primary" href="/dakcheck">
                <span>Start de Dakcheck</span>
                <b>↗</b>
              </Link>
              <Link className="v4-ghost" href="/prijsindicatie">
                Prijsindicatie
              </Link>
            </div>

            <div className="v4-proof-strip">
              <div><small>01</small><strong>Direct contact</strong><span>Met LRS zelf</span></div>
              <div><small>02</small><strong>Technisch duidelijk</strong><span>Eerst begrijpen, dan uitvoeren</span></div>
              <div><small>03</small><strong>Lokale focus</strong><span>Breda & omgeving</span></div>
            </div>
          </div>

          <div className="v4-hero-visual" aria-hidden="true">
            <div className="v4-visual-grid" />
            <svg viewBox="0 0 760 620">
              <defs>
                <linearGradient id="v4roof" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#94a9b6" />
                  <stop offset="48%" stopColor="#3d6278" />
                  <stop offset="100%" stopColor="#18262f" />
                </linearGradient>
                <linearGradient id="v4wall" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#172129" />
                  <stop offset="100%" stopColor="#090d11" />
                </linearGradient>
              </defs>
              <path d="M66 326 382 82 696 326" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="2" />
              <path d="M100 324 382 111 663 324 610 348 382 177 152 349Z" fill="url(#v4roof)" />
              <path d="M157 340h449v222H157z" fill="url(#v4wall)" />
              <path d="M157 340h449" stroke="#7892a1" strokeWidth="2" opacity=".55" />
              <rect x="333" y="410" width="98" height="152" fill="#070a0d" />
              <rect x="205" y="397" width="88" height="72" rx="2" fill="#eaf0f3" />
              <rect x="470" y="397" width="88" height="72" rx="2" fill="#eaf0f3" />
              <path d="M205 433h88M249 397v72M470 433h88M514 397v72" stroke="#8298a5" strokeWidth="2" opacity=".7" />
              <path d="M181 360h402" stroke="rgba(255,255,255,.08)" strokeWidth="1" />
            </svg>

            <div className="v4-spec v4-spec-a"><span>01</span><div><b>HELLEND DAK</b><small>Laag voor laag bekeken</small></div></div>
            <div className="v4-spec v4-spec-b"><span>02</span><div><b>PLAT DAK</b><small>Details bepalen waterdichtheid</small></div></div>
            <div className="v4-coordinate">51.5719° N / 4.7683° E</div>
          </div>
        </div>
      </section>

      <section className="v4-marquee" aria-label="Specialismen">
        <div>
          <span>PANNENDAKEN</span><i>◆</i><span>BITUMEN</span><i>◆</i><span>DAKISOLATIE</span><i>◆</i><span>DAKLEKKAGE</span><i>◆</i><span>SCHOORSTEENWERK</span>
        </div>
      </section>

      <section className="v4-section v4-services-section">
        <div className="container">
          <div className="v4-section-head">
            <div><span className="v4-label">02 / SPECIALISMEN</span><h2>Niet alles tegelijk.<br/>Wel alles in samenhang.</h2></div>
            <p>Een dak is een systeem. Daarom begint goed werk niet bij een product, maar bij het onderdeel dat werkelijk aandacht nodig heeft.</p>
          </div>

          <div className="v4-services">
            {services.map((s, i) => (
              <Link className="v4-service-row" key={s.slug} href={`/${s.slug}`}>
                <span className="v4-service-no">{String(i + 1).padStart(2, "0")}</span>
                <div><small>{s.eyebrow}</small><h3>{s.name}</h3></div>
                <p>{s.intro}</p>
                <span className="v4-service-arrow">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="v4-dark-panel">
        <div className="container v4-diagnostic-layout">
          <div className="v4-diagnostic-copy">
            <span className="v4-label v4-label-light">03 / DAKCHECK</span>
            <h2>U hoeft het probleem niet eerst zelf te benoemen.</h2>
            <p>Vertel wat u ziet. De Dakcheck brengt u naar de meest logische vervolgstap zonder te doen alsof een website op afstand een definitieve diagnose kan stellen.</p>
            <Link className="v4-primary v4-primary-light" href="/dakcheck"><span>Open Dakcheck</span><b>↗</b></Link>
          </div>

          <div className="v4-diagnostic-ui">
            <div className="v4-ui-head"><span>LRS / DAKCHECK</span><b>ONLINE</b></div>
            {["Wat speelt er op het dak?","Welk daktype heeft u?","Hoe urgent is de situatie?"].map((label, i) => (
              <div className={i === 0 ? "v4-ui-row active" : "v4-ui-row"} key={label}>
                <span>{String(i + 1).padStart(2, "0")}</span><strong>{label}</strong><i>→</i>
              </div>
            ))}
            <div className="v4-ui-foot"><span>GEEN FOTO VERPLICHT</span><span>± 60 SEC</span></div>
          </div>
        </div>
      </section>

      <section className="v4-section v4-technical-section">
        <div className="container v4-tech-grid">
          <div className="v4-tech-copy">
            <span className="v4-label">04 / DAKOPBOUW</span>
            <h2>Wat u bovenop ziet, is maar één laag.</h2>
            <p>Een professioneel dakdetail draait om de complete opbouw. Daarom laat LRS niet alleen het eindmateriaal zien, maar ook wat daaronder technisch meespeelt.</p>
            <Link className="v4-text-link" href="/diensten">Bekijk alle diensten <span>↗</span></Link>
          </div>

          <div className="v4-layer-stack">
            {["Dakpan","Panlat","Tengel","Folie","Dakbeschot","Isolatie"].map((layer, i) => (
              <div key={layer} style={{ "--layer": i } as React.CSSProperties}>
                <span>{String(i + 1).padStart(2, "0")}</span><strong>{layer}</strong><small>{i === 0 ? "buitenlaag" : i === 5 ? "comfortlaag" : "onderdeel dakopbouw"}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="v4-price-section">
        <div className="container v4-price-card">
          <div className="v4-price-copy">
            <span className="v4-label v4-label-light">05 / PRIJSINDICATIE</span>
            <h2>Een bedrag tonen als het verantwoord is.</h2>
            <p>Geen kunstmatige vanaf-prijzen voor werk dat eerst bekeken moet worden. Voor daklekkage is er wel een bestaande indicatieve bandbreedte.</p>
            <Link className="v4-primary v4-primary-light" href="/prijsindicatie"><span>Open prijsindicatie</span><b>↗</b></Link>
          </div>
          <div className="v4-price-number">
            <small>DAKLEKKAGE · INDICATIE</small>
            <strong>€242<span>—</span>€423,50</strong>
            <p>Inclusief 21% btw</p>
          </div>
        </div>
      </section>

      <section className="v4-section v4-local-section">
        <div className="container v4-local-grid">
          <div>
            <span className="v4-label">06 / REGIO</span>
            <h2>Breda als basis.<br/>De regio als werkgebied.</h2>
          </div>
          <div className="v4-local-links">
            {locations.filter((l) => l[2] === "A").map((l) => (
              <Link key={l[0]} href={`/${l[0]}`}><span>{l[1]}</span><i>↗</i></Link>
            ))}
            <Link href="/werkgebied"><span>Volledig werkgebied</span><i>↗</i></Link>
          </div>
        </div>
      </section>

      <div className="container v4-cta-wrap"><CTA title="Uw dak bespreken zonder omwegen?" /></div>
    </>
  );
}

function ServicePage({slug}:{slug:string}) {
  const s=serviceBySlug(slug)!;
  return <>
    <section className="compact-page-hero"><div className="container"><p className="compact-kicker">{s.eyebrow}</p><h1>{s.title}</h1><p className="compact-lead">{s.hero}</p><p>{s.intro}</p><div className="hero-actions"><Link className="button" href="/dakcheck">Dakcheck</Link><Link className="button button-secondary" href="/prijsindicatie">Prijsindicatie</Link></div></div></section>
    <section className="section"><div className="container compact-grid-2"><div><p className="eyebrow">SIGNALEN</p><h2>Wanneer is controle logisch?</h2></div><div>{s.symptoms.map((x,i)=><div className="screen-line" key={x}><b>{String(i+1).padStart(2,"0")}</b><strong>{x}</strong></div>)}</div></div></section>
    <section className="section section-ink"><div className="container"><div className="section-title"><p className="eyebrow light">TECHNISCHE CHECK</p><h2>Wat wordt bekeken?</h2></div><div className="check-grid">{s.checks.map((x,i)=><article key={x}><span>{String(i+1).padStart(2,"0")}</span><h3>{x}</h3></article>)}</div></div></section>
    <div className="container"><CTA/></div>
  </>;
}

function Dakcheck() {
  const [issue,setIssue]=useState("Ik weet het niet");
  const [roof,setRoof]=useState("Weet ik niet");
  const route = issue.includes("lekk")?"/dak-lekkage":issue.includes("Pannen")?"/dakpannen":issue.includes("Bitumen")?"/betumendaken":issue.includes("isolatie")?"/dak-isolatie":issue.includes("Schoorsteen")?"/schoorsteen-verwijderen":"/contact";
  return <><section className="compact-page-hero"><div className="container"><p className="compact-kicker">INTERACTIEVE DAKCHECK</p><h1>Van wat u ziet naar een logische volgende stap.</h1><p className="compact-lead">Geen diagnose op afstand, wel snel bepalen welke informatie relevant is.</p></div></section><section className="section section-soft"><div className="container dakcheck-shell"><div className="dakcheck-section"><h2>Wat speelt er?</h2><div className="choice-grid">{["Lekkage","Pannendak","Bitumen / plat dak","Dakisolatie","Schoorsteen","Ik weet het niet"].map(x=><button key={x} className={issue===x?"choice active":"choice"} onClick={()=>setIssue(x)}><strong>{x}</strong></button>)}</div></div><div className="dakcheck-section compact-section"><h3>Welk daktype?</h3><div className="segmented">{["Hellend","Plat","Weet ik niet"].map(x=><button key={x} className={roof===x?"active":""} onClick={()=>setRoof(x)}>{x}</button>)}</div></div><div className="dakcheck-result"><div className="result-label">UW ROUTE</div><h2>{issue}</h2><p>Daktype: {roof}. Bekijk de bijpassende dienst of stuur deze informatie door.</p><div className="hero-actions"><Link className="button button-light" href={route}>Bekijk route</Link><a className="button button-outline-light" href={whatsapp(`Hallo LRS, ik deed de Dakcheck.\nOnderwerp: ${issue}\nDaktype: ${roof}`)} target="_blank">WhatsApp</a></div></div></div></section></>;
}

function PricePage() {
  const [type,setType]=useState("Daklekkage");
  const [area,setArea]=useState(50);
  const isLeak=type==="Daklekkage";
  return <><section className="compact-page-hero"><div className="container"><p className="compact-kicker">PRIJSINDICATIE</p><h1>Geen lokprijs. Wel een bruikbare richting.</h1></div></section><section className="section section-ink"><div className="container price-engine"><div className="price-engine-head"><div><p className="eyebrow light">LRS PRIJSENGINE</p><h2>Kies uw situatie.</h2></div><p>Alleen bekende prijsregels worden als bedrag getoond.</p></div><div className="price-grid" style={{padding:"38px"}}><label><span>Categorie</span><select value={type} onChange={e=>setType(e.target.value)}><option>Daklekkage</option><option>Pannendak</option><option>Bitumen</option><option>Dakisolatie</option><option>Schoorsteen</option></select></label><label><span>Oppervlakte</span><input type="number" value={area} onChange={e=>setArea(Number(e.target.value))}/></label></div><div className="price-result"><div><p className="eyebrow">UITKOMST</p><h3>{type}</h3></div><div className="price-number"><strong>{isLeak?"€242 – €423,50":"Prijs op maat"}</strong><span>{isLeak?"incl. 21% btw":"geen verzonnen standaardbedrag"}</span></div><a className="button" href={whatsapp(`Hallo LRS, prijsindicatie: ${type}, ${area} m²`)} target="_blank">Bespreek selectie</a></div></div></section></>;
}

function Contact() {
  const [name,setName]=useState(""); const [place,setPlace]=useState(""); const [text,setText]=useState("");
  const message=useMemo(()=>`Hallo LRS Daktechniek.\nNaam: ${name}\nPlaats: ${place}\nSituatie: ${text}`,[name,place,text]);
  function submit(e:FormEvent){e.preventDefault(); window.open(whatsapp(message),"_blank");}
  return <><section className="compact-page-hero"><div className="container"><p className="compact-kicker">CONTACT</p><h1>Geen callcenter. Gewoon LRS.</h1><p className="compact-lead">Foto’s zijn handig, maar niet nodig om uw vraag te stellen.</p></div></section><section className="section section-soft"><div className="container contact-wizard"><div className="contact-wizard-intro"><h2>Snelle aanvraag</h2></div><form onSubmit={submit}><div className="contact-form-grid"><label><span>Naam</span><input required value={name} onChange={e=>setName(e.target.value)}/></label><label><span>Woonplaats</span><input required value={place} onChange={e=>setPlace(e.target.value)}/></label><label className="span-2"><span>Situatie</span><textarea required rows={5} value={text} onChange={e=>setText(e.target.value)}/></label></div><button className="button">Open in WhatsApp</button></form></div></section></>;
}

function WorkArea() {
  return <><section className="compact-page-hero"><div className="container"><p className="compact-kicker">WERKGEBIED</p><h1>Breda en de regio eromheen.</h1><p className="compact-lead">Lokale focus zonder fictieve vestigingen.</p></div></section><section className="section"><div className="container compact-local-board">{locations.map(l=><Link key={l[0]} href={`/${l[0]}`}><span><small>DAKDEKKER</small><br/><strong>{l[1]}</strong></span><i>↗</i></Link>)}</div></section></>;
}

function LocalPage({slug}:{slug:string}) {
  const l=locationBySlug(slug)!;
  return <><section className="compact-page-hero"><div className="container"><p className="compact-kicker">WERKGEBIED</p><h1>Dakdekker {l.name}</h1><p className="compact-lead">LRS Daktechniek voor pannendaken, bitumen, isolatie, lekkage en schoorsteenwerk in {l.name} en de regio Breda.</p><div className="hero-actions"><Link className="button" href="/dakcheck">Dakcheck</Link><Link className="button button-secondary" href="/prijsindicatie">Prijsindicatie</Link></div></div></section><section className="section section-soft"><div className="container compact-grid-3">{services.map(s=><Link className="compact-link-card" key={s.slug} href={`/${s.slug}`}><small>{s.eyebrow}</small><strong>{s.name}</strong><span>Bekijk dienst ↗</span></Link>)}</div></section><div className="container"><CTA title={`Dakwerk in ${l.name} bespreken?`}/></div></>;
}

function BlogIndex() {
  return <><section className="compact-page-hero"><div className="container"><p className="compact-kicker">KENNISBANK</p><h1>Dakvragen duidelijk uitgelegd.</h1></div></section><section className="section"><div className="container compact-grid-2">{articles.map(a=><Link className="compact-link-card" key={a.slug} href={`/blog-s/${a.slug}`}><small>KENNISBANK</small><strong>{a.title}</strong><p>{a.description}</p></Link>)}</div></section></>;
}
function Article({slug}:{slug:string}) {
  const a=articleBySlug(slug)!;
  return <><section className="compact-page-hero"><div className="container"><p className="compact-kicker">KENNISBANK</p><h1>{a.title}</h1><p className="compact-lead">{a.description}</p></div></section><section className="section"><div className="container compact-article-body">{a.sections.map(([h,b])=><section key={h}><h2>{h}</h2><p>{b}</p></section>)}</div></section></>;
}
function About() {return <><section className="compact-page-hero"><div className="container"><p className="compact-kicker">OVER LRS</p><h1>Korte lijnen. Duidelijk dakwerk.</h1><p className="compact-lead">LRS Daktechniek werkt vanuit Breda en kiest voor direct contact en begrijpelijke uitleg.</p></div></section><section className="section"><div className="container compact-grid-3"><div className="compact-card"><h3>Direct</h3><p>Geen onnodige tussenlagen.</p></div><div className="compact-card"><h3>Duidelijk</h3><p>Eerst uitleggen wat technisch nodig is.</p></div><div className="compact-card"><h3>Lokaal</h3><p>Focus op Breda en omgeving.</p></div></div></section></>}
function ServicesIndex(){return <><section className="compact-page-hero"><div className="container"><p className="compact-kicker">DIENSTEN</p><h1>Van gericht herstel tot complete renovatie.</h1></div></section><section className="section"><div className="container compact-grid-2">{services.map(s=><Link className="compact-link-card" key={s.slug} href={`/${s.slug}`}><small>{s.eyebrow}</small><strong>{s.title}</strong><p>{s.intro}</p></Link>)}</div></section></>}
function Privacy(){return <section className="section"><div className="container compact-article-body"><p className="compact-kicker">PRIVACY</p><h1>Privacyverklaring</h1><p>Contactgegevens worden verwerkt wanneer u die zelf verstrekt om uw vraag of opdracht te behandelen.</p><h2>Contact</h2><p>U kunt contact opnemen via {site.email}.</p><h2>Projectgegevens</h2><p>Klantadressen worden niet automatisch als openbare content gepubliceerd.</p></div></section>}

export function PublicSite({segments}:{segments:string[]}) {
  const path=segments.join("/");
  let view:React.ReactNode;
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
  else view=<section className="notfound"><div className="container"><span>404</span><h1>Deze pagina bestaat niet.</h1><Link className="button" href="/">Homepage</Link></div></section>;
  return <><Header/><main id="main">{view}</main><Footer/><div className="mobile-actions"><a href={`tel:${site.phoneHref}`}>Bellen</a><a href={whatsapp()} target="_blank">WhatsApp</a><Link href="/dakcheck">Dakcheck</Link><Link href="/prijsindicatie">Prijs</Link></div></>;
}
