import type { Metadata } from "next";
import { PublicSite } from "@/components/PublicSite";
import {
  articleBySlug,
  locationBySlug,
  locations,
  projectBySlug,
  projects,
  serviceBySlug,
  services,
  specialtyBySlug,
  specialtyPages,
  site,
} from "@/lib/content";

type Props = { params: Promise<{ slug?: string[] }> };

const businessId = `${site.url}/#lrs-daktechniek`;

function cleanJson(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function titleForPath(path: string, slug: string[]) {
  const service = serviceBySlug(path);
  const specialty = specialtyBySlug(path);
  const location = locationBySlug(path);
  const article = slug[0] === "blog-s" && slug[1] ? articleBySlug(slug[1]) : undefined;
  const project = slug[0] === "projecten" && slug[1] ? projectBySlug(slug[1]) : undefined;

  if (service?.slug === "dak-lekkage") return "Daklekkage Breda | LRS Daktechniek";
  if (service) return `${service.title} Breda | LRS Daktechniek`;
  if (specialty) return `${specialty.title} | LRS Daktechniek`;
  if (location) return `Dakdekker ${location.name} | LRS Daktechniek`;
  if (article) return `${article.title} | LRS Daktechniek`;
  if (project) return `${project.title} | LRS Daktechniek`;

  if (!path) return "LRS Daktechniek | Dakdekker Breda & omgeving";
  if (path === "diensten") return "Dakdekker diensten Breda | LRS Daktechniek";
  if (path === "dakcheck") return "Dakcheck dakwerk | LRS Daktechniek Breda";
  if (path === "prijsindicatie") return "Prijsindicatie dakwerk Breda | LRS Daktechniek";
  if (path === "reparatie-indicatie") return "Dakreparatie prijsindicatie Breda | LRS Daktechniek";
  if (path === "contact") return "Contact dakdekker Breda | LRS Daktechniek";
  if (path === "werkgebied") return "Werkgebied dakdekker Breda | LRS Daktechniek";
  if (path === "blog-s") return "Dak kennisbank | LRS Daktechniek";
  if (path === "over-ons") return "Over LRS Daktechniek | Dakdekker Breda";
  if (path === "projecten") return "Dakprojecten Breda | LRS Daktechniek";
  if (path === "beoordelen") return "LRS Daktechniek beoordelen";
  if (path === "privacyverklaring") return "Privacyverklaring | LRS Daktechniek";
  return "LRS Daktechniek | Dakdekker Breda & omgeving";
}

function descriptionForPath(path: string, slug: string[]) {
  const service = serviceBySlug(path);
  const specialty = specialtyBySlug(path);
  const location = locationBySlug(path);
  const article = slug[0] === "blog-s" && slug[1] ? articleBySlug(slug[1]) : undefined;
  const project = slug[0] === "projecten" && slug[1] ? projectBySlug(slug[1]) : undefined;

  if (service?.slug === "dak-lekkage") {
    return "Daklekkage in Breda of omgeving? Slimme lekkagecheck, €75 excl. btw voorrijkosten en vooraf duidelijke technische informatie voordat LRS op locatie komt.";
  }
  if (service) {
    return `${service.intro} LRS Daktechniek werkt in Breda en omgeving met rechtstreeks contact, duidelijke uitleg en een gerichte technische aanpak.`;
  }
  if (specialty) return `${specialty.intro} Praktische technische uitleg van LRS Daktechniek voor Breda en omgeving.`;
  if (location) {
    return `Dakdekker ${location.name} voor pannendaken, bitumen, dakisolatie, daklekkage en schoorsteen verwijderen. Rechtstreeks contact met LRS Daktechniek.`;
  }
  if (article) return article.description;
  if (project) return project.summary;

  if (path === "dak-lekkage") return "Daklekkage in Breda of omgeving? Slimme lekkagecheck, €75 excl. btw voorrijkosten en vooraf duidelijke technische informatie voor LRS.";
  if (path === "prijsindicatie") return "Bereken online een prijsindicatie voor dakwerk bij LRS Daktechniek in Breda en omgeving.";
  if (path === "reparatie-indicatie") return "Bereken vooraf een ruime online indicatie voor kleine dakreparaties in Breda en omgeving, inclusief btw en standaard bezoek/startkosten.";
  if (path === "werkgebied") return "Bekijk het werkgebied van LRS Daktechniek rond Breda op de kaart en ga direct naar de dakdekker-pagina van uw plaats.";
  if (path === "projecten") return "Projectarchief van LRS Daktechniek. Alleen echte dakprojecten worden gepubliceerd met controleerbare werkzaamheden en projectmateriaal.";
  if (path === "beoordelen") return "Deel uw ervaring met LRS Daktechniek via Google Maps.";
  return "LRS Daktechniek voor pannendaken, bitumen, dakisolatie, daklekkage en schoorsteen verwijderen in Breda en omgeving.";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params;
  const path = slug.join("/");
  const title = titleForPath(path, slug);
  const description = descriptionForPath(path, slug);
  const canonical = path ? `${site.url}/${path}` : site.url;

  const noIndex =
    path === "beoordelen" ||
    (path === "projecten" && projects.length === 0);

  return {
    title,
    description,
    alternates: { canonical },
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: site.name,
      locale: "nl_NL",
      type: slug[0] === "blog-s" ? "article" : "website",
    },
  };
}

