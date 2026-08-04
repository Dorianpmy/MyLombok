import seedPlaces from "./seed-lombok";
import { semanticPhotoForPlace } from "./place-media";

export type PlaceCategory = "activite" | "restaurant" | "plage" | "service" | "nature" | "excursion" | "culture";
export type HalalStatus = "certifié" | "sans porc ni alcool" | "non" | "inconnu";
export type Ambiance = "romantique" | "calme" | "familial" | "animé" | "vue";
export type NearbyMosque = { nom: string; distance_m: number; mawaqit_slug: string };
export type RestaurantMenu = { highlights: string[]; source_url: string; source_label: string; verified_at: string; status: "officiel" | "communauté" | "à confirmer" };

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
  phone?: string | null;
  contact_source_url?: string | null;
  maps_url: string;
  photos: string[];
  menu: RestaurantMenu | null;
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

const activityPlaceIds = new Set([
  "kuta-lombok-surf-school",
  "heartbeach-surf",
  "surf-cult",
  "paradise-surfschool",
  "surf-camp-lombok",
  "lmbk-surf-house",
  "mandalika-beach-club",
  "rinjani-trek",
  "gili-air-day",
  "pink-beach-boat",
]);

function canonicalCategory(id: string, category: PlaceCategory): PlaceCategory {
  if (activityPlaceIds.has(id)) return "activite";
  if (id === "bangsal-public-boat") return "service";
  return category;
}

const restaurantMenuSources: Record<string, Omit<RestaurantMenu, "highlights">> = {
  "kenza-cafe": { source_url: "https://kenzalombok.com/wp-content/uploads/2025/08/MENU-NEW-Kenza-09082025.pdf", source_label: "Menu Kenza", verified_at: "22 juillet 2026", status: "officiel" },
  elamu: { source_url: "https://elamulombok.com/assets/menu/elamu-lunch-dinner-sep25.pdf", source_label: "Menu Elamu", verified_at: "22 juillet 2026", status: "officiel" },
  "cantina-mexicana": { source_url: "https://www.cantinamexicanalombok.com/menu", source_label: "Menu Cantina Mexicana", verified_at: "22 juillet 2026", status: "officiel" },
  "papi-sapi": { source_url: "https://papisapi.com/wp-content/uploads/2026/04/PAPI-SAPI-Lombok-MENU-January-2026-Update.pdf", source_label: "Menu Papi Sapi", verified_at: "22 juillet 2026", status: "officiel" },
  "the-shack": { source_url: "https://theshacklombok.com/", source_label: "Menu The Shack", verified_at: "22 juillet 2026", status: "officiel" },
  "la-cabana": { source_url: "https://sikaralombokhotel.com/wp-content/uploads/2026/03/La-Cabana-Menu-2026.pdf", source_label: "Menu La Cabaña", verified_at: "22 juillet 2026", status: "officiel" },
  treehouse: { source_url: "https://www.treehousekutalombok.com/foodmenu", source_label: "Menu Treehouse", verified_at: "22 juillet 2026", status: "officiel" },
  "ramen-otaku": { source_url: "https://discoverlombok.guide/places/indonesia/central-lombok-regency/kuta-pujut-1/ramen-otaku/", source_label: "Guide Discover Lombok", verified_at: "22 juillet 2026", status: "communauté" },
  "warung-flora": { source_url: "https://restaurantguru.com/Warung-Flora-Kuta-3-2/menu", source_label: "Photos de la carte", verified_at: "22 juillet 2026", status: "communauté" },
  "uma-blu": { source_url: "https://umablu.com/", source_label: "Menu Uma Blu", verified_at: "22 juillet 2026", status: "officiel" },
  "honey-jack": { source_url: "https://honeyjacklombok.com/menus/food/", source_label: "Menu Honey Jack", verified_at: "22 juillet 2026", status: "officiel" },
  milk: { source_url: "https://whatsyum.com/place/343325/milk-espresso-kuta-lombok-world-menu", source_label: "Carte numérisée MILK", verified_at: "22 juillet 2026", status: "communauté" },
};

