import { semanticPhotoForPlace } from "./place-media";
import type { Ambiance, Place, PlaceCategory, PlaceSource } from "./places";

type MataramPlaceInput = {
  id: string;
  name: string;
  zone: string;
  category: PlaceCategory;
  subcategory: string;
  description: string;
  specialty: string;
  tags: string[];
  priceLevel: 1 | 2 | 3 | null;
  priceRange: string | null;
  lat: number;
  lng: number;
  openingHours: string | null;
  phone?: string;
  bestTime?: string;
  vigilance?: string;
  source: Omit<PlaceSource, "verified_at">;
};

const VERIFIED_AT = "5 août 2026";

function mapsUrl(name: string, lat: number, lng: number) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${lat},${lng}`)}`;
}

function createMataramPlace(input: MataramPlaceInput): Place {
  const mapUrl = mapsUrl(input.name, input.lat, input.lng);
  const sources: PlaceSource[] = [
    { ...input.source, verified_at: VERIFIED_AT },
    { label: "Repère cartographique", url: mapUrl, kind: "cartographie", verified_at: VERIFIED_AT },
  ];
  const ambiance: Ambiance[] = input.category === "restaurant"
    ? ["animé", "familial"]
    : input.category === "plage"
      ? ["vue", "familial"]
      : ["familial"];

  return {
    id: input.id,
    region: "west-lombok",
    island: "lombok",
    city: "Mataram",
    category: input.category,
    subcategory: input.subcategory,
    name: input.name,
    slug: input.id,
    description: input.description,
    specialty: input.specialty,
    tags: input.tags,
    price_level: input.priceLevel,
    price_range: input.priceRange,
    lat: input.lat,
    lng: input.lng,
    opening_hours: input.openingHours,
    whatsapp: null,
    phone: input.phone ?? null,
    contact_source_url: input.phone ? input.source.url : null,
    sources,
    maps_url: mapUrl,
    photos: [semanticPhotoForPlace(input)],
    menu: input.category === "restaurant" ? {
      highlights: [input.specialty],
      source_url: input.source.url,
      source_label: input.source.label,
      verified_at: VERIFIED_AT,
      status: input.source.kind === "établissement" ? "officiel" : "à confirmer",
    } : null,
    tested_by_us: false,
    rating: null,
    best_time: input.bestTime ?? null,
    level: null,
    vigilance: input.vigilance ?? "Horaires, tarifs et disponibilité à confirmer directement auprès du lieu avant le déplacement.",
    zone: input.zone,
    halal: "inconnu",
    alcool_servi: null,
    ambiance,
    mosquee_proche: null,
    prive: false,
    created_at: "2026-08-05T00:00:00.000Z",
  };
}

