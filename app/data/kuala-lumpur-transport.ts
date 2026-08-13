export type KualaLumpurTransportMode =
  | "walk"
  | "mrt"
  | "lrt"
  | "monorail"
  | "taxi"
  | "airport"
  | "baby";

export type KualaLumpurTransportEntry = {
  id: KualaLumpurTransportMode;
  title: string;
  summary: string;
  advice: string[];
  sourceLabel: string;
  sourceUrl: string;
  secondarySourceUrl?: string;
  lastVerifiedAt: string;
};

const verifiedAt = "2026-08-05";

/**
 * Repères éditoriaux : aucun horaire ni tarif n'est recopié ici afin que les
 * informations dynamiques restent consultées chez les opérateurs officiels.
 */
export const kualaLumpurTransportGuide: readonly KualaLumpurTransportEntry[] = [
  {
    id: "walk",
    title: "Marcher par quartier",
    summary: "Regroupez les visites proches plutôt que de traverser la ville à pied entre chaque étape.",
    advice: [
      "Construisez une boucle courte autour de KLCC, Bukit Bintang, Chinatown ou du centre historique.",
      "Vérifiez le trajet porte à porte avant de partir : trottoirs, traversées et passages couverts varient selon la rue.",
      "Gardez une option intérieure en cas de forte chaleur ou de pluie.",
    ],
    sourceLabel: "Guide officiel Tourism Malaysia — Kuala Lumpur",
    sourceUrl: "https://ebrochures.malaysia.travel/en/malaysia-travel-guide/kuala-lumpur/",
    lastVerifiedAt: verifiedAt,
  },
  {
    id: "mrt",
    title: "MRT",
    summary: "Les lignes Kajang et Putrajaya desservent plusieurs pôles utiles, dont Bukit Bintang, TRX et Persiaran KLCC.",
    advice: [
      "Utilisez le planificateur MyRapid avant chaque trajet et consultez l’état du service.",
      "Une correspondance indiquée sur le plan peut inclure une marche entre deux stations : lisez le détail du trajet.",
      "Les équipements sont documentés station par station par MRT Corp.",
    ],
    sourceLabel: "MyRapid — planificateur et état du réseau",
    sourceUrl: "https://myrapid.com.my/",
    secondarySourceUrl: "https://www.mymrt.com.my/projects/putrajaya-line/stations/persiaran-klcc/",
    lastVerifiedAt: verifiedAt,
  },
  {
    id: "lrt",
    title: "LRT",
    summary: "Le LRT complète le MRT pour rejoindre notamment KLCC, Masjid Jamek et KL Sentral.",
    advice: [
      "Cherchez votre origine et votre destination dans le Journey Planner officiel.",
      "Vérifiez l’état de la ligne le jour même : l’application ne fige ni fréquence, ni heure de dernier train.",
      "Prévoyez un peu de marge lorsque le trajet comporte une correspondance.",
    ],
    sourceLabel: "MyRapid — Journey Planner officiel",
    sourceUrl: "https://jp-web.myrapid.com.my/",
    secondarySourceUrl: "https://www.prasarana.com.my/rapid-rail/",
    lastVerifiedAt: verifiedAt,
  },
  {
    id: "monorail",
    title: "KL Monorail",
    summary: "Le monorail traverse une partie du centre et relie notamment KL Sentral, Bukit Bintang et Titiwangsa.",
    advice: [
      "Comparez-le au MRT ou au LRT dans le planificateur : le meilleur choix dépend de votre point de départ exact.",
      "Consultez les alertes MyRapid avant de rejoindre la station.",
      "À KL Sentral, suivez la signalétique locale pour la marche de correspondance.",
    ],
    sourceLabel: "MyRapid — réseau Rapid KL",
    sourceUrl: "https://myrapid.com.my/",
    secondarySourceUrl: "https://www.mot.gov.my/en/land/infrastructure/current-rail-services",
    lastVerifiedAt: verifiedAt,
  },
  {
    id: "taxi",
    title: "Grab, e-hailing et taxi",
    summary: "Une course porte à porte peut être utile avec des bagages, un bébé ou lorsque la gare est éloignée.",
    advice: [
      "Pour l’e-hailing, réservez uniquement dans l’application du prestataire et vérifiez plaque, conducteur et point de prise en charge.",
      "Consultez la liste officielle APAD des opérateurs agréés plutôt que de supposer qu’un service est autorisé.",
      "Pour un siège enfant, demandez une confirmation explicite au prestataire avant la course.",
    ],
    sourceLabel: "APAD — taxis et opérateurs e-hailing agréés",
    sourceUrl: "https://www.apad.gov.my/index.php/en/services/taxi-and-ehailing",
    lastVerifiedAt: verifiedAt,
  },
  {
    id: "airport",
    title: "Depuis ou vers l’aéroport",
    summary: "KLIA Ekspres et KLIA Transit relient KLIA T1 et T2 à KL Sentral, avec des parcours différents.",
    advice: [
      "KLIA Ekspres est le service direct ; KLIA Transit marque des arrêts intermédiaires.",
      "Vérifiez le terminal, le service choisi et l’horaire officiel juste avant le départ.",
      "Depuis KL Sentral, poursuivez en transport urbain, taxi ou e-hailing selon l’adresse finale.",
    ],
    sourceLabel: "KLIA Ekspres — transfert officiel vers Kuala Lumpur",
    sourceUrl: "https://www.kliaekspres.com/plan-your-trip/plan/faq-on-airport-transfer-by-train-to-kuala-lumpur-city/",
    secondarySourceUrl: "https://www.kliaekspres.com/schedule/",
    lastVerifiedAt: verifiedAt,
  },
  {
    id: "baby",
    title: "Avec un bébé ou une poussette",
    summary: "Le réseau donne des consignes spécifiques aux poussettes, mais l’accès réel doit être vérifié station par station.",
    advice: [
      "Rapid KL recommande de sécuriser l’enfant, d’utiliser le frein de la poussette dans le train et de franchir prudemment l’espace quai-train.",
      "Repérez les ascenseurs avant la correspondance ; MRT Corp publie les équipements de chaque station.",
      "Conservez une alternative porte à porte si un ascenseur est indisponible ou si la marche est trop longue.",
    ],
    sourceLabel: "Rapid KL — guide officiel d’utilisation et sécurité",
    sourceUrl: "https://myrapid.com.my/wp-content/uploads/2024/10/Booklet_Panduan-Penggunaan-Perkhidmatan-Rapid-KL_c.pdf",
    secondarySourceUrl: "https://www.mymrt.com.my/projects/kajang-line/stations/muzium-negara-kl-sentral/",
    lastVerifiedAt: verifiedAt,
  },
] as const;