function breadcrumbFor(path: string, slug: string[]) {
  if (!path) return null;

  const items: { name: string; item: string }[] = [
    { name: "Home", item: site.url },
  ];

  const service = serviceBySlug(path);
  const specialty = specialtyBySlug(path);
  const location = locationBySlug(path);
  const article = slug[0] === "blog-s" && slug[1] ? articleBySlug(slug[1]) : undefined;
  const project = slug[0] === "projecten" && slug[1] ? projectBySlug(slug[1]) : undefined;

  if (service) {
    items.push({ name: "Diensten", item: `${site.url}/diensten` });
    items.push({ name: service.name, item: `${site.url}/${service.slug}` });
  } else if (specialty) {
    const parent = serviceBySlug(specialty.parentService);
    items.push({ name: "Diensten", item: `${site.url}/diensten` });
    if (parent) items.push({ name: parent.name, item: `${site.url}/${parent.slug}` });
    items.push({ name: specialty.title, item: `${site.url}/${specialty.slug}` });
  } else if (location) {
    items.push({ name: "Werkgebied", item: `${site.url}/werkgebied` });
    items.push({ name: `Dakdekker ${location.name}`, item: `${site.url}/${location.slug}` });
  } else if (article) {
    items.push({ name: "Kennisbank", item: `${site.url}/blog-s` });
    items.push({ name: article.title, item: `${site.url}/blog-s/${article.slug}` });
  } else if (project) {
    items.push({ name: "Projecten", item: `${site.url}/projecten` });
    items.push({ name: project.title, item: `${site.url}/projecten/${project.slug}` });
  } else {
    const labels: Record<string, string> = {
      diensten: "Diensten",
      dakcheck: "Dakcheck",
      prijsindicatie: "Dak prijsindicatie",
      "reparatie-indicatie": "Reparatie indicatie",
      contact: "Contact",
      werkgebied: "Werkgebied",
      "blog-s": "Kennisbank",
      "over-ons": "Over LRS",
      projecten: "Projecten",
      beoordelen: "Beoordelen",
      privacyverklaring: "Privacyverklaring",
    };
    items.push({ name: labels[path] ?? path, item: `${site.url}/${path}` });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

function structuredDataFor(path: string, slug: string[]) {
  const service = serviceBySlug(path);
  const specialty = specialtyBySlug(path);
  const location = locationBySlug(path);
  const article = slug[0] === "blog-s" && slug[1] ? articleBySlug(slug[1]) : undefined;
  const project = slug[0] === "projecten" && slug[1] ? projectBySlug(slug[1]) : undefined;
  const canonical = path ? `${site.url}/${path}` : site.url;

  const business = {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    "@id": businessId,
    name: site.name,
    url: site.url,
    telephone: site.phoneHref,
    email: site.email,
    openingHours: "Mo-Fr 08:00-16:00",
    areaServed: locations.map(([, name]) => ({
      "@type": "Place",
      name,
    })),
    identifier: {
      "@type": "PropertyValue",
      propertyID: "KVK",
      value: site.kvk,
    },
    knowsAbout: [
      "Pannendaken",
      "Bitumen daken",
      "Dakisolatie",
      "Daklekkage",
      "Schoorsteen verwijderen",
      ...specialtyPages.map(page => page.title),
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Dakwerkzaamheden",
      itemListElement: services.map((item) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: item.name,
          url: `${site.url}/${item.slug}`,
        },
      })),
    },
  };

  const graph: unknown[] = [business];

  const breadcrumb = breadcrumbFor(path, slug);
  if (breadcrumb) graph.push(breadcrumb);

  if (!path) {
    graph.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      publisher: { "@id": businessId },
      inLanguage: "nl-NL",
    });
  }

  if (service) {
    graph.push({
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${canonical}#service`,
      name: service.title,
      description: service.intro,
      url: canonical,
      provider: { "@id": businessId },
      areaServed: { "@type": "Place", name: "Breda en omgeving" },
      serviceType: service.name,
    });
  }

  if (specialty) {
    graph.push({
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${canonical}#service`,
      name: specialty.title,
      description: specialty.intro,
      url: canonical,
      provider: { "@id": businessId },
      areaServed: { "@type": "Place", name: "Breda en omgeving" },
      serviceType: specialty.title,
      category: serviceBySlug(specialty.parentService)?.name ?? "Dakwerk",
    });
  }

  if (location) {
    graph.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: `Dakdekker ${location.name}`,
      description: `Dakwerk in ${location.name} door LRS Daktechniek.`,
      about: { "@id": businessId },
      inLanguage: "nl-NL",
    });
  }

  if (article) {
    graph.push({
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${canonical}#article`,
      headline: article.title,
      description: article.description,
      url: canonical,
      author: { "@id": businessId },
      publisher: { "@id": businessId },
      inLanguage: "nl-NL",
    });
  }

  if (project) {
    graph.push({
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${canonical}#project`,
      headline: project.title,
      description: project.summary,
      url: canonical,
      author: { "@id": businessId },
      publisher: { "@id": businessId },
      about: {
        "@type": "Service",
        name: services.find(item => item.slug === project.serviceSlug)?.name ?? "Dakwerk",
      },
      contentLocation: { "@type": "Place", name: project.place },
      inLanguage: "nl-NL",
    });
  }

  return graph;
}

export default async function Page({ params }: Props) {
  const { slug = [] } = await params;
  const path = slug.join("/");
  const structuredData = structuredDataFor(path, slug);

  return (
    <>
      {structuredData.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: cleanJson(item) }}
        />
      ))}
      <PublicSite segments={slug} />
    </>
  );
}
