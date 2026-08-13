"use client";

import Link from "next/link";
import Image, { type ImageLoaderProps } from "next/image";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, FolderHeart, Heart, MapPin, Plus, Search, ShieldCheck } from "lucide-react";
import type { PrivateTrip, TravelPlace, TravelPlaceCategory } from "../data/destination-types";
import { destinationRepository } from "../lib/repositories/destination-repository";
import { favoritesRepository, type FavoritesSnapshot } from "../lib/repositories/favorites-repository";
import { placeRepository } from "../lib/repositories/place-repository";
import { tripRepository, type TripSnapshot } from "../lib/repositories/trip-repository";

const categoryLabels: Record<TravelPlaceCategory, string> = {
  attraction: "Activités",
  family: "Famille",
  food: "Restaurants",
  market: "Marchés",
  mosque: "Mosquées",
  culture: "Culture",
  shopping: "Shopping",
  park: "Parcs & nature",
  viewpoint: "Points de vue",
  neighborhood: "Quartiers",
  practical: "Pratique",
  transport: "Transports",
};

function resolveFavoritePlace(id: string): TravelPlace | null {
  return placeRepository.getById(id) ?? placeRepository.list().find((place) => place.legacyId === id) ?? null;
}

function formatDay(date: string) {
  return new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" })
    .format(new Date(`${date}T00:00:00Z`));
}

function passthroughImageLoader({ src }: ImageLoaderProps) {
  return src;
}

