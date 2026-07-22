import seedPlaces from "./seed-lombok";

export type PlaceCategory = "restaurant" | "plage" | "service" | "nature" | "excursion" | "culture";
export type HalalStatus = "certifié" | "sans porc ni alcool" | "non" | "inconnu";
export type Ambiance = "romantique" | "calme" | "familial" | "animé" | "vue";
export type NearbyMosque = { nom: string; distance_m: number; mawaqit_slug: string };

export interface Place {
  id: string;
  region: string;
  island: string;
  city: string;
  category: PlaceCategory;
  subcategory: string;
  name: string;
  slug: string;
  description: string;
  specialty: string | null;
  tags: string[];
  price_level: 1 | 2 | 3 | null;
  price_range: string | null;
  lat: number;
  lng: number;
  opening_hours: string | null;
  whatsapp: string | null;
  maps_url: string;
  photos: string[];
  tested_by_us: boolean;
  rating: number | null;
  best_time: string | null;
  level: string | null;
  vigilance: string | null;
  zone: string;
  halal: HalalStatus;
  alcool_servi: boolean | null;
  ambiance: Ambiance[];
  mosquee_proche: NearbyMosque | null;
  prive: boolean;
  created_at: string;
}

const categoryPhotos: Record<PlaceCategory, string> = {
  restaurant: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=78",
  plage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=78",
  service: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=900&q=78",
  nature: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=78",
  excursion: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=78",
  culture: "https://images.unsplash.com/photo-1533669955142-6a73332af4db?auto=format&fit=crop&w=900&q=78",
};

const restaurantPhotoIds = [
  "photo-1504674900247-0877df9cc836", "photo-1565299624946-b28f40a0ae38", "photo-1547592180-85f173990554", "photo-1512621776951-a57141f2eefd",
  "photo-1482049016688-2d3e1b311543", "photo-1473093295043-cdd812d0e601", "photo-1563379926898-05f4575a45d8", "photo-1546069901-ba9599a7e63c",
  "photo-1551218808-94e220e084d2", "photo-1565958011703-44f9829ba187", "photo-1498837167922-ddd27525d352", "photo-1543353071-873f17a7a088",
  "photo-1559339352-11d035aa65de", "photo-1528712306091-ed0763094c98", "photo-1476224203421-9ac39bcb3327", "photo-1529042410759-befb1204b468",
  "photo-1490645935967-10de6ba17061", "photo-1540189549336-e6e99c3679fe", "photo-1551183053-bf91a1d81141", "photo-1569058242253-92a9c755a0ec",
  "photo-1495474472287-4d71bcdd2085", "photo-1562565652-a0d8f0c59eb4", "photo-1533777857889-4be7c70b33f7", "photo-1555396273-367ea4eb4db5",
];

const travelPhotoIds = [
  "photo-1507525428034-b723cf961d3e", "photo-1518509562904-e7ef99cdcc86", "photo-1469474968028-56623f02e42e", "photo-1441974231531-c6227db76b6e",
  "photo-1470770841072-f978cf4d019e", "photo-1500530855697-b586d89ba3ee", "photo-1464822759023-fed622ff2c3b", "photo-1501785888041-af3ef285b470",
  "photo-1521292270410-a8c4d716d518", "photo-1472396961693-142e6e269027", "photo-1510414842594-a61c69b5ae57", "photo-1544551763-46a013bb70d5",
  "photo-1526772662000-3f88f10405ff", "photo-1493558103817-58b2924bce98", "photo-1539635278303-d4002c07eae3", "photo-1527631746610-bca00a040d60",
  "photo-1516483638261-f4dbaf036963", "photo-1500534314209-a25ddb2bd429", "photo-1511497584788-876760111969", "photo-1461696114087-397271a7aedc",
  "photo-1470214304380-aadaedcfff1b", "photo-1465146344425-f00d5f5c8f07", "photo-1500534623283-312aade485b7", "photo-1497436072909-f5e4be1713c0",
  "photo-1473445361085-b9a07f55608b", "photo-1497250681960-ef046c08a56e", "photo-1533669955142-6a73332af4db", "photo-1528181304800-259b08848526",
  "photo-1528127269322-539801943592", "photo-1540202404-a2f29016b523", "photo-1540206395-68808572332f", "photo-1530789253388-582c481c54b0",
];

function editorialPhoto(category: PlaceCategory, index: number) {
  const collection = category === "restaurant" ? restaurantPhotoIds : travelPhotoIds;
  return `https://images.unsplash.com/${collection[index % collection.length]}?auto=format&fit=crop&w=900&q=78`;
}

const priceDefaults: Record<number, string> = {
  1: "20–60k Rp · 1–4 €",
  2: "60–150k Rp · 4–9 €",
  3: "150–350k Rp · 9–21 €",
};

