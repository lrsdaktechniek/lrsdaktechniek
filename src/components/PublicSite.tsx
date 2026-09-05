:root {
  --graphite: #070a0d;
  --ink: #12181d;
  --paper: #f2f0ec;
  --paper-deep: #e8e5df;
  --slate: #294b5e;
  --steel: #3d6278;
  --cool-steel: #6f8796;
  --champagne: #b6a27b;
  --oxide: #8a4a3c;
  --line-light: rgba(7, 10, 13, 0.12);
  --line-mid: rgba(7, 10, 13, 0.22);
  --line-dark: rgba(255, 255, 255, 0.14);
  --text-dark: #1c242a;
  --text-muted: #5f6a72;
  --paper-text: #c3cbd1;
  --max: 1280px;
  --gutter: 24px;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; background: var(--paper); }
body {
  margin: 0;
  background: var(--paper);
  color: var(--graphite);
  font-family: var(--font-archivo), Archivo, Arial, sans-serif;
  font-size: 18px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

a { color: inherit; text-decoration: none; }
button, input, select, textarea { font: inherit; }
button, a { -webkit-tap-highlight-color: transparent; }
button { color: inherit; }
img, svg { display: block; max-width: 100%; }
h1, h2, h3, p { margin-top: 0; }
h1, h2, h3 { letter-spacing: -0.02em; }
h1 { font-size: clamp(3rem, 6vw, 4.75rem); line-height: 1.05; }
h2 { font-size: clamp(2.1rem, 4vw, 2.75rem); line-height: 1.15; }
h3 { font-size: 1.35rem; line-height: 1.25; }
p { color: var(--text-muted); max-width: 68ch; }
::selection { background: var(--champagne); color: var(--graphite); }

.shell {
  width: min(calc(100% - 48px), var(--max));
  margin-inline: auto;
  position: relative;
}

.mono, .annotation, .section-index, .dimension-line, .technical-form span, .title-block dt {
  font-family: var(--font-plex), "IBM Plex Mono", ui-monospace, monospace;
}
.annotation {
  font-size: 12px;
  line-height: 1.4;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--steel);
}
.dark-zone .annotation,
.annotation.on-dark,
.on-dark .annotation { color: var(--champagne); }

/* ---------- CONTINUOUS WATERLINE ---------- */
.waterline-shell {
  position: fixed;
  z-index: 4;
  top: 0;
  left: max(4px, calc((100vw - 1440px) / 2));
  width: 88px;
  height: 100vh;
  pointer-events: none;
  opacity: .9;
}
.waterline-shell svg { width: 100%; height: 100%; overflow: visible; }
.waterline-base,
.waterline-progress {
  fill: none;
  vector-effect: non-scaling-stroke;
  stroke-width: 1;
}
.waterline-base { stroke: rgba(111,135,150,.22); }
.waterline-progress { stroke: var(--champagne); }

/* ---------- HEADER ---------- */
.utility-bar {
  position: relative;
  z-index: 30;
  min-height: 32px;
  background: var(--graphite);
  border-bottom: 1px solid var(--line-dark);
  color: var(--paper-text);
}
.utility-inner {
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.utility-data { display: flex; align-items: center; gap: 28px; }
.utility-bar .annotation { color: var(--cool-steel); font-size: 10px; }
.utility-bar .mono { color: var(--paper); font-size: 12px; letter-spacing: .02em; }
.site-header {
  position: sticky;
  z-index: 28;
  top: 0;
  background: rgba(7,10,13,.96);
  border-bottom: 1px solid var(--line-dark);
}
.header-inner {
  min-height: 74px;
  display: flex;
  align-items: center;
  gap: 34px;
}
.wordmark {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  color: var(--paper);
  white-space: nowrap;
  letter-spacing: -.02em;
}
.wordmark strong { font-size: 1.08rem; font-stretch: 112%; }
.wordmark span { font-size: .82rem; color: var(--cool-steel); letter-spacing: .06em; }
.desktop-nav { margin-left: auto; display: flex; align-items: center; gap: 26px; }
.desktop-nav a {
  position: relative;
  color: #aeb9c0;
  font-size: .82rem;
  font-weight: 500;
}
.desktop-nav a::after,
.text-action::after,
.phone-action::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -5px;
  height: 1px;
  transform: scaleX(0);
  transform-origin: left;
  background: currentColor;
  transition: transform 200ms ease-out;
}
.desktop-nav a:hover::after,
.text-action:hover::after,
.phone-action:hover::after { transform: scaleX(1); }
.header-phone { color: var(--paper); font-size: .78rem; border-left: 1px solid var(--line-dark); padding-left: 24px; }
.mobile-menu { display: none; margin-left: auto; }
.mobile-menu summary { list-style: none; width: 42px; height: 42px; display: grid; place-content: center; gap: 7px; cursor: pointer; }
.mobile-menu summary::-webkit-details-marker { display:none; }
.mobile-menu summary span { width: 22px; height: 1px; background: var(--paper); }
.mobile-menu-panel { position:absolute; top:74px; left:0; right:0; background:var(--graphite); border-top:1px solid var(--line-dark); border-bottom:1px solid var(--line-dark); padding:24px; display:grid; gap:0; }
.mobile-menu-panel a { padding:14px 0; border-bottom:1px solid var(--line-dark); color:var(--paper); }

/* ---------- COMMON TECHNICAL UI ---------- */
.section-index {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 34px;
  color: var(--steel);
}
.section-index > span:first-child {
  min-width: 32px;
  font-size: 12px;
  color: var(--champagne);
}
.section-index::after { content:""; width:54px; height:1px; background: var(--line-light); }
.section-index.on-dark::after { background: var(--line-dark); }
.section-index.on-dark { color: var(--paper-text); }
.dimension-line {
  display: flex;
  align-items: center;
  min-height: 22px;
  margin: 24px 0;
  color: var(--champagne);
  font-size: 11px;
  letter-spacing: .08em;
}
.dimension-line i { display:block; position:relative; height:1px; flex:1; background: var(--line-mid); }
.dimension-line i::before { content:""; position:absolute; width:1px; height:8px; top:-4px; background:currentColor; }
.dimension-line i:first-child::before { left:0; }
.dimension-line i:last-child::before { right:0; }
.dimension-line span { padding: 0 10px; }
.dimension-line.on-dark i { background: var(--line-dark); }

