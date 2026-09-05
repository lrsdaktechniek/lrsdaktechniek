"use client";

import { useEffect, useMemo, useState } from "react";
import { site } from "@/lib/content";

type Book = {
  leakageSmall:number; leakageStandard:number; leakageLarge:number;
  concrete:number; ceramic:number; renovation:number; insulation:number;
  overlay:number; bitumenNew:number; warmRoof:number; chimney:number;
  scaffold:number; waste:number; travel:number; difficultPct:number; vat:number;
};

const DEFAULT:Book={
  leakageSmall:200,
  leakageStandard:275,
  leakageLarge:350,
  concrete:0,
  ceramic:0,
  renovation:0,
  insulation:0,
  overlay:0,
  bitumenNew:0,
  warmRoof:0,
  chimney:0,
  scaffold:0,
  waste:0,
  travel:0,
  difficultPct:10,
  vat:21
};

const LABELS:Record<keyof Book,string>={
  leakageSmall:"Lekkage klein",
  leakageStandard:"Lekkage standaard",
  leakageLarge:"Lekkage uitgebreid",
  concrete:"Beton/sneldek per m²",
  ceramic:"Keramisch per m²",
  renovation:"Pannendak renovatie per m²",
  insulation:"Dakisolatie per m²",
  overlay:"Bitumen overlagen per m²",
  bitumenNew:"Nieuw bitumen per m²",
  warmRoof:"Warm dak per m²",
  chimney:"Schoorsteen verwijderen vast",
  scaffold:"Steiger vast",
  waste:"Afval vast",
  travel:"Transport vast",
  difficultPct:"Moeilijk bereikbaar %",
  vat:"BTW %"
};

type Line={
  d:string;
  q:number;
  u:string;
  p:number;
};

const euro=(n:number)=>
  new Intl.NumberFormat("nl-NL",{
    style:"currency",
    currency:"EUR"
  }).format(n||0);

