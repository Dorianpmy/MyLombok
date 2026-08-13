"use client";

import dynamic from "next/dynamic";
import { Clock3, Filter, Grid2X2, List, Map as MapIcon, RotateCcw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Destination, DestinationId, PrivateTrip, TravelPlace, TravelPlaceCategory } from "../data/destination-types";
import { destinationRepository } from "../lib/repositories/destination-repository";
import { tripRepository } from "../lib/repositories/trip-repository";
import { TravelPlaceCard, travelCategoryLabels } from "./travel-place-card";

const DestinationMap = dynamic(() => import("./destination-map").then((module) => module.DestinationMap), {
  ssr: false,
  loading: () => <div className="destination-map__loading" role="status">La carte se prépare…</div>,
});

type Coordinates = { latitude: number; longitude: number };
type ExplorerView = "list" | "map";
type BooleanFilter = "baby" | "stroller" | "indoor" | "outdoor" | "evening" | "free" | "halal" | "prayer" | "nearHotel";

type DestinationExplorerClientProps = {
  destination: Destination;
  places: readonly TravelPlace[];
  initialView?: ExplorerView;
  initialPlaceSlug?: string | null;
  hotelCoordinates?: Coordinates | null;
  hotelName?: string | null;
  initialNearHotel?: boolean;
  allPlaces?: readonly TravelPlace[];
};

const filterLabels: Record<BooleanFilter, string> = {
  baby: "Avec bébé",
  stroller: "Poussette",
  indoor: "Intérieur",
  outdoor: "Extérieur",
  evening: "En soirée",
  free: "Gratuit",
  halal: "Halal vérifié",
  prayer: "Prière",
  nearHotel: "Près de l’hôtel",
};

function normalizeSearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr").trim();
}

function hasTag(place: TravelPlace, tag: TravelPlace["tags"][number]) {
  return place.tags.includes(tag);
}

