import type { MetadataRoute } from "next";
import { conciergeServices } from "./data/concierge-services";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://my-lombok.vercel.app";
  const paths = [
    "",
    "/services",
    ...conciergeServices.map(({ slug }) => `/services/${slug}`),
    "/explorer",
    "/destinations",
    "/destination/lombok",
    "/destination/lombok/map",
    "/destination/lombok/activities",
    "/destination/kuala-lumpur",
    "/destination/kuala-lumpur/map",
    "/destination/kuala-lumpur/activities",
    "/destination/kuala-lumpur/transport",
    "/a-propos",
    "/conciergerie",
    "/confidentialite",
    "/mentions-legales",
  ];
  return paths.map((path) => ({ url: `${base}${path}`, lastModified: new Date("2026-08-04"), changeFrequency: path === "/explorer" ? "weekly" as const : "monthly" as const, priority: path === "" ? 1 : path === "/conciergerie" || path === "/explorer" ? 0.9 : 0.6 }));
}
