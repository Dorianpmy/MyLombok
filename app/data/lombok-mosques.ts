import { semanticPhotoForPlace } from "./place-media";
import type { Place, PlaceSource } from "./places";

type MosqueInput = {
  id: string;
  name: string;
  region: string;
  island?: string;
  city: string;
  zone: string;
  description: string;
  specialty: string;
  lat: number;
  lng: number;
  source: Omit<PlaceSource, "verified_at">;
  bestTime?: string;
};

const VERIFIED_AT = "5 août 2026";
const SIMAS_NTB_URL = "https://simas.kemenag.go.id/provinsi/nusa-tenggara-barat-18";

function mapsUrl(name: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, Lombok, Indonesia`)}`;
}

function createMosque(input: MosqueInput): Place {
  const sources: PlaceSource[] = [
    { ...input.source, verified_at: VERIFIED_AT },
    {
      label: "Annuaire officiel SIMAS · Kementerian Agama",
      url: SIMAS_NTB_URL,
      kind: "officiel",
      verified_at: VERIFIED_AT,
    },
  ];

  return {
    id: input.id,
    region: input.region,
    island: input.island ?? "lombok",
    city: input.city,
    category: "service",
    subcategory: "mosquée",
    name: input.name,
    slug: input.id,
    description: input.description,
    specialty: input.specialty,
    tags: ["mosquée", "prière", "ablutions", "jummah", input.city.toLocaleLowerCase("fr")],
    price_level: null,
    price_range: "Accès libre",
    lat: input.lat,
    lng: input.lng,
    opening_hours: null,
    whatsapp: null,
    phone: null,
    contact_source_url: null,
    sources,
    prayer_area: input.city,
    // Aucune fiche publique MAWAQIT n'était disponible pour Lombok au moment
    // de la vérification. Ne jamais fabriquer un identifiant ou une iqama.
    mawaqit_uuid: null,
    maps_url: mapsUrl(input.name),
    photos: [semanticPhotoForPlace({
      id: input.id,
      name: input.name,
      category: "service",
      subcategory: "mosquée",
      city: input.city,
    })],
    menu: null,
    tested_by_us: false,
    rating: null,
    best_time: input.bestTime ?? "arriver quelques minutes avant l’adhan",
    level: null,
    vigilance: "L’adhan affiché dans MyLombok est calculé pour les coordonnées de cette mosquée. L’iqama, la Jumu’ah et les accès visiteurs doivent être confirmés localement. Aucune fiche publique MAWAQIT n’était disponible lors de la vérification du 5 août 2026.",
    zone: input.zone,
    halal: "inconnu",
    alcool_servi: null,
    ambiance: ["calme", "familial"],
    mosquee_proche: null,
    prive: false,
    created_at: "2026-08-05T00:00:00.000Z",
  };
}

