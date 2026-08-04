import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://my-lombok.vercel.app";
  return ["", "/services", "/explorer", "/a-propos", "/conciergerie", "/profil", "/installer", "/confidentialite", "/mentions-legales"].map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: path === "/explorer" ? "weekly" as const : "monthly" as const, priority: path === "" ? 1 : path === "/conciergerie" || path === "/explorer" ? 0.9 : 0.6 }));
}