.btn {
  display: inline-flex;
  min-height: 50px;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  border-radius: 2px;
  border: 1px solid transparent;
  font-family: var(--font-plex), "IBM Plex Mono", monospace;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: .08em;
  cursor: pointer;
  transition: background 200ms ease-out, color 200ms ease-out, border-color 200ms ease-out;
}
.primary-dark { background: var(--paper); color: var(--graphite); border-color: var(--paper); }
.primary-dark:hover { background: transparent; color: var(--paper); }
.primary-light { background: var(--steel); color: #fff; border-color: var(--steel); }
.primary-light:hover { background: transparent; color: var(--steel); }
.text-action, .phone-action { position:relative; display:inline-flex; width:max-content; }
.text-button { border:0; border-bottom:1px solid currentColor; background:none; padding:0 0 3px; cursor:pointer; color:var(--steel); }

.section-block { padding: 160px 0 120px; }
.work-zone { background: var(--paper); }
.paper-deep-zone { background: var(--paper-deep); }
.dark-zone { background: var(--graphite); color: var(--paper); }
.dark-zone p { color: var(--paper-text); }
.section-rule-top { border-top: 1px solid var(--line-light); }
.section-heading { margin-bottom: 64px; }
.split-heading { display:grid; grid-template-columns:minmax(0,1.15fr) minmax(280px,.65fr); align-items:end; gap:80px; }
.split-heading h2 { margin-bottom:0; max-width:18ch; }
.split-heading > p { margin-bottom:6px; }
.dark-heading h2 { color: var(--paper); }
.body-large { font-size: 1.18rem; }

/* ---------- HERO ---------- */
.hero-v2 {
  position: relative;
  overflow: hidden;
  min-height: min(900px, calc(100svh - 106px));
  background: var(--graphite);
  color: var(--paper);
}
.hero-tonal-step {
  position:absolute;
  inset:0;
  background: var(--ink);
  clip-path: polygon(0 83%, 100% 14%, 100% 100%, 0 100%);
}
.hero-roof-line {
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  pointer-events:none;
}
.hero-roof-line line { stroke: rgba(182,162,123,.72); stroke-width:1; vector-effect:non-scaling-stroke; }
.hero-roof-line .hero-angle-tick { stroke-width:1.5; }
.hero-content { min-height: inherit; }
.hero-copy { position:absolute; top:14%; left:0; max-width: 780px; }
.hero-code { color:var(--cool-steel); margin-bottom:20px; }
.hero-copy h1 {
  margin:0;
  font-size: clamp(3.7rem, 8vw, 6.4rem);
  line-height:.92;
  font-weight:700;
  font-stretch:112%;
  letter-spacing:-.035em;
}
.hero-copy h1 span { display:block; color:var(--paper); }
.hero-statement { margin:26px 0 0; color:var(--paper-text); font-size:clamp(1.1rem,2vw,1.35rem); }
.hero-angle { position:absolute; top:31%; right:16%; color:var(--champagne); font-size:13px; }
.hero-action-zone { position:absolute; left:0; bottom:7%; width:min(720px, 72vw); }
.hero-action-zone .dimension-line { max-width:560px; }
.hero-actions-v2 { display:flex; align-items:center; gap:30px; }
.phone-action { color:var(--paper); font-size:.9rem; }
.hero-subroute { margin-top:20px; color:var(--cool-steel); font-size:.84rem; }
.hero-subroute a { border-bottom:1px solid rgba(111,135,150,.45); padding-bottom:3px; }

/* ---------- SITUATION ROUTER ---------- */
.situation-zone { padding: 110px 0 150px; }
.situation-table { border-top:1px solid var(--line-dark); }
.situation-row {
  display:grid;
  grid-template-columns: 50px 2fr 1fr 1.1fr 24px;
  align-items:center;
  gap:24px;
  min-height:92px;
  border-bottom:1px solid var(--line-dark);
  color:var(--paper);
  transition: background 200ms ease-out;
}
.situation-row:hover { background: rgba(255,255,255,.025); }
.situation-row strong { font-size:1.08rem; font-weight:500; }
.row-index { color:var(--cool-steel); font-size:11px; }
.technical-label { color:var(--champagne) !important; }
.row-result { color:var(--cool-steel); font-size:.8rem; }
.row-arrow { color:var(--champagne); text-align:right; }

/* ---------- ROOF ASSEMBLY ---------- */
.assembly-layout { display:grid; grid-template-columns:minmax(0,1.35fr) minmax(320px,.65fr); gap:54px; align-items:start; }
.assembly-drawing { position:relative; min-height:610px; border:1px solid var(--line-light); background:rgba(255,255,255,.28); }
.drawing-title { display:flex; justify-content:space-between; padding:14px 16px; border-bottom:1px solid var(--line-light); }
.drawing-title .mono { font-size:11px; color:var(--text-muted); }
.assembly-drawing > svg { width:100%; height:auto; min-height:540px; }
.assembly-drawing svg path,
.assembly-drawing svg line,
.assembly-drawing svg polygon {
  vector-effect:non-scaling-stroke;
}
.layer-shape { fill:rgba(61,98,120,.04); stroke:rgba(7,10,13,.25); stroke-width:1; transition:fill 200ms ease-out, stroke 200ms ease-out; }
.layer-shape.layer-thin { fill:rgba(182,162,123,.07); }
.layer-shape.is-active { fill:rgba(61,98,120,.20); stroke:var(--champagne); }
.tile-roof,.insulation-pattern { stroke:rgba(7,10,13,.48); stroke-width:1; }
#tilePattern path,#insPattern path { stroke:rgba(7,10,13,.42); stroke-width:1; }
.is-active-stroke,.is-active-stroke path,.is-active-stroke line { stroke:var(--champagne) !important; }
.drawing-dimensions line { stroke:rgba(7,10,13,.35); stroke-width:1; }
.drawing-dimensions rect { fill:var(--paper); }
.drawing-dimensions text { font-family:var(--font-plex),monospace; font-size:11px; fill:var(--steel); letter-spacing:.04em; }
.detail-bubble { position:absolute; width:32px; height:32px; display:grid; place-items:center; border:1px solid var(--champagne); border-radius:50%; color:var(--champagne); font-size:11px; background:var(--paper); }
.bubble-a { top:21%; right:13%; }
.bubble-b { bottom:12%; left:24%; }
.detail-bubble.static { position:static; flex:0 0 auto; background:transparent; }
.layer-register { border-top:1px solid var(--line-light); }
.layer-register > .annotation { display:block; padding:14px 0; border-bottom:1px solid var(--line-light); }
.layer-row {
  width:100%;
  display:grid;
  grid-template-columns:52px 1fr 54px;
  gap:16px;
  align-items:center;
  min-height:78px;
  padding:12px 0;
  border:0;
  border-bottom:1px solid var(--line-light);
  background:transparent;
  text-align:left;
  cursor:pointer;
}
.layer-row strong { display:block; font-size:.95rem; font-weight:500; }
.layer-row small { display:block; margin-top:3px; color:var(--text-muted); font-size:.74rem; }
.layer-code,.layer-state { font-size:11px; color:var(--cool-steel); }
.layer-row.active .layer-code,.layer-row.active .layer-state { color:var(--champagne); }
.layer-row.active strong { color:var(--steel); }
.active-layer-note { margin-top:26px; padding-left:18px; border-left:1px solid var(--champagne); }
.active-layer-note strong { display:block; margin:8px 0; }
.active-layer-note p { font-size:.86rem; margin:0; }

/* ---------- MATERIAL STATE ---------- */
.material-state { display:grid; grid-template-columns:repeat(3,1fr); border-top:1px solid var(--line-light); border-left:1px solid var(--line-light); }
.material-cell { min-height:330px; padding:22px; border-right:1px solid var(--line-light); border-bottom:1px solid var(--line-light); }
.material-swatch { height:150px; border:1px solid var(--line-light); margin-bottom:22px; }
.typ-pan { background: repeating-linear-gradient(135deg, transparent 0 18px, rgba(7,10,13,.15) 18px 19px), repeating-linear-gradient(45deg, transparent 0 28px, rgba(61,98,120,.10) 28px 29px); }
.typ-concrete { background: repeating-linear-gradient(90deg, rgba(7,10,13,.04) 0 20px, rgba(7,10,13,.12) 20px 21px), repeating-linear-gradient(0deg, transparent 0 16px, rgba(7,10,13,.10) 16px 17px); }
.typ-bitumen { background-image: radial-gradient(rgba(7,10,13,.28) .8px, transparent .8px); background-size:8px 8px; }
.typ-wood { background: repeating-linear-gradient(6deg, transparent 0 12px, rgba(7,10,13,.16) 12px 13px, transparent 13px 23px); }
.typ-insulation { background: repeating-linear-gradient(120deg, transparent 0 16px, rgba(61,98,120,.18) 16px 17px, transparent 17px 31px), repeating-linear-gradient(60deg, transparent 0 16px, rgba(61,98,120,.10) 16px 17px, transparent 17px 31px); }
.typ-metal { background: repeating-linear-gradient(135deg, transparent 0 8px, rgba(7,10,13,.13) 8px 9px); }
.material-meta { display:grid; gap:2px; }
.material-code { font-size:11px; color:var(--champagne); }
.material-meta strong { font-size:.92rem; margin-top:6px; }
.material-meta small { color:var(--text-muted); }
.material-cell .dimension-line { margin-top:24px; margin-bottom:0; }

/* ---------- MEASURED AREA / PRICE ---------- */
.price-home-grid { display:grid; grid-template-columns:minmax(0,.8fr) minmax(420px,1.2fr); gap:100px; align-items:center; }
.price-home-grid h2 { max-width:13ch; }
.price-home-grid .btn { margin-top:18px; }
.measured-area { position:relative; width:min(100%,620px); aspect-ratio:1.35; margin:auto; padding:45px 55px 30px 30px; }
.measure-box { position:relative; height:100%; border:1px solid var(--steel); display:grid; place-items:center; overflow:hidden; }
.measure-box > span { position:relative; z-index:2; padding:8px 12px; background:var(--paper); color:var(--steel); font-size:14px; }
.measure-hatch { position:absolute; inset:0; background:repeating-linear-gradient(135deg, transparent 0 13px, rgba(61,98,120,.08) 13px 14px); }
.measure-top { position:absolute; top:12px; left:30px; right:55px; display:flex; align-items:center; color:var(--champagne); font-size:11px; }
.measure-top i { flex:1; height:1px; background:var(--line-mid); position:relative; }
.measure-top i::after { content:""; position:absolute; top:-4px; width:1px; height:8px; background:var(--champagne); }
.measure-top i:first-child::after{left:0}.measure-top i:last-child::after{right:0}
.measure-top span { padding:0 9px; }
.measure-side { position:absolute; top:45px; right:12px; bottom:30px; width:24px; display:flex; flex-direction:column; align-items:center; color:var(--champagne); font-size:11px; }
.measure-side i { width:1px; flex:1; background:var(--line-mid); position:relative; }
.measure-side span { writing-mode:vertical-rl; padding:8px 0; }

/* ---------- PRINCIPLE DETAILS ---------- */
.not-needed-grid { display:grid; grid-template-columns:repeat(3,1fr); border-left:1px solid var(--line-light); border-top:1px solid var(--line-light); }
.principle-grid { display:grid; grid-template-columns:repeat(2,1fr); border-left:1px solid var(--line-light); border-top:1px solid var(--line-light); }
.principle-card { min-width:0; padding:24px; border-right:1px solid var(--line-light); border-bottom:1px solid var(--line-light); background:transparent; }
.principle-head { display:flex; align-items:center; justify-content:space-between; gap:16px; min-height:34px; }
.principle-head .annotation { font-size:9px; color:var(--text-muted); }
.principle-card svg { width:100%; height:220px; margin:18px 0; }
.principle-card svg path,.principle-card svg rect,.principle-card svg circle { fill:none; stroke:rgba(7,10,13,.48); stroke-width:1; vector-effect:non-scaling-stroke; }
.principle-card svg .failure { stroke:var(--oxide); stroke-width:1.5; }
.principle-card svg .failure-fill { fill:var(--oxide); stroke:var(--oxide); }
.principle-card h3 { max-width:22ch; margin-bottom:20px; }
.principle-card dl { margin:0; border-top:1px solid var(--line-light); }
.principle-card dl > div { display:grid; grid-template-columns:95px 1fr; gap:14px; padding:10px 0; border-bottom:1px solid var(--line-light); }
.principle-card dt { color:var(--oxide); }
.principle-card dd { margin:0; font-size:.75rem; color:var(--text-muted); }
.principle-copy > .mono { font-size:10px; color:var(--champagne); }
.principle-copy p { font-size:.86rem; }

/* ---------- CONTACT PROOF ---------- */
.contact-proof-grid { display:grid; grid-template-columns:minmax(0,.8fr) minmax(460px,1.2fr); gap:90px; align-items:start; }
.contact-number { display:inline-block; margin-top:20px; font-size:clamp(1.6rem,3vw,2.4rem); color:var(--steel); border-bottom:1px solid var(--steel); }
.single-contact-table { border-top:1px solid var(--line-light); }
.single-contact-table > div { display:grid; grid-template-columns:50px 1.4fr 1fr 50px; gap:18px; align-items:center; min-height:74px; border-bottom:1px solid var(--line-light); }
.single-contact-table .mono { color:var(--cool-steel); font-size:11px; }
.single-contact-table strong { font-size:.92rem; }
.single-contact-table .annotation { color:var(--text-muted); }
.single-contact-table b { font-family:var(--font-plex),monospace; font-size:11px; color:var(--champagne); }

/* ---------- WORK AREA ---------- */
.survey-map { position:relative; min-height:620px; border:1px solid var(--line-dark); }
.survey-caption { display:flex; justify-content:space-between; padding:14px 16px; border-bottom:1px solid var(--line-dark); }
.survey-caption .mono { color:var(--paper-text); font-size:11px; }
.survey-map svg { width:100%; height:520px; padding:44px; }
.survey-map svg path,.survey-map svg circle { fill:none; stroke:rgba(195,203,209,.25); stroke-width:1; vector-effect:non-scaling-stroke; }
.survey-map svg .survey-core { fill:var(--champagne); stroke:var(--champagne); }
.survey-labels { position:absolute; inset:70px 80px auto 80px; display:flex; justify-content:space-between; flex-wrap:wrap; gap:14px; pointer-events:none; }
.survey-labels a { pointer-events:auto; color:var(--paper-text); font-size:.78rem; }
.survey-core-label { position:absolute; left:43%; top:150px; color:var(--paper); }
.survey-core-label strong { display:block; }
.survey-core-label .annotation { font-size:9px; }
.survey-ring { display:flex; flex-wrap:wrap; gap:10px 18px; padding:18px 20px; border-top:1px solid var(--line-dark); }
.survey-ring a { color:var(--cool-steel); font-size:.75rem; }
.location-register { margin-top:80px; border-top:1px solid var(--line-dark); }
.location-register a { display:grid; grid-template-columns:50px 1fr 24px; min-height:72px; align-items:center; border-bottom:1px solid var(--line-dark); color:var(--paper); }
.location-register .mono { color:var(--cool-steel); font-size:11px; }
.location-register a > span:last-child { color:var(--champagne); }

/* ---------- PAGE HERO ---------- */
.page-hero-v2 { position:relative; overflow:hidden; padding:110px 0 100px; background:var(--paper-deep); border-bottom:1px solid var(--line-light); }
.page-hero-v2::after { content:""; position:absolute; left:-10%; right:-10%; bottom:15%; height:1px; background:var(--line-mid); transform:rotate(-7deg); transform-origin:center; }
.page-hero-inner { position:relative; z-index:2; display:grid; grid-template-columns:1fr 280px; gap:80px; align-items:end; }
.page-hero-inner > div:first-child { max-width:900px; }
.page-hero-v2 h1 { margin:18px 0 24px; max-width:17ch; font-size:clamp(3rem,6vw,4.75rem); }
.page-lead { font-size:1.12rem; }
.page-angle .dimension-line { margin-bottom:8px; }

/* ---------- SERVICE ---------- */
.service-signal-grid { display:grid; grid-template-columns:.8fr 1.2fr; gap:90px; }
.signal-register { border-top:1px solid var(--line-light); }
.signal-register > div { display:grid; grid-template-columns:50px 1fr; align-items:center; min-height:76px; border-bottom:1px solid var(--line-light); }
.signal-register .mono { color:var(--champagne); font-size:11px; }
.compact-check-list { display:grid; grid-template-columns:.75fr 1.25fr; gap:90px; }
.compact-check-list > div:last-child { border-top:1px solid var(--line-light); }
.compact-check-list > div:last-child > div { display:grid; grid-template-columns:54px 1fr; align-items:center; min-height:72px; border-bottom:1px solid var(--line-light); }
.compact-check-list .mono { color:var(--champagne); font-size:11px; }
.service-register { border-top:1px solid var(--line-light); }
.service-register > a { display:grid; grid-template-columns:58px 1fr 24px; gap:24px; align-items:start; padding:28px 0; border-bottom:1px solid var(--line-light); }
.service-register > a > .mono { color:var(--champagne); font-size:11px; margin-top:5px; }
.service-register strong { display:block; font-size:1.18rem; margin:5px 0; }
.service-register p { margin:0; font-size:.85rem; }

/* ---------- DAKCHECK ---------- */
.dakcheck-v2-grid { display:grid; grid-template-columns:minmax(0,1fr) minmax(380px,.8fr); gap:90px; align-items:start; }
.dakcheck-question h2 { max-width:13ch; }
.check-options { margin-top:44px; border-top:1px solid var(--line-light); }
.check-options button { width:100%; display:flex; justify-content:space-between; align-items:center; min-height:74px; padding:0; border:0; border-bottom:1px solid var(--line-light); background:transparent; text-align:left; cursor:pointer; }
.check-options button span { color:var(--champagne); }
.workticket { position:sticky; top:110px; border:1px solid var(--line-light); background:var(--paper-deep); padding:0 22px 24px; }
.workticket::before { content:""; position:absolute; top:0; bottom:0; left:-1px; width:7px; background:repeating-linear-gradient(to bottom, transparent 0 10px, var(--paper) 10px 15px); }
.workticket-head { min-height:54px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--line-light); }
.workticket-head .mono { font-size:11px; color:var(--champagne); }
.ticket-row { padding:16px 0; border-bottom:1px solid var(--line-light); }
.ticket-row .annotation { display:block; margin-bottom:4px; color:var(--text-muted); }
.ticket-progress { height:2px; margin:24px 0; background:var(--line-light); }
.ticket-progress span { display:block; height:100%; background:var(--champagne); transition:width 200ms ease-out; }
.ticket-actions { display:grid; gap:18px; }
.ticket-actions .text-action { font-size:.78rem; color:var(--steel); }