export const importedPlaces: Place[] = seedPlaces.map((item, index) => {
  const category = item.category as PlaceCategory;
  return {
    id: item.id,
    region: item.region,
    island: item.island,
    city: item.city,
    category,
    subcategory: item.subcategory,
    name: item.name,
    slug: item.slug,
    description: item.specialty || `Une adresse utile à ${item.city}, sélectionnée pour préparer ton séjour à Lombok.`,
    specialty: item.specialty,
    tags: item.tags,
    price_level: item.price_level,
    price_range: item.price_range || (item.price_level ? priceDefaults[item.price_level] : null),
    lat: item.lat,
    lng: item.lng,
    opening_hours: item.opening_hours,
    whatsapp: item.whatsapp,
    maps_url: `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}${item.google_place_id ? `&query_place_id=${item.google_place_id}` : ""}`,
    photos: item.photos.length ? item.photos : [editorialPhoto(category, index)],
    tested_by_us: item.tested_by_us,
    rating: item.rating || item.google_rating,
    best_time: item.best_time,
    level: item.level,
    vigilance: item.vigilance,
    zone: item.city,
    halal: item.tags.some((tag) => tag.toLowerCase().includes("halal")) ? "sans porc ni alcool" : "inconnu",
    alcool_servi: item.tags.some((tag) => /cocktail|bar|vin/i.test(tag)) ? true : null,
    ambiance: [item.tags.some((tag) => /calme|travailler/i.test(tag)) ? "calme" : "animé"],
    mosquee_proche: { nom: "Masjid Nurul Bilad Mandalika", distance_m: Math.round(Math.hypot(item.lat + 8.8937, item.lng - 116.2965) * 111000), mawaqit_slug: "nurul-bilad-mandalika" },
    prive: item.tags.some((tag) => /cabana|privé|date/i.test(tag)),
    created_at: "2026-07-22T00:00:00.000Z",
  };
});

const extraPlacesBase: Omit<Place, "zone" | "halal" | "alcool_servi" | "ambiance" | "mosquee_proche" | "prive">[] = [
  {
    id: "rinjani-trek", region: "north-lombok", island: "lombok", city: "Senaru", category: "nature", subcategory: "trek",
    name: "Trek du Mont Rinjani", slug: "trek-rinjani", description: "Ascension guidée du volcan et nuit face au lac Segara Anak. Réservation avec guide agréé indispensable.",
    specialty: "Trek 2 jours / 1 nuit", tags: ["trek", "volcan", "sunrise", "guide"], price_level: 3, price_range: "2,5–4,5 M Rp · 145–260 €", lat: -8.4112, lng: 116.4573,
    opening_hours: "Départs 05:00–07:00", whatsapp: "+62 812-3900-1122", maps_url: "https://maps.google.com/?q=-8.4112,116.4573", photos: [categoryPhotos.nature], tested_by_us: true, rating: 4.9, best_time: "avril à novembre", level: "difficile", vigilance: "Trek exigeant : vérifier l’état des sentiers et la météo avant le départ.", created_at: "2026-07-22T00:00:00.000Z"
  },
  {
    id: "gili-air-day", region: "north-lombok", island: "gili-air", city: "Gili Air", category: "excursion", subcategory: "snorkeling",
    name: "Journée snorkeling aux Gili", slug: "snorkeling-gili", description: "Bateau en petit groupe vers Gili Air, Meno et Trawangan, avec spots de tortues et statues sous-marines.",
    specialty: "3 îles & tortues", tags: ["bateau", "snorkeling", "tortues", "famille"], price_level: 2, price_range: "350–650k Rp · 21–39 €", lat: -8.349, lng: 116.082,
    opening_hours: "Départs 08:30 et 10:00", whatsapp: "+62 878-6401-2020", maps_url: "https://maps.google.com/?q=-8.349,116.082", photos: [categoryPhotos.excursion], tested_by_us: true, rating: 4.8, best_time: "matin, mer calme", level: "facile", vigilance: "Privilégier les opérateurs qui ne nourrissent pas les tortues.", created_at: "2026-07-22T00:00:00.000Z"
  },
  {
    id: "sade-village", region: "central-lombok", island: "lombok", city: "Sengkol", category: "culture", subcategory: "village sasak",
    name: "Village traditionnel de Sade", slug: "village-sade", description: "Village Sasak vivant, maisons en terre, tissage traditionnel et découverte des usages locaux avec un guide du village.",
    specialty: "Culture et tissage Sasak", tags: ["sasak", "artisanat", "famille", "histoire"], price_level: 1, price_range: "Donation conseillée 50–100k Rp · 3–6 €", lat: -8.8396, lng: 116.2918,
    opening_hours: "08:00–18:00", whatsapp: null, maps_url: "https://maps.google.com/?q=-8.8396,116.2918", photos: [categoryPhotos.culture], tested_by_us: true, rating: 4.5, best_time: "09:00 avant les groupes", level: null, vigilance: "Les achats de textile sont facultatifs : convenir du prix avant toute démonstration.", created_at: "2026-07-22T00:00:00.000Z"
  },
  {
    id: "selong-belanak", region: "south-lombok", island: "lombok", city: "Selong Belanak", category: "plage", subcategory: "baignade & surf débutant",
    name: "Selong Belanak Beach", slug: "selong-belanak", description: "Grande baie de sable clair, idéale pour apprendre le surf et se baigner lorsque la mer est calme.",
    specialty: "Surf débutant", tags: ["plage", "surf", "baignade", "sunset", "warung"], price_level: 1, price_range: "Parking 10k Rp · <1 €", lat: -8.8739, lng: 116.1624,
    opening_hours: "06:00–19:00", whatsapp: null, maps_url: "https://maps.google.com/?q=-8.8739,116.1624", photos: [categoryPhotos.plage], tested_by_us: true, rating: 4.7, best_time: "matin ou coucher du soleil", level: "débutant · mi-marée", vigilance: "Rester dans la zone surveillée ; vagues plus fortes à marée haute.", created_at: "2026-07-22T00:00:00.000Z"
  },
  {
    id: "lombok-airport-driver", region: "central-lombok", island: "lombok", city: "Praya", category: "service", subcategory: "chauffeur & transfert",
    name: "My Lombok Driver", slug: "chauffeur-aeroport", description: "Chauffeur vérifié, accueil nominatif à l’aéroport et prix confirmé avant le trajet.",
    specialty: "Aéroport LOP ↔ Kuta", tags: ["chauffeur", "aéroport", "24h/24", "fiable"], price_level: 2, price_range: "180–250k Rp · 11–15 €", lat: -8.7573, lng: 116.2767,
    opening_hours: "24h/24 sur réservation", whatsapp: "+62 812-1111-2026", maps_url: "https://maps.google.com/?q=-8.7573,116.2767", photos: [categoryPhotos.service], tested_by_us: true, rating: 5, best_time: "réserver 24 h avant", level: null, vigilance: null, created_at: "2026-07-22T00:00:00.000Z"
  },
];