const mataramCatalog: MataramPlaceInput[] = [
  {
    id: "lombok-epicentrum-mall", name: "Lombok Epicentrum Mall", zone: "Punia · centre de Mataram", category: "activite", subcategory: "shopping, cinéma & loisirs",
    description: "Le plus grand centre commercial moderne de Lombok : boutiques, Hero Supermarket, restauration, espaces enfants et cinéma XXI. Un repère pratique pour s’équiper lorsqu’on s’installe à Mataram.",
    specialty: "Courses du quotidien, shopping et cinéma XXI", tags: ["mall", "shopping", "cinéma", "supermarché", "famille", "wifi", "ATM"], priceLevel: 1, priceRange: "Entrée libre", lat: -8.593497, lng: 116.10468,
    openingHours: "10:00–22:00 · tous les jours", bestTime: "semaine avant 17:00", source: { label: "Wonderful Indonesia · Ministère du Tourisme", url: "https://www.indonesia.travel/id/en/destination/bali-nusa-tenggara/west-nusa-tenggara/lombok-epicentrum-mall", kind: "officiel" },
  },
  {
    id: "mataram-mall", name: "Mataram Mall", zone: "Cilinaya · Cakranegara", category: "activite", subcategory: "shopping de centre-ville",
    description: "Centre commercial historique de Cakranegara, utile pour les achats courants et les services du centre-ville.", specialty: "Commerces de proximité au cœur de Cakranegara", tags: ["mall", "shopping", "centre-ville", "famille"], priceLevel: 1, priceRange: "Entrée libre", lat: -8.588175, lng: 116.119778,
    openingHours: "10:00–22:00 · à confirmer", source: { label: "Fiche Mataram Mall", url: "https://maps.apple.com/place?place-id=IF3B8FBDB416801D4", kind: "cartographie" },
  },
  {
    id: "transmart-mataram-cgv", name: "Transmart Mataram · CGV", zone: "Selaparang", category: "activite", subcategory: "cinéma & shopping",
    description: "Complexe commercial dont l’intérêt principal est le cinéma CGV. Vérifier les séances avant de se déplacer, la galerie pouvant être très calme.", specialty: "Cinéma CGV et sortie intérieure", tags: ["cinéma", "films", "mall", "famille", "climatisé"], priceLevel: 2, priceRange: "Billets selon séance", lat: -8.590648, lng: 116.146184,
    openingHours: "10:00–22:00 · selon les séances", vigilance: "Consulter la programmation CGV le jour même ; plusieurs espaces de la galerie peuvent être fermés.", source: { label: "Programmation CGV Mataram", url: "https://www.cgv.id/en/schedule/cinema/034", kind: "établissement" },
  },
  {
    id: "timezone-lombok-epicentrum", name: "Timezone Lombok Epicentrum", zone: "Punia · Epicentrum Mall niveau 2", category: "activite", subcategory: "arcade & social bowling",
    description: "Espace de loisirs intérieur avec jeux d’arcade, social bowling, bumper cars, réalité virtuelle et photobox au niveau 2 du mall.", specialty: "Arcade, bowling et jeux en famille", tags: ["arcade", "bowling", "VR", "famille", "climatisé"], priceLevel: 2, priceRange: "Crédits de jeu selon activité", lat: -8.593497, lng: 116.10468,
    openingHours: "10:00–22:00 · tous les jours", source: { label: "Timezone Lombok Epicentrum Mall", url: "https://www.timezonegames.com/id-id/lokasi/bali/lombok-epicentrum-mall/", kind: "établissement" },
  },
  {
    id: "rua-rasa-immersive-edupark", name: "Rua Rasa · Lombok Immersive Edupark", zone: "Rembiga · Selaparang", category: "activite", subcategory: "culture immersive",
    description: "Parcours immersif consacré à Lombok, complété par un café, une kid zone, une mushola et des démonstrations culturelles selon la programmation.", specialty: "Découverte immersive de Lombok en 60 à 90 minutes", tags: ["immersif", "culture", "famille", "enfants", "mushola", "café"], priceLevel: 1, priceRange: "Immersif 30k Rp · bundles selon formule", lat: -8.5658166, lng: 116.1235012,
    openingHours: "10:00–21:30 · tous les jours", phone: "+62 853-3877-719", bestTime: "après-midi", vigilance: "Les démonstrations et bundles sont saisonniers : consulter la programmation avant le déplacement.", source: { label: "Rua Rasa · site officiel", url: "https://ruarasa.com/", kind: "établissement" },
  },
  {
    id: "nirwana-waterpark-mataram", name: "Nirwana Waterpark", zone: "Rembiga · Selaparang", category: "activite", subcategory: "parc aquatique",
    description: "Parc aquatique urbain voisin de Rua Rasa, avec bassins, espaces extérieurs, parking et sanitaires pour une sortie en famille.", specialty: "Piscines et jeux d’eau près du centre", tags: ["piscine", "waterpark", "famille", "enfants", "extérieur"], priceLevel: 1, priceRange: "Tarif à confirmer · bundle possible avec Rua Rasa", lat: -8.5663069, lng: 116.1237993,
    openingHours: "08:00–18:00 · tous les jours · à confirmer", phone: "+62 370 7504583", bestTime: "matin", vigilance: "Tarifs, profondeur des bassins, surveillance et éventuelles fermetures techniques à vérifier le jour même.", source: { label: "Fiche d’accès Nirwana Waterpark", url: "https://www.waze.com/live-map/directions/nirwana-waterpark-jenderal-sudirman-mataram?to=place.w.76089010.761021175.8302576", kind: "cartographie" },
  },
  {
    id: "museum-negeri-ntb", name: "Museum Negeri Nusa Tenggara Barat", zone: "Taman Sari", category: "culture", subcategory: "musée régional",
    description: "Musée public consacré à l’histoire, aux arts, aux traditions et à la géologie de Lombok et Sumbawa, avec galeries, bibliothèque et espace audiovisuel.", specialty: "Comprendre Lombok avant de parcourir l’île", tags: ["musée", "histoire", "culture", "artisanat", "famille"], priceLevel: 1, priceRange: "2–7k Rp selon le public", lat: -8.585067, lng: 116.085886,
    openingHours: "Lun 10:00–16:00 · mar–jeu 08:00–16:00 · ven 08:00–17:00 · week-end 08:00–13:00", phone: "+62 897-3862-445", bestTime: "matin", source: { label: "Musée Negeri NTB · Ministère de la Culture", url: "https://museum.kemenbud.go.id/museum/profile/museum%2Bnegeri%2Bnusa%2Btenggara%2Bbarat", kind: "officiel" },
  },
  {
    id: "taman-sangkareang", name: "Taman Sangkareang", zone: "centre de Mataram", category: "activite", subcategory: "parc urbain & street-food",
    description: "Grande place végétalisée fréquentée pour marcher, courir, se retrouver et goûter aux stands de rue en fin de journée.", specialty: "Vie locale, jogging et petite restauration", tags: ["parc", "jogging", "street-food", "famille", "gratuit"], priceLevel: 1, priceRange: "Accès libre", lat: -8.583336, lng: 116.107116,
    openingHours: "Espace public · accès continu", bestTime: "17:00–21:00", source: { label: "Carte numérique officielle de Mataram", url: "https://peta-digital.mataramkota.go.id/", kind: "officiel" },
  },
  {
    id: "taman-udayana", name: "Taman Udayana", zone: "Monjok", category: "activite", subcategory: "promenade & cuisine locale",
    description: "Promenade urbaine ombragée appréciée des habitants, avec vendeurs de sate bulayak et animation en soirée.", specialty: "Balade locale et sate bulayak", tags: ["parc", "promenade", "sate bulayak", "famille", "gratuit"], priceLevel: 1, priceRange: "Accès libre", lat: -8.57213, lng: 116.102569,
    openingHours: "Espace public · accès continu", bestTime: "fin d’après-midi", source: { label: "SISPAR Nasional · Ministère du Tourisme", url: "https://sisparnas.kemenpar.go.id/p/31286", kind: "officiel" },
  },
  {
    id: "pantai-ampenan", name: "Pantai Ampenan", zone: "Ampenan", category: "plage", subcategory: "sunset & promenade",
    description: "Front de mer populaire à l’ouest de Mataram, animé par les promeneurs et les petits warungs au coucher du soleil.", specialty: "Coucher du soleil près de la ville", tags: ["plage", "sunset", "promenade", "warung", "local"], priceLevel: 1, priceRange: "Accès libre", lat: -8.570322, lng: 116.071888,
    openingHours: "Accès public", bestTime: "17:00–18:30", vigilance: "Ce front de mer est surtout adapté à la promenade ; vérifier l’état de la mer avant toute baignade.", source: { label: "Repère côtier d’Ampenan", url: "https://www.google.com/maps/search/?api=1&query=Pantai%20Ampenan%20Lombok", kind: "cartographie" },
  },
  {
    id: "taman-budaya-ntb", name: "Taman Budaya NTB", zone: "Majapahit", category: "culture", subcategory: "centre culturel & spectacles",
    description: "Centre culturel provincial accueillant expositions, spectacles, répétitions et événements artistiques selon la programmation.", specialty: "Arts de scène et événements culturels", tags: ["culture", "spectacle", "danse", "exposition", "événement"], priceLevel: 1, priceRange: "Selon l’événement", lat: -8.593588, lng: 116.099807,
    openingHours: "Selon la programmation", bestTime: "jour d’événement", source: { label: "Carte numérique officielle de Mataram", url: "https://peta-digital.mataramkota.go.id/", kind: "officiel" },
  },
  {
    id: "sate-rembiga-ibu-sinnaseh", name: "Sate Rembiga Ibu Sinnaseh", zone: "Rembiga", category: "restaurant", subcategory: "spécialité sasak",
    description: "Adresse familiale connue pour le sate rembiga : brochettes de bœuf marinées, sucrées, épicées et grillées à la commande.", specialty: "Sate rembiga au bœuf, recette historique", tags: ["sate rembiga", "sasak", "grillades", "local", "famille"], priceLevel: 1, priceRange: "25–50k Rp · à confirmer", lat: -8.561491, lng: 116.109288,
    openingHours: "09:00–22:00 · tous les jours", phone: "+62 819-1799-1747", source: { label: "Sate Rembiga Ibu Sinnaseh", url: "https://saterembigasinnaseh.com/", kind: "établissement" },
  },
  {
    id: "sate-rembiga-bu-ririn", name: "Sate Rembiga Utama Bu Ririn", zone: "Rembiga", category: "restaurant", subcategory: "spécialité sasak",
    description: "Warung de quartier centré sur les brochettes de bœuf de Rembiga et les accompagnements lombokois.", specialty: "Sate rembiga et repas local rapide", tags: ["sate rembiga", "sasak", "warung", "local"], priceLevel: 1, priceRange: "25–50k Rp · à confirmer", lat: -8.561767, lng: 116.109379,
    openingHours: "08:00–22:30 · à confirmer", phone: "+62 819-0900-0089", source: { label: "Fiche publique Bu Ririn", url: "https://wanderlog.com/place/details/2213626/warung-sate-rembiga-utama-bu-ririn", kind: "éditorial" },
  },
  {
    id: "roemah-langko-putera-lombok", name: "Roemah Langko by Putera Lombok", zone: "Langko", category: "restaurant", subcategory: "cuisine indonésienne & sasak",
    description: "Restaurant installé dans une maison de ville, proposant des plats indonésiens et des spécialités de Lombok dans un cadre calme.", specialty: "Cuisine sasak dans une maison traditionnelle", tags: ["sasak", "indonésien", "maison", "famille"], priceLevel: 2, priceRange: "50–150k Rp · à confirmer", lat: -8.576987, lng: 116.083799,
    openingHours: "11:00–21:00 · à confirmer", phone: "+62 370 630080", source: { label: "Fiche publique Roemah Langko", url: "https://wanderlog.com/place/details/2211104/roemah-langko-by-putera-lombok", kind: "éditorial" },
  },
  {
    id: "rollpin-mataram", name: "ROLLPIN Casual Smart Dine", zone: "Sayang Sayang", category: "restaurant", subcategory: "café-jardin & repas",
    description: "Café-restaurant spacieux dans un environnement végétalisé, adapté à un déjeuner tranquille ou à une session de travail avec Wi‑Fi.", specialty: "Café, repas et espace végétalisé", tags: ["café", "jardin", "wifi", "travail", "famille"], priceLevel: 2, priceRange: "50–150k Rp · à confirmer", lat: -8.572922, lng: 116.14515,
    openingHours: "08:00–21:30 · à confirmer", phone: "+62 823-4142-0010", source: { label: "Fiche publique ROLLPIN", url: "https://wanderlog.com/place/details/2672619", kind: "éditorial" },
  },
  {
    id: "maktal-coffee-bar", name: "Maktal Coffee Bar", zone: "Cakranegara", category: "restaurant", subcategory: "café & petit-déjeuner",
    description: "Café urbain pour prendre un café, petit-déjeuner ou travailler quelques heures au centre de Mataram.", specialty: "Café, petit-déjeuner et Wi‑Fi", tags: ["café", "petit-déjeuner", "wifi", "travail"], priceLevel: 1, priceRange: "25–75k Rp · à confirmer", lat: -8.587733, lng: 116.12234,
    openingHours: "07:30–22:00 · à confirmer", phone: "+62 370 6130624", bestTime: "matin", source: { label: "Fiche publique Maktal Coffee Bar", url: "https://wanderlog.com/place/details/2848362/maktal-coffee-bar", kind: "éditorial" },
  },
  {
    id: "elf-belly-mataram", name: "ELF BELLY", zone: "Airlangga", category: "restaurant", subcategory: "steakhouse & pâtisserie",
    description: "Table contemporaine réunissant viandes grillées, plats généreux et desserts dans le quartier d’Airlangga.", specialty: "Steaks, grillades et desserts", tags: ["steak", "grillades", "dessert", "dîner"], priceLevel: 3, priceRange: "100–250k Rp · à confirmer", lat: -8.584434, lng: 116.100944,
    openingHours: "14:00–22:00 · à confirmer", phone: "+62 852-3704-6409", source: { label: "ELF BELLY Steakhouse Lombok", url: "https://elfbellysteakhouselombok.com/", kind: "établissement" },
  },
  {
    id: "begibung-resto", name: "Begibung Resto", zone: "Cilinaya · Mataram Mall", category: "restaurant", subcategory: "cuisine lombok & indonésienne",
    description: "Restaurant accessible depuis Mataram Mall, pratique pour découvrir plusieurs plats indonésiens et lombokois en groupe.", specialty: "Repas indonésien à partager", tags: ["lombok", "indonésien", "famille", "groupe", "mall"], priceLevel: 2, priceRange: "35–75k Rp · à confirmer", lat: -8.588452, lng: 116.119737,
    openingHours: "10:00–23:00 · à confirmer", phone: "+62 370 631266", source: { label: "Fiche publique Begibung Resto", url: "https://wanderlog.com/place/details/2672617/begibung", kind: "éditorial" },
  },
];

export const mataramPlaces = mataramCatalog.map(createMataramPlace);