/* ---------- PRICE ENGINE ---------- */
.price-engine-v2 { display:grid; grid-template-columns:minmax(320px,.7fr) minmax(480px,1.3fr); gap:90px; }
.material-choice-list { border-top:1px solid var(--line-light); margin-top:34px; }
.material-choice-list button { width:100%; min-height:66px; display:flex; align-items:center; justify-content:space-between; border:0; border-bottom:1px solid var(--line-light); background:transparent; cursor:pointer; text-align:left; }
.material-choice-list button.active { color:var(--steel); }
.material-choice-list .mono { font-size:10px; color:var(--champagne); }
.area-input { display:block; margin-top:38px; }
.area-input > span { display:block; margin-bottom:8px; }
.area-input > div { display:flex; align-items:center; gap:12px; border-bottom:1px solid var(--line-mid); }
.area-input input { width:100%; border:0; background:transparent; padding:10px 0; font-family:var(--font-plex),monospace; font-size:2rem; color:var(--steel); outline:none; }
.area-input .mono { color:var(--champagne); }
.price-drawing-panel { border-left:1px solid var(--line-light); padding-left:54px; }
.price-output { margin:36px 0 28px; padding-top:24px; border-top:1px solid var(--line-light); }
.price-output > strong { display:block; font-size:clamp(2rem,4vw,3.4rem); line-height:1.1; margin:8px 0; }
.price-output small { color:var(--text-muted); }

/* ---------- CONTACT FORM ---------- */
.contact-v2-grid { display:grid; grid-template-columns:.75fr 1.25fr; gap:100px; }
.technical-form { border-top:1px solid var(--line-light); }
.technical-form label { display:block; padding:18px 0; border-bottom:1px solid var(--line-light); }
.technical-form label > span { display:block; margin-bottom:8px; color:var(--text-muted); }
.technical-form input,.technical-form textarea { width:100%; border:0; background:transparent; color:var(--graphite); outline:none; resize:vertical; }
.technical-form input { min-height:46px; }
.technical-form textarea { min-height:120px; }
.technical-form .btn { margin-top:28px; }

/* ---------- ARTICLES ---------- */
.article-register { border-top:1px solid var(--line-light); }
.article-register > a { display:grid; grid-template-columns:56px 1fr 30px; gap:24px; padding:34px 0; border-bottom:1px solid var(--line-light); align-items:start; }
.article-register > a > .mono { color:var(--champagne); font-size:11px; }
.article-register h2 { font-size:1.6rem; margin:8px 0 10px; }
.article-register p { margin:0; font-size:.86rem; }
.article-body-v2 { max-width:980px; }
.article-body-v2 > section { display:grid; grid-template-columns:64px 1fr; gap:30px; padding:42px 0; border-bottom:1px solid var(--line-light); }
.article-body-v2 > section > .mono { color:var(--champagne); font-size:11px; margin-top:8px; }
.article-body-v2 h2 { font-size:1.8rem; }

/* ---------- CTA ---------- */
.cta-v2 { margin:80px 0 120px; padding:50px 0; border-top:1px solid var(--line-light); border-bottom:1px solid var(--line-light); display:grid; grid-template-columns:1fr .8fr; gap:80px; align-items:end; }
.cta-v2 h2 { margin-bottom:12px; }
.cta-actions-v2 { display:flex; flex-direction:column; align-items:flex-start; gap:16px; }
.cta-actions-v2 .mono { font-size:.9rem; color:var(--steel); }

/* ---------- FOOTER / TITLE BLOCK ---------- */
.site-footer-v2 { background:var(--graphite); color:var(--paper); padding:120px 0 36px; }
.footer-contact-zone { display:grid; grid-template-columns:.6fr 1fr .8fr; gap:60px; align-items:end; margin-bottom:90px; }
.footer-contact-zone h2 { color:var(--paper); margin:0; }
.footer-actions { display:flex; flex-direction:column; gap:12px; align-items:flex-start; }
.footer-phone { font-size:1.45rem; color:var(--paper); }
.footer-actions > a:last-child { color:var(--cool-steel); font-size:.82rem; }
.title-block { border:1px solid var(--line-dark); display:grid; grid-template-columns:1fr 1.6fr; }
.title-brand { padding:28px; display:flex; flex-direction:column; justify-content:space-between; min-height:240px; border-right:1px solid var(--line-dark); }
.title-brand strong { font-size:1.35rem; font-stretch:112%; }
.title-block dl { margin:0; display:grid; grid-template-columns:repeat(2,1fr); }
.title-block dl > div { min-height:80px; padding:14px 16px; border-right:1px solid var(--line-dark); border-bottom:1px solid var(--line-dark); }
.title-block dt { color:var(--cool-steel); font-size:9px; letter-spacing:.08em; }
.title-block dd { margin:7px 0 0; font-size:.78rem; color:var(--paper); }
.legal-row { display:flex; gap:24px; justify-content:space-between; padding-top:22px; color:var(--cool-steel); font-size:.68rem; }

/* ---------- 404 ---------- */
.notfound-v2 { min-height:70vh; display:grid; place-items:center; background:var(--graphite); color:var(--paper); text-align:left; }
.notfound-v2 .mono { color:var(--champagne); }
.notfound-v2 h1 { margin:10px 0 30px; }

/* ---------- MOBILE CONTACT BAR ---------- */
.mobile-contact-bar { display:none; }

/* ---------- ACCESSIBILITY / FOCUS ---------- */
a:focus-visible, button:focus-visible, input:focus-visible, textarea:focus-visible, summary:focus-visible { outline:2px solid var(--champagne); outline-offset:4px; }

/* ---------- RESPONSIVE ---------- */
@media (max-width: 1080px) {
  .desktop-nav { display:none; }
  .header-phone { margin-left:auto; }
  .mobile-menu { display:block; }
  .hero-copy { max-width:650px; }
  .assembly-layout,.price-home-grid,.contact-proof-grid,.service-signal-grid,.compact-check-list,.dakcheck-v2-grid,.price-engine-v2,.contact-v2-grid { grid-template-columns:1fr; gap:60px; }
  .assembly-drawing { min-height:540px; }
  .price-drawing-panel { border-left:0; border-top:1px solid var(--line-light); padding:45px 0 0; }
  .workticket { position:relative; top:auto; }
  .footer-contact-zone { grid-template-columns:1fr 1fr; }
  .footer-contact-zone .section-index { grid-column:1/-1; }
}

@media (max-width: 760px) {
  body { font-size:17px; padding-bottom:52px; }
  .shell { width:min(calc(100% - 34px), var(--max)); }
  .utility-bar { display:none; }
  .site-header { top:0; }
  .header-inner { min-height:64px; }
  .header-phone { display:none; }
  .wordmark strong { font-size:.95rem; }
  .wordmark span { font-size:.7rem; }
  .mobile-menu-panel { top:64px; }
  .waterline-shell { left:0; width:36px; opacity:.7; }
  .waterline-shell svg { transform:scaleX(.55); transform-origin:left; }
  .section-block { padding:80px 0 64px; }
  .section-index { margin-bottom:24px; gap:9px; }
  .section-index::after { width:26px; }
  .split-heading { grid-template-columns:1fr; gap:18px; }
  .section-heading { margin-bottom:42px; }
  .section-heading h2 { max-width:none; }
  h1 { font-size:40px; }
  h2 { font-size:28px; }
  h3 { font-size:21px; }
  .annotation { font-size:10px; }

  .hero-v2 { min-height:calc(100svh - 64px); max-height:none; }
  .hero-tonal-step { clip-path:polygon(0 76%,100% 24%,100% 100%,0 100%); }
  .hero-roof-line line:first-child { transform:rotate(-7deg); transform-origin:center; }
  .hero-copy { top:14%; left:0; right:0; }
  .hero-copy h1 { font-size:40px; line-height:.98; }
  .hero-statement { font-size:17px; max-width:28ch; }
  .hero-angle { top:43%; right:17%; font-size:11px; }
  .hero-action-zone { left:0; bottom:8%; width:100%; }
  .hero-actions-v2 { gap:18px; align-items:flex-start; flex-direction:column; }
  .hero-actions-v2 .btn { width:100%; }
  .hero-subroute { font-size:.74rem; }

  .situation-zone { padding:70px 0 90px; }
  .situation-row { grid-template-columns:34px 1fr 18px; grid-template-areas:"idx human arrow" ". tech ."; gap:2px 10px; padding:14px 0; min-height:78px; }
  .situation-row .row-index { grid-area:idx; }
  .situation-row strong { grid-area:human; font-size:.95rem; }
  .situation-row .technical-label { grid-area:tech; font-size:9px; }
  .situation-row .row-result { display:none; }
  .situation-row .row-arrow { grid-area:arrow; }

  .assembly-drawing { min-height:390px; }
  .assembly-drawing > svg { min-height:360px; }
  .drawing-title { padding:10px; }
  .drawing-title .annotation,.drawing-title .mono { font-size:8px; }
  .detail-bubble { width:44px; height:44px; }
  .bubble-a { top:20%; right:6%; }
  .bubble-b { bottom:7%; left:16%; }
  .layer-row { min-height:70px; grid-template-columns:44px 1fr 44px; }
  .layer-row small { font-size:.68rem; }

  .material-state { display:flex; overflow-x:auto; scroll-snap-type:x mandatory; border-left:0; padding-bottom:4px; }
  .material-cell { flex:0 0 280px; scroll-snap-align:start; border-left:1px solid var(--line-light); }
  .material-swatch { height:130px; }

  .measured-area { width:100%; padding:38px 42px 26px 22px; }
  .measure-top { left:22px; right:42px; }
  .measure-side { right:8px; }

  .not-needed-grid,.principle-grid { grid-template-columns:1fr; border-left:0; }
  .principle-card { border-left:1px solid var(--line-light); }
  .principle-card svg { height:190px; }
  .principle-card dl > div { grid-template-columns:78px 1fr; }

  .single-contact-table > div { grid-template-columns:34px 1fr 36px; grid-template-areas:"idx step lrs" ". label lrs"; padding:12px 0; gap:2px 10px; }
  .single-contact-table .mono { grid-area:idx; }
  .single-contact-table strong { grid-area:step; }
  .single-contact-table .annotation { grid-area:label; font-size:8px; }
  .single-contact-table b { grid-area:lrs; }

  .survey-map { min-height:470px; }
  .survey-map svg { height:390px; padding:18px; }
  .survey-labels { inset:54px 20px auto 20px; }
  .survey-labels a { font-size:.62rem; }
  .survey-core-label { top:120px; left:40%; }
  .survey-ring { padding:14px; }

  .page-hero-v2 { padding:78px 0 70px; }
  .page-hero-inner { grid-template-columns:1fr; gap:28px; }
  .page-hero-v2 h1 { font-size:40px; }
  .page-angle { width:70%; }

  .service-register > a { grid-template-columns:34px 1fr 18px; gap:12px; }
  .service-register strong { font-size:1rem; }
  .service-register p { font-size:.78rem; }

  .workticket { padding-left:18px; padding-right:18px; }
  .check-options button { min-height:66px; }
  .price-output > strong { font-size:2rem; }

  .article-register > a { grid-template-columns:34px 1fr 18px; gap:12px; }
  .article-register h2 { font-size:1.25rem; }
  .article-body-v2 > section { grid-template-columns:34px 1fr; gap:12px; }

  .cta-v2 { grid-template-columns:1fr; gap:28px; margin:40px 0 80px; }
  .cta-actions-v2 .btn { width:100%; }

  .site-footer-v2 { padding:80px 0 80px; }
  .footer-contact-zone { grid-template-columns:1fr; gap:28px; margin-bottom:60px; }
  .title-block { grid-template-columns:1fr; }
  .title-brand { min-height:150px; border-right:0; border-bottom:1px solid var(--line-dark); }
  .title-block dl { grid-template-columns:1fr; }
  .title-block dl > div { min-height:64px; border-right:0; }
  .legal-row { flex-direction:column; gap:8px; }

  .mobile-contact-bar {
    position:fixed;
    z-index:50;
    left:0; right:0; bottom:0;
    height:52px;
    display:grid;
    grid-template-columns:1fr 1fr;
    background:var(--ink);
    border-top:1px solid var(--line-dark);
  }
  .mobile-contact-bar a { display:grid; place-items:center; color:var(--paper); font-family:var(--font-plex),monospace; font-size:11px; letter-spacing:.08em; }
  .mobile-contact-bar a + a { border-left:1px solid var(--line-dark); }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior:auto; }
  *, *::before, *::after { animation-duration:0.01ms !important; transition-duration:0.01ms !important; }
  .waterline-progress { stroke-dasharray:none !important; stroke-dashoffset:0 !important; }
}

