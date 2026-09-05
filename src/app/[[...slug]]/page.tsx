import type { Metadata } from "next";
import { PublicSite } from "@/components/PublicSite";
import { articleBySlug, locationBySlug, serviceBySlug, site } from "@/lib/content";

type Props = { params: Promise<{ slug?: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params;
  const path = slug.join("/");
  let title = "LRS Daktechniek | Dakdekker Breda & omgeving";
  let description = "LRS Daktechniek voor pannendaken, bitumen, dakisolatie, daklekkage en schoorsteen verwijderen in Breda en omgeving.";

  const service = serviceBySlug(path);
  const location = locationBySlug(path);
  const article = slug[0] === "blog-s" && slug[1] ? articleBySlug(slug[1]) : undefined;

  if (service) {
    title = `${service.title} | LRS Daktechniek`;
    description = service.intro;
  } else if (location) {
    title = `Dakdekker ${location.name} | LRS Daktechniek`;
    description = `Dakwerk in ${location.name}: pannendaken, bitumen, isolatie, daklekkage en schoorsteenwerk.`;
  } else if (article) {
    title = `${article.title} | LRS Daktechniek`;
    description = article.description;
  } else if (path === "diensten") title = "Dakdekker diensten Breda | LRS Daktechniek";
  else if (path === "dakcheck") title = "Dakcheck | LRS Daktechniek";
  else if (path === "prijsindicatie") title = "Prijsindicatie dakwerk Breda | LRS Daktechniek";
  else if (path === "contact") title = "Contact | LRS Daktechniek";
  else if (path === "werkgebied") title = "Werkgebied | LRS Daktechniek";
  else if (path === "blog-s") title = "Dak kennisbank | LRS Daktechniek";
  else if (path === "over-ons") title = "Over LRS Daktechniek";

  const canonical = path ? `${site.url}/${path}` : site.url;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, siteName: site.name, locale: "nl_NL", type: article ? "article" : "website" }
  };
}

export default async function Page({ params }: Props) {
  const { slug = [] } = await params;
  return <PublicSite segments={slug} />;
}