export function QuoteBuilder(){
  const [book,setBook]=useState<Book>(DEFAULT);
  const [showBook,setShowBook]=useState(false);

  const [type,setType]=useState("leakageStandard");
  const [area,setArea]=useState(50);
  const [difficult,setDifficult]=useState(false);

  const [scaffold,setScaffold]=useState(false);
  const [waste,setWaste]=useState(false);
  const [travel,setTravel]=useState(false);

  const [customer,setCustomer]=useState("");
  const [address,setAddress]=useState("");
  const [title,setTitle]=useState("Offerte dakwerk");

  const [lines,setLines]=useState<Line[]>([]);

  useEffect(()=>{
    const b=localStorage.getItem("lrs-compact-book");

    if(b){
      setBook({
        ...DEFAULT,
        ...JSON.parse(b)
      });
    }

    const d=localStorage.getItem("lrs-compact-draft");

    if(d){
      const x=JSON.parse(d);

      setCustomer(x.customer||"");
      setAddress(x.address||"");
      setTitle(x.title||"Offerte dakwerk");
      setLines(x.lines||[]);
    }
  },[]);

  useEffect(()=>{
    localStorage.setItem(
      "lrs-compact-draft",
      JSON.stringify({
        customer,
        address,
        title,
        lines
      })
    );
  },[customer,address,title,lines]);

  const vat=book.vat/100;

  const subtotal=useMemo(
    ()=>lines.reduce((s,l)=>s+l.q*l.p,0),
    [lines]
  );

  const total=subtotal*(1+vat);

  function saveBook(){
    localStorage.setItem(
      "lrs-compact-book",
      JSON.stringify(book)
    );

    setShowBook(false);
  }

  function autoFill(){
    const map:Record<string,[string,number,string]> = {
      leakageSmall:[
        "Daklekkage klein herstel",
        book.leakageSmall,
        "post"
      ],
      leakageStandard:[
        "Daklekkage standaard herstel",
        book.leakageStandard,
        "post"
      ],
      leakageLarge:[
        "Daklekkage uitgebreid herstel",
        book.leakageLarge,
        "post"
      ],
      concrete:[
        "Dakpannen beton/sneldek",
        book.concrete,
        "m²"
      ],
      ceramic:[
        "Dakpannen keramisch",
        book.ceramic,
        "m²"
      ],
      renovation:[
        "Complete pannendakrenovatie",
        book.renovation,
        "m²"
      ],
      insulation:[
        "Dakisolatie",
        book.insulation,
        "m²"
      ],
      overlay:[
        "Bitumen overlagen",
        book.overlay,
        "m²"
      ],
      bitumenNew:[
        "Nieuw bitumen dak",
        book.bitumenNew,
        "m²"
      ],
      warmRoof:[
        "Warm dak isolatie + bitumen",
        book.warmRoof,
        "m²"
      ],
      chimney:[
        "Schoorsteen verwijderen",
        book.chimney,
        "post"
      ]
    };

    const [d,p,u]=map[type];

    const per=u==="m²";

    const arr:Line[]=[
      {
        d,
        q:per?area:1,
        u,
        p
      }
    ];

    if(scaffold&&book.scaffold){
      arr.push({
        d:"Steiger / bereikbaarheid",
        q:1,
        u:"post",
        p:book.scaffold
      });
    }

    if(waste&&book.waste){
      arr.push({
        d:"Afvoer materiaal",
        q:1,
        u:"post",
        p:book.waste
      });
    }

    if(travel&&book.travel){
      arr.push({
        d:"Voorrij / transport",
        q:1,
        u:"post",
        p:book.travel
      });
    }

    if(difficult){
      const b=arr.reduce(
        (s,l)=>s+l.q*l.p,
        0
      );

      arr.push({
        d:`Toeslag moeilijke bereikbaarheid (${book.difficultPct}%)`,
        q:1,
        u:"post",
        p:b*book.difficultPct/100
      });
    }

    setLines(arr);
    setTitle(d);
  }

  return (
    <div className="quote-app">

      <section className="quote-editor no-print">

        <div className="quote-editor-head">
          <div>
            <p className="eyebrow">
              LRS OFFERTE ENGINE
            </p>

            <h1>
              Offerte maken
            </h1>
          </div>

          <div className="quote-editor-actions">
            <button
              className="mini-button"
              onClick={()=>setShowBook(v=>!v)}
            >
              Prijsboek
            </button>

            <button
              className="button"
              onClick={()=>window.print()}
            >
              PDF / print
            </button>
          </div>
        </div>

        {showBook&&(
          <div className="pricebook-panel">

            <h2>
              Prijsboek
            </h2>

            <div className="pricebook-grid">

              {(Object.keys(book) as (keyof Book)[]).map(k=>(
                <label key={k}>

                  <span>
                    {LABELS[k]}
                  </span>

                  <input
                    type="number"
                    value={book[k]}
                    onChange={e=>
                      setBook({
                        ...book,
                        [k]:Number(e.target.value)
                      })
                    }
                  />

                </label>
              ))}

            </div>

            <button
              className="button"
              onClick={saveBook}
            >
              Opslaan
            </button>

          </div>
        )}

        <div className="quote-editor-section quote-auto-section">

          <h2>
            Automatisch vullen
          </h2>

          <div className="auto-quote-grid">

            <label>

              <span>
                Werk
              </span>

              <select
                value={type}
                onChange={e=>setType(e.target.value)}
              >

                {[
                  "leakageSmall",
                  "leakageStandard",
                  "leakageLarge",
                  "concrete",
                  "ceramic",
                  "renovation",
                  "insulation",
                  "overlay",
                  "bitumenNew",
                  "warmRoof",
                  "chimney"
                ].map(k=>(
                  <option
                    key={k}
                    value={k}
                  >
                    {LABELS[k as keyof Book]}
                  </option>
                ))}

              </select>

            </label>

            <label>

              <span>
                m²
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

          <div className="auto-options">

            <label>
              <input
                type="checkbox"
                checked={scaffold}
                onChange={e=>
                  setScaffold(
                    e.target.checked
                  )
                }
              />
              Steiger
            </label>

            <label>
              <input
                type="checkbox"
                checked={waste}
                onChange={e=>
                  setWaste(
                    e.target.checked
                  )
                }
              />
              Afval
            </label>

            <label>
              <input
                type="checkbox"
                checked={travel}
                onChange={e=>
                  setTravel(
                    e.target.checked
                  )
                }
              />
              Transport
            </label>

            <label>
              <input
                type="checkbox"
                checked={difficult}
                onChange={e=>
                  setDifficult(
                    e.target.checked
                  )
                }
              />
              Moeilijk bereikbaar
            </label>

          </div>

          <button
            className="button"
            onClick={autoFill}
          >
            Vul offerte automatisch
          </button>

        </div>

        <div className="quote-editor-section">

          <div className="quote-form-grid">

            <label>

              <span>
                Klantnaam
              </span>

              <input
                value={customer}
                onChange={e=>
                  setCustomer(
                    e.target.value
                  )
                }
              />

            </label>

            <label>

              <span>
                Adres
              </span>

              <input
                value={address}
                onChange={e=>
                  setAddress(
                    e.target.value
                  )
                }
              />

            </label>

            <label className="quote-span-2">

              <span>
                Titel
              </span>

              <input
                value={title}
                onChange={e=>
                  setTitle(
                    e.target.value
                  )
                }
              />

            </label>

          </div>

        </div>

        <div className="quote-editor-section">

          <h2>
            Werkregels
          </h2>

          {lines.map((l,i)=>(
            <div
              className="quote-line-editor"
              key={i}
            >

              <div className="quote-line-number">
                {String(i+1).padStart(2,"0")}
              </div>

              <label className="quote-desc">

                <span>
                  Omschrijving
                </span>

                <textarea
                  value={l.d}
                  onChange={e=>
                    setLines(
                      lines.map(
                        (x,j)=>
                          j===i
                            ?{
                              ...x,
                              d:e.target.value
                            }
                            :x
                      )
                    )
                  }
                />

              </label>

              <label>

                <span>
                  Aantal
                </span>

                <input
                  type="number"
                  value={l.q}
                  onChange={e=>
                    setLines(
                      lines.map(
                        (x,j)=>
                          j===i
                            ?{
                              ...x,
                              q:Number(
                                e.target.value
                              )
                            }
                            :x
                      )
                    )
                  }
                />

              </label>

              <label>

                <span>
                  Eenheid
                </span>

                <input
                  value={l.u}
                  onChange={e=>
                    setLines(
                      lines.map(
                        (x,j)=>
                          j===i
                            ?{
                              ...x,
                              u:e.target.value
                            }
                            :x
                      )
                    )
                  }
                />

              </label>

              <label>

                <span>
                  Prijs
                </span>

                <input
                  type="number"
                  value={l.p}
                  onChange={e=>
                    setLines(
                      lines.map(
                        (x,j)=>
                          j===i
                            ?{
                              ...x,
                              p:Number(
                                e.target.value
                              )
                            }
                            :x
                      )
                    )
                  }
                />

              </label>

            </div>
          ))}

        </div>

      </section>

      <section className="quote-preview-wrap">

        <article className="quote-document">

          <header className="quote-doc-header">

            <div className="quote-logo">

              <span>
                LRS
              </span>

              <div>
                <strong>
                  DAKTECHNIEK
                </strong>

                <small>
                  Breda & omgeving
                </small>
              </div>

            </div>

            <div className="quote-doc-meta">

              <p>
                <strong>
                  Datum
                </strong>

                <span>
                  {new Date().toLocaleDateString("nl-NL")}
                </span>
              </p>

            </div>

          </header>

          <div className="quote-doc-rule"/>

          <section className="quote-address-grid">

            <div>

              <small>
                VAN
              </small>

              <strong>
                {site.name}
              </strong>

              <span>
                {site.phoneDisplay}
              </span>

              <span>
                {site.email}
              </span>

              <span>
                KVK {site.kvk}
              </span>

            </div>

            <div>

              <small>
                VOOR
              </small>

              <strong>
                {customer||"Klantnaam"}
              </strong>

              <span>
                {address||"Adres"}
              </span>

            </div>

          </section>

          <section className="quote-title-block">

            <p>
              OFFERTE
            </p>

            <h1>
              {title}
            </h1>

          </section>

          <table className="quote-table">

            <thead>
              <tr>
                <th>
                  Omschrijving
                </th>

                <th className="num">
                  Aantal
                </th>

                <th>
                  Eenheid
                </th>

                <th className="num">
                  Prijs excl.
                </th>

                <th className="num">
                  Totaal excl.
                </th>
              </tr>
            </thead>

            <tbody>

              {lines.map((l,i)=>(
                <tr key={i}>

                  <td>
                    {l.d}
                  </td>

                  <td className="num">
                    {l.q}
                  </td>

                  <td>
                    {l.u}
                  </td>

                  <td className="num">
                    {euro(l.p)}
                  </td>

                  <td className="num">
                    {euro(l.q*l.p)}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

          <section className="quote-total-grid">

            <div/>

            <div className="quote-totals">

              <p>
                <span>
                  Subtotaal excl.
                </span>

                <strong>
                  {euro(subtotal)}
                </strong>
              </p>

              <p>
                <span>
                  BTW {book.vat}%
                </span>

                <strong>
                  {euro(subtotal*vat)}
                </strong>
              </p>

              <p className="grand">
                <span>
                  Totaal incl.
                </span>

                <strong>
                  {euro(total)}
                </strong>
              </p>

            </div>

          </section>

          <footer className="quote-doc-footer">

            <strong>
              LRS Daktechniek
            </strong>

            <span>
              {site.phoneDisplay}
            </span>

            <span>
              {site.email}
            </span>

          </footer>

        </article>

      </section>

    </div>
  );
}