/* Explicit structural hooks used by the V2 component. */
.assembly-base-lines { pointer-events: none; }
.failure-card { background: transparent; }
.price-controls { min-width: 0; }


/* ==========================================================================
   LRS HIGH-END PHOTO + CALCULATOR CORRECTION
   ========================================================================== */

.hero-photo-v3 {
  position: relative;
  min-height: min(900px, 100svh);
  overflow: hidden;
  background: var(--graphite);
  color: var(--paper);
  isolation: isolate;
}

.hero-photo-layer {
  position: absolute;
  inset: 0;
  z-index: -3;
}

.hero-photo-layer img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: saturate(.72) contrast(1.1) brightness(.67);
  transform: scale(1.02);
}

.hero-photo-shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(7,10,13,.97) 0%, rgba(7,10,13,.88) 40%, rgba(7,10,13,.36) 72%, rgba(7,10,13,.22) 100%),
    linear-gradient(180deg, rgba(7,10,13,.10), rgba(7,10,13,.82));
}

.hero-waterproof-line {
  position: absolute;
  inset: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.hero-waterproof-line line {
  stroke: rgba(242,240,236,.48);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}

.hero-waterproof-line .hero-angle-tick {
  stroke: var(--champagne);
}

.hero-photo-content {
  display: grid;
  min-height: min(900px, 100svh);
  grid-template-columns: minmax(0,1.12fr) minmax(300px,.62fr);
  align-items: end;
  gap: 80px;
  padding-top: 170px;
  padding-bottom: 92px;
}

.hero-photo-copy {
  max-width: 820px;
}

.hero-photo-copy .section-index {
  margin-bottom: 58px;
}

.hero-photo-copy h1 {
  max-width: 920px;
  margin: 0 0 24px;
  color: var(--paper);
  font-size: clamp(4.8rem, 9vw, 8.7rem);
  line-height: .84;
  letter-spacing: -.055em;
  text-transform: uppercase;
}

.hero-photo-copy h1 span {
  display: block;
  color: var(--paper);
  font-weight: 480;
}

.hero-photo-copy .hero-statement {
  max-width: 600px;
  margin: 0;
  color: #d9dde0;
  font-size: clamp(1.2rem,2vw,1.65rem);
}

.hero-actions-v3 {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 28px;
  margin-top: 42px;
}

.hero-primary {
  border-color: var(--paper);
  background: var(--paper);
  color: var(--graphite);
}

.hero-primary:hover {
  border-color: var(--paper);
  background: #fff;
}

.hero-phone {
  padding-bottom: 7px;
  border-bottom: 1px solid rgba(242,240,236,.55);
  color: var(--paper);
  font-size: 1.12rem;
}

.hero-dakcheck-link {
  display: inline-flex;
  align-items: center;
  gap: 18px;
  margin-top: 26px;
  color: #c2cbd0;
}

.hero-dakcheck-link span {
  color: var(--champagne);
}

.hero-spec-panel {
  align-self: end;
  margin-bottom: 18px;
  padding: 26px 0 0;
  border-top: 1px solid rgba(255,255,255,.22);
}

.hero-spec-panel > .annotation {
  color: var(--champagne);
}

.hero-spec-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
  padding: 15px 0;
  border-bottom: 1px solid rgba(255,255,255,.13);
  color: #d4dadd;
}

.hero-spec-row span {
  color: #8798a3;
  font-family: var(--font-mono);
  font-size: .72rem;
  letter-spacing: .08em;
}

.hero-spec-row strong {
  color: var(--paper);
  font-size: .86rem;
}

.hero-spec-panel small {
  display: block;
  margin-top: 16px;
  color: #8798a3;
  font-size: .72rem;
}

/* Rich editorial photo band */

.editorial-material-band {
  padding: 0 0 150px;
}

.editorial-material-grid {
  display: grid;
  grid-template-columns: 1.3fr .72fr;
  grid-template-rows: auto auto;
  gap: 22px;
}

.editorial-photo {
  position: relative;
  overflow: hidden;
  min-height: 390px;
  margin: 0;
  background: var(--graphite);
}

.editorial-photo-large {
  grid-row: 1 / span 2;
  min-height: 720px;
}

.editorial-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(.72) contrast(1.06);
  transition: transform 700ms cubic-bezier(.22,1,.36,1), filter 300ms ease;
}

.editorial-photo:hover img {
  transform: scale(1.025);
  filter: saturate(.88) contrast(1.03);
}

.editorial-photo figcaption {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  padding: 26px;
  background: linear-gradient(180deg, transparent, rgba(7,10,13,.88));
  color: var(--paper);
}

.editorial-photo figcaption .annotation {
  color: #c8d1d5;
}

.editorial-note {
  display: grid;
  grid-template-columns: 56px 1fr;
  column-gap: 20px;
  align-content: start;
  padding: 34px 0 0;
  border-top: 1px solid var(--line-light);
}

.editorial-note > .mono {
  color: var(--champagne);
}

.editorial-note > *:not(.mono) {
  grid-column: 2;
}

.editorial-note h2 {
  max-width: 580px;
  margin-bottom: 18px;
  font-size: clamp(2rem,3.6vw,3.7rem);
}

/* Photo-led inner page hero */

.page-hero-photo {
  padding: 92px 0 76px;
  background: var(--paper);
  border-bottom: 1px solid var(--line-light);
}

.page-hero-photo-grid {
  display: grid;
  grid-template-columns: minmax(0,1fr) minmax(380px,.74fr);
  align-items: stretch;
  gap: 64px;
}

.page-hero-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 500px;
}

.page-hero-copy h1 {
  max-width: 760px;
}

.page-hero-copy .dimension-line {
  margin-top: 28px;
}

.page-hero-image {
  position: relative;
  min-height: 500px;
  margin: 0;
  overflow: hidden;
  background: var(--graphite);
}

.page-hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(.62) contrast(1.08);
}

.page-hero-image figcaption {
  position: absolute;
  right: 18px;
  bottom: 16px;
  padding: 8px 10px;
  background: rgba(7,10,13,.76);
  color: #d4dadd;
}

/* Calculator: restore actual tool feel */

.calculator-v3-shell {
  display: grid;
  grid-template-columns: .72fr 1.18fr .68fr;
  align-items: start;
  gap: 54px;
}

.calculator-v3-intro h2 {
  max-width: 430px;
  font-size: clamp(2.2rem,3.7vw,4rem);
}

.calculator-v3-form {
  padding: 36px;
  border: 1px solid var(--line-light);
  background: #f7f5f0;
}

.calculator-field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
}

.calculator-field-grid label {
  display: grid;
  gap: 9px;
}

.calculator-field-grid .calculator-wide {
  grid-column: 1 / -1;
}

.calculator-field-grid select,
.calculator-field-grid input {
  width: 100%;
  min-height: 58px;
  border: 0;
  border-bottom: 1px solid rgba(7,10,13,.26);
  border-radius: 0;
  outline: 0;
  background: transparent;
  color: var(--graphite);
  font: inherit;
}

.calculator-field-grid select:focus,
.calculator-field-grid input:focus {
  border-bottom-color: var(--steel);
}

.calculator-number {
  position: relative;
}

.calculator-number input {
  padding-right: 54px;
}

.calculator-number > .mono {
  position: absolute;
  right: 0;
  bottom: 18px;
  color: var(--steel);
  font-size: .8rem;
}

.calculator-submit {
  width: 100%;
  margin-top: 28px;
  border-color: var(--steel);
  background: var(--steel);
  color: #fff;
}

.calculator-v3-visual {
  position: sticky;
  top: 150px;
  padding-top: 42px;
}

.calculator-result-zone {
  padding: 84px 0;
  background: var(--graphite);
  color: var(--paper);
}

.calculator-result-v3 {
  display: grid;
  grid-template-columns: .85fr 1.15fr;
  gap: 90px;
  align-items: start;
}

.calculator-result-v3 h2 {
  color: var(--paper);
}

.calculator-summary {
  margin: 32px 0 0;
  border-top: 1px solid var(--line-dark);
}

.calculator-summary div {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 24px;
  padding: 14px 0;
  border-bottom: 1px solid var(--line-dark);
}

.calculator-summary dt {
  color: var(--cool-steel);
  font-family: var(--font-mono);
  font-size: .7rem;
  letter-spacing: .08em;
}

.calculator-summary dd {
  margin: 0;
  color: var(--paper);
}

.calculator-price-panel {
  padding-left: 48px;
  border-left: 1px solid var(--line-dark);
}

.calculator-price-panel > strong {
  display: block;
  margin: 12px 0 18px;
  color: var(--paper);
  font-size: clamp(2.5rem,5vw,5.7rem);
  line-height: .98;
}

