/**
 * Illustrations éditoriales du catalogue MyLombok.
 *
 * Ces visuels décrivent le sujet de la fiche, mais ne prétendent jamais avoir
 * été pris dans l'établissement ou sur le site nommé. Le mapping est explicite
 * pour éviter qu'un changement d'ordre du seed ne change les images.
 */

export type PlaceMediaSubject =
  | "asian-food"
  | "atm-banking"
  | "airport"
  | "artisan-market"
  | "bakery"
  | "beach-club"
  | "beach-sunset"
  | "beachfront-dining"
  | "beauty-wellness"
  | "boat-crossing"
  | "boat-excursion"
  | "brunch"
  | "clinic"
  | "coffee-shop"
  | "coastal-reserve"
  | "coworking"
  | "family-coworking"
  | "festival"
  | "ferry-port"
  | "fitness-coworking"
  | "forest"
  | "grill"
  | "historic-garden"
  | "historic-mosque"
  | "hospital"
  | "indonesian-warung"
  | "island-lunch"
  | "island-snorkeling"
  | "laundry"
  | "local-market"
  | "medical-emergency"
  | "mediterranean-food"
  | "mexican-food"
  | "mobile-internet"
  | "mosque"
  | "old-town"
  | "pharmacy"
  | "pizza-italian"
  | "pottery"
  | "ramen"
  | "rice-terraces"
  | "rocky-cove"
  | "sasak-village"
  | "scooter-rental"
  | "seaside-promenade"
  | "snorkeling-reef"
  | "spa-massage"
  | "surf-camp"
  | "surf-lesson"
  | "surf-wave"
  | "temple"
  | "tiny-island"
  | "tropical-beach"
  | "tropical-restaurant"
  | "vegetarian-food"
  | "volcanic-lake"
  | "volcano-trek"
  | "water-palace"
  | "waterfall"
  | "weaving"
  | "viewpoint-hike";

