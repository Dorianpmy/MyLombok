import type { Destination, DestinationId } from "./destination-types";

export const destinations: readonly Destination[] = [
  {
    id: "lombok",
    slug: "lombok",
    name: "Lombok",
    country: "Indonésie",
    shortName: "Lombok",
    description: "Voyage, conciergerie et installation",
    coordinates: { latitude: -8.5833, longitude: 116.1167 },
    bounds: [[-9.18, 115.72], [-8.12, 116.86]],
    defaultZoom: 9,
    heroImage: "/lombok-merese.jpg",
    heroImageAlt: "Côte et reliefs tropicaux de Lombok",
    timezone: "Asia/Makassar",
    currency: "IDR",
    languageCodes: ["id", "en"],
    enabledModules: {
      explore: true,
      map: true,
      activities: true,
      trip: true,
      concierge: true,
      expatriation: true,
    },
    badges: ["Explorer", "Séjour", "Installation"],
  },
  {
    id: "kuala-lumpur",
    slug: "kuala-lumpur",
    name: "Kuala Lumpur",
    country: "Malaisie",
    shortName: "Kuala Lumpur",
    description: "City guide, activités et séjour",
    coordinates: { latitude: 3.139, longitude: 101.6869 },
    bounds: [[2.95, 101.55], [3.29, 101.83]],
    defaultZoom: 12,
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/c/c8/The_Twins_SE_Asia_2019_%2849171985716%29.jpg",
    heroImageAlt: "Kuala Lumpur et les tours Petronas au crépuscule",
    heroImageCredit: "James Kerwin · CC BY 2.0",
    heroImageSourceUrl: "https://commons.wikimedia.org/wiki/File:The_Twins_SE_Asia_2019_(49171985716).jpg",
    timezone: "Asia/Kuala_Lumpur",
    currency: "MYR",
    languageCodes: ["ms", "en", "zh"],
    enabledModules: {
      explore: true,
      map: true,
      activities: true,
      trip: true,
      concierge: false,
      expatriation: false,
    },
    badges: ["City guide", "Activités", "Carte"],
  },
] as const;

export const DEFAULT_DESTINATION_ID: DestinationId = "lombok";

export function isDestinationId(value: string): value is DestinationId {
  return destinations.some((destination) => destination.id === value);
}
