"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import {
  articles,
  articleBySlug,
  locationBySlug,
  locations,
  serviceBySlug,
  services,
  site,
  whatsapp
} from "@/lib/content";

function Header() {
  return (
    <>
      <div className="utility-bar">
        <div className="container utility-inner">
          <span>
            DAKDEKKER BREDA & OMGEVING
          </span>

          <div>
            <span>
              {site.shortHours}
            </span>

            <a href={`tel:${site.phoneHref}`}>
              {site.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      <header className="site-header">
        <div className="container header-inner">

          <Link
            href="/"
            className="brand"
          >
            <span className="brand-mark compact">
              <span>
                LRS
              </span>
              <i />
            </span>

            <span className="brand-copy">
              <strong>
                Daktechniek
              </strong>

              <small>
                Breda & omgeving
              </small>
            </span>
          </Link>

          <nav className="desktop-nav">
            <Link href="/diensten">
              Diensten
            </Link>

            <Link href="/dakcheck">
              Dakcheck
            </Link>

            <Link href="/dak-lekkage">
              Daklekkage
            </Link>

            <Link href="/werkgebied">
              Werkgebied
            </Link>

            <Link href="/blog-s">
              Kennisbank
            </Link>

            <Link href="/contact">
              Contact
            </Link>
          </nav>

          <Link
            className="button header-cta"
            href="/prijsindicatie"
          >
            Prijsindicatie
          </Link>

          <details className="mobile-menu">

            <summary>
              <span/>
              <span/>
              <span/>
            </summary>

            <div className="mobile-menu-panel">

              <nav>
                {[
                  ["/diensten","Diensten"],
                  ["/dakcheck","Dakcheck"],
                  ["/dak-lekkage","Daklekkage"],
                  ["/werkgebied","Werkgebied"],
                  ["/blog-s","Kennisbank"],
                  ["/contact","Contact"]
                ].map(([href,label])=>(
                  <Link
                    key={href}
                    href={href}
                  >
                    {label}
                    <b>
                      ↗
                    </b>
                  </Link>
                ))}
              </nav>

              <Link
                className="button button-full"
                href="/prijsindicatie"
              >
                Prijsindicatie
              </Link>

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

            <span className="brand-mark compact">
              <span>
                LRS
              </span>
              <i />
            </span>

            <span className="brand-copy">

              <strong>
                Daktechniek
              </strong>

              <small>
                Breda & omgeving
              </small>

            </span>

          </div>

          <p>
            Direct contact voor dakwerk in Breda en omliggende plaatsen.
          </p>

          <a
            className="footer-phone"
            href={`tel:${site.phoneHref}`}
          >
            {site.phoneDisplay}
          </a>

          <a href={`mailto:${site.email}`}>
            {site.email}
          </a>

        </div>

        <div>

          <h3>
            Diensten
          </h3>

          <div className="footer-links">
            {services.map(s=>(
              <Link
                key={s.slug}
                href={`/${s.slug}`}
              >
                {s.name}
              </Link>
            ))}
          </div>

        </div>

        <div>

          <h3>
            Kerngebied
          </h3>

          <div className="footer-links">
            {locations
              .filter(l=>l[2]==="A")
              .map(l=>(
                <Link
                  key={l[0]}
                  href={`/${l[0]}`}
                >
                  {l[1]}
                </Link>
              ))
            }
          </div>

        </div>

        <div>

          <h3>
            LRS
          </h3>

          <div className="footer-links">

            <Link href="/over-ons">
              Over ons
            </Link>

            <Link href="/prijsindicatie">
              Prijsindicatie
            </Link>

            <Link href="/blog-s">
              Kennisbank
            </Link>

            <Link href="/contact">
              Contact
            </Link>

          </div>

          <p className="footer-meta">
            KVK {site.kvk}
            <br/>
            {site.hours}
          </p>

        </div>

      </div>

      <div className="container footer-bottom">

        <span>
          © {new Date().getFullYear()} LRS Daktechniek
        </span>

        <span>
          Uw dak duidelijk.
        </span>

      </div>

    </footer>
  );
}

function CTA({
  title="Niet zeker wat uw dak nodig heeft?"
}:{
  title?:string
}) {
  return (
    <section className="mega-cta">

      <div>

        <p className="eyebrow light">
          VOLGENDE STAP
        </p>

        <h2>
          {title}
        </h2>

        <p>
          Begin met de Dakcheck of neem direct contact op. Foto’s zijn niet verplicht.
        </p>

      </div>

      <div className="mega-cta-actions">

        <Link
          className="button button-light"
          href="/dakcheck"
        >
          Doe de Dakcheck
        </Link>

        <Link
          className="button button-outline-light"
          href="/prijsindicatie"
        >
          Prijsindicatie
        </Link>

        <a
          href={whatsapp()}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp ↗
        </a>

        <a href={`tel:${site.phoneHref}`}>
          {site.phoneDisplay}
        </a>

      </div>

    </section>
  );
}

function Home() {
  return (
    <>

      <section className="home-hero">

        <div className="container home-hero-grid">

          <div className="home-hero-copy">

            <p className="eyebrow">
              LRS DAKTECHNIEK · BREDA
            </p>

            <h1>
              Uw dak duidelijk.
              <span>
                Van probleem naar oplossing.
              </span>
            </h1>

            <p className="hero-intro">
              Pannendaken, bitumen, isolatie, lekkages en schoorsteen verwijderen.
              Rechtstreeks contact met LRS.
            </p>

            <div className="hero-actions">

              <Link
                className="button"
                href="/dakcheck"
              >
                Start Dakcheck
              </Link>

              <Link
                className="button button-secondary"
                href="/prijsindicatie"
              >
                Prijsindicatie
              </Link>

            </div>

            <div className="micro-proof">

              <div>
                <strong>
                  01
                </strong>
                <span>
                  Direct contact
                </span>
              </div>

              <div>
                <strong>
                  02
                </strong>
                <span>
                  Lokale focus
                </span>
              </div>

              <div>
                <strong>
                  03
                </strong>
                <span>
                  Duidelijke prijsroute
                </span>
              </div>

            </div>

          </div>

          <div className="hero-art">

            <div className="hero-art-grid"/>

            <svg
              viewBox="0 0 720 560"
              aria-hidden="true"
            >

              <defs>
                <linearGradient
                  id="roofc"
                  x1="0"
                  x2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#6f8796"
                  />
                  <stop
                    offset="100%"
                    stopColor="#294b5e"
                  />
                </linearGradient>
              </defs>

              <path
                d="M90 300 360 92 630 300Z"
                fill="url(#roofc)"
              />

              <path
                d="M147 287h426v205H147z"
                fill="#11171d"
              />

              <rect
                x="316"
                y="365"
                width="88"
                height="127"
                fill="#070a0d"
              />

              <rect
                x="192"
                y="352"
                width="82"
                height="65"
                fill="#eef3f5"
              />

              <rect
                x="448"
                y="352"
                width="82"
                height="65"
                fill="#eef3f5"
              />

            </svg>

            <div className="floating-card floating-one">

              <span>
                01
              </span>

              <div>
                <strong>
                  Dakcheck
                </strong>
                <small>
                  In 60 seconden richting
                </small>
              </div>

            </div>

            <div className="floating-card floating-two">

              <span>
                02
              </span>

              <div>
                <strong>
                  Prijsindicatie
                </strong>
                <small>
                  Eerlijke prijsroute
                </small>
              </div>

            </div>

          </div>

        </div>

      </section>

      <section className="section">

        <div className="container">

          <div className="section-title section-title-wide">

            <div>

              <p className="eyebrow">
                DIENSTEN
              </p>

              <h2>
                Vijf specialismen. Eén aanspreekpunt.
              </h2>

            </div>

            <p>
              Kies het onderdeel van uw dak en lees direct waar technisch op gelet wordt.
            </p>

          </div>

          <div className="service-showcase">

            {services.map((s,i)=>(
              <Link
                className="service-tile"
                key={s.slug}
                href={`/${s.slug}`}
              >

                <div className="service-tile-top">

                  <span>
                    {String(i+1).padStart(2,"0")}
                  </span>

                  <span>
                    ↗
                  </span>

                </div>

                <div className="service-word">
                  {s.name.toUpperCase()}
                </div>

                <p className="eyebrow">
                  {s.eyebrow}
                </p>

                <h3>
                  {s.name}
                </h3>

                <p>
                  {s.intro}
                </p>

              </Link>
            ))}

          </div>

        </div>

      </section>

      <section className="section section-ink">

        <div className="container diagnostic-grid">

          <div className="diagnostic-copy">

            <p className="eyebrow light">
              DAKCHECK
            </p>

            <h2>
              U hoeft niet zelf de diagnose te kennen.
            </h2>

            <p>
              Kies wat u ziet en de website leidt u naar de juiste volgende stap.
            </p>

            <Link
              className="button button-light"
              href="/dakcheck"
            >
              Doe de Dakcheck
            </Link>

          </div>

          <div className="diagnostic-screen">

            <div className="screen-top">
              <span>
                DAKCHECK
              </span>
              <i>
                LIVE
              </i>
            </div>

            <div className="screen-line active">
              <b>
                01
              </b>
              <strong>
                Wat speelt er?
              </strong>
              <span>
                →
              </span>
            </div>

            <div className="screen-line">
              <b>
                02
              </b>
              <strong>
                Welk daktype?
              </strong>
              <span>
                →
              </span>
            </div>

            <div className="screen-line">
              <b>
                03
              </b>
              <strong>
                Hoe urgent?
              </strong>
              <span>
                →
              </span>
            </div>

          </div>

        </div>

      </section>

      <section className="section">

        <div className="container">

          <div className="price-teaser">

            <div className="price-teaser-main">

              <p className="eyebrow light">
                PRIJSINDICATIE
              </p>

              <h2>
                Een bedrag als het betrouwbaar kan.
              </h2>

              <p>
                Voor lekkage is een bestaande bandbreedte beschikbaar.
                Grotere renovaties blijven maatwerk.
              </p>

              <Link
                className="button button-light"
                href="/prijsindicatie"
              >
                Open prijsindicatie
              </Link>

            </div>

            <div className="price-teaser-number">

              <span>
                LEKKAGE
              </span>

              <strong>
                €242 – €423,50
              </strong>

              <small>
                incl. btw · huidige indicatie
              </small>

            </div>

          </div>

        </div>

      </section>

      <div className="container">
        <CTA/>
      </div>

    </>
  );
}

function ServicePage({
  slug
}:{
  slug:string
}) {
  const s=serviceBySlug(slug)!;

  return (
    <>

      <section className="compact-page-hero">

        <div className="container">

          <p className="compact-kicker">
            {s.eyebrow}
          </p>

          <h1>
            {s.title}
          </h1>

          <p className="compact-lead">
            {s.hero}
          </p>

          <p>
            {s.intro}
          </p>

          <div className="hero-actions">

            <Link
              className="button"
              href="/dakcheck"
            >
              Dakcheck
            </Link>

            <Link
              className="button button-secondary"
              href="/prijsindicatie"
            >
              Prijsindicatie
            </Link>

          </div>

        </div>

      </section>

      <section className="section">

        <div className="container compact-grid-2">

          <div>

            <p className="eyebrow">
              SIGNALEN
            </p>

            <h2>
              Wanneer is controle logisch?
            </h2>

          </div>

          <div>

            {s.symptoms.map((x,i)=>(
              <div
                className="screen-line"
                key={x}
              >

                <b>
                  {String(i+1).padStart(2,"0")}
                </b>

                <strong>
                  {x}
                </strong>

              </div>
            ))}

          </div>

        </div>

      </section>

      <section className="section section-ink">

        <div className="container">

          <div className="section-title">

            <p className="eyebrow light">
              TECHNISCHE CHECK
            </p>

            <h2>
              Wat wordt bekeken?
            </h2>

          </div>

          <div className="check-grid">

            {s.checks.map((x,i)=>(
              <article key={x}>

                <span>
                  {String(i+1).padStart(2,"0")}
                </span>

                <h3>
                  {x}
                </h3>

              </article>
            ))}

          </div>

        </div>

      </section>

      <div className="container">
        <CTA/>
      </div>

    </>
  );
}

function Dakcheck() {
  const [issue,setIssue]=useState(
    "Ik weet het niet"
  );

  const [roof,setRoof]=useState(
    "Weet ik niet"
  );

  const route=
    issue.includes("Lekkage")
      ?"/dak-lekkage"
      :issue.includes("Pannen")
        ?"/dakpannen"
        :issue.includes("Bitumen")
          ?"/betumendaken"
          :issue.includes("isolatie")
            ?"/dak-isolatie"
            :issue.includes("Schoorsteen")
              ?"/schoorsteen-verwijderen"
              :"/contact";

  return (
    <>

      <section className="compact-page-hero">

        <div className="container">

          <p className="compact-kicker">
            INTERACTIEVE DAKCHECK
          </p>

          <h1>
            Van wat u ziet naar een logische volgende stap.
          </h1>

          <p className="compact-lead">
            Geen diagnose op afstand, wel snel bepalen welke informatie relevant is.
          </p>

        </div>

      </section>

      <section className="section section-soft">

        <div className="container dakcheck-shell">

          <div className="dakcheck-section">

            <h2>
              Wat speelt er?
            </h2>

            <div className="choice-grid">

              {[
                "Lekkage",
                "Pannendak",
                "Bitumen / plat dak",
                "Dakisolatie",
                "Schoorsteen",
                "Ik weet het niet"
              ].map(x=>(
                <button
                  key={x}
                  className={
                    issue===x
                      ?"choice active"
                      :"choice"
                  }
                  onClick={()=>setIssue(x)}
                >
                  <strong>
                    {x}
                  </strong>
                </button>
              ))}

            </div>

          </div>

          <div className="dakcheck-section compact-section">

            <h3>
              Welk daktype?
            </h3>

            <div className="segmented">

              {[
                "Hellend",
                "Plat",
                "Weet ik niet"
              ].map(x=>(
                <button
                  key={x}
                  className={
                    roof===x
                      ?"active"
                      :""
                  }
                  onClick={()=>setRoof(x)}
                >
                  {x}
                </button>
              ))}

            </div>

          </div>

          <div className="dakcheck-result">

            <div className="result-label">
              UW ROUTE
            </div>

            <h2>
              {issue}
            </h2>

            <p>
              Daktype: {roof}. Bekijk de bijpassende dienst of stuur deze informatie door.
            </p>

            <div className="hero-actions">

              <Link
                className="button button-light"
                href={route}
              >
                Bekijk route
              </Link>

              <a
                className="button button-outline-light"
                href={whatsapp(
                  `Hallo LRS, ik deed de Dakcheck.\nOnderwerp: ${issue}\nDaktype: ${roof}`
                )}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>

            </div>

          </div>

        </div>

      </section>

    </>
  );
}

function PricePage() {
  const [type,setType]=useState(
    "Daklekkage"
  );

  const [area,setArea]=useState(50);

  const isLeak=
    type==="Daklekkage";

  return (
    <>

      <section className="compact-page-hero">

        <div className="container">

          <p className="compact-kicker">
            PRIJSINDICATIE
          </p>

          <h1>
            Geen lokprijs. Wel een bruikbare richting.
          </h1>

        </div>

      </section>

      <section className="section section-ink">

        <div className="container price-engine">

          <div className="price-engine-head">

            <div>

              <p className="eyebrow light">
                LRS PRIJSENGINE
              </p>

              <h2>
                Kies uw situatie.
              </h2>

            </div>

            <p>
              Alleen bekende prijsregels worden als bedrag getoond.
            </p>

          </div>

          <div
            className="price-grid"
            style={{padding:"38px"}}
          >

            <label>

              <span>
                Categorie
              </span>

              <select
                value={type}
                onChange={e=>
                  setType(
                    e.target.value
                  )
                }
              >

                <option>
                  Daklekkage
                </option>

                <option>
                  Pannendak
                </option>

                <option>
                  Bitumen
                </option>

                <option>
                  Dakisolatie
                </option>

                <option>
                  Schoorsteen
                </option>

              </select>

            </label>

            <label>

              <span>
                Oppervlakte
              </span>

              <input
                type="number"
                value={area}
                onChange={e=>
                  setArea(
                    Number(e.target.value)
                  )
                }
              />

            </label>

          </div>

          <div className="price-result">

            <div>

              <p className="eyebrow">
                UITKOMST
              </p>

              <h3>
                {type}
              </h3>

            </div>

            <div className="price-number">

              <strong>
                {isLeak
                  ?"€242 – €423,50"
                  :"Prijs op maat"
                }
              </strong>

              <span>
                {isLeak
                  ?"incl. 21% btw"
                  :"geen verzonnen standaardbedrag"
                }
              </span>

            </div>

            <a
              className="button"
              href={whatsapp(
                `Hallo LRS, prijsindicatie: ${type}, ${area} m²`
              )}
              target="_blank"
              rel="noreferrer"
            >
              Bespreek selectie
            </a>

          </div>

        </div>

      </section>

    </>
  );
}

function Contact() {
  const [name,setName]=useState("");
  const [place,setPlace]=useState("");
  const [text,setText]=useState("");

  const message=useMemo(
    ()=>`Hallo LRS Daktechniek.\nNaam: ${name}\nPlaats: ${place}\nSituatie: ${text}`,
    [name,place,text]
  );

  function submit(
    e:FormEvent<HTMLFormElement>
  ){
    e.preventDefault();

    window.open(
      whatsapp(message),
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <>

      <section className="compact-page-hero">

        <div className="container">

          <p className="compact-kicker">
            CONTACT
          </p>

          <h1>
            Geen callcenter. Gewoon LRS.
          </h1>

          <p className="compact-lead">
            Foto’s zijn handig, maar niet nodig om uw vraag te stellen.
          </p>

        </div>

      </section>

      <section className="section section-soft">

        <div className="container contact-wizard">

          <div className="contact-wizard-intro">

            <h2>
              Snelle aanvraag
            </h2>

          </div>

          <form onSubmit={submit}>

            <div className="contact-form-grid">

              <label>

                <span>
                  Naam
                </span>

                <input
                  required
                  value={name}
                  onChange={e=>
                    setName(
                      e.target.value
                    )
                  }
                />

              </label>

              <label>

                <span>
                  Woonplaats
                </span>

                <input
                  required
                  value={place}
                  onChange={e=>
                    setPlace(
                      e.target.value
                    )
                  }
                />

              </label>

              <label className="span-2">

                <span>
                  Situatie
                </span>

                <textarea
                  required
                  rows={5}
                  value={text}
                  onChange={e=>
                    setText(
                      e.target.value
                    )
                  }
                />

              </label>

            </div>

            <button className="button">
              Open in WhatsApp
            </button>

          </form>

        </div>

      </section>

    </>
  );
}

function WorkArea() {
  return (
    <>

      <section className="compact-page-hero">

        <div className="container">

          <p className="compact-kicker">
            WERKGEBIED
          </p>

          <h1>
            Breda en de regio eromheen.
          </h1>

          <p className="compact-lead">
            Lokale focus zonder fictieve vestigingen.
          </p>

        </div>

      </section>

      <section className="section">

        <div className="container compact-local-board">

          {locations.map(l=>(
            <Link
              key={l[0]}
              href={`/${l[0]}`}
            >

              <span>
                <small>
                  DAKDEKKER
                </small>
                <br/>
                <strong>
                  {l[1]}
                </strong>
              </span>

              <i>
                ↗
              </i>

            </Link>
          ))}

        </div>

      </section>

    </>
  );
}

function LocalPage({
  slug
}:{
  slug:string
}) {
  const l=locationBySlug(slug)!;

  return (
    <>

      <section className="compact-page-hero">

        <div className="container">

          <p className="compact-kicker">
            WERKGEBIED
          </p>

          <h1>
            Dakdekker {l.name}
          </h1>

          <p className="compact-lead">
            LRS Daktechniek voor pannendaken, bitumen, isolatie,
            lekkage en schoorsteenwerk in {l.name} en de regio Breda.
          </p>

          <div className="hero-actions">

            <Link
              className="button"
              href="/dakcheck"
            >
              Dakcheck
            </Link>

            <Link
              className="button button-secondary"
              href="/prijsindicatie"
            >
              Prijsindicatie
            </Link>

          </div>

        </div>

      </section>

      <section className="section section-soft">

        <div className="container compact-grid-3">

          {services.map(s=>(
            <Link
              className="compact-link-card"
              key={s.slug}
              href={`/${s.slug}`}
            >

              <small>
                {s.eyebrow}
              </small>

              <strong>
                {s.name}
              </strong>

              <span>
                Bekijk dienst ↗
              </span>

            </Link>
          ))}

        </div>

      </section>

      <div className="container">
        <CTA
          title={`Dakwerk in ${l.name} bespreken?`}
        />
      </div>

    </>
  );
}

function BlogIndex() {
  return (
    <>

      <section className="compact-page-hero">

        <div className="container">

          <p className="compact-kicker">
            KENNISBANK
          </p>

          <h1>
            Dakvragen duidelijk uitgelegd.
          </h1>

        </div>

      </section>

      <section className="section">

        <div className="container compact-grid-2">

          {articles.map(a=>(
            <Link
              className="compact-link-card"
              key={a.slug}
              href={`/blog-s/${a.slug}`}
            >

              <small>
                KENNISBANK
              </small>

              <strong>
                {a.title}
              </strong>

              <p>
                {a.description}
              </p>

            </Link>
          ))}

        </div>

      </section>

    </>
  );
}

function Article({
  slug
}:{
  slug:string
}) {
  const a=articleBySlug(slug)!;

  return (
    <>

      <section className="compact-page-hero">

        <div className="container">

          <p className="compact-kicker">
            KENNISBANK
          </p>

          <h1>
            {a.title}
          </h1>

          <p className="compact-lead">
            {a.description}
          </p>

        </div>

      </section>

      <section className="section">

        <div className="container compact-article-body">

          {a.sections.map(([h,b])=>(
            <section key={h}>

              <h2>
                {h}
              </h2>

              <p>
                {b}
              </p>

            </section>
          ))}

        </div>

      </section>

    </>
  );
}

function About() {
  return (
    <>

      <section className="compact-page-hero">

        <div className="container">

          <p className="compact-kicker">
            OVER LRS
          </p>

          <h1>
            Korte lijnen. Duidelijk dakwerk.
          </h1>

          <p className="compact-lead">
            LRS Daktechniek werkt vanuit Breda en kiest voor direct contact en begrijpelijke uitleg.
          </p>

        </div>

      </section>

      <section className="section">

        <div className="container compact-grid-3">

          <div className="compact-card">

            <h3>
              Direct
            </h3>

            <p>
              Geen onnodige tussenlagen.
            </p>

          </div>

          <div className="compact-card">

            <h3>
              Duidelijk
            </h3>

            <p>
              Eerst uitleggen wat technisch nodig is.
            </p>

          </div>

          <div className="compact-card">

            <h3>
              Lokaal
            </h3>

            <p>
              Focus op Breda en omgeving.
            </p>

          </div>

        </div>

      </section>

    </>
  );
}

function ServicesIndex(){
  return (
    <>

      <section className="compact-page-hero">

        <div className="container">

          <p className="compact-kicker">
            DIENSTEN
          </p>

          <h1>
            Van gericht herstel tot complete renovatie.
          </h1>

        </div>

      </section>

      <section className="section">

        <div className="container compact-grid-2">

          {services.map(s=>(
            <Link
              className="compact-link-card"
              key={s.slug}
              href={`/${s.slug}`}
            >

              <small>
                {s.eyebrow}
              </small>

              <strong>
                {s.title}
              </strong>

              <p>
                {s.intro}
              </p>

            </Link>
          ))}

        </div>

      </section>

    </>
  );
}

function Privacy(){
  return (
    <section className="section">

      <div className="container compact-article-body">

        <p className="compact-kicker">
          PRIVACY
        </p>

        <h1>
          Privacyverklaring
        </h1>

        <p>
          Contactgegevens worden verwerkt wanneer u die zelf verstrekt om uw vraag of opdracht te behandelen.
        </p>

        <h2>
          Contact
        </h2>

        <p>
          U kunt contact opnemen via {site.email}.
        </p>

        <h2>
          Projectgegevens
        </h2>

        <p>
          Klantadressen worden niet automatisch als openbare content gepubliceerd.
        </p>

      </div>

    </section>
  );
}

export function PublicSite({
  segments
}:{
  segments:string[]
}) {
  const path=segments.join("/");

  let view:React.ReactNode;

  if(!path){
    view=<Home/>;
  }

  else if(path==="diensten"){
    view=<ServicesIndex/>;
  }

  else if(path==="dakcheck"){
    view=<Dakcheck/>;
  }

  else if(path==="prijsindicatie"){
    view=<PricePage/>;
  }

  else if(path==="contact"){
    view=<Contact/>;
  }

  else if(path==="werkgebied"){
    view=<WorkArea/>;
  }

  else if(path==="over-ons"){
    view=<About/>;
  }

  else if(path==="privacyverklaring"){
    view=<Privacy/>;
  }

  else if(path==="blog-s"){
    view=<BlogIndex/>;
  }

  else if(
    segments[0]==="blog-s" &&
    segments[1] &&
    articleBySlug(segments[1])
  ){
    view=<Article slug={segments[1]}/>;
  }

  else if(serviceBySlug(path)){
    view=<ServicePage slug={path}/>;
  }

  else if(locationBySlug(path)){
    view=<LocalPage slug={path}/>;
  }

  else{
    view=(
      <section className="notfound">

        <div className="container">

          <span>
            404
          </span>

          <h1>
            Deze pagina bestaat niet.
          </h1>

          <Link
            className="button"
            href="/"
          >
            Homepage
          </Link>

        </div>

      </section>
    );
  }

  return (
    <>

      <Header/>

      <main id="main">
        {view}
      </main>

      <Footer/>

      <div className="mobile-actions">

        <a href={`tel:${site.phoneHref}`}>
          Bellen
        </a>

        <a
          href={whatsapp()}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>

        <Link href="/dakcheck">
          Dakcheck
        </Link>

        <Link href="/prijsindicatie">
          Prijs
        </Link>

      </div>

    </>
  );
}
