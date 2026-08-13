import { semanticPhotoAlt } from "../../data/place-media";
import { places as legacyLombokPlaces, type Place } from "../../data/places";
import type {
  TravelPlace,
  TravelPlaceCategory,
  TravelPlaceTag,
} from "../../data/destination-types";
import { kualaLumpurPlaces } from "../../data/kuala-lumpur-places";

const categoryMap: Record<Place["category"], TravelPlaceCategory> = {
  activite: "attraction",
  restaurant: "food",
  plage: "attraction",
  service: "practical",
  nature: "park",
  excursion: "attraction",
  culture: "culture",
};

const legacyTagMap: Array<[RegExp, TravelPlaceTag]> = [
  [/famille/i, "family-friendly"],
  [/intérieur|indoor/i, "indoor"],
  [/extérieur|plein air|outdoor/i, "outdoor"],
  [/soir|sunset|dîner/i, "evening"],
  [/gratuit/i, "free"],
];

export function legacyLombokPlaceToTravelPlace(place: Place): TravelPlace {
  const sourceUrls = Array.from(new Set([
    ...(place.sources?.map((source) => source.url) ?? []),
    place.maps_url,
    place.menu?.source_url,
  ].filter((url): url is string => Boolean(url))));

  const tags = legacyTagMap
    .filter(([pattern]) => place.tags.some((tag) => pattern.test(tag)))
    .map(([, tag]) => tag);

  return {
    id: `lombok:${place.id}`,
    legacyId: place.id,
    slug: place.slug,
    destinationId: "lombok",
    name: place.name,
    category: place.subcategory === "mosquée" ? "mosque" : categoryMap[place.category],
    shortDescription: place.specialty || place.description,
    description: place.description,
    neighborhood: place.zone || place.city,
    coordinates: { latitude: place.lat, longitude: place.lng },
    images: place.photos.map((src) => ({ src, alt: semanticPhotoAlt(place) })),
    tags: Array.from(new Set(tags)),
    priceLevel: place.price_level === 1 ? "low" : place.price_level === 2 ? "medium" : place.price_level === 3 ? "high" : undefined,
    officialUrl: place.sources?.find((source) => source.kind === "officiel" || source.kind === "établissement")?.url,
    navigationUrl: place.maps_url,
    sourceUrls,
    lastVerifiedAt: place.created_at.slice(0, 10),
    verificationStatus: sourceUrls.length > 1 ? "verified" : "to-check",
    halalStatus: place.halal === "certifié" ? "verified" : place.category === "restaurant" ? "to-check" : undefined,
  };
}

const lombokPlaces = legacyLombokPlaces.map(legacyLombokPlaceToTravelPlace);
const allPlaces = [...lombokPlaces, ...kualaLumpurPlaces];

export const placeRepository = {
  list(): readonly TravelPlace[] {
    return allPlaces;
  },

  listByDestination(destinationId: string): TravelPlace[] {
    return allPlaces.filter((place) => place.destinationId === destinationId);
  },

  getById(id: string): TravelPlace | null {
    return allPlaces.find((place) => place.id === id) ?? null;
  },

  getBySlug(slug: string): TravelPlace | null {
    return allPlaces.find((place) => place.slug === slug) ?? null;
  },

  search(query: string, destinationId?: string): TravelPlace[] {
    const normalized = query.trim().toLocaleLowerCase("fr");
    const source = destinationId ? this.listByDestination(destinationId) : allPlaces;
    if (!normalized) return [...source];
    return source.filter((place) => [
      place.name,
      place.category,
      place.neighborhood,
      place.shortDescription,
      ...place.tags,
    ].filter(Boolean).join(" ").toLocaleLowerCase("fr").includes(normalized));
  },
};