.calculator-price-panel p {
  max-width: 600px;
  color: #aebbc2;
}

.calculator-price-panel .btn {
  margin-top: 20px;
}

.calculator-explain {
  border-top: 1px solid var(--line-light);
}

@media (max-width: 980px) {
  .hero-photo-content {
    grid-template-columns: 1fr;
    align-items: end;
    gap: 44px;
    padding-top: 150px;
  }

  .hero-photo-copy h1 {
    font-size: clamp(4rem,14vw,7rem);
  }

  .hero-spec-panel {
    max-width: 560px;
  }

  .editorial-material-grid,
  .page-hero-photo-grid,
  .calculator-v3-shell,
  .calculator-result-v3 {
    grid-template-columns: 1fr;
  }

  .editorial-photo-large {
    min-height: 520px;
    grid-row: auto;
  }

  .editorial-photo-small {
    min-height: 420px;
  }

  .page-hero-copy {
    min-height: auto;
  }

  .page-hero-image {
    min-height: 430px;
  }

  .calculator-v3-visual {
    position: static;
    max-width: 520px;
  }

  .calculator-price-panel {
    padding-left: 0;
    padding-top: 38px;
    border-left: 0;
    border-top: 1px solid var(--line-dark);
  }
}

@media (max-width: 640px) {
  .hero-photo-v3 {
    min-height: 790px;
  }

  .hero-photo-layer img {
    object-position: 62% center;
  }

  .hero-photo-shade {
    background:
      linear-gradient(180deg, rgba(7,10,13,.72) 0%, rgba(7,10,13,.72) 38%, rgba(7,10,13,.96) 78%, rgba(7,10,13,1) 100%);
  }

  .hero-photo-content {
    min-height: 790px;
    padding-top: 126px;
    padding-bottom: 56px;
  }

  .hero-photo-copy .section-index {
    margin-bottom: 34px;
  }

  .hero-photo-copy h1 {
    font-size: clamp(3.55rem,18vw,5.5rem);
  }

  .hero-photo-copy .hero-statement {
    max-width: 330px;
  }

  .hero-actions-v3 {
    align-items: stretch;
    flex-direction: column;
    gap: 18px;
  }

  .hero-primary {
    width: 100%;
  }

  .hero-phone {
    width: fit-content;
  }

  .hero-spec-panel {
    display: none;
  }

  .editorial-material-band {
    padding-bottom: 88px;
  }

  .editorial-material-grid {
    gap: 14px;
  }

  .editorial-photo-large,
  .editorial-photo-small {
    min-height: 390px;
  }

  .editorial-photo figcaption {
    display: grid;
    padding: 18px;
  }

  .editorial-note {
    grid-template-columns: 36px 1fr;
    padding-top: 24px;
  }

  .page-hero-photo {
    padding: 62px 0 42px;
  }

  .page-hero-image {
    min-height: 330px;
  }

  .calculator-v3-form {
    padding: 24px 18px;
  }

  .calculator-field-grid {
    grid-template-columns: 1fr;
  }

  .calculator-field-grid .calculator-wide {
    grid-column: auto;
  }

  .calculator-result-zone {
    padding: 64px 0 86px;
  }

  .calculator-summary div {
    grid-template-columns: 1fr;
    gap: 4px;
  }

  .calculator-price-panel > strong {
    font-size: clamp(2.3rem,11vw,4rem);
  }
}

/* =========================================================
   LRS JOUWWEB ASSET + REAL CALCULATOR FIX
   ========================================================= */

.brand-with-original {
  gap: 12px;
}

.original-logo-frame {
  position: relative;
  display: block;
  width: 58px;
  height: 44px;
  overflow: hidden;
  border: 1px solid var(--line-dark);
  background: var(--paper);
}

.original-logo-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.brand-text-fallback {
  display: inline-flex;
  align-items: baseline;
  gap: 7px;
}

.brand-text-fallback strong {
  color: var(--paper);
}

.brand-text-fallback > span {
  color: var(--cool-steel);
}

.hero-photo-copy h1 {
  max-width: 980px;
}

.hero-photo-copy h1 > span {
  display: block;
  margin-bottom: 10px;
  color: var(--champagne);
  font-family: var(--font-mono), "IBM Plex Mono", ui-monospace, monospace;
  font-size: clamp(.72rem, 1.1vw, .92rem);
  font-weight: 500;
  letter-spacing: .12em;
}

.hero-photo-layer img,
.page-hero-image img,
.editorial-photo img {
  filter: saturate(.82) contrast(1.04);
}

.editorial-photo-large img {
  object-position: 50% 36%;
}

.editorial-photo-small img {
  object-position: 72% 64%;
  transform: scale(1.08);
}

.editorial-photo-small:hover img {
  transform: scale(1.1);
}

.calculator-live-preview {
  display: grid;
  gap: 8px;
  margin: 22px 0 26px;
  padding: 22px 0;
  border-top: 1px solid var(--line-light);
  border-bottom: 1px solid var(--line-light);
}

.calculator-live-preview > strong {
  color: var(--slate);
  font-size: clamp(1.9rem, 4vw, 3.2rem);
  line-height: 1;
  letter-spacing: -.045em;
}

.calculator-live-preview > small {
  color: var(--cool-steel);
  font-family: var(--font-mono), "IBM Plex Mono", ui-monospace, monospace;
  font-size: .72rem;
  letter-spacing: .08em;
}

.calculator-model-note {
  padding-left: 14px;
  border-left: 2px solid var(--champagne);
}

.calculator-disclaimer {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid rgba(255,255,255,.14);
  font-size: .9rem;
}

.calculator-price-panel .calculator-model-note,
.calculator-price-panel .calculator-disclaimer {
  color: var(--cool-steel);
}

@media (max-width: 860px) {
  .original-logo-frame {
    width: 48px;
    height: 38px;
  }

  .brand-text-fallback > span {
    display: none;
  }

  .hero-photo-copy h1 > span {
    margin-bottom: 7px;
    font-size: .7rem;
  }

  .calculator-live-preview > strong {
    font-size: clamp(1.7rem, 9vw, 2.8rem);
  }
}



/* =========================================================
   LRS PREMIUM V6 — 2026-09-05
   Dark hero retained. Everything below rebuilt as a calmer,
   image-led premium contractor site rather than a CAD demo.
   ========================================================= */

:root {
  --premium-bg: #f4f2ed;
  --premium-bg-2: #ebe8e1;
  --premium-ink: #0b1014;
  --premium-slate: #233946;
  --premium-steel: #42687d;
  --premium-line: rgba(11,16,20,.14);
  --premium-white: #f6f4ef;
}

body {
  background: var(--premium-bg);
}

.premium-kicker {
  display: inline-flex;
  margin-bottom: 18px;
  font-family: var(--font-plex), "IBM Plex Mono", monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--premium-steel);
}