export const importedPlaces: Place[] = seedPlaces.map((item) => {
  const category = canonicalCategory(item.id, item.category as PlaceCategory);
  const menuSource = restaurantMenuSources[item.id];
  const menuHighlights = item.specialty?.split(/,|—/).map((entry) => entry.trim()).filter(Boolean).slice(0, 4) || [];
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
    price_range: item.price_range,
    lat: item.lat,
    lng: item.lng,
    opening_hours: item.opening_hours,
    whatsapp: item.whatsapp,
    maps_url: `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}${item.google_place_id ? `&query_place_id=${item.google_place_id}` : ""}`,
    photos: [semanticPhotoForPlace({ id: item.id, name: item.name, category, subcategory: item.subcategory, city: item.city })],
    menu: category === "restaurant" ? {
      highlights: menuHighlights,
      source_url: menuSource?.source_url || `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}${item.google_place_id ? `&query_place_id=${item.google_place_id}` : ""}`,
      source_label: menuSource?.source_label || "Carte et prix à confirmer auprès du restaurant",
      verified_at: menuSource?.verified_at || "22 juillet 2026",
      status: menuSource?.status || "à confirmer",
    } : null,
    tested_by_us: false,
    rating: item.google_rating,
    best_time: item.best_time,
    level: item.level,
    vigilance: item.vigilance,
    zone: item.city,
    // Le statut halal exige une déclaration explicite ou une certification à jour.
    // Les tags éditoriaux ne constituent pas une preuve suffisante.
    halal: "inconnu",
    alcool_servi: item.tags.some((tag) => /cocktail|bar|vin/i.test(tag)) ? true : null,
    ambiance: [item.tags.some((tag) => /calme|travailler/i.test(tag)) ? "calme" : "animé"],
    // Ne pas présenter une proximité calculée à vol d'oiseau comme une information
    // vérifiée : l'accès réel dépend du réseau routier et des entrées du lieu.
    mosquee_proche: null,
    prive: item.tags.some((tag) => /cabana|privé|date/i.test(tag)),
    created_at: "2026-07-22T00:00:00.000Z",
  };
});

const extraPlacesBase: Omit<Place, "zone" | "halal" | "alcool_servi" | "ambiance" | "mosquee_proche" | "prive">[] = [
  {
    id: "rinjani-trek", region: "north-lombok", island: "lombok", city: "Senaru", category: "activite", subcategory: "trek guidé",
    name: "Trek du Mont Rinjani", slug: "trek-rinjani", description: "Ascension guidée du volcan et nuit face au lac Segara Anak. Réservation avec guide agréé indispensable.",
    specialty: "Trek 2 jours / 1 nuit", tags: ["trek", "volcan", "sunrise", "guide"], price_level: 3, price_range: "2,5–4,5 M Rp · à confirmer", lat: -8.4112, lng: 116.4573,
    opening_hours: null, whatsapp: null, maps_url: "https://maps.google.com/?q=-8.4112,116.4573", photos: [], menu: null, tested_by_us: false, rating: null, best_time: "avril à novembre", level: "difficile", vigilance: "Trek exigeant : vérifier l’état des sentiers, la météo, les permis et l’agrément de l’opérateur avant le départ.", created_at: "2026-07-22T00:00:00.000Z"
  },
  {
    id: "gili-air-day", region: "north-lombok", island: "gili-air", city: "Gili Air", category: "activite", subcategory: "sortie snorkeling",
    name: "Journée snorkeling aux Gili", slug: "snorkeling-gili", description: "Bateau en petit groupe vers Gili Air, Meno et Trawangan, avec spots de tortues et statues sous-marines.",
    specialty: "3 îles & tortues", tags: ["bateau", "snorkeling", "tortues", "famille"], price_level: 2, price_range: "350–650k Rp · à confirmer", lat: -8.349, lng: 116.082,
    opening_hours: null, whatsapp: null, maps_url: "https://maps.google.com/?q=-8.349,116.082", photos: [], menu: null, tested_by_us: false, rating: null, best_time: "matin, mer calme", level: "facile", vigilance: "Horaires, tarif et opérateur à confirmer. Privilégier ceux qui ne nourrissent pas les tortues.", created_at: "2026-07-22T00:00:00.000Z"
  },
  {
    id: "selong-belanak", region: "south-lombok", island: "lombok", city: "Selong Belanak", category: "plage", subcategory: "baignade & surf débutant",
    name: "Selong Belanak Beach", slug: "selong-belanak", description: "Grande baie de sable clair, idéale pour apprendre le surf et se baigner lorsque la mer est calme.",
    specialty: "Surf débutant", tags: ["plage", "surf", "baignade", "sunset", "warung"], price_level: 1, price_range: "Parking 10k Rp · à confirmer", lat: -8.8739, lng: 116.1624,
    opening_hours: null, whatsapp: null, maps_url: "https://maps.google.com/?q=-8.8739,116.1624", photos: [], menu: null, tested_by_us: false, rating: null, best_time: "matin ou coucher du soleil", level: "débutant · mi-marée", vigilance: "Conditions de baignade et de surf à confirmer sur place ; rester prudent lorsque la houle augmente.", created_at: "2026-07-22T00:00:00.000Z"
  },
];

