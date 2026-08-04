export const conciergeServices = [
  {
    slug: "transferts-arrivee",
    query: "transfert",
    icon: "plane",
    eyebrow: "Arrivée et départ",
    title: "Transferts et arrivée",
    promise: "Préparer le premier ou le dernier trajet avec les informations utiles réunies au même endroit.",
    description:
      "MyLombok vous aide à formuler une demande complète depuis un aéroport ou un port vers votre hébergement. Le trajet reste à confirmer avec le prestataire avant votre départ.",
    benefitTitle: "Une arrivée plus lisible, sans fausse promesse.",
    benefit:
      "Horaires, point d’arrivée, destination, nombre de voyageurs et bagages sont regroupés dans un seul message. Vous gardez la main sur le choix final et sur les conditions communiquées par le prestataire.",
    steps: [
      {
        title: "Vous partagez le trajet",
        text: "Indiquez votre vol ou bateau, l’heure prévue, votre destination, le nombre de passagers et les bagages particuliers.",
      },
      {
        title: "Nous clarifions la demande",
        text: "MyLombok vérifie que les éléments nécessaires sont présents et peut rechercher un contact adapté au besoin exprimé.",
      },
      {
        title: "Vous validez les conditions",
        text: "Disponibilité, lieu de rendez-vous, tarif et mode de règlement sont confirmés avec le prestataire avant tout engagement.",
      },
    ],
    useful: [
      "Préparez le numéro du vol ou du bateau et l’heure d’arrivée prévue.",
      "Signalez les bagages volumineux, les besoins enfant ou toute contrainte de mobilité.",
      "Les horaires, prix et disponibilités peuvent évoluer et doivent être confirmés avant le trajet.",
    ],
    related: ["mobilite-ile", "organisation-sejour"],
  },
  {
    slug: "mobilite-ile",
    query: "mobilite",
    icon: "car",
    eyebrow: "Se déplacer à Lombok",
    title: "Mobilité sur l’île",
    promise: "Choisir entre scooter, voiture ou chauffeur selon vos trajets et votre niveau de confort.",
    description:
      "MyLombok vous aide à cadrer le besoin avant la mise en relation. Le véhicule, les documents demandés, l’assurance, le dépôt et les conditions restent à vérifier directement avec le prestataire.",
    benefitTitle: "Un choix guidé par votre usage réel.",
    benefit:
      "Plutôt que de choisir un véhicule par défaut, vous partez de vos zones de séjour, de votre expérience de conduite, du nombre de voyageurs et des trajets envisagés.",
    steps: [
      {
        title: "Vous décrivez vos déplacements",
        text: "Précisez vos dates, vos étapes, le nombre de voyageurs et votre préférence entre autonomie et chauffeur.",
      },
      {
        title: "Nous cadrons les options",
        text: "MyLombok vous aide à identifier la solution cohérente et les questions à poser au prestataire.",
      },
      {
        title: "Vous contrôlez avant de partir",
        text: "Vous confirmez le véhicule, les documents, l’état des lieux, l’assurance, le prix et les modalités de restitution.",
      },
    ],
    useful: [
      "Vérifiez avant toute location que vos permis et votre assurance couvrent réellement le véhicule choisi.",
      "Demandez par écrit ce qui est inclus, le dépôt éventuel et la procédure en cas de problème.",
      "Ne choisissez pas un scooter si votre expérience ou les conditions de route ne vous mettent pas à l’aise.",
    ],
    related: ["transferts-arrivee", "organisation-sejour"],
  },
  {
    slug: "activites-excursions",
    query: "activite",
    icon: "compass",
    eyebrow: "Expériences locales",
    title: "Activités et excursions",
    promise: "Repérer des expériences compatibles avec votre zone, votre rythme et les conditions du moment.",
    description:
      "MyLombok vous aide à transformer une envie en demande exploitable. Le déroulement, le niveau requis, la météo, le matériel et les conditions d’annulation sont confirmés auprès de l’opérateur.",
    benefitTitle: "Moins de listes, plus de contexte.",
    benefit:
      "La sélection part de vos dates, de votre lieu de séjour, de votre expérience et de ce que vous ne voulez pas. Vous pouvez ainsi écarter plus vite les options peu adaptées.",
    steps: [
      {
        title: "Vous posez le cadre",
        text: "Partagez vos dates, votre zone, votre niveau, le nombre de participants et vos envies prioritaires.",
      },
      {
        title: "Nous préparons une sélection",
        text: "MyLombok repère les options pertinentes dans le carnet ou auprès de contacts locaux disponibles.",
      },
      {
        title: "Vous confirmez avec l’opérateur",
        text: "Horaire, inclusions, équipement, conditions météo, sécurité, annulation et paiement sont validés avant l’activité.",
      },
    ],
    useful: [
      "Indiquez l’âge des participants, leur niveau et toute contrainte de santé ou de mobilité pertinente.",
      "Pour la mer, le surf ou la montagne, demandez toujours comment les conditions du jour influencent la sortie.",
      "Une activité affichée dans Explorer n’implique ni disponibilité ni réservation automatique.",
    ],
    related: ["organisation-sejour", "demande-particuliere"],
  },
  {
    slug: "restaurants-occasions",
    query: "restaurant",
    icon: "restaurant",
    eyebrow: "Tables et moments à célébrer",
    title: "Restaurants et occasions",
    promise: "Chercher une table ou une attention particulière à partir de l’ambiance réellement souhaitée.",
    description:
      "MyLombok peut vous aider à identifier un lieu et à préparer la prise de contact. La réservation, le menu, les informations alimentaires et les conditions sont confirmés directement avec l’établissement.",
    benefitTitle: "Une recommandation qui part de votre moment.",
    benefit:
      "Dîner simple, vue, groupe, anniversaire ou contrainte alimentaire : la demande est formulée avec suffisamment de contexte pour éviter une recommandation générique.",
    steps: [
      {
        title: "Vous décrivez l’occasion",
        text: "Précisez la date, la zone, le nombre de personnes, l’ambiance, le budget indicatif et les besoins alimentaires.",
      },
      {
        title: "Nous affinons les pistes",
        text: "MyLombok s’appuie sur le carnet et les informations disponibles pour proposer des lieux cohérents à contacter.",
      },
      {
        title: "Vous confirmez avec le lieu",
        text: "Disponibilité, menu, allergènes, information halal, acompte éventuel et conditions finales sont validés avec le restaurant.",
      },
    ],
    useful: [
      "Mentionnez clairement les allergies et demandez une confirmation directe à l’établissement.",
      "Les mentions halal ne sont affichées dans l’application que lorsqu’une information exploitable est disponible ; vérifiez-les selon vos exigences.",
      "Les menus, prix et horaires peuvent changer sans préavis.",
    ],
    related: ["organisation-sejour", "demande-particuliere"],
  },
  {
    slug: "organisation-sejour",
    query: "sejour",
    icon: "route",
    eyebrow: "Préparer sans surcharger",
    title: "Organisation du séjour",
    promise: "Relier vos dates, vos étapes et vos priorités dans un programme réaliste et encore modifiable.",
    description:
      "MyLombok vous aide à poser une structure de séjour et les réservations à anticiper. Ce programme reste une proposition de travail : chaque transport, activité ou table doit être confirmé séparément.",
    benefitTitle: "Un fil conducteur, pas un voyage chronométré.",
    benefit:
      "Vous visualisez les zones qui vont bien ensemble, les déplacements à anticiper et les moments à laisser libres, sans remplir chaque heure de votre séjour.",
    steps: [
      {
        title: "Vous partagez vos priorités",
        text: "Dates, hébergements déjà choisis, rythme, envies, contraintes et incontournables servent de point de départ.",
      },
      {
        title: "Nous structurons les étapes",
        text: "MyLombok vous aide à organiser les zones et à repérer les demandes qui méritent d’être lancées en avance.",
      },
      {
        title: "Vous arbitrez et confirmez",
        text: "Vous ajustez le programme, puis validez séparément les disponibilités et conditions avec chaque prestataire concerné.",
      },
    ],
    useful: [
      "Partagez ce qui est déjà réservé pour éviter les doublons et les trajets inutiles.",
      "Gardez des marges pour les temps de route, la météo et les changements d’envie.",
      "MyLombok ne réserve ni ne débite automatiquement aucun service depuis cette page.",
    ],
    related: ["transferts-arrivee", "activites-excursions"],
  },
  {
    slug: "demande-particuliere",
    query: "autre",
    icon: "message",
    eyebrow: "Un besoin hors catégorie",
    title: "Demande particulière",
    promise: "Commencer par votre situation concrète lorsque les catégories habituelles ne suffisent pas.",
    description:
      "MyLombok clarifie votre demande et vous indique honnêtement si elle entre dans le périmètre de la conciergerie. Une conversation n’implique ni acceptation ni engagement automatique.",
    benefitTitle: "Un point d’entrée simple pour les cas moins simples.",
    benefit:
      "Vous n’avez pas à choisir la mauvaise catégorie. Décrivez le résultat recherché, vos dates et vos contraintes ; MyLombok peut ensuite proposer une prochaine étape ou signaler ses limites.",
    steps: [
      {
        title: "Vous expliquez le besoin",
        text: "Décrivez la situation, le résultat attendu, l’échéance et les personnes concernées, sans transmettre de document sensible.",
      },
      {
        title: "Nous vérifions le périmètre",
        text: "MyLombok précise ce qui peut être accompagné, ce qui doit être confirmé et, si possible, vers quel type d’interlocuteur vous orienter.",
      },
      {
        title: "Vous choisissez la suite",
        text: "Vous recevez les informations disponibles et décidez vous-même de poursuivre ou non avec le contact concerné.",
      },
    ],
    useful: [
      "N’envoyez pas de passeport, coordonnées bancaires ou autre document sensible dans le premier message.",
      "Pour une urgence immédiate, contactez directement les services d’urgence compétents plutôt que la conciergerie.",
      "La possibilité d’aider dépend de la nature de la demande et des interlocuteurs disponibles.",
    ],
    related: ["organisation-sejour", "activites-excursions"],
  },
] as const;

export type ConciergeService = (typeof conciergeServices)[number];
export type ConciergeServiceSlug = ConciergeService["slug"];

export function getConciergeService(slug: string) {
  return conciergeServices.find((service) => service.slug === slug);
}