.premium-kicker.on-dark { color: #c9b98e; }

.premium-section-head {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(260px, .7fr);
  align-items: end;
  gap: 72px;
  margin-bottom: 72px;
}

.premium-section-head h2 {
  max-width: 850px;
  margin: 0;
  font-size: clamp(2.8rem, 5vw, 5.4rem);
  line-height: .98;
  letter-spacing: -.045em;
}

.premium-section-head h2 em,
.premium-section-head.dark h2 em {
  font-style: normal;
  font-weight: 400;
  color: var(--premium-steel);
}

.premium-section-head p {
  margin: 0 0 8px;
  max-width: 470px;
  font-size: 1rem;
}

.premium-section-head.dark h2 { color: var(--premium-white); }
.premium-section-head.dark h2 em { color: #9eb1bc; }
.premium-section-head.dark p { color: #9caab2; }

/* slim proof line directly after the retained dark hero */
.premium-trust-strip {
  background: #0a0f13;
  border-top: 1px solid rgba(255,255,255,.09);
  border-bottom: 1px solid rgba(255,255,255,.09);
  color: #fff;
}

.premium-trust-strip .shell {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.premium-trust-strip .shell > div {
  display: grid;
  grid-template-columns: 42px 1fr;
  grid-template-areas: "num title" "num sub";
  align-items: center;
  min-height: 108px;
  padding: 20px 32px;
  border-right: 1px solid rgba(255,255,255,.09);
}

.premium-trust-strip .shell > div:first-child { padding-left: 0; }
.premium-trust-strip .shell > div:last-child { border-right: 0; }
.premium-trust-strip .mono { grid-area: num; color: #c9b98e; font-size: 11px; }
.premium-trust-strip strong { grid-area: title; font-size: .96rem; letter-spacing: -.01em; }
.premium-trust-strip small { grid-area: sub; color: #75858f; font-size: .75rem; }

/* SERVICES — large editorial rows, no little template cards */
.premium-services-section {
  padding: 150px 0 140px;
  background: var(--premium-bg);
}

.premium-service-rail {
  border-top: 1px solid var(--premium-line);
}

.premium-service-row {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) 52px;
  gap: 28px;
  align-items: center;
  min-height: 170px;
  padding: 28px 24px 28px 0;
  border-bottom: 1px solid var(--premium-line);
  transition: background 260ms ease, padding 260ms ease, color 260ms ease;
}

.premium-service-row:hover {
  padding-left: 28px;
  background: var(--premium-ink);
  color: #fff;
}

.premium-service-index {
  align-self: start;
  padding-top: 7px;
  color: #8b979d;
  font-size: 11px;
}

.premium-service-main small {
  display: block;
  margin-bottom: 8px;
  color: var(--premium-steel);
  font-family: var(--font-plex), "IBM Plex Mono", monospace;
  font-size: 10px;
  letter-spacing: .1em;
  text-transform: uppercase;
}

.premium-service-main h3 {
  margin: 0 0 10px;
  font-size: clamp(2rem, 3vw, 3.25rem);
  font-weight: 500;
  letter-spacing: -.035em;
}

.premium-service-main p {
  max-width: 720px;
  margin: 0;
  font-size: .92rem;
}

.premium-service-row:hover p { color: #aeb9bf; }
.premium-service-row:hover small { color: #c9b98e; }

.premium-service-arrow {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  justify-self: end;
  border: 1px solid var(--premium-line);
  border-radius: 50%;
  font-size: 1.1rem;
  transition: transform 260ms ease, border-color 260ms ease;
}

.premium-service-row:hover .premium-service-arrow {
  transform: rotate(45deg);
  border-color: rgba(255,255,255,.28);
}

/* One strong real LRS image instead of repeating small image cards */
.premium-image-story {
  position: relative;
  min-height: 760px;
  overflow: hidden;
  background: var(--graphite);
  color: #fff;
}

.premium-image-story-media,
.premium-image-story-overlay {
  position: absolute;
  inset: 0;
}

.premium-image-story-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 48%;
  filter: saturate(.78) contrast(1.08);
  transform: scale(1.01);
}

.premium-image-story-overlay {
  background:
    linear-gradient(90deg, rgba(5,8,10,.92) 0%, rgba(5,8,10,.72) 40%, rgba(5,8,10,.22) 72%, rgba(5,8,10,.12) 100%),
    linear-gradient(0deg, rgba(5,8,10,.55), transparent 42%);
}

.premium-image-story-content {
  min-height: 760px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 88px;
  z-index: 2;
}

.premium-image-story-content h2 {
  max-width: 820px;
  margin-bottom: 20px;
  color: #fff;
  font-size: clamp(3.2rem, 6vw, 6.6rem);
  line-height: .94;
  letter-spacing: -.055em;
  font-weight: 600;
}

.premium-image-story-content > p {
  max-width: 580px;
  margin-bottom: 42px;
  color: #c4cdd2;
  font-size: 1.06rem;
}

.premium-image-facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(160px, 1fr));
  width: min(760px, 100%);
  border-top: 1px solid rgba(255,255,255,.2);
}

.premium-image-facts > div {
  display: grid;
  gap: 6px;
  padding: 18px 24px 0 0;
}

.premium-image-facts span {
  color: #c9b98e;
  font-family: var(--font-plex), monospace;
  font-size: 10px;
}

.premium-image-facts strong {
  font-size: .85rem;
  font-weight: 500;
}

/* problem router */
.premium-issue-section {
  padding: 150px 0;
  background: #ebe8e1;
}

.premium-issue-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid var(--premium-line);
  border-left: 1px solid var(--premium-line);
}

.premium-issue-card {
  display: flex;
  min-height: 290px;
  flex-direction: column;
  justify-content: space-between;
  padding: 28px;
  border-right: 1px solid var(--premium-line);
  border-bottom: 1px solid var(--premium-line);
  background: rgba(255,255,255,.18);
  transition: background 220ms ease, transform 220ms ease;
}

.premium-issue-card:hover {
  background: #f8f6f1;
}

.premium-issue-top {
  display: flex;
  justify-content: space-between;
  color: #79868d;
  font-size: 11px;
}

.premium-issue-card h3 {
  max-width: 320px;
  margin: 42px 0;
  font-size: clamp(1.6rem, 2.25vw, 2.4rem);
  font-weight: 500;
  line-height: 1.08;
}

.premium-issue-meta {
  display: grid;
  gap: 4px;
  padding-top: 18px;
  border-top: 1px solid var(--premium-line);
}

.premium-issue-meta span {
  color: var(--premium-steel);
  font-family: var(--font-plex), monospace;
  font-size: 10px;
  letter-spacing: .08em;
}

.premium-issue-meta small { color: #778188; }

/* calculator spotlight */
.premium-price-section {
  padding: 150px 0;
  background: var(--premium-bg);
}

.premium-price-grid {
  display: grid;
  grid-template-columns: .92fr 1.08fr;
  gap: 92px;
  align-items: center;
}

.premium-price-copy h2 {
  max-width: 650px;
  margin-bottom: 24px;
  font-size: clamp(3rem, 5vw, 5.3rem);
  line-height: .97;
  letter-spacing: -.05em;
}

.premium-price-copy p {
  max-width: 540px;
  margin-bottom: 36px;
}

.premium-cta {
  display: inline-flex;
  align-items: center;
  gap: 26px;
  min-height: 58px;
  padding: 0 22px;
  border: 1px solid var(--premium-ink);
  background: var(--premium-ink);
  color: #fff;
  font-family: var(--font-plex), monospace;
  font-size: 11px;
  letter-spacing: .09em;
  transition: background 200ms ease, color 200ms ease, gap 200ms ease;
}

.premium-cta:hover {
  gap: 36px;
  background: transparent;
  color: var(--premium-ink);
}

.premium-cta.light {
  border-color: #fff;
  background: #fff;
  color: #0b1014;
}

.premium-cta.light:hover {
  background: transparent;
  color: #fff;
}

.premium-calc-preview {
  padding: 44px;
  background: var(--premium-ink);
  color: #fff;
  border: 1px solid rgba(255,255,255,.05);
}

.premium-calc-top,
.premium-calc-line {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,.12);
}

.premium-calc-top {
  padding-bottom: 22px;
  color: #99a8b0;
  font-family: var(--font-plex), monospace;
  font-size: 10px;
  letter-spacing: .1em;
}

.premium-calc-top b { color: #c9b98e; }

.premium-calc-line {
  min-height: 76px;
}

.premium-calc-line span {
  color: #72838c;
  font-family: var(--font-plex), monospace;
  font-size: 10px;
}

.premium-calc-line strong {
  font-size: .82rem;
  font-weight: 500;
}

.premium-calc-result {
  padding-top: 38px;
}

.premium-calc-result small {
  display: block;
  margin-bottom: 10px;
  color: #c9b98e;
  font-family: var(--font-plex), monospace;
  letter-spacing: .08em;
}

.premium-calc-result strong {
  display: block;
  margin-bottom: 5px;
  font-size: clamp(2rem, 3vw, 3.4rem);
  font-weight: 500;
  letter-spacing: -.04em;
}

.premium-calc-result span { color: #84949d; }

/* why */
.premium-why-section {
  padding: 140px 0;
  background: #fff;
}

.premium-why-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid var(--premium-line);
}

.premium-why-grid article {
  min-height: 310px;
  padding: 34px 40px 34px 0;
  border-right: 1px solid var(--premium-line);
}

.premium-why-grid article + article { padding-left: 40px; }
.premium-why-grid article:last-child { border-right: 0; }

.premium-why-grid .mono {
  display: block;
  margin-bottom: 78px;
  color: #9ba4aa;
  font-size: 11px;
}

.premium-why-grid h3 {
  max-width: 320px;
  margin-bottom: 14px;
  font-size: 1.7rem;
  font-weight: 500;
}

.premium-why-grid p {
  max-width: 340px;
  margin: 0;
  font-size: .9rem;
}

/* contact */
.premium-contact-section {
  padding: 150px 0;
  background: var(--premium-bg);
}

.premium-contact-grid {
  display: grid;
  grid-template-columns: .82fr 1.18fr;
  gap: 100px;
  align-items: start;
}

.premium-contact-grid h2 {
  margin-bottom: 22px;
  font-size: clamp(3rem, 5vw, 5rem);
  line-height: .98;
  letter-spacing: -.05em;
}

.premium-phone {
  display: inline-block;
  margin-top: 30px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--premium-ink);
  font-size: clamp(1.5rem, 3vw, 2.4rem);
}

.premium-contact-section .single-contact-table > div {
  min-height: 88px;
  padding-inline: 20px;
  background: rgba(255,255,255,.36);
}

.premium-contact-section .single-contact-table > div:hover {
  background: #fff;
}

.premium-area-section {
  padding: 150px 0 130px;
}

.premium-area-section .survey-map {
  min-height: 560px;
  background: #0b1115;
}

/* INTERNAL PAGE HERO — image-led instead of a small technical split */
.premium-page-hero {
  position: relative;
  min-height: min(780px, 82svh);
  overflow: hidden;
  background: #070a0d;
  color: #fff;
}

.premium-page-hero-media,
.premium-page-hero-shade {
  position: absolute;
  inset: 0;
}

.premium-page-hero-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: saturate(.72) contrast(1.08);
}

.premium-page-hero-shade {
  background:
    linear-gradient(90deg, rgba(5,8,10,.91) 0%, rgba(5,8,10,.7) 42%, rgba(5,8,10,.22) 74%, rgba(5,8,10,.08) 100%),
    linear-gradient(0deg, rgba(5,8,10,.45), transparent 55%);
}

.premium-page-hero-content {
  min-height: min(780px, 82svh);
  display: grid;
  grid-template-columns: minmax(0, 1fr) 160px;
  gap: 60px;
  align-items: end;
  padding-top: 130px;
  padding-bottom: 80px;
  z-index: 2;
}

.premium-page-hero-content h1 {
  max-width: 900px;
  margin: 0 0 24px;
  color: #fff;
  font-size: clamp(3.5rem, 7vw, 7.2rem);
  line-height: .91;
  letter-spacing: -.06em;
  font-weight: 600;
}

.premium-page-hero-content p {
  max-width: 620px;
  margin-bottom: 34px;
  color: #b5c0c6;
  font-size: 1.05rem;
}

.premium-page-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 26px;
  align-items: center;
}

.premium-page-phone {
  color: #fff;
  font-size: .9rem;
}

.premium-angle-card {
  align-self: end;
  padding: 18px 0 8px 22px;
  border-left: 1px solid rgba(255,255,255,.25);
}

.premium-angle-card .mono {
  display: block;
  color: #c9b98e;
  font-size: 2rem;
}

.premium-angle-card small {
  color: #7f9098;
  font-family: var(--font-plex), monospace;
  font-size: 9px;
  letter-spacing: .1em;
}

/* SERVICE PAGES */
.premium-service-intro {
  padding: 140px 0;
  background: var(--premium-bg);
}

.premium-service-intro-grid {
  display: grid;
  grid-template-columns: .9fr 1.1fr;
  gap: 100px;
}

.premium-service-intro-grid h2 {
  max-width: 600px;
  font-size: clamp(2.6rem, 4vw, 4.6rem);
  line-height: 1;
  letter-spacing: -.045em;
}

.premium-symptom-list {
  border-top: 1px solid var(--premium-line);
}

.premium-symptom-list > div,
.premium-check-register > div {
  display: grid;
  grid-template-columns: 50px 1fr;
  gap: 20px;
  min-height: 78px;
  align-items: center;
  border-bottom: 1px solid var(--premium-line);
}

.premium-symptom-list .mono,
.premium-check-register .mono {
  color: #8a969d;
  font-size: 10px;
}

.premium-symptom-list strong,
.premium-check-register strong {
  font-size: 1rem;
  font-weight: 500;
}

.premium-service-photo-block {
  padding: 0 0 150px;
  background: var(--premium-bg);
}

.premium-service-photo-grid {
  display: grid;
  grid-template-columns: 1.15fr .85fr;
  gap: 76px;
  align-items: center;
}

.premium-service-photo-grid figure {
  position: relative;
  min-height: 620px;
  margin: 0;
  overflow: hidden;
  background: var(--premium-ink);
}

.premium-service-photo-grid figure img {
  width: 100%;
  height: 620px;
  object-fit: cover;
  filter: saturate(.82) contrast(1.04);
}

.premium-service-photo-grid figcaption {
  position: absolute;
  left: 18px;
  bottom: 16px;
  padding: 8px 10px;
  background: rgba(7,10,13,.72);
  color: #d8dcde;
  font-family: var(--font-plex), monospace;
  font-size: 9px;
  letter-spacing: .08em;
}

.premium-service-photo-grid h2 {
  margin-bottom: 34px;
  font-size: clamp(2.6rem, 4vw, 4.3rem);
  line-height: 1;
}

.premium-technical-section {
  padding: 140px 0;
  background: #ebe8e1;
}

.premium-technical-section .assembly-layout {
  background: #f6f4ef;
  border: 1px solid var(--premium-line);
}

.premium-service-cta-wrap {
  padding-top: 30px;
  padding-bottom: 30px;
}

/* CTA: make it feel like a proper final premium block */
.cta-v2 {
  margin: 90px 0 130px;
  padding: 58px 64px;
  border: 0;
  background: var(--premium-ink);
  color: #fff;
}

.cta-v2 h2 {
  color: #fff;
  font-size: clamp(2.5rem, 4vw, 4.4rem);
  line-height: 1;
}

.cta-v2 p { color: #99a9b1; }
.cta-v2 .annotation { color: #c9b98e; }
.cta-v2 .text-action,
.cta-v2 .mono { color: #fff; }

/* Calculator — make the real tool a premium centerpiece */
.calculator-v3-shell {
  grid-template-columns: .72fr 1.22fr;
  gap: 72px;
}

.calculator-v3-visual { display: none; }

.calculator-v3-form {
  position: relative;
  padding: 46px;
  background: #fff;
  border: 1px solid rgba(7,10,13,.12);
}

.calculator-v3-form::before {
  content: "LRS / ONLINE PRIJSENGINE";
  display: block;
  margin-bottom: 32px;
  color: #8b989f;
  font-family: var(--font-plex), monospace;
  font-size: 9px;
  letter-spacing: .12em;
}

.calculator-live-preview {
  margin-top: 30px;
  padding: 26px 0;
  border-top: 1px solid var(--premium-line);
  border-bottom: 1px solid var(--premium-line);
}

.calculator-live-preview > strong {
  display: block;
  margin: 8px 0 4px;
  color: var(--premium-ink);
  font-size: clamp(1.8rem, 3vw, 3rem);
  letter-spacing: -.04em;
}

.calculator-live-preview small { color: #7c898f; }

.calculator-submit {
  min-height: 62px;
  margin-top: 30px;
  background: var(--premium-ink);
  border-color: var(--premium-ink);
}

.calculator-submit:hover {
  background: var(--premium-steel);
  border-color: var(--premium-steel);
  color: #fff;
}

.calculator-result-zone {
  padding: 110px 0;
}

.calculator-price-panel > strong {
  font-size: clamp(3rem, 6vw, 6rem);
}

/* Footer remains dark but less like a CAD title sheet */
.site-footer-v2 {
  background: #070a0d;
}

.title-block {
  border-color: rgba(255,255,255,.1);
}

.title-brand .annotation {
  color: #7f8f97;
}

/* reduce the old global waterline so it is detail, not the whole design */
.waterline-shell {
  opacity: .34;
  width: 68px;
}

/* ===== responsive ===== */
@media (max-width: 980px) {
  .premium-section-head,
  .premium-price-grid,
  .premium-contact-grid,
  .premium-service-intro-grid,
  .premium-service-photo-grid {
    grid-template-columns: 1fr;
    gap: 42px;
  }

  .premium-issue-grid { grid-template-columns: repeat(2, 1fr); }
  .premium-why-grid { grid-template-columns: 1fr; }
  .premium-why-grid article {
    min-height: 0;
    padding: 34px 0;
    border-right: 0;
    border-bottom: 1px solid var(--premium-line);
  }
  .premium-why-grid article + article { padding-left: 0; }
  .premium-why-grid .mono { margin-bottom: 28px; }

  .premium-service-photo-grid figure,
  .premium-service-photo-grid figure img { min-height: 500px; height: 500px; }

  .calculator-v3-shell { grid-template-columns: 1fr; }
}

@media (max-width: 720px) {
  .premium-trust-strip .shell {
    grid-template-columns: 1fr;
  }

  .premium-trust-strip .shell > div,
  .premium-trust-strip .shell > div:first-child {
    min-height: 78px;
    padding: 14px 0;
    border-right: 0;
    border-bottom: 1px solid rgba(255,255,255,.09);
  }

  .premium-services-section,
  .premium-issue-section,
  .premium-price-section,
  .premium-why-section,
  .premium-contact-section,
  .premium-area-section,
  .premium-service-intro,
  .premium-technical-section {
    padding-top: 82px;
    padding-bottom: 76px;
  }

  .premium-section-head {
    gap: 24px;
    margin-bottom: 44px;
  }

  .premium-section-head h2 {
    font-size: clamp(2.4rem, 12vw, 3.5rem);
  }

  .premium-service-row {
    grid-template-columns: 34px 1fr 34px;
    min-height: 145px;
    gap: 12px;
    padding-right: 0;
  }

  .premium-service-row:hover { padding-left: 10px; }

  .premium-service-main h3 { font-size: 1.8rem; }
  .premium-service-main p {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size: .8rem;
  }

  .premium-service-arrow { width: 32px; height: 32px; }

  .premium-image-story,
  .premium-image-story-content {
    min-height: 650px;
  }

  .premium-image-story-overlay {
    background: linear-gradient(0deg, rgba(5,8,10,.94) 0%, rgba(5,8,10,.58) 58%, rgba(5,8,10,.28) 100%);
  }

  .premium-image-story-content {
    padding-bottom: 60px;
  }

  .premium-image-story-content h2 {
    font-size: clamp(2.8rem, 14vw, 4.6rem);
  }

  .premium-image-facts {
    grid-template-columns: 1fr;
  }

  .premium-image-facts > div {
    grid-template-columns: 34px 1fr;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255,255,255,.12);
  }

  .premium-issue-grid { grid-template-columns: 1fr; }
  .premium-issue-card { min-height: 220px; }

  .premium-price-copy h2,
  .premium-contact-grid h2 {
    font-size: clamp(2.6rem, 12vw, 4rem);
  }

  .premium-calc-preview { padding: 28px 20px; }
  .premium-page-hero { min-height: 680px; }
  .premium-page-hero-content {
    min-height: 680px;
    grid-template-columns: 1fr;
    padding-top: 110px;
    padding-bottom: 54px;
  }
  .premium-page-hero-content h1 {
    font-size: clamp(3rem, 14vw, 5rem);
  }
  .premium-angle-card { display: none; }

  .premium-service-photo-grid figure,
  .premium-service-photo-grid figure img { min-height: 380px; height: 380px; }

  .calculator-v3-form { padding: 28px 20px; }
  .calculator-field-grid { grid-template-columns: 1fr; }
  .calculator-field-grid .calculator-wide { grid-column: auto; }

  .cta-v2 {
    padding: 36px 24px;
  }

  .waterline-shell {
    opacity: .22;
    width: 34px;
  }
}


/* ========================================================================== */
/* V7 — REAL WORK AREA MAP + PROFESSIONAL PRICE ENGINE + LEAKAGE PAGE          */
/* ========================================================================== */

.workarea-real-section {
  background: #f6f4ef;
}

.real-workarea-map {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(320px, .55fr);
  gap: 42px;
  align-items: stretch;
}

.real-map-frame {
  position: relative;
  min-height: 650px;
  overflow: hidden;
  background: var(--graphite);
  border: 1px solid rgba(7,10,13,.12);
}

.real-map-frame iframe {
  display: block;
  width: 100%;
  height: 650px;
  border: 0;
  filter: saturate(.82) contrast(1.02);
}

.real-map-badge {
  position: absolute;
  left: 24px;
  bottom: 24px;
  display: grid;
  gap: 4px;
  max-width: 285px;
  padding: 18px 20px;
  background: rgba(7,10,13,.92);
  color: var(--paper);
  border-left: 2px solid var(--champagne);
}

.real-map-badge strong {
  font-size: 1.25rem;
}

.real-map-badge small {
  color: #aab7bf;
}

.real-map-copy {
  align-self: center;
  padding: 28px 0;
}

.real-map-copy h2 {
  margin: 12px 0 18px;
  font-size: clamp(2.2rem, 4vw, 4.4rem);
  line-height: .98;
}

.real-map-copy > p {
  max-width: 520px;
  font-size: 1.05rem;
}

.real-map-places {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 28px;
}

.real-map-places span {
  padding: 8px 10px;
  border: 1px solid rgba(7,10,13,.13);
  background: rgba(255,255,255,.55);
  font-size: .82rem;
}

.real-location-register {
  margin-top: 54px;
  border-top: 1px solid rgba(7,10,13,.12);
}

.real-location-register a {
  grid-template-columns: 55px 1fr auto;
  color: var(--graphite);
  border-bottom-color: rgba(7,10,13,.12);
}

.real-location-register a:hover {
  background: rgba(41,75,94,.05);
}

/* Professional calculator tone */
.calculator-v3-intro h2 {
  max-width: 780px;
}

.calculator-v3-intro > p:last-child {
  max-width: 760px;
  font-size: 1.04rem;
}

.calculator-live-preview small {
  text-transform: none;
  letter-spacing: 0;
}

.calculator-model-note strong {
  color: inherit;
}

/* Dedicated leakage page */
.leak-hero {
  position: relative;
  min-height: min(840px, 92svh);
  overflow: hidden;
  background: var(--graphite);
  color: var(--paper);
}

.leak-hero-media,
.leak-hero-shade {
  position: absolute;
  inset: 0;
}

.leak-hero-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.leak-hero-shade {
  background:
    linear-gradient(90deg, rgba(7,10,13,.94) 0%, rgba(7,10,13,.76) 43%, rgba(7,10,13,.32) 72%, rgba(7,10,13,.18) 100%),
    linear-gradient(180deg, rgba(7,10,13,.08), rgba(7,10,13,.5));
}

.leak-hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  min-height: min(840px, 92svh);
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-top: 110px;
  padding-bottom: 80px;
}

.leak-hero h1 {
  max-width: 900px;
  margin: 14px 0 24px;
  font-size: clamp(4rem, 8vw, 8.6rem);
  line-height: .86;
  letter-spacing: -.055em;
}

.leak-hero h1 em {
  color: #dfe6e9;
  font-style: normal;
  font-weight: 450;
}

.leak-hero-content > p {
  max-width: 690px;
  color: #c7d0d5;
  font-size: clamp(1.05rem, 1.7vw, 1.3rem);
}

.leak-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: center;
  margin-top: 28px;
}

.leak-hero-price {
  display: grid;
  gap: 4px;
  margin-top: 54px;
  padding-top: 22px;
  border-top: 1px solid rgba(255,255,255,.2);
}

.leak-hero-price > span,
.leak-price-card > small {
  color: var(--champagne);
  font-family: var(--font-mono), monospace;
  font-size: .72rem;
  letter-spacing: .1em;
}

.leak-hero-price strong {
  font-size: clamp(1.9rem, 3vw, 3.4rem);
}

.leak-hero-price small {
  color: #aeb9bf;
}

.leak-intro-section,
.leak-roof-types,
.leak-price-section,
.leak-now-section {
  padding: 130px 0;
  background: #f6f4ef;
}

.leak-intro-grid {
  display: grid;
  grid-template-columns: minmax(0,.72fr) minmax(0,1.28fr);
  gap: 72px;
}

.leak-intro-grid > div:first-child h2,
.leak-price-grid h2,
.leak-now-grid h2 {
  font-size: clamp(2.5rem, 5vw, 5rem);
  line-height: .95;
}

.leak-cause-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  border-top: 1px solid rgba(7,10,13,.14);
  border-left: 1px solid rgba(7,10,13,.14);
}

.leak-cause-grid article {
  min-height: 245px;
  padding: 28px;
  border-right: 1px solid rgba(7,10,13,.14);
  border-bottom: 1px solid rgba(7,10,13,.14);
}

.leak-cause-grid article > span {
  color: var(--steel);
  font-size: .76rem;
}

.leak-cause-grid h3 {
  margin: 34px 0 10px;
  font-size: 1.35rem;
}

.leak-cause-grid p {
  margin: 0;
}

.leak-dark-section {
  padding: 130px 0;
  background: var(--graphite);
  color: var(--paper);
}

.leak-dark-grid {
  display: grid;
  grid-template-columns: .8fr 1.2fr;
  gap: 90px;
}

.leak-dark-grid h2 {
  max-width: 620px;
  font-size: clamp(2.7rem, 5.4vw, 5.7rem);
  line-height: .92;
}

.leak-dark-grid > div:first-child p {
  max-width: 560px;
  color: #aeb9bf;
}

.leak-process-list {
  border-top: 1px solid rgba(255,255,255,.16);
}

.leak-process-list > div {
  display: grid;
  grid-template-columns: 58px 1fr;
  gap: 20px;
  padding: 25px 0;
  border-bottom: 1px solid rgba(255,255,255,.16);
}

.leak-process-list > div > span {
  color: var(--champagne);
}

.leak-process-list strong {
  font-size: 1.15rem;
}

.leak-process-list p {
  margin: 5px 0 0;
  color: #aeb9bf;
}

.leak-roof-types {
  background: var(--paper-deep);
}

.leak-roof-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  margin-top: 52px;
  border-top: 1px solid rgba(7,10,13,.14);
  border-left: 1px solid rgba(7,10,13,.14);
}