const extraPlaces: Place[] = extraPlacesBase.map((place) => ({ ...place, photos: [semanticPhotoForPlace(place)], zone: place.city, halal: "inconnu", alcool_servi: null, ambiance: place.category === "culture" ? ["calme", "familial"] : place.category === "nature" || place.category === "plage" ? ["vue", "romantique"] : ["calme"], mosquee_proche: null, prive: false }));

const mosques: Place[] = [
  { id: "masjid-nurul-bilad", region: "central-lombok", island: "lombok", city: "Kuta", category: "service", subcategory: "mosquée", name: "Masjid Nurul Bilad Mandalika", slug: "masjid-nurul-bilad", description: "Grande mosquée de Mandalika, facilement accessible depuis Kuta.", specialty: "Salle de prière et ablutions", tags: ["mosquée", "prière", "ablutions", "parking"], price_level: null, price_range: "Gratuit", lat: -8.8937, lng: 116.2965, opening_hours: null, whatsapp: null, maps_url: "https://maps.google.com/?q=-8.8937,116.2965", photos: [semanticPhotoForPlace({ id: "masjid-nurul-bilad", name: "Masjid Nurul Bilad Mandalika", category: "service", subcategory: "mosquée", city: "Kuta" })], menu: null, tested_by_us: false, rating: null, best_time: "hors grande affluence du vendredi", level: null, vigilance: "Les horaires d'accès peuvent varier autour des prières et des événements.", zone: "Kuta/Mandalika", halal: "inconnu", alcool_servi: null, ambiance: ["calme", "familial"], mosquee_proche: null, prive: false, created_at: "2026-07-22T00:00:00.000Z" },
  { id: "masjid-hubbul-wathan", region: "west-lombok", island: "lombok", city: "Mataram", category: "service", subcategory: "mosquée", name: "Islamic Center Hubbul Wathan", slug: "islamic-center-lombok", description: "Mosquée emblématique de Mataram et centre culturel islamique de Lombok.", specialty: "Architecture et grande salle de prière", tags: ["mosquée", "culture", "ablutions", "parking"], price_level: null, price_range: "Gratuit", lat: -8.5831, lng: 116.1036, opening_hours: null, whatsapp: null, maps_url: "https://maps.google.com/?q=-8.5831,116.1036", photos: [semanticPhotoForPlace({ id: "masjid-hubbul-wathan", name: "Islamic Center Hubbul Wathan", category: "service", subcategory: "mosquée", city: "Mataram" })], menu: null, tested_by_us: false, rating: null, best_time: "avant le coucher du soleil", level: null, vigilance: "Les horaires d'accès peuvent varier autour des prières et des événements.", zone: "Mataram", halal: "inconnu", alcool_servi: null, ambiance: ["calme", "familial"], mosquee_proche: null, prive: false, created_at: "2026-07-22T00:00:00.000Z" },
];

type CuratedPlaceInput = {
  id: string;
  name: string;
  city: string;
  category: PlaceCategory;
  subcategory: string;
  lat: number;
  lng: number;
  specialty: string;
  tags: string[];
  priceLevel?: 1 | 2 | 3;
  bestTime?: string;
  level?: string;
};

