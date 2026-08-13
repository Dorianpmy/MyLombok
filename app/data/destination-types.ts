export type DestinationId = "lombok" | "kuala-lumpur";

export type DestinationModule =
  | "explore"
  | "map"
  | "activities"
  | "trip"
  | "concierge"
  | "expatriation";

export type Destination = {
  id: DestinationId;
  slug: DestinationId;
  name: string;
  country: string;
  shortName: string;
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  bounds: [[number, number], [number, number]];
  defaultZoom: number;
  heroImage: string;
  heroImageAlt: string;
  heroImageCredit?: string;
  heroImageSourceUrl?: string;
  timezone: string;
  currency: string;
  languageCodes: string[];
  enabledModules: Record<DestinationModule, boolean>;
  badges: string[];
};

export type TravelPlaceCategory =
  | "attraction"
  | "family"
  | "food"
  | "market"
  | "mosque"
  | "culture"
  | "shopping"
  | "park"
  | "viewpoint"
  | "neighborhood"
  | "practical"
  | "transport";

export type TravelPlaceTag =
  | "family-friendly"
  | "baby-friendly"
  | "stroller-friendly"
  | "indoor"
  | "outdoor"
  | "rain-friendly"
  | "halal-verified"
  | "halal-to-check"
  | "prayer-room"
  | "mosque-nearby"
  | "free"
  | "evening"
  | "short-visit"
  | "booking-recommended"
  | "near-klcc"
  | "air-conditioned";

export type VerificationStatus = "verified" | "to-check" | "archived";

export type PlaceImage = {
  src: string;
  alt: string;
  credit?: string;
  sourceUrl?: string;
};

export type StructuredOpeningHours = {
  label: string;
  sourceUrl: string;
  verifiedAt: string;
};

export type FamilyInformation = {
  babyFriendly?: boolean;
  strollerFriendly?: boolean;
  babyChangingAvailable?: boolean;
  indoor?: boolean;
  airConditioned?: boolean;
  quietAreaAvailable?: boolean;
  feedingFriendly?: boolean;
  estimatedWalkingMinutes?: number;
  stairsOrDifficultAccess?: string;
  familyNotes?: string;
  sourceUrl?: string;
};

export type TravelPlace = {
  id: string;
  slug: string;
  destinationId: DestinationId;
  name: string;
  category: TravelPlaceCategory;
  shortDescription: string;
  description?: string;
  whyGo?: string;
  neighborhood?: string;
  address?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  images: PlaceImage[];
  tags: TravelPlaceTag[];
  estimatedDuration?: {
    minMinutes: number;
    maxMinutes: number;
  };
  priceLevel?: "free" | "low" | "medium" | "high";
  openingHours?: StructuredOpeningHours;
  bookingUrl?: string;
  officialUrl?: string;
  navigationUrl: string;
  sourceUrls: string[];
  lastVerifiedAt: string;
  verificationStatus: VerificationStatus;
  featured?: boolean;
  family?: FamilyInformation;
  halalStatus?: "verified" | "to-check";
  prayerInformation?: string;
  nearestStation?: string;
  transportNote?: string;
  legacyId?: string;
};

export type TripTraveler = {
  adults: number;
  children: number;
  baby: boolean;
};

export type TripDay = {
  date: string;
  placeIds: string[];
  notes: Record<string, string>;
};

export type PrivateTrip = {
  version: 1;
  destinationId: DestinationId;
  startDate: string;
  endDate: string;
  accommodation: {
    name: string;
    address?: string;
    coordinates?: { latitude: number; longitude: number };
  } | null;
  travelers: TripTraveler;
  preferences: TravelPlaceTag[];
  excludedPlaceIds: string[];
  days: TripDay[];
  updatedAt: string;
};