function distanceKm(a: Coordinates, b: Coordinates) {
  const radius = 6371;
  const radians = (value: number) => value * Math.PI / 180;
  const dLat = radians(b.latitude - a.latitude);
  const dLng = radians(b.longitude - a.longitude);
  const lat1 = radians(a.latitude);
  const lat2 = radians(b.latitude);
  const value = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function matchesBooleanFilter(place: TravelPlace, filter: BooleanFilter, hotelCoordinates?: Coordinates | null) {
  if (filter === "baby") return place.family?.babyFriendly === true || hasTag(place, "baby-friendly");
  if (filter === "stroller") return place.family?.strollerFriendly === true || hasTag(place, "stroller-friendly");
  if (filter === "indoor") return place.family?.indoor === true || hasTag(place, "indoor");
  if (filter === "outdoor") return hasTag(place, "outdoor");
  if (filter === "evening") return hasTag(place, "evening");
  if (filter === "free") return place.priceLevel === "free" || hasTag(place, "free");
  if (filter === "halal") return place.halalStatus === "verified" || hasTag(place, "halal-verified");
  if (filter === "prayer") return place.category === "mosque" || Boolean(place.prayerInformation) || hasTag(place, "prayer-room") || hasTag(place, "mosque-nearby");
  return Boolean(hotelCoordinates) && distanceKm(hotelCoordinates!, place.coordinates) <= 3;
}

export function DestinationExplorerClient({ destination, places, initialView = "list", initialPlaceSlug = null, hotelCoordinates = null, hotelName = null, initialNearHotel = false, allPlaces = places }: DestinationExplorerClientProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<TravelPlaceCategory | "all">("all");
  const [duration, setDuration] = useState(0);
  const [filters, setFilters] = useState<Set<BooleanFilter>>(() => new Set(hotelCoordinates && initialNearHotel ? ["nearHotel"] : []));
  const [view, setView] = useState<ExplorerView>(initialView);
  const [destinationScope, setDestinationScope] = useState<DestinationId | "all">(destination.id);
  const [selectedId, setSelectedId] = useState<string | null>(() => places.find((place) => place.slug === initialPlaceSlug)?.id ?? null);
  const [savedHotel, setSavedHotel] = useState<{ coordinates: Coordinates; name: string | null } | null>(() => hotelCoordinates ? { coordinates: hotelCoordinates, name: hotelName } : null);

  useEffect(() => {
    if (hotelCoordinates) return;
    let active = true;
    const applyTrip = (trip: PrivateTrip) => {
      if (!active) return;
      const accommodation = trip.destinationId === destination.id ? trip.accommodation : null;
      setSavedHotel(accommodation?.coordinates ? { coordinates: accommodation.coordinates, name: accommodation.name } : null);
      if (initialNearHotel && accommodation?.coordinates) setFilters((current) => new Set(current).add("nearHotel"));
      if (!accommodation?.coordinates) setFilters((current) => {
        if (!current.has("nearHotel")) return current;
        const next = new Set(current);
        next.delete("nearHotel");
        return next;
      });
    };
    void tripRepository.load().then(({ trip }) => applyTrip(trip));
    const handleTripChange = (event: Event) => {
      const trip = (event as CustomEvent<{ trip?: PrivateTrip }>).detail?.trip;
      if (trip) applyTrip(trip);
    };
    window.addEventListener(tripRepository.eventName, handleTripChange);
    return () => {
      active = false;
      window.removeEventListener(tripRepository.eventName, handleTripChange);
    };
  }, [destination.id, hotelCoordinates, initialNearHotel]);

  const activeHotelCoordinates = hotelCoordinates ?? savedHotel?.coordinates ?? null;
  const activeHotelName = hotelName ?? savedHotel?.name ?? null;

  const scopedPlaces = useMemo(() => destinationScope === "all" ? [...allPlaces] : allPlaces.filter((place) => place.destinationId === destinationScope), [allPlaces, destinationScope]);
  const categories = useMemo(() => [...new Set(scopedPlaces.map((place) => place.category))], [scopedPlaces]);
  const filteredPlaces = useMemo(() => {
    const normalizedQuery = normalizeSearch(query);
    return scopedPlaces.filter((place) => {
      const searchable = normalizeSearch([
        place.name,
        travelCategoryLabels[place.category],
        place.category,
        place.neighborhood,
        place.shortDescription,
        place.description,
        ...place.tags,
      ].filter(Boolean).join(" "));
      return (!normalizedQuery || searchable.includes(normalizedQuery))
        && (category === "all" || place.category === category)
        && (!duration || Boolean(place.estimatedDuration) && place.estimatedDuration!.maxMinutes <= duration)
        && [...filters].every((filter) => matchesBooleanFilter(place, filter, activeHotelCoordinates));
    });
  }, [activeHotelCoordinates, category, duration, filters, query, scopedPlaces]);

  function changeDestinationScope(nextScope: DestinationId | "all") {
    setDestinationScope(nextScope);
    setCategory("all");
    setSelectedId(null);
    if (nextScope !== destination.id) setFilters((current) => {
      if (!current.has("nearHotel")) return current;
      const next = new Set(current);
      next.delete("nearHotel");
      return next;
    });
    if (nextScope !== destination.id) setView("list");
  }

  function toggleFilter(filter: BooleanFilter) {
    setFilters((current) => {
      const next = new Set(current);
      if (next.has(filter)) next.delete(filter);
      else next.add(filter);
      return next;
    });
  }

  function reset() {
    setQuery("");
    setDestinationScope(destination.id);
    setCategory("all");
    setDuration(0);
    setFilters(new Set());
    setSelectedId(null);
  }

  const availableBooleanFilters = (Object.keys(filterLabels) as BooleanFilter[]).filter((filter) => filter !== "nearHotel" || activeHotelCoordinates && destinationScope === destination.id);

  return (
    <section className="destination-explorer" aria-label={`Explorer ${destination.name}`}>
      <div className="destination-explorer__toolbar">
        <label className="destination-explorer__search">
          <Search aria-hidden="true" />
          <span className="sr-only">Rechercher dans {destination.name}</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nom, quartier, catégorie ou envie…" />
        </label>
        <label className="destination-explorer__scope"><span>Destination</span><select value={destinationScope} onChange={(event) => changeDestinationScope(event.target.value as DestinationId | "all")}><option value={destination.id}>{destination.name}</option><option value="all">Toutes</option>{destinationRepository.list().filter((item) => item.id !== destination.id).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <div className="destination-explorer__view" aria-label="Mode d’affichage">
          <button type="button" className={view === "list" ? "is-active" : undefined} aria-pressed={view === "list"} onClick={() => setView("list")}><List aria-hidden="true" /> Liste</button>
          <button type="button" className={view === "map" ? "is-active" : undefined} aria-pressed={view === "map"} disabled={destinationScope !== destination.id} title={destinationScope !== destination.id ? "Choisissez la destination de cette page pour ouvrir sa carte" : undefined} onClick={() => setView("map")}><MapIcon aria-hidden="true" /> Carte</button>
        </div>
      </div>

      <div className="destination-explorer__categories" aria-label="Catégories">
        <button type="button" className={category === "all" ? "is-active" : undefined} aria-pressed={category === "all"} onClick={() => setCategory("all")}><Grid2X2 aria-hidden="true" />Tout</button>
        {categories.map((item) => <button type="button" key={item} className={category === item ? "is-active" : undefined} aria-pressed={category === item} onClick={() => setCategory(item)}>{travelCategoryLabels[item]}</button>)}
      </div>

      <section className="destination-explorer__filters" aria-label="Filtres">
        <div className="destination-explorer__filter-heading"><Filter aria-hidden="true" /><strong>Affiner</strong>{activeHotelCoordinates && <small>Hôtel : {activeHotelName || "hébergement enregistré"}</small>}</div>
        <div className="destination-explorer__filter-toggles">
          {availableBooleanFilters.map((filter) => <button type="button" key={filter} className={filters.has(filter) ? "is-active" : undefined} aria-pressed={filters.has(filter)} onClick={() => toggleFilter(filter)}>{filterLabels[filter]}</button>)}
        </div>
        <label className="destination-explorer__duration"><Clock3 aria-hidden="true" /><span>Durée maximale</span><select value={duration} onChange={(event) => setDuration(Number(event.target.value))}><option value="0">Toutes</option><option value="60">1 heure</option><option value="120">2 heures</option><option value="240">4 heures</option></select></label>
      </section>

      <header className="destination-explorer__results-header">
        <p aria-live="polite"><strong>{filteredPlaces.length}</strong> résultat{filteredPlaces.length > 1 ? "s" : ""}</p>
        <button type="button" onClick={reset}><RotateCcw aria-hidden="true" /> Réinitialiser</button>
      </header>

      {view === "map" ? (
        <DestinationMap destination={destination} places={filteredPlaces} selectedId={selectedId} onSelect={(place) => setSelectedId(place.id)} onClearSelection={() => setSelectedId(null)} />
      ) : filteredPlaces.length ? (
        <div className="destination-explorer__grid travel-place-grid">
          {filteredPlaces.map((place, index) => <TravelPlaceCard key={place.id} place={place} priority={index < 2} />)}
        </div>
      ) : (
        <div className="destination-explorer__empty"><strong>Aucun lieu ne correspond à ces critères.</strong><p>Essayez une autre catégorie ou retirez un filtre.</p><button type="button" onClick={reset}>Afficher tous les lieux</button></div>
      )}
    </section>
  );
}