const curatedCatalog: CuratedPlaceInput[] = [
  { id: "ashtari-kuta", name: "Ashtari", city: "Kuta", category: "restaurant", subcategory: "cuisine & panorama", lat: -8.8795, lng: 116.2708, specialty: "Cuisine fraîche avec vue sur la baie de Kuta", tags: ["vue", "brunch", "coucher de soleil"], priceLevel: 2, bestTime: "fin d’après-midi" },
  { id: "el-bazar-kuta", name: "El Bazar Café & Restaurant", city: "Kuta", category: "restaurant", subcategory: "méditerranéen", lat: -8.8912, lng: 116.2779, specialty: "Assiettes méditerranéennes à partager", tags: ["dîner", "terrasse", "pour deux"], priceLevel: 3, bestTime: "dîner" },
  { id: "krnk-kuta", name: "KRNK Bar & Restaurant", city: "Kuta", category: "restaurant", subcategory: "grill & burgers", lat: -8.8915, lng: 116.2786, specialty: "Burgers, grillades et cuisine généreuse", tags: ["burger", "grill", "animé"], priceLevel: 2 },
  { id: "bush-radio-kuta", name: "Bush Radio", city: "Kuta", category: "restaurant", subcategory: "café & coworking", lat: -8.8918, lng: 116.2804, specialty: "Café de spécialité et petit-déjeuner", tags: ["café", "wifi", "brunch"], priceLevel: 2, bestTime: "matin" },
  { id: "mama-pizza-kuta", name: "Mama Pizza Kuta Lombok", city: "Kuta", category: "restaurant", subcategory: "pizzeria", lat: -8.8934, lng: 116.2795, specialty: "Pizzas au feu de bois", tags: ["pizza", "famille", "dîner"], priceLevel: 2 },
  { id: "terra-kuta", name: "Terra", city: "Kuta", category: "restaurant", subcategory: "végétal", lat: -8.8922, lng: 116.2763, specialty: "Cuisine végétale colorée et jus frais", tags: ["veggie", "healthy", "brunch"], priceLevel: 2 },
  { id: "markisa-kuta", name: "Markisa Lombok", city: "Kuta", category: "restaurant", subcategory: "indonésien contemporain", lat: -8.891, lng: 116.2814, specialty: "Produits locaux et recettes indonésiennes revisitées", tags: ["local", "dîner", "terrasse"], priceLevel: 2 },
  { id: "square-senggigi", name: "Square Restaurant", city: "Senggigi", category: "restaurant", subcategory: "international", lat: -8.4939, lng: 116.0434, specialty: "Cuisine internationale au cœur de Senggigi", tags: ["dîner", "central", "terrasse"], priceLevel: 3 },
  { id: "cafe-alberto-senggigi", name: "Cafe Alberto", city: "Senggigi", category: "restaurant", subcategory: "italien en bord de mer", lat: -8.5015, lng: 116.043, specialty: "Cuisine italienne les pieds dans le sable", tags: ["plage", "italien", "sunset"], priceLevel: 3, bestTime: "coucher du soleil" },
  { id: "pituq-gili-trawangan", name: "Pituq Waroeng", city: "Gili Trawangan", category: "restaurant", subcategory: "indonésien végétal", lat: -8.3489, lng: 116.0448, specialty: "Cuisine indonésienne végétale dans un jardin", tags: ["veggie", "local", "calme"], priceLevel: 2 },
  { id: "pachamama-gili-air", name: "Pachamama Organic Cafe", city: "Gili Air", category: "restaurant", subcategory: "café biologique", lat: -8.3548, lng: 116.0844, specialty: "Bowls, jus frais et cuisine végétale", tags: ["veggie", "brunch", "healthy"], priceLevel: 2 },
  { id: "scallywags-gili-air", name: "Scallywags Beach Club Gili Air", city: "Gili Air", category: "restaurant", subcategory: "grill de plage", lat: -8.359, lng: 116.0834, specialty: "Poissons grillés et dîner en bord de mer", tags: ["poisson", "plage", "dîner"], priceLevel: 3 },

  { id: "tanjung-aan", name: "Tanjung Aan Beach", city: "Mandalika", category: "plage", subcategory: "baignade & panorama", lat: -8.9107, lng: 116.3207, specialty: "Double baie de sable clair au pied de Merese", tags: ["baignade", "warung", "famille"], priceLevel: 1, bestTime: "matin", level: "baignade selon conditions" },
  { id: "mawun-beach", name: "Mawun Beach", city: "Mawun", category: "plage", subcategory: "baignade", lat: -8.9016, lng: 116.2285, specialty: "Baie en croissant entourée de collines", tags: ["baignade", "calme", "vue"], priceLevel: 1, bestTime: "matin" },
  { id: "are-guling-beach", name: "Are Guling Beach", city: "Are Guling", category: "plage", subcategory: "surf", lat: -8.9166, lng: 116.2384, specialty: "Spot de surf et grande plage au sud de Kuta", tags: ["surf", "sunset", "warung"], priceLevel: 1, bestTime: "selon marée", level: "intermédiaire à confirmé" },
  { id: "gerupuk-bay", name: "Gerupuk Bay", city: "Gerupuk", category: "plage", subcategory: "surf en bateau", lat: -8.9191, lng: 116.3498, specialty: "Plusieurs vagues accessibles en bateau local", tags: ["surf", "bateau", "village"], priceLevel: 2, bestTime: "matin", level: "tous niveaux selon spot" },
  { id: "ekas-beach", name: "Ekas Bay", city: "Ekas", category: "plage", subcategory: "surf & baie", lat: -8.8965, lng: 116.4524, specialty: "Baie sauvage de l’est de Lombok", tags: ["surf", "calme", "vue"], priceLevel: 1, bestTime: "saison sèche", level: "intermédiaire" },
  { id: "pink-beach-tangsi", name: "Pink Beach · Tangsi", city: "Sekaroh", category: "plage", subcategory: "snorkeling", lat: -8.8534, lng: 116.5723, specialty: "Sable rosé et eau claire sur la péninsule de Jerowaru", tags: ["snorkeling", "bateau", "photo"], priceLevel: 1, bestTime: "08:00–14:00" },
  { id: "nipah-beach", name: "Nipah Beach", city: "Nipah", category: "plage", subcategory: "baignade & sunset", lat: -8.4357, lng: 116.0376, specialty: "Baie calme et warungs de poisson", tags: ["baignade", "poisson", "sunset"], priceLevel: 1, bestTime: "fin d’après-midi" },
  { id: "klui-beach", name: "Klui Beach", city: "Klui", category: "plage", subcategory: "plage calme", lat: -8.4557, lng: 116.038, specialty: "Longue plage tranquille au nord de Senggigi", tags: ["calme", "promenade", "sunset"], priceLevel: 1 },
  { id: "sire-beach", name: "Sire Beach", city: "Tanjung", category: "plage", subcategory: "baignade & snorkeling", lat: -8.3611, lng: 116.1113, specialty: "Eau calme face aux îles Gili", tags: ["baignade", "snorkeling", "famille"], priceLevel: 1, bestTime: "matin" },
  { id: "semetti-beach", name: "Semeti Beach", city: "Mekar Sari", category: "plage", subcategory: "crique rocheuse", lat: -8.8846, lng: 116.1505, specialty: "Paysage minéral et criques sauvages", tags: ["photo", "sauvage", "rochers"], priceLevel: 1, bestTime: "marée basse", level: "prudence sur les rochers" },
  { id: "nambung-beach", name: "Nambung Beach", city: "Sekotong", category: "plage", subcategory: "côte sauvage", lat: -8.8235, lng: 115.9417, specialty: "Grande plage isolée de l’ouest de Lombok", tags: ["sauvage", "photo", "route panoramique"], priceLevel: 1, bestTime: "saison sèche" },
  { id: "torok-aik-belek", name: "Torok Aik Belek", city: "Praya Barat", category: "plage", subcategory: "baie secrète", lat: -8.8897, lng: 116.1908, specialty: "Petite baie entourée de collines", tags: ["calme", "baignade", "vue"], priceLevel: 1, bestTime: "matin" },

  { id: "sendang-gile", name: "Cascade Sendang Gile", city: "Senaru", category: "nature", subcategory: "cascade", lat: -8.2989, lng: 116.4079, specialty: "Cascade facilement accessible depuis Senaru", tags: ["cascade", "forêt", "famille"], priceLevel: 1, bestTime: "matin", level: "facile" },
  { id: "tiu-kelep", name: "Cascade Tiu Kelep", city: "Senaru", category: "nature", subcategory: "cascade", lat: -8.3036, lng: 116.4106, specialty: "Grande cascade au cœur de la forêt de Senaru", tags: ["cascade", "randonnée", "forêt"], priceLevel: 1, bestTime: "matin", level: "modéré" },
  { id: "benang-stokel", name: "Benang Stokel", city: "Aik Berik", category: "nature", subcategory: "cascade", lat: -8.5317, lng: 116.3416, specialty: "Deux chutes au pied du Rinjani", tags: ["cascade", "forêt", "baignade"], priceLevel: 1, bestTime: "matin", level: "facile" },
  { id: "benang-kelambu", name: "Benang Kelambu", city: "Aik Berik", category: "nature", subcategory: "cascade", lat: -8.5354, lng: 116.3441, specialty: "Rideau d’eau végétal dans la forêt", tags: ["cascade", "photo", "forêt"], priceLevel: 1, bestTime: "matin", level: "modéré" },
  { id: "jeruk-manis", name: "Cascade Jeruk Manis", city: "Tetebatu", category: "nature", subcategory: "cascade", lat: -8.5262, lng: 116.4305, specialty: "Balade forestière au nord de Tetebatu", tags: ["cascade", "randonnée", "rizières"], priceLevel: 1, bestTime: "matin", level: "modéré" },
  { id: "mangku-sakti", name: "Cascade Mangku Sakti", city: "Sembalun", category: "nature", subcategory: "cascade", lat: -8.3138, lng: 116.5285, specialty: "Canyon minéral et eau laiteuse au nord-est", tags: ["cascade", "aventure", "canyon"], priceLevel: 2, bestTime: "saison sèche", level: "modéré" },
  { id: "bukit-pergasingan", name: "Bukit Pergasingan", city: "Sembalun", category: "nature", subcategory: "randonnée sunrise", lat: -8.3588, lng: 116.5392, specialty: "Vue sur les parcelles colorées de Sembalun", tags: ["sunrise", "trek", "panorama"], priceLevel: 2, bestTime: "avant le lever du soleil", level: "modéré" },
  { id: "bukit-selong", name: "Bukit Selong", city: "Sembalun", category: "nature", subcategory: "point de vue", lat: -8.3628, lng: 116.5293, specialty: "Point de vue rapide sur la vallée de Sembalun", tags: ["panorama", "photo", "famille"], priceLevel: 1, bestTime: "lever du soleil", level: "facile" },
  { id: "tetebatu-rice-terraces", name: "Rizières de Tetebatu", city: "Tetebatu", category: "nature", subcategory: "rizières", lat: -8.5523, lng: 116.4197, specialty: "Balade entre rizières, canaux et villages", tags: ["rizières", "marche", "local"], priceLevel: 1, bestTime: "07:00–10:00", level: "facile" },
  { id: "gunung-tunak", name: "Parc naturel Gunung Tunak", city: "Mertak", category: "nature", subcategory: "réserve côtière", lat: -8.9511, lng: 116.3812, specialty: "Falaises, collines et plages sauvages", tags: ["randonnée", "falaises", "vue"], priceLevel: 1, bestTime: "matin", level: "modéré" },
  { id: "pusuk-monkey-forest", name: "Pusuk Monkey Forest", city: "Pusuk", category: "nature", subcategory: "forêt & panorama", lat: -8.4737, lng: 116.1003, specialty: "Route forestière panoramique vers le nord", tags: ["forêt", "singes", "route"], priceLevel: 1, bestTime: "journée", level: "facile" },
  { id: "segara-anak", name: "Lac Segara Anak", city: "Rinjani", category: "nature", subcategory: "lac volcanique", lat: -8.4114, lng: 116.4038, specialty: "Lac de cratère accessible lors des treks encadrés", tags: ["trek", "volcan", "campement"], priceLevel: 3, bestTime: "avril à novembre", level: "difficile" },

  { id: "narmada-park", name: "Narmada Park", city: "Narmada", category: "culture", subcategory: "jardins historiques", lat: -8.5967, lng: 116.2025, specialty: "Jardins royaux et bassins historiques", tags: ["histoire", "jardin", "famille"], priceLevel: 1, bestTime: "matin" },
  { id: "mayura-water-palace", name: "Mayura Water Palace", city: "Mataram", category: "culture", subcategory: "palais historique", lat: -8.5869, lng: 116.1353, specialty: "Ancien palais d’eau de Cakranegara", tags: ["histoire", "architecture", "jardin"], priceLevel: 1 },
  { id: "pura-lingsar", name: "Pura Lingsar", city: "Lingsar", category: "culture", subcategory: "temple", lat: -8.5739, lng: 116.1812, specialty: "Ensemble religieux partagé et jardins", tags: ["temple", "histoire", "respect"], priceLevel: 1 },
  { id: "pura-meru", name: "Pura Meru", city: "Mataram", category: "culture", subcategory: "temple", lat: -8.5849, lng: 116.1359, specialty: "Grand temple historique de Cakranegara", tags: ["temple", "architecture", "histoire"], priceLevel: 1 },
  { id: "banyumulek-pottery", name: "Village de potiers Banyumulek", city: "Banyumulek", category: "culture", subcategory: "artisanat", lat: -8.6492, lng: 116.1206, specialty: "Ateliers de poterie traditionnelle Sasak", tags: ["artisanat", "poterie", "atelier"], priceLevel: 1 },
  { id: "ampuan-old-town", name: "Vieille ville d’Ampenan", city: "Ampenan", category: "culture", subcategory: "quartier historique", lat: -8.5752, lng: 116.0745, specialty: "Façades anciennes, marché et front de mer", tags: ["architecture", "marché", "photo"], priceLevel: 1, bestTime: "fin d’après-midi" },
  { id: "cakranegara-market", name: "Marché de Cakranegara", city: "Mataram", category: "culture", subcategory: "marché local", lat: -8.5905, lng: 116.1327, specialty: "Marché vivant pour produits locaux et textiles", tags: ["marché", "local", "artisanat"], priceLevel: 1, bestTime: "07:00–11:00" },
  { id: "bayan-beleq-mosque", name: "Mosquée ancienne Bayan Beleq", city: "Bayan", category: "culture", subcategory: "patrimoine", lat: -8.2774, lng: 116.4243, specialty: "Site historique lié aux traditions Wetu Telu", tags: ["patrimoine", "histoire", "religion"], priceLevel: 1 },
  { id: "gili-nanggu", name: "Gili Nanggu", city: "Sekotong", category: "excursion", subcategory: "île & snorkeling", lat: -8.7632, lng: 115.9905, specialty: "Petite île calme au sud-ouest de Lombok", tags: ["snorkeling", "île", "plage"], priceLevel: 2, bestTime: "matin" },
  { id: "gili-kedis", name: "Gili Kedis", city: "Sekotong", category: "excursion", subcategory: "îlot", lat: -8.7299, lng: 116.0247, specialty: "Minuscule îlot de sable pour une courte escale", tags: ["île", "snorkeling", "photo"], priceLevel: 2 },
  { id: "gili-sudak", name: "Gili Sudak", city: "Sekotong", category: "excursion", subcategory: "île & déjeuner", lat: -8.7257, lng: 116.019, specialty: "Escale snorkeling et warungs de poisson", tags: ["île", "poisson", "snorkeling"], priceLevel: 2 },
  { id: "gili-meno", name: "Gili Meno", city: "Gili Meno", category: "excursion", subcategory: "île calme", lat: -8.3503, lng: 116.056, specialty: "Île paisible, lac salé et snorkeling", tags: ["île", "calme", "tortues"], priceLevel: 2 },
  { id: "gili-trawangan", name: "Gili Trawangan", city: "Gili Trawangan", category: "excursion", subcategory: "île animée", lat: -8.3502, lng: 116.0387, specialty: "Plages, plongée et coucher du soleil", tags: ["île", "plongée", "sunset"], priceLevel: 2 },
  { id: "gili-air", name: "Gili Air", city: "Gili Air", category: "excursion", subcategory: "île & snorkeling", lat: -8.3572, lng: 116.0828, specialty: "Ambiance douce entre snorkeling et cafés", tags: ["île", "snorkeling", "famille"], priceLevel: 2 },
  { id: "pink-beach-boat", name: "Boucle bateau Pink Beach", city: "Tanjung Luar", category: "activite", subcategory: "sortie bateau & snorkeling", lat: -8.7737, lng: 116.5152, specialty: "Journée vers les plages roses et petits îlots", tags: ["bateau", "snorkeling", "plage"], priceLevel: 2, bestTime: "départ tôt" },
  { id: "bangsal-public-boat", name: "Bateau public de Bangsal", city: "Bangsal", category: "service", subcategory: "transport maritime", lat: -8.3937, lng: 116.0998, specialty: "Point de départ des bateaux publics vers les Gili", tags: ["bateau", "transport", "Gili"], priceLevel: 1, bestTime: "08:00–15:00" },

  { id: "zainuddin-airport", name: "Aéroport International Zainuddin Abdul Madjid", city: "Praya", category: "service", subcategory: "aéroport", lat: -8.7573, lng: 116.2767, specialty: "Arrivées, départs, taxis officiels et distributeurs", tags: ["aéroport", "transfert", "ATM"], priceLevel: 1 },
  { id: "rsud-ntb", name: "RSUD Provinsi NTB", city: "Mataram", category: "service", subcategory: "hôpital", lat: -8.6231, lng: 116.1182, specialty: "Hôpital public provincial de référence", tags: ["santé", "urgence", "hôpital"], priceLevel: 2 },
  { id: "siloam-mataram", name: "Siloam Hospitals Mataram", city: "Mataram", category: "service", subcategory: "hôpital privé", lat: -8.5961, lng: 116.1125, specialty: "Services hospitaliers privés à Mataram", tags: ["santé", "urgence", "hôpital"], priceLevel: 3 },
  { id: "grapari-mataram", name: "GraPARI Telkomsel Mataram", city: "Mataram", category: "service", subcategory: "mobile & internet", lat: -8.5884, lng: 116.1098, specialty: "Assistance SIM, eSIM et connexion mobile", tags: ["internet", "SIM", "Telkomsel"], priceLevel: 1 },
  { id: "lembar-port", name: "Port de Lembar", city: "Lembar", category: "service", subcategory: "ferry", lat: -8.7289, lng: 116.0742, specialty: "Ferries publics entre Lombok et Bali", tags: ["ferry", "transport", "Bali"], priceLevel: 1 },
  { id: "kayangan-port", name: "Port de Kayangan", city: "Labuhan Lombok", category: "service", subcategory: "ferry", lat: -8.4877, lng: 116.6821, specialty: "Ferries publics entre Lombok et Sumbawa", tags: ["ferry", "transport", "Sumbawa"], priceLevel: 1 },
  { id: "epicentrum-atm", name: "Lombok Epicentrum Mall · ATM Center", city: "Mataram", category: "service", subcategory: "ATM & change", lat: -8.5957, lng: 116.1003, specialty: "Distributeurs bancaires et services pratiques", tags: ["ATM", "banque", "centre commercial"], priceLevel: 1 },
];

