import type { MetadataRoute } from "next";
import { articles, locations, projects, services, specialtyPages, site } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/diensten`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/dakcheck`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/prijsindicatie`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/reparatie-indicatie`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/contact`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/werkgebied`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${site.url}/blog-s`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/over-ons`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/privacyverklaring`, changeFrequency: "yearly", priority: 0.3 },
  ];

  if (projects.length > 0) {
    staticRoutes.push({
      url: `${site.url}/projecten`,
      changeFrequency: "monthly",
      priority: 0.85,
    });
  }

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${site.url}/${service.slug}`,
    changeFrequency: "monthly",
    priority: service.slug === "dak-lekkage" ? 0.95 : 0.9,
  }));

  const locationRoutes: MetadataRoute.Sitemap = locations.map(([slug, _name, tier]) => ({
    url: `${site.url}/${slug}`,
    changeFrequency: "monthly",
    priority: slug === "dakdekker-breda" ? 0.95 : tier === "A" ? 0.9 : tier === "B" ? 0.8 : 0.7,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${site.url}/blog-s/${article.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const specialtyRoutes: MetadataRoute.Sitemap = specialtyPages.map((page) => ({
    url: `${site.url}/${page.slug}`,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${site.url}/projecten/${project.slug}`,
    changeFrequency: "yearly",
    priority: 0.75,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...locationRoutes,
    ...specialtyRoutes,
    ...articleRoutes,
    ...projectRoutes,
  ];
}