const mosqueCatalog: MosqueInput[] = [
  {
    id: "masjid-hubbul-wathan",
    name: "Masjid Raya Hubbul Wathan · Islamic Center NTB",
    region: "west-lombok",
    city: "Mataram",
    zone: "Gomong · Selaparang",
    description: "Grande mosquée provinciale et repère majeur de Mataram, au sein de l’Islamic Center de Nusa Tenggara Barat.",
    specialty: "Grande salle de prière, centre islamique et architecture emblématique",
    lat: -8.5801244,
    lng: 116.1009132,
    bestTime: "avant Maghrib, hors affluence du vendredi",
    source: {
      label: "Office du tourisme de Nusa Tenggara Barat",
      url: "https://www.indonesia.travel/gb/en/muslim-friendly-travel/attraction/islamic-centre-mataram/",
      kind: "officiel",
    },
  },
  {
    id: "masjid-raya-al-taqwa-mataram",
    name: "Masjid Raya Al‑Taqwa Mataram",
    region: "west-lombok",
    city: "Mataram",
    zone: "Selaparang · centre de Mataram",
    description: "Mosquée centrale de Mataram située à proximité immédiate de l’Islamic Center et du quartier d’Udayana.",
    specialty: "Prière quotidienne et accès central à Mataram",
    lat: -8.581194,
    lng: 116.0991935,
    source: {
      label: "OpenStreetMap · Masjid Raya Al‑Taqwa",
      url: "https://www.openstreetmap.org/node/2690663695",
      kind: "cartographie",
    },
  },
  {
    id: "masjid-nurul-bilad",
    name: "Masjid Raya Nurul Bilad Mandalika",
    region: "central-lombok",
    city: "Kuta",
    zone: "Mandalika",
    description: "Mosquée principale de la zone de Mandalika, proche du centre de Kuta et des grands équipements touristiques.",
    specialty: "Grande salle de prière, ablutions et accès depuis Kuta",
    lat: -8.8900516,
    lng: 116.2839118,
    source: {
      label: "Wonderful Indonesia · Ministère du Tourisme",
      url: "https://www.indonesia.travel/id/id/muslim-friendly-travel/attraction/masjid-raya-nurul-bilad",
      kind: "officiel",
    },
  },
  {
    id: "masjid-agung-praya",
    name: "Masjid Agung Praya",
    region: "central-lombok",
    city: "Praya",
    zone: "Leneng · centre de Praya",
    description: "Mosquée centrale du kabupaten de Lombok Tengah, située dans la capitale administrative de Praya.",
    specialty: "Mosquée centrale de Lombok Tengah",
    lat: -8.7025578,
    lng: 116.2676343,
    source: {
      label: "Wonderful Indonesia · Ministère du Tourisme",
      url: "https://www.indonesia.travel/gb/en/muslim-friendly-travel/attraction/masjid-agung-praya",
      kind: "officiel",
    },
  },
  {
    id: "masjid-jamiq-al-mujahidin-selong",
    name: "Masjid Jamiq Al Mujahidin Selong",
    region: "east-lombok",
    city: "Selong",
    zone: "Sandubaya · centre de Selong",
    description: "Mosquée congrégationnelle officielle de Lombok Timur, sur Jl. TGH Abdul Majid au centre de Selong.",
    specialty: "Mosquée centrale de Lombok Timur",
    lat: -8.6507433,
    lng: 116.5382538,
    source: {
      label: "Wonderful Indonesia · Ministère du Tourisme",
      url: "https://www.indonesia.travel/id/id/muslim-friendly-travel/attraction/masjid-jamiq-al-mujahidin-selong",
      kind: "officiel",
    },
  },
  {
    id: "masjid-al-akbar-masbagik",
    name: "Masjid Al Akbar Masbagik",
    region: "east-lombok",
    city: "Masbagik",
    zone: "Masbagik Utara Baru",
    description: "Grande mosquée communautaire de Masbagik, visible depuis le carrefour principal de la ville.",
    specialty: "Mosquée centrale et repère architectural de Masbagik",
    lat: -8.621063,
    lng: 116.476797,
    source: {
      label: "Wonderful Indonesia · Ministère du Tourisme",
      url: "https://www.indonesia.travel/gb/en/muslim-friendly-travel/attraction/masjid-al-akbar-masbagik",
      kind: "officiel",
    },
  },
  {
    id: "masjid-syafaatul-ikhwan-jerowaru",
    name: "Masjid Syafa’atul Ikhwan",
    region: "east-lombok",
    city: "Jerowaru",
    zone: "Sengkelok · Seriwe",
    description: "Mosquée Jami de Seriwe enregistrée par le ministère indonésien des Affaires religieuses, utile dans le sud-est de Lombok.",
    specialty: "Prière quotidienne, Jumu’ah, ablutions et parking",
    lat: -8.910592,
    lng: 116.48533,
    source: {
      label: "Fiche officielle SIMAS · Syafa’atul Ikhwan",
      url: "https://simas.kemenag.go.id/profil/masjid/01.4.18.03.20.000103",
      kind: "officiel",
    },
  },
  {
    id: "masjid-jami-al-istiqomah-pemenang",
    name: "Masjid Jami’ Al‑Istiqomah",
    region: "north-lombok",
    city: "Pemenang",
    zone: "Pemenang Barat",
    description: "Mosquée Jami située à Pemenang, point de passage pratique avant Bangsal et les traversées vers les îles Gili.",
    specialty: "Prière quotidienne et Jumu’ah près de Bangsal",
    lat: -8.4058674,
    lng: 116.1019111,
    source: {
      label: "OpenStreetMap · Masjid Jami’ Al‑Istiqomah",
      url: "https://www.openstreetmap.org/way/303256714",
      kind: "cartographie",
    },
  },
  {
    id: "masjid-baitur-rahman-gili-trawangan",
    name: "Masjid Agung Bai’tur Rahman",
    region: "north-lombok",
    island: "gili-trawangan",
    city: "Gili Trawangan",
    zone: "centre de Gili Trawangan",
    description: "Grande mosquée de Gili Trawangan, accessible à pied depuis la côte est et les principaux hébergements de l’île.",
    specialty: "Prière quotidienne et Jumu’ah à Gili Trawangan",
    lat: -8.3502709,
    lng: 116.0431052,
    source: {
      label: "OpenStreetMap · Masjid Agung Bai’tur Rahman",
      url: "https://www.openstreetmap.org/way/239384237",
      kind: "cartographie",
    },
  },
  {
    id: "masjid-darrul-yaqin-bayan",
    name: "Masjid Darrul Yaqin",
    region: "north-lombok",
    city: "Bayan",
    zone: "Tanak Petak Daya · Loloan",
    description: "Mosquée publique du nord de Lombok enregistrée dans l’annuaire SIMAS, à proximité de la zone de Bayan.",
    specialty: "Prière quotidienne, Jumu’ah et ablutions",
    lat: -8.210431,
    lng: 116.371246,
    source: {
      label: "Fiche officielle SIMAS · Darrul Yaqin",
      url: "https://simas.kemenag.go.id/profil/masjid/01.6.18.08.04.000090",
      kind: "officiel",
    },
  },
];

export const lombokMosques = mosqueCatalog.map(createMosque);