const regionForCity = (city: string) => /Senaru|Sembalun|Bayan|Tanjung|Bangsal|Gili|Nipah|Klui/i.test(city) ? "north-lombok" : /Mataram|Ampenan|Senggigi|Lingsar|Narmada|Lembar|Sekotong/i.test(city) ? "west-lombok" : /Tetebatu|Ekas|Sekaroh|Tanjung Luar|Labuhan/i.test(city) ? "east-lombok" : "central-lombok";
const islandForCity = (city: string) => city.startsWith("Gili ") ? city.toLowerCase().replaceAll(" ", "-") : "lombok";

const curatedPlaces: Place[] = curatedCatalog.map((place) => {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;
  const priceLevel = place.priceLevel ?? (place.category === "restaurant" || place.category === "activite" || place.category === "excursion" ? 2 : 1);
  return {
    ...place,
    region: regionForCity(place.city),
    island: islandForCity(place.city),
    slug: place.id,
    description: `${place.specialty}. Une fiche de repérage MyLombok à vérifier auprès du lieu avant le départ.`,
    price_level: priceLevel,
    price_range: null,
    opening_hours: null,
    whatsapp: null,
    maps_url: mapUrl,
    photos: [semanticPhotoForPlace(place)],
    menu: place.category === "restaurant" ? { highlights: [place.specialty], source_url: mapUrl, source_label: "Carte et horaires à confirmer auprès du restaurant", verified_at: "23 juillet 2026", status: "à confirmer" } : null,
    tested_by_us: false,
    rating: null,
    best_time: place.bestTime || null,
    level: place.level || null,
    vigilance: "Horaires, accès et prix à confirmer directement auprès du lieu avant le déplacement.",
    zone: place.city,
    halal: "inconnu",
    alcool_servi: null,
    ambiance: (place.category === "restaurant" ? ["animé"] : place.category === "service" ? ["familial"] : ["vue", "calme"]) as Ambiance[],
    mosquee_proche: null,
    prive: false,
    created_at: "2026-07-23T00:00:00.000Z",
  };
});