.leak-roof-grid article {
  min-height: 330px;
  padding: 38px;
  border-right: 1px solid rgba(7,10,13,.14);
  border-bottom: 1px solid rgba(7,10,13,.14);
}

.leak-roof-grid article > span {
  color: var(--steel);
}

.leak-roof-grid h3 {
  margin: 58px 0 14px;
  font-size: clamp(2rem, 3vw, 3.4rem);
}

.leak-roof-grid a {
  display: inline-block;
  margin-top: 20px;
  font-weight: 800;
  color: var(--slate);
}

.leak-price-section {
  background: #fff;
}

.leak-price-grid,
.leak-now-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 70px;
  align-items: start;
}

.leak-price-card {
  padding: 46px;
  background: var(--graphite);
  color: var(--paper);
}

.leak-price-card strong {
  display: block;
  margin: 15px 0 30px;
  font-size: clamp(2.2rem, 4.6vw, 5.3rem);
  line-height: .95;
}

.leak-price-card ul {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid rgba(255,255,255,.16);
}

.leak-price-card li {
  padding: 15px 0;
  border-bottom: 1px solid rgba(255,255,255,.16);
  color: #c6d0d5;
}

.leak-now-section {
  background: var(--paper);
}

.leak-now-list {
  border-top: 1px solid rgba(7,10,13,.14);
}