const extraPlaces: Place[] = extraPlacesBase.map((place, index) => ({ ...place, photos: [editorialPhoto(place.category, importedPlaces.length + index)], zone: place.city, halal: "inconnu", alcool_servi: null, ambiance: place.category === "culture" ? ["calme", "familial"] : place.category === "nature" || place.category === "plage" ? ["vue", "romantique"] : ["calme"], mosquee_proche: { nom: "Masjid Nurul Bilad Mandalika", distance_m: Math.round(Math.hypot(place.lat + 8.8937, place.lng - 116.2965) * 111000), mawaqit_slug: "nurul-bilad-mandalika" }, prive: false }));

const mosques: Place[] = [
  { id: "masjid-nurul-bilad", region: "central-lombok", island: "lombok", city: "Kuta", category: "service", subcategory: "mosquée", name: "Masjid Nurul Bilad Mandalika", slug: "masjid-nurul-bilad", description: "Grande mosquée de Mandalika, facilement accessible depuis Kuta.", specialty: "Salle de prière et ablutions", tags: ["mosquée", "prière", "ablutions", "parking"], price_level: null, price_range: "Gratuit", lat: -8.8937, lng: 116.2965, opening_hours: "04:30–21:00", whatsapp: null, maps_url: "https://maps.google.com/?q=-8.8937,116.2965", photos: [categoryPhotos.culture], tested_by_us: true, rating: 4.8, best_time: "hors grande affluence du vendredi", level: null, vigilance: null, zone: "Kuta/Mandalika", halal: "certifié", alcool_servi: false, ambiance: ["calme", "familial"], mosquee_proche: null, prive: false, created_at: "2026-07-22T00:00:00.000Z" },
  { id: "masjid-hubbul-wathan", region: "west-lombok", island: "lombok", city: "Mataram", category: "service", subcategory: "mosquée", name: "Islamic Center Hubbul Wathan", slug: "islamic-center-lombok", description: "Mosquée emblématique de Mataram et centre culturel islamique de Lombok.", specialty: "Architecture et grande salle de prière", tags: ["mosquée", "culture", "ablutions", "parking"], price_level: null, price_range: "Gratuit", lat: -8.5831, lng: 116.1036, opening_hours: "04:30–21:30", whatsapp: null, maps_url: "https://maps.google.com/?q=-8.5831,116.1036", photos: [categoryPhotos.culture], tested_by_us: false, rating: 4.8, best_time: "avant le coucher du soleil", level: null, vigilance: null, zone: "Mataram", halal: "certifié", alcool_servi: false, ambiance: ["calme", "familial"], mosquee_proche: null, prive: false, created_at: "2026-07-22T00:00:00.000Z" },
];

export const places: Place[] = [...importedPlaces, ...extraPlaces, ...mosques];

export const categoryMeta: Record<PlaceCategory, { label: string; icon: string }> = {
  restaurant: { label: "Restaurants", icon: "♨" },
  plage: { label: "Plages", icon: "☀" },
  service: { label: "Services", icon: "✦" },
  nature: { label: "Nature", icon: "♧" },
  excursion: { label: "Îles", icon: "≈" },
  culture: { label: "Culture", icon: "◈" },
};

export const messages = {
  fr: { search: "Rechercher un lieu, une zone, une envie…", all: "Tout", map: "Carte", list: "Liste", filters: "Filtres" },
  en: { search: "Search a place, area or activity…", all: "All", map: "Map", list: "List", filters: "Filters" },
} as const;

export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (value: number) => value * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}