const verifiedAdditions: Place[] = [
  {
    id: "baleoli-beach",
    region: "west-lombok",
    island: "lombok",
    city: "Batu Layar",
    category: "restaurant",
    subcategory: "restaurant de plage",
    name: "Baléoli Beach",
    slug: "baleoli-beach",
    description: "Restaurant en bord de mer sur la route de Senggigi, avec cuisine indonésienne, pizzas et fruits de mer. Une adresse à envisager au coucher du soleil, à environ quinze minutes de Mataram selon la circulation.",
    specialty: "Dîner face à la mer, pizzas et cuisine indonésienne",
    tags: ["bord de mer", "sunset", "terrasse", "wifi", "parking"],
    price_level: 1,
    price_range: "25–50k Rp · à confirmer",
    lat: -8.5229289,
    lng: 116.0655994,
    opening_hours: "15:00–22:00 · 7j/7 · à confirmer",
    whatsapp: null,
    phone: "+62 819-1391-9949",
    contact_source_url: "https://restaurantguru.com/Baleoli-Beach-Indonesia",
    maps_url: "https://www.google.com/maps/search/?api=1&query=Bal%C3%A9oli%20Beach%2C%20Jl.%20Raya%20Senggigi%20No.999%2C%20Batu%20Layar%2C%20Lombok",
    photos: [semanticPhotoForPlace({ id: "baleoli-beach", name: "Baléoli Beach", category: "restaurant", subcategory: "restaurant de plage", city: "Batu Layar" })],
    menu: {
      highlights: ["Cuisine indonésienne", "Pizzas", "Fruits de mer"],
      source_url: "https://restaurantguru.com/Baleoli-Beach-Indonesia",
      source_label: "Fiche publique Baléoli Beach",
      verified_at: "5 août 2026",
      status: "communauté",
    },
    tested_by_us: false,
    rating: 4.4,
    best_time: "coucher du soleil",
    level: null,
    vigilance: "Horaires, carte, prix et disponibilité à confirmer directement auprès du restaurant avant le déplacement.",
    zone: "Batu Layar · proche Mataram/Senggigi",
    halal: "inconnu",
    alcool_servi: null,
    ambiance: ["vue", "familial"],
    mosquee_proche: null,
    prive: false,
    created_at: "2026-08-05T00:00:00.000Z",
  },
];

export const places: Place[] = [...importedPlaces, ...extraPlaces, ...mosques, ...curatedPlaces, ...verifiedAdditions];

export const categoryMeta: Record<PlaceCategory, { label: string; icon: string }> = {
  activite: { label: "Activités", icon: "✦" },
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