.leak-now-list p {
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 18px;
  margin: 0;
  padding: 20px 0;
  border-bottom: 1px solid rgba(7,10,13,.14);
}

.leak-now-list strong {
  color: var(--steel);
  font-family: var(--font-mono), monospace;
}

@media (max-width: 900px) {
  .real-workarea-map,
  .leak-intro-grid,
  .leak-dark-grid,
  .leak-price-grid,
  .leak-now-grid {
    grid-template-columns: 1fr;
  }

  .real-map-frame,
  .real-map-frame iframe {
    min-height: 500px;
    height: 500px;
  }

  .leak-cause-grid,
  .leak-roof-grid {
    grid-template-columns: 1fr;
  }

  .leak-dark-grid {
    gap: 46px;
  }
}

@media (max-width: 640px) {
  .real-map-frame,
  .real-map-frame iframe {
    min-height: 430px;
    height: 430px;
  }

  .real-map-badge {
    right: 14px;
    left: 14px;
    bottom: 14px;
  }

  .leak-hero {
    min-height: 820px;
  }

  .leak-hero-content {
    min-height: 820px;
    padding-top: 110px;
  }

  .leak-hero h1 {
    font-size: clamp(3.2rem, 17vw, 5.3rem);
  }

  .leak-intro-section,
  .leak-roof-types,
  .leak-price-section,
  .leak-now-section,
  .leak-dark-section {
    padding: 82px 0;
  }

  .leak-cause-grid article,
  .leak-roof-grid article,
  .leak-price-card {
    padding: 26px;
  }

  .leak-price-card strong {
    font-size: clamp(2rem, 11vw, 3.6rem);
  }
}

/* ==========================================================
   V8 — SITEWIDE LRS BLACK HOVER + LEAKAGE INTAKE
   ========================================================== */

/* One interaction language across the public website */
@media (hover: hover) {
  .btn:hover,
  .premium-cta:hover,
  .calculator-submit:hover,
  .leak-intake-submit:hover,
  .leak-whatsapp-submit:hover {
    background: #070a0d !important;
    color: #f2f0ec !important;
    border-color: #070a0d !important;
  }

  .premium-cta.light:hover,
  .hero-primary:hover,
  .leak-secondary-action:hover {
    background: #070a0d !important;
    color: #f2f0ec !important;
    border-color: #f2f0ec !important;
  }

  .leak-intake-choice:hover,
  .leak-inline-action:hover {
    background: #070a0d;
    color: #f2f0ec;
    border-color: #070a0d;
  }
}

.leak-secondary-action {
  border-color: rgba(255,255,255,.55);
  background: rgba(7,10,13,.18);
  color: #fff;
}

.leak-intake-section {
  padding: 140px 0;
  background: #f6f4ef;
  border-bottom: 1px solid rgba(7,10,13,.12);
}

.leak-intake-head {
  margin-bottom: 68px;
}

.leak-intake-layout {
  display: grid;
  grid-template-columns: minmax(0,1.2fr) minmax(350px,.8fr);
  gap: 54px;
  align-items: start;
}

.leak-intake-form {
  display: grid;
  gap: 0;
  border-top: 1px solid rgba(7,10,13,.16);
}

.leak-intake-group {
  min-width: 0;
  margin: 0;
  padding: 28px 0 30px;
  border: 0;
  border-bottom: 1px solid rgba(7,10,13,.16);
}

.leak-intake-group legend {
  margin-bottom: 18px;
  padding: 0;
  color: var(--steel);
  font-size: .72rem;
  font-weight: 600;
  letter-spacing: .08em;
}

.leak-intake-options {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
}

.leak-intake-choice {
  min-height: 46px;
  padding: 0 15px;
  border: 1px solid rgba(7,10,13,.18);
  border-radius: 2px;
  background: transparent;
  color: #182027;
  cursor: pointer;
  font-size: .88rem;
  font-weight: 650;
  transition: background 180ms ease, color 180ms ease, border-color 180ms ease, transform 180ms ease;
}

.leak-intake-choice.active {
  border-color: #070a0d;
  background: #070a0d;
  color: #f2f0ec;
}

.leak-intake-fields {
  display: grid;
  gap: 22px;
  padding: 30px 0;
}

.leak-intake-fields label {
  display: grid;
  gap: 9px;
}

.leak-intake-fields label > span {
  color: var(--steel);
  font-size: .72rem;
  font-weight: 600;
  letter-spacing: .08em;
}

.leak-intake-fields input,
.leak-intake-fields textarea {
  width: 100%;
  border: 1px solid rgba(7,10,13,.18);
  border-radius: 2px;
  background: #fff;
  color: #10171c;
  outline: 0;
}

.leak-intake-fields input {
  min-height: 54px;
  padding: 0 15px;
}

.leak-intake-fields textarea {
  resize: vertical;
  padding: 14px 15px;
}

.leak-intake-fields input:focus,
.leak-intake-fields textarea:focus {
  border-color: var(--steel);
  box-shadow: 0 0 0 1px var(--steel);
}

.leak-intake-submit,
.leak-whatsapp-submit {
  width: 100%;
  min-height: 60px;
  border: 1px solid var(--steel);
  background: var(--steel);
  color: #fff;
}

.leak-intake-summary {
  position: sticky;
  top: 110px;
  padding: 38px;
  background: #0b1014;
  color: #f2f0ec;
  border: 1px solid rgba(255,255,255,.08);
}

.leak-intake-summary h3 {
  margin: 12px 0 28px;
  color: #fff;
  font-size: clamp(2rem,3.5vw,3.6rem);
}

.leak-intake-summary dl {
  margin: 0;
  border-top: 1px solid rgba(255,255,255,.14);
}

.leak-intake-summary dl > div {
  display: grid;
  grid-template-columns: .8fr 1.2fr;
  gap: 18px;
  padding: 13px 0;
  border-bottom: 1px solid rgba(255,255,255,.14);
}

.leak-intake-summary dt {
  color: #7f929e;
  font-size: .72rem;
  text-transform: uppercase;
  letter-spacing: .06em;
}

.leak-intake-summary dd {
  margin: 0;
  color: #e9edef;
  font-size: .86rem;
  text-align: right;
}

.leak-intake-price {
  display: grid;
  gap: 4px;
  margin: 30px 0 22px;
}

.leak-intake-price small {
  color: var(--champagne);
  font-size: .68rem;
  letter-spacing: .08em;
}

.leak-intake-price strong {
  color: #fff;
  font-size: clamp(1.75rem,3.5vw,3rem);
  line-height: 1;
}

.leak-intake-price span {
  color: #aeb9bf;
  font-size: .78rem;
}

.leak-intake-includes {
  margin: 0 0 26px;
  padding: 0;
  list-style: none;
  border-top: 1px solid rgba(255,255,255,.14);
}

.leak-intake-includes li {
  padding: 11px 0;
  border-bottom: 1px solid rgba(255,255,255,.14);
  color: #c8d1d6;
  font-size: .84rem;
}

.leak-transparency-section {
  padding: 135px 0;
  background: #fff;
}

.leak-price-table {
  margin-top: 54px;
  border-top: 1px solid rgba(7,10,13,.18);
}

.leak-price-table > div {
  display: grid;
  grid-template-columns: 1fr .7fr 1.35fr;
  gap: 30px;
  align-items: center;
  min-height: 84px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(7,10,13,.16);
}

.leak-price-table .head {
  min-height: 48px;
  color: var(--steel);
  font-family: var(--font-plex), monospace;
  font-size: .68rem;
  font-weight: 600;
  letter-spacing: .08em;
}

.leak-price-table strong {
  font-size: 1rem;
}

.leak-price-table span {
  color: #5e6970;
  font-size: .88rem;
}

.leak-price-table .mono {
  color: #11191e;
  font-weight: 600;
}

.leak-price-footnote {
  max-width: 880px;
  margin: 30px 0 0;
  font-size: .9rem;
}

.leak-inline-action {
  display: inline-flex !important;
  min-height: 44px;
  align-items: center;
  padding: 0 12px;
  border: 1px solid rgba(7,10,13,.18);
  transition: background 180ms ease, color 180ms ease, border-color 180ms ease;
}

@media (max-width: 980px) {
  .leak-intake-layout {
    grid-template-columns: 1fr;
  }

  .leak-intake-summary {
    position: static;
  }
}

@media (max-width: 700px) {
  .leak-intake-section,
  .leak-transparency-section {
    padding: 82px 0;
  }

  .leak-intake-head {
    margin-bottom: 42px;
  }

  .leak-intake-options {
    display: grid;
    grid-template-columns: 1fr;
  }

  .leak-intake-choice {
    width: 100%;
    justify-content: flex-start;
    text-align: left;
  }

  .leak-intake-summary {
    padding: 26px;
  }

  .leak-intake-summary dl > div {
    grid-template-columns: 1fr;
    gap: 3px;
  }

  .leak-intake-summary dd {
    text-align: left;
  }

  .leak-price-table > div,
  .leak-price-table .head {
    grid-template-columns: 1fr;
    gap: 6px;
    padding: 18px 0;
  }

  .leak-price-table .head {
    display: none;
  }
}

/* ==========================================================
   V9 — SMART LEAKAGE ROUTE / FIXED CALLOUT FEE
   ========================================================== */
.leak-route-box {
  margin: 18px 0 26px;
  padding: 22px 0 24px;
  border-top: 1px solid rgba(255,255,255,.16);
  border-bottom: 1px solid rgba(255,255,255,.16);
}

.leak-route-box > small {
  display: block;
  margin-bottom: 10px;
  color: var(--champagne);
  font-size: .68rem;
  letter-spacing: .08em;
}

.leak-route-box h3 {
  margin: 0 0 10px;
  color: #fff;
  font-size: clamp(1.45rem, 2.4vw, 2.15rem);
  line-height: 1.08;
}

.leak-route-box p {
  margin: 0;
  color: #b7c2c8;
  font-size: .88rem;
  line-height: 1.6;
}

.leak-first-checks {
  margin: 24px 0 4px;
  padding: 16px 18px;
  border-left: 2px solid var(--champagne);
  background: rgba(255,255,255,.045);
}

.leak-first-checks small {
  display: block;
  margin-bottom: 7px;
  color: var(--champagne);
  font-size: .66rem;
  letter-spacing: .08em;
}

.leak-first-checks p {
  margin: 0;
  color: #edf0f2;
  font-size: .84rem;
}

/* On leakage selections the calculator is a routing tool, not a fake repair quote. */
.calculator-price-panel .btn + .btn {
  margin-top: 10px;
}