export function SavedClient() {
  const [favoritesSnapshot, setFavoritesSnapshot] = useState<FavoritesSnapshot | null>(null);
  const [tripSnapshot, setTripSnapshot] = useState<TripSnapshot | null>(null);
  const [query, setQuery] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | TravelPlaceCategory>("all");
  const [selectedDay, setSelectedDay] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void Promise.all([favoritesRepository.load(), tripRepository.load()]).then(([favorites, trip]) => {
      if (!active) return;
      setFavoritesSnapshot(favorites);
      setTripSnapshot(trip);
      setSelectedDay(trip.trip.days[0]?.date || "");
      setLoading(false);
    });
    const refreshFavorites = (event: Event) => {
      const detail = (event as CustomEvent<{ ids?: string[]; userId?: string | null }>).detail;
      const ids = detail?.ids;
      if (!ids) return;
      setFavoritesSnapshot((current) => current && (detail.userId === current.userId) ? { ...current, ids } : current);
    };
    const refreshTrip = (event: Event) => {
      const detail = (event as CustomEvent<{ trip?: PrivateTrip; userId?: string | null }>).detail;
      const trip = detail?.trip;
      if (!trip) return;
      setTripSnapshot((current) => current && detail.userId === current.userId ? { ...current, trip } : current);
    };
    window.addEventListener(favoritesRepository.eventName, refreshFavorites);
    window.addEventListener(tripRepository.eventName, refreshTrip);
    return () => {
      active = false;
      window.removeEventListener(favoritesRepository.eventName, refreshFavorites);
      window.removeEventListener(tripRepository.eventName, refreshTrip);
    };
  }, []);

  const favoritePlaces = useMemo(() => (favoritesSnapshot?.ids ?? []).map(resolveFavoritePlace).filter((place): place is TravelPlace => Boolean(place)), [favoritesSnapshot?.ids]);
  const availableCategories = useMemo(() => Array.from(new Set(favoritePlaces.map((place) => place.category))).sort(), [favoritePlaces]);
  const filteredPlaces = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fr");
    return favoritePlaces.filter((place) =>
      (destinationFilter === "all" || place.destinationId === destinationFilter) &&
      (categoryFilter === "all" || place.category === categoryFilter) &&
      (!normalizedQuery || [place.name, place.neighborhood, place.shortDescription, categoryLabels[place.category]].filter(Boolean).join(" ").toLocaleLowerCase("fr").includes(normalizedQuery)),
    );
  }, [categoryFilter, destinationFilter, favoritePlaces, query]);

  async function removeFavorite(place: TravelPlace) {
    if (!favoritesSnapshot) return;
    const aliases = new Set([place.id, ...(place.legacyId ? [place.legacyId] : [])]);
    setStatus("Mise à jour…");
    const result = await favoritesRepository.save(favoritesSnapshot.ids.filter((id) => !aliases.has(id)), favoritesSnapshot.userId);
    setFavoritesSnapshot(result);
    setStatus(`${place.name} a été retiré de vos favoris.`);
  }

  async function addToTrip(place: TravelPlace) {
    if (!tripSnapshot) return;
    const trip = tripSnapshot.trip;
    if (trip.destinationId !== place.destinationId) {
      setStatus(`Ce lieu appartient à ${destinationRepository.resolve(place.destinationId).name}. Choisissez cette destination dans Mon voyage.`);
      return;
    }
    const dayDate = selectedDay || trip.days[0]?.date;
    if (!dayDate) {
      setStatus("Ajoutez d’abord vos dates dans Mon voyage pour créer les journées.");
      return;
    }
    if (trip.excludedPlaceIds.includes(place.id)) {
      setStatus("Ce lieu est dans votre liste d’exclusions. Retirez-le d’abord depuis Mon voyage.");
      return;
    }
    const next = {
      ...trip,
      days: trip.days.map((day) => day.date === dayDate ? { ...day, placeIds: Array.from(new Set([...day.placeIds, place.id])) } : day),
    };
    setStatus("Ajout au voyage…");
    const result = await tripRepository.save(next, tripSnapshot.userId);
    setTripSnapshot(result);
    setStatus(`${place.name} a été ajouté au ${formatDay(dayDate)}.`);
  }

  if (loading) return <div className="saved-loading" role="status">Ouverture de vos favoris privés…</div>;

  return (
    <div className="saved-layout">
      <section className="saved-privacy">
        <ShieldCheck aria-hidden="true" />
        <div><strong>Votre sélection reste privée.</strong><p>{favoritesSnapshot?.userId ? "Elle est liée à votre compte MyLombok." : "Sans compte, elle reste sur cet appareil."}</p></div>
      </section>

      <section className="saved-toolbar" aria-label="Filtrer vos favoris">
        <label className="saved-search"><Search aria-hidden="true" /><span className="sr-only">Rechercher dans mes favoris</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher une adresse…" /></label>
        <label>Destination
          <select value={destinationFilter} onChange={(event) => setDestinationFilter(event.target.value)}>
            <option value="all">Toutes les destinations</option>
            {destinationRepository.list().map((destination) => <option key={destination.id} value={destination.id}>{destination.name}</option>)}
          </select>
        </label>
        <label>Catégorie
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value as "all" | TravelPlaceCategory)}>
            <option value="all">Toutes les catégories</option>
            {availableCategories.map((category) => <option key={category} value={category}>{categoryLabels[category]}</option>)}
          </select>
        </label>
      </section>

      {tripSnapshot?.trip.days.length ? <section className="saved-trip-target" aria-label="Journée de destination">
        <CalendarDays aria-hidden="true" />
        <label>Ajouter les lieux à
          <select value={selectedDay} onChange={(event) => setSelectedDay(event.target.value)}>
            {tripSnapshot.trip.days.map((day) => <option key={day.date} value={day.date}>{formatDay(day.date)}</option>)}
          </select>
        </label>
        <Link href="/trip">Ouvrir mon voyage</Link>
      </section> : <section className="saved-trip-target"><CalendarDays aria-hidden="true" /><p><strong>Aucune journée créée.</strong> Ajoutez vos dates pour transformer vos favoris en programme.</p><Link href="/trip">Préparer mon voyage</Link></section>}

      {status && <p className="saved-status" role="status">{status}</p>}

      <div className="saved-heading"><div><span className="eyebrow">Votre carnet</span><h2>{filteredPlaces.length} {filteredPlaces.length > 1 ? "adresses" : "adresse"}</h2></div></div>

      {filteredPlaces.length ? <div className="saved-grid">{filteredPlaces.map((place) => {
        const destination = destinationRepository.resolve(place.destinationId);
        const inTrip = tripSnapshot?.trip.days.some((day) => day.placeIds.includes(place.id));
        return <article className="saved-card" key={place.id}>
          <Link className="saved-card__image" href={`/activity/${place.slug}`}>
            {place.images[0] ? <Image src={place.images[0].src} alt={place.images[0].alt} fill sizes="(max-width: 760px) 100vw, 33vw" loader={passthroughImageLoader} unoptimized /> : <span><MapPin aria-hidden="true" /></span>}
          </Link>
          <div className="saved-card__body">
            <span className="eyebrow">{destination.shortName} · {categoryLabels[place.category]}</span>
            <h3><Link href={`/activity/${place.slug}`}>{place.name}</Link></h3>
            <p>{place.shortDescription}</p>
            <small><MapPin aria-hidden="true" /> {place.neighborhood || destination.name}</small>
          </div>
          <div className="saved-card__actions">
            <button type="button" className="button button--primary" disabled={Boolean(inTrip)} onClick={() => addToTrip(place)}><Plus aria-hidden="true" /> {inTrip ? "Déjà au voyage" : "Ajouter au voyage"}</button>
            <button type="button" className="button button--outline" onClick={() => removeFavorite(place)} aria-label={`Retirer ${place.name} des favoris`}><Heart fill="currentColor" aria-hidden="true" /> Retirer</button>
          </div>
        </article>;
      })}</div> : <div className="saved-empty"><FolderHeart aria-hidden="true" /><h2>{favoritePlaces.length ? "Aucun favori ne correspond aux filtres." : "Votre carnet est encore vide."}</h2><p>{favoritePlaces.length ? "Essayez une autre destination ou catégorie." : "Ajoutez un cœur depuis Explorer pour préparer votre sélection."}</p><Link className="button button--primary" href="/explorer">Explorer les adresses</Link></div>}
    </div>
  );
}