export type PlaceMediaInput = Readonly<{
  id: string;
  name: string;
  category?: string;
  subcategory?: string;
  city?: string;
}>;

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=82`;

const pexels = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;

const subjectLabels: Record<PlaceMediaSubject, string> = {
  "asian-food": "table de cuisine asiatique",
  "atm-banking": "service bancaire et paiement",
  airport: "aéroport et voyage aérien",
  "artisan-market": "marché d'artisanat local",
  bakery: "pains et pâtisseries artisanales",
  "beach-club": "beach club avec piscine et transats",
  "beach-sunset": "plage tropicale au coucher du soleil",
  "beachfront-dining": "restaurant en bord de mer",
  "beauty-wellness": "soin de beauté et bien-être",
  "boat-crossing": "traversée maritime en bateau",
  "boat-excursion": "excursion en bateau dans les îles",
  brunch: "brunch et café",
  clinic: "clinique médicale",
  "coffee-shop": "café de spécialité",
  "coastal-reserve": "réserve naturelle côtière",
  coworking: "espace de coworking",
  "family-coworking": "espace convivial pour travailler en famille",
  festival: "célébration culturelle en bord de mer",
  "ferry-port": "port et ferry",
  "fitness-coworking": "espace de travail et de sport",
  forest: "forêt tropicale",
  grill: "plats grillés",
  "historic-garden": "jardin historique indonésien",
  "historic-mosque": "mosquée historique",
  hospital: "établissement hospitalier",
  "indonesian-warung": "plats de warung indonésien",
  "island-lunch": "escale insulaire et déjeuner en bord de mer",
  "island-snorkeling": "îlot tropical et snorkeling",
  laundry: "blanchisserie et linge propre",
  "local-market": "marché local indonésien",
  "medical-emergency": "service médical d'urgence",
  "mediterranean-food": "table méditerranéenne",
  "mexican-food": "cuisine mexicaine",
  "mobile-internet": "téléphone et connexion mobile",
  mosque: "mosquée contemporaine",
  "old-town": "rue de quartier historique",
  pharmacy: "pharmacie et soins de première nécessité",
  "pizza-italian": "pizza et cuisine italienne",
  pottery: "poterie artisanale",
  ramen: "bol de ramen japonais",
  "rice-terraces": "rizières en terrasses",
  "rocky-cove": "crique tropicale rocheuse",
  "sasak-village": "village traditionnel indonésien",
  "scooter-rental": "scooter de location avec casque",
  "seaside-promenade": "promenade aménagée en bord de mer",
  "snorkeling-reef": "snorkeling sur un récif tropical",
  "spa-massage": "massage dans un spa",
  "surf-camp": "séjour surf près de l'océan",
  "surf-lesson": "cours de surf dans les vagues",
  "surf-wave": "vague et surf tropical",
  temple: "temple indonésien",
  "tiny-island": "petit îlot tropical",
  "tropical-beach": "baie et plage tropicales",
  "tropical-restaurant": "restaurant tropical convivial",
  "vegetarian-food": "assiette végétale colorée",
  "volcanic-lake": "lac volcanique de montagne",
  "volcano-trek": "trek sur un volcan",
  "water-palace": "palais d'eau et jardins historiques",
  waterfall: "cascade en forêt tropicale",
  weaving: "tissage artisanal traditionnel",
  "viewpoint-hike": "randonnée vers un point de vue",
};

/**
 * Pools par sujet. Les URL sont directes et stables ; aucune URL de recherche
 * aléatoire n'est utilisée. Une même fiche conservera donc toujours son image.
 */
export const semanticPhotoPools: Record<PlaceMediaSubject, readonly string[]> = {
  "asian-food": [unsplash("photo-1562565652-a0d8f0c59eb4"), pexels(699953), unsplash("photo-1551183053-bf91a1d81141")],
  "atm-banking": [pexels(4386366), pexels(4968630), unsplash("photo-1563013544-824ae1b704d3")],
  airport: [unsplash("photo-1436491865332-7a61a109cc05"), pexels(358220), pexels(210182)],
  "artisan-market": [pexels(1488463), pexels(2474689), unsplash("photo-1488459716781-31db52582fe9")],
  bakery: [unsplash("photo-1509440159596-0249088772ff"), pexels(2067396), pexels(1855214)],
  "beach-club": [pexels(261102), pexels(1450353), unsplash("photo-1540202404-a2f29016b523")],
  "beach-sunset": [unsplash("photo-1507525428034-b723cf961d3e"), pexels(457882), pexels(994605)],
  "beachfront-dining": [unsplash("photo-1559339352-11d035aa65de"), pexels(262978), unsplash("photo-1510414842594-a61c69b5ae57")],
  "beauty-wellness": [pexels(3738369), unsplash("photo-1540555700478-4be289fbecef"), pexels(3997989)],
  "boat-crossing": [unsplash("photo-1544550285-f813152fb2fd"), pexels(730778), unsplash("photo-1500375592092-40eb2168fd21")],
  "boat-excursion": [unsplash("photo-1528127269322-539801943592"), unsplash("photo-1544550285-f813152fb2fd"), unsplash("photo-1540202404-a2f29016b523")],
  brunch: [unsplash("photo-1482049016688-2d3e1b311543"), pexels(376464), unsplash("photo-1490645935967-10de6ba17061"), unsplash("photo-1565958011703-44f9829ba187")],
  clinic: [unsplash("photo-1538108149393-fbbd81895907"), pexels(3845126), pexels(263402)],
  "coffee-shop": [unsplash("photo-1495474472287-4d71bcdd2085"), pexels(302899), pexels(312418), unsplash("photo-1533777857889-4be7c70b33f7")],
  "coastal-reserve": [unsplash("photo-1510414842594-a61c69b5ae57"), unsplash("photo-1507525428034-b723cf961d3e"), pexels(248797)],
  coworking: [unsplash("photo-1497366754035-f200968a6e72"), unsplash("photo-1497366811353-6870744d04b2"), pexels(1181244), pexels(1957477)],
  "family-coworking": [pexels(3184465), unsplash("photo-1522071820081-009f0129c71c"), pexels(1181406)],
  festival: [pexels(1190297), pexels(3225531), unsplash("photo-1492684223066-81342ee5ff30")],
  "ferry-port": [pexels(730778), unsplash("photo-1544550285-f813152fb2fd"), unsplash("photo-1500375592092-40eb2168fd21")],
  "fitness-coworking": [pexels(1954524), pexels(1552242), unsplash("photo-1534438327276-14e5300c3a48")],
  forest: [unsplash("photo-1441974231531-c6227db76b6e"), unsplash("photo-1511497584788-876760111969"), pexels(1671325)],
  grill: [unsplash("photo-1504674900247-0877df9cc836"), pexels(769289), pexels(3026808)],
  "historic-garden": [pexels(1450353), unsplash("photo-1472396961693-142e6e269027"), pexels(1470502)],
  "historic-mosque": [pexels(1537086), unsplash("photo-1585036156171-384164a8c675"), pexels(2166559)],
  hospital: [unsplash("photo-1519494026892-80bbd2d6fd0d"), pexels(236380), pexels(263402)],
  "indonesian-warung": [pexels(699953), unsplash("photo-1562565652-a0d8f0c59eb4"), unsplash("photo-1543353071-873f17a7a088"), unsplash("photo-1476224203421-9ac39bcb3327")],
  "island-lunch": [unsplash("photo-1559339352-11d035aa65de"), unsplash("photo-1540202404-a2f29016b523"), pexels(1450353)],
  "island-snorkeling": [unsplash("photo-1544551763-46a013bb70d5"), unsplash("photo-1518509562904-e7ef99cdcc86"), pexels(1430677)],
  laundry: [pexels(5591581), pexels(8774475), unsplash("photo-1517677208171-0bc6725a3e60")],
  "local-market": [unsplash("photo-1488459716781-31db52582fe9"), pexels(1488463), pexels(264636)],
  "medical-emergency": [pexels(263402), unsplash("photo-1576091160399-112ba8d25d1d"), pexels(3845126)],
  "mediterranean-food": [unsplash("photo-1473093295043-cdd812d0e601"), unsplash("photo-1563379926898-05f4575a45d8"), pexels(1640777)],
  "mexican-food": [unsplash("photo-1543353071-873f17a7a088"), pexels(461198), pexels(5737247)],
  "mobile-internet": [unsplash("photo-1511707171634-5f897ff02aa9"), pexels(607812), pexels(356056)],
  mosque: [unsplash("photo-1585036156171-384164a8c675"), pexels(1537086), pexels(2166559)],
  "old-town": [unsplash("photo-1527631746610-bca00a040d60"), pexels(2901209), pexels(1488463)],
  pharmacy: [pexels(4481259), pexels(3683074), pexels(263402)],
  "pizza-italian": [unsplash("photo-1565299624946-b28f40a0ae38"), pexels(825661), pexels(1566837), unsplash("photo-1473093295043-cdd812d0e601")],
  pottery: [pexels(2350366), pexels(377903), unsplash("photo-1610701596007-11502861dcfa")],
  ramen: [unsplash("photo-1569718212165-3a8278d5f624"), pexels(884600), unsplash("photo-1551183053-bf91a1d81141")],
  "rice-terraces": [unsplash("photo-1537996194471-e657df975ab4"), pexels(2166553), pexels(210186)],
  "rocky-cove": [unsplash("photo-1510414842594-a61c69b5ae57"), unsplash("photo-1518509562904-e7ef99cdcc86"), pexels(248797)],
  "sasak-village": [pexels(210186), pexels(2166559), unsplash("photo-1528181304800-259b08848526")],
  "scooter-rental": [pexels(2611690), unsplash("photo-1558981806-ec527fa84c39")],
  "seaside-promenade": [pexels(994605), unsplash("photo-1518509562904-e7ef99cdcc86"), pexels(457882)],
  "snorkeling-reef": [unsplash("photo-1544551763-46a013bb70d5"), unsplash("photo-1546026423-cc4642628d2b"), pexels(1430677)],
  "spa-massage": [pexels(3757942), pexels(3865676), unsplash("photo-1600334089648-b0d9d3028eb2")],
  "surf-camp": [unsplash("photo-1502680390469-be75c86b636f"), pexels(416676), unsplash("photo-1455729552865-3658a5d39692")],
  "surf-lesson": [pexels(416676), unsplash("photo-1502680390469-be75c86b636f"), unsplash("photo-1455729552865-3658a5d39692")],
  "surf-wave": [unsplash("photo-1502680390469-be75c86b636f"), pexels(416676), unsplash("photo-1540206395-68808572332f")],
  temple: [pexels(210186), pexels(2166559), unsplash("photo-1528181304800-259b08848526")],
  "tiny-island": [unsplash("photo-1540202404-a2f29016b523"), pexels(3601425), unsplash("photo-1518509562904-e7ef99cdcc86")],
  "tropical-beach": [unsplash("photo-1507525428034-b723cf961d3e"), unsplash("photo-1518509562904-e7ef99cdcc86"), pexels(457882), pexels(248797)],
  "tropical-restaurant": [unsplash("photo-1533777857889-4be7c70b33f7"), unsplash("photo-1559339352-11d035aa65de"), pexels(262978)],
  "vegetarian-food": [unsplash("photo-1547592180-85f173990554"), unsplash("photo-1512621776951-a57141f2eefd"), unsplash("photo-1546069901-ba9599a7e63c"), pexels(1640777)],
  "volcanic-lake": [unsplash("photo-1470770841072-f978cf4d019e"), unsplash("photo-1501785888041-af3ef285b470"), pexels(417074)],
  "volcano-trek": [unsplash("photo-1464822759023-fed622ff2c3b"), unsplash("photo-1501785888041-af3ef285b470"), pexels(691668)],
  "water-palace": [pexels(210186), pexels(2166559), unsplash("photo-1472396961693-142e6e269027")],
  waterfall: [unsplash("photo-1433086966358-54859d0ed716"), unsplash("photo-1432405972618-c60b0225b8f9"), pexels(2101187), pexels(753626)],
  weaving: [pexels(373289), pexels(6192337), unsplash("photo-1603252110481-7ba873bf42ab")],
  "viewpoint-hike": [unsplash("photo-1501785888041-af3ef285b470"), unsplash("photo-1469474968028-56623f02e42e"), unsplash("photo-1500534314209-a25ddb2bd429"), pexels(691668)],
};

/** Mapping revu fiche par fiche pour les 128 entrées actuellement exportées. */
export const placeMediaSubjectById = {
  "kenza-cafe": "brunch",
  elamu: "mediterranean-food",
  "cantina-mexicana": "mexican-food",
  "papi-sapi": "grill",
  "the-shack": "pizza-italian",
  munchies: "brunch",
  "la-cabana": "mediterranean-food",
  treehouse: "tropical-restaurant",
  "ramen-otaku": "ramen",
  bara: "bakery",
  "warung-suka-suka": "vegetarian-food",
  "the-warung": "indonesian-warung",
  "luis-warung": "indonesian-warung",
  "warung-flora": "indonesian-warung",
  "warung-ombak": "indonesian-warung",
  "dina-warung": "indonesian-warung",
  "warung-bu-de": "indonesian-warung",
  "uma-blu": "brunch",
  "jelajah-coffee": "coffee-shop",
  "honey-jack": "brunch",
  "alchemist-coffee": "coffee-shop",
  milk: "brunch",
  piccolo: "coffee-shop",
  "pantai-kuta": "tropical-beach",
  "pantai-seger": "surf-wave",
  "mandalika-beach": "tropical-beach",
  "mawi-beach": "surf-wave",
  "mandalika-beach-club": "beach-club",
  "mandalika-beach-park": "seaside-promenade",
  "bukit-merese": "viewpoint-hike",
  "kuta-lombok-surf-school": "surf-lesson",
  "heartbeach-surf": "surf-lesson",
  "surf-cult": "surf-lesson",
  "paradise-surfschool": "surf-lesson",
  "surf-camp-lombok": "surf-camp",
  "lmbk-surf-house": "surf-camp",
  "loys-scooter": "scooter-rental",
  "bojil-scooter": "scooter-rental",
  "scooter-lombok-transport": "scooter-rental",
  "easy-rides": "scooter-rental",
  "scooter-kuta-mandalika": "scooter-rental",
  "matcha-spa": "spa-massage",
  "glaze-wellness": "beauty-wellness",
  "oasis-spa": "spa-massage",
  "vip-spa": "spa-massage",
  "orelia-spa": "spa-massage",
  "karia-coworking": "coworking",
  "xeno-hub": "fitness-coworking",
  "the-spot": "coworking",
  "the-well": "family-coworking",
  "kuta-emergency": "medical-emergency",
  "k2-clinic": "clinic",
  "golden-medical": "clinic",
  "kuta-medical-service": "pharmacy",
  "lasingan-laundry": "laundry",
  "benning-laundry": "laundry",
  "espresso-laundry": "laundry",
  "nana-laundry": "laundry",
  "desa-sade": "sasak-village",
  "desa-ende": "sasak-village",
  "sukarara-weaving": "weaving",
  "penujak-pottery": "pottery",
  "pasar-seni-kuta": "artisan-market",
  "bau-nyale-mandalika": "festival",
  "rinjani-trek": "volcano-trek",
  "gili-air-day": "island-snorkeling",
  "selong-belanak": "surf-lesson",
  "masjid-nurul-bilad": "mosque",
  "masjid-hubbul-wathan": "mosque",
  "ashtari-kuta": "tropical-restaurant",
  "el-bazar-kuta": "mediterranean-food",
  "krnk-kuta": "grill",
  "bush-radio-kuta": "coffee-shop",
  "mama-pizza-kuta": "pizza-italian",
  "terra-kuta": "vegetarian-food",
  "markisa-kuta": "indonesian-warung",
  "square-senggigi": "tropical-restaurant",
  "cafe-alberto-senggigi": "beachfront-dining",
  "pituq-gili-trawangan": "vegetarian-food",
  "pachamama-gili-air": "vegetarian-food",
  "scallywags-gili-air": "beachfront-dining",
  "baleoli-beach": "beachfront-dining",
  "tanjung-aan": "tropical-beach",
  "mawun-beach": "tropical-beach",
  "are-guling-beach": "surf-wave",
  "gerupuk-bay": "surf-wave",
  "ekas-beach": "surf-wave",
  "pink-beach-tangsi": "snorkeling-reef",
  "nipah-beach": "beach-sunset",
  "klui-beach": "tropical-beach",
  "sire-beach": "snorkeling-reef",
  "semetti-beach": "rocky-cove",
  "nambung-beach": "tropical-beach",
  "torok-aik-belek": "rocky-cove",
  "sendang-gile": "waterfall",
  "tiu-kelep": "waterfall",
  "benang-stokel": "waterfall",
  "benang-kelambu": "waterfall",
  "jeruk-manis": "waterfall",
  "mangku-sakti": "waterfall",
  "bukit-pergasingan": "viewpoint-hike",
  "bukit-selong": "viewpoint-hike",
  "tetebatu-rice-terraces": "rice-terraces",
  "gunung-tunak": "coastal-reserve",
  "pusuk-monkey-forest": "forest",
  "segara-anak": "volcanic-lake",
  "narmada-park": "historic-garden",
  "mayura-water-palace": "water-palace",
  "pura-lingsar": "temple",
  "pura-meru": "temple",
  "banyumulek-pottery": "pottery",
  "ampuan-old-town": "old-town",
  "cakranegara-market": "local-market",
  "bayan-beleq-mosque": "historic-mosque",
  "gili-nanggu": "island-snorkeling",
  "gili-kedis": "tiny-island",
  "gili-sudak": "island-lunch",
  "gili-meno": "tiny-island",
  "gili-trawangan": "tropical-beach",
  "gili-air": "island-snorkeling",
  "pink-beach-boat": "boat-excursion",
  "bangsal-public-boat": "boat-crossing",
  "zainuddin-airport": "airport",
  "rsud-ntb": "hospital",
  "siloam-mataram": "hospital",
  "grapari-mataram": "mobile-internet",
  "lembar-port": "ferry-port",
  "kayangan-port": "ferry-port",
  "epicentrum-atm": "atm-banking",
} as const satisfies Record<string, PlaceMediaSubject>;

/**
 * Overrides photographiques revus individuellement.
 *
 * Le pool thématique reste le fallback de toutes les autres fiches, tandis
 * que ces lieux utilisent un cadrage précis lorsque le tirage déterministe du
 * pool racontait une autre expérience (ex. montgolfière pour une école de
 * surf, cascade pour une plage ou moto de route pour une location de scooter).
 */
export const placePhotoOverrideById = {
  "heartbeach-surf": unsplash("photo-1502680390469-be75c86b636f"),
  "desa-sade": unsplash("photo-1578019448201-09ad2ac7995a"),
  "desa-ende": unsplash("photo-1722252800239-09e07ce47679"),
  "sukarara-weaving": unsplash("photo-1707716312213-b1dee92f147a"),
  "pasar-seni-kuta": unsplash("photo-1617646160236-db27e21e4efe"),
  "narmada-park": unsplash("photo-1761565655572-55d5fc2174e0"),
  "mayura-water-palace": unsplash("photo-1759577499556-047b9c8db09b"),
  "pura-lingsar": unsplash("photo-1768834108238-86eb85d88b90"),
  "ampuan-old-town": unsplash("photo-1667438698939-5fbe5cb7684b"),
  "masjid-nurul-bilad": unsplash("photo-1744521671392-2a5dd0b1c48a"),
  "masjid-hubbul-wathan": unsplash("photo-1754437959922-066736c73051"),
  "bayan-beleq-mosque": unsplash("photo-1746102268391-a17760aff398"),
  "pura-meru": unsplash("photo-1577457834047-04d541e0eb77"),

  "sendang-gile": unsplash("photo-1737493453364-7f55ed44e155"),
  "jeruk-manis": unsplash("photo-1512005654819-3e01846b1a16"),
  "mangku-sakti": unsplash("photo-1572579836286-62a9c35baf79"),
  "tetebatu-rice-terraces": unsplash("photo-1744887081162-fd86aaed07ec"),
  "rinjani-trek": unsplash("photo-1710168833758-3cdceee3b8b7"),
  "segara-anak": unsplash("photo-1741845303120-61daa348ecd0"),
  "bukit-merese": unsplash("photo-1532506182952-9aaa2633962a"),

  "loys-scooter": unsplash("photo-1712213248719-aade0e02a591"),
  "bojil-scooter": unsplash("photo-1669279185574-5e4448a03ba6"),
  "scooter-lombok-transport": unsplash("photo-1746816803712-546a59f08e0d"),
  "easy-rides": unsplash("photo-1550039082-d8572c2ba1a4"),
  "scooter-kuta-mandalika": unsplash("photo-1619523704113-0a8c9596a89f"),
  "bangsal-public-boat": unsplash("photo-1752549873830-6905cfbd9ffc"),
  "zainuddin-airport": pexels(358220),
  "lembar-port": unsplash("photo-1752549873830-6905cfbd9ffc"),
  "kayangan-port": unsplash("photo-1752549873830-6905cfbd9ffc"),

  "mandalika-beach-park": unsplash("photo-1759437345059-d45329d72dcc"),
  "selong-belanak": unsplash("photo-1536517076075-e9cc97d4993a"),
  "cafe-alberto-senggigi": unsplash("photo-1559339352-11d035aa65de"),
  "mandalika-beach-club": pexels(261102),
  "pink-beach-tangsi": unsplash("photo-1658642017201-45bb87756f1b"),
  "gili-sudak": unsplash("photo-1559339352-11d035aa65de"),
  "pink-beach-boat": unsplash("photo-1658642017201-45bb87756f1b"),
  "gili-air-day": unsplash("photo-1544551763-46a013bb70d5"),
} as const satisfies Record<string, string>;

function stableIndex(value: string, modulo: number) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % modulo;
}

function inferSubject(place: PlaceMediaInput): PlaceMediaSubject {
  const text = `${place.category ?? ""} ${place.subcategory ?? ""}`.toLocaleLowerCase("fr");
  if (/restaurant|warung/.test(text)) return "indonesian-warung";
  if (/plage/.test(text)) return "tropical-beach";
  if (/cascade/.test(text)) return "waterfall";
  if (/surf/.test(text)) return "surf-wave";
  if (/mosquée/.test(text)) return "mosque";
  if (/culture|temple|patrimoine/.test(text)) return "sasak-village";
  if (/excursion|île|bateau/.test(text)) return "boat-excursion";
  if (/nature|trek|randonnée/.test(text)) return "viewpoint-hike";
  return "tropical-restaurant";
}

export function semanticPhotoSubject(place: PlaceMediaInput): PlaceMediaSubject {
  return placeMediaSubjectById[place.id as keyof typeof placeMediaSubjectById] ?? inferSubject(place);
}

export function semanticPhotoForPlace(place: PlaceMediaInput): string {
  const override = placePhotoOverrideById[place.id as keyof typeof placePhotoOverrideById];
  if (override) return override;

  const subject = semanticPhotoSubject(place);
  const pool = semanticPhotoPools[subject];
  return pool[stableIndex(place.id, pool.length)];
}

export function semanticPhotoFallback(place: PlaceMediaInput): string {
  const subject = semanticPhotoSubject(place);
  const pool = semanticPhotoPools[subject];
  return pool[(stableIndex(place.id, pool.length) + 1) % pool.length];
}

export function semanticPhotoAlt(place: PlaceMediaInput): string {
  const subject = semanticPhotoSubject(place);
  return `Illustration éditoriale : ${subjectLabels[subject]} à Lombok. Ce visuel n'est pas une photo de ${place.name}.`;
}
