"use client";

import Link from "next/link";
import { CalendarPlus, Check, Heart, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type { DestinationId, PrivateTrip } from "../data/destination-types";
import { favoritesRepository, type FavoritesSnapshot } from "../lib/repositories/favorites-repository";
import { tripRepository, type TripSnapshot } from "../lib/repositories/trip-repository";

type ActivityActionsProps = {
  placeId: string;
  placeName: string;
  destinationId: DestinationId;
};

type Feedback = { tone: "success" | "notice"; text: string } | null;

function dayWithFewestPlaces(trip: PrivateTrip) {
  return trip.days.reduce((best, day) => day.placeIds.length < best.placeIds.length ? day : best, trip.days[0]);
}

export function ActivityActions({ placeId, placeName, destinationId }: ActivityActionsProps) {
  const [favorites, setFavorites] = useState<FavoritesSnapshot | null>(null);
  const [trip, setTrip] = useState<TripSnapshot | null>(null);
  const [favoriteBusy, setFavoriteBusy] = useState(false);
  const [tripBusy, setTripBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  useEffect(() => {
    let active = true;
    void Promise.all([favoritesRepository.load(), tripRepository.load()]).then(([favoriteSnapshot, tripSnapshot]) => {
      if (!active) return;
      setFavorites(favoriteSnapshot);
      setTrip(tripSnapshot);
    });
    return () => { active = false; };
  }, []);

  const isFavorite = favorites?.ids.includes(placeId) ?? false;
  const isInTrip = trip?.trip.days.some((day) => day.placeIds.includes(placeId)) ?? false;

  async function toggleFavorite() {
    if (!favorites || favoriteBusy) return;
    setFavoriteBusy(true);
    const next = await favoritesRepository.toggle(placeId, favorites.ids, favorites.userId);
    setFavorites(next);
    setFeedback({ tone: "success", text: isFavorite ? `${placeName} a été retiré de vos favoris.` : `${placeName} a été enregistré dans vos favoris.` });
    setFavoriteBusy(false);
  }

  async function addToTrip() {
    if (!trip || tripBusy || isInTrip) return;
    if (trip.trip.destinationId !== destinationId && (trip.trip.startDate || trip.trip.days.length || trip.trip.accommodation)) {
      setFeedback({ tone: "notice", text: "Votre voyage actuel concerne une autre destination. Ouvrez Mon voyage pour choisir quoi conserver." });
      return;
    }
    if (!trip.trip.days.length) {
      setFeedback({ tone: "notice", text: "Ajoutez d’abord vos dates dans Mon voyage, puis revenez sur cette fiche." });
      return;
    }

    setTripBusy(true);
    const targetDay = dayWithFewestPlaces(trip.trip);
    const nextTrip: PrivateTrip = {
      ...trip.trip,
      destinationId,
      days: trip.trip.days.map((day) => day.date === targetDay.date
        ? { ...day, placeIds: [...day.placeIds, placeId] }
        : day),
    };
    const next = await tripRepository.save(nextTrip, trip.userId);
    setTrip(next);
    setFeedback({ tone: "success", text: `${placeName} a été ajouté au ${new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${targetDay.date}T00:00:00Z`))}.` });
    setTripBusy(false);
  }

  return (
    <div className="activity-actions">
      <button type="button" className="button button--primary" onClick={toggleFavorite} disabled={!favorites || favoriteBusy} aria-pressed={isFavorite}>
        {favoriteBusy ? <LoaderCircle className="activity-actions__spinner" aria-hidden="true" /> : isFavorite ? <Check aria-hidden="true" /> : <Heart aria-hidden="true" />}
        {isFavorite ? "Dans mes favoris" : "Enregistrer"}
      </button>
      <button type="button" className="button button--outline" onClick={addToTrip} disabled={!trip || tripBusy || isInTrip}>
        {tripBusy ? <LoaderCircle className="activity-actions__spinner" aria-hidden="true" /> : isInTrip ? <Check aria-hidden="true" /> : <CalendarPlus aria-hidden="true" />}
        {isInTrip ? "Dans mon voyage" : "Ajouter au voyage"}
      </button>
      {feedback && <p className={`activity-actions__feedback is-${feedback.tone}`} role="status">{feedback.text}</p>}
      <div className="activity-actions__links">
        <Link href="/saved">Voir mes favoris</Link>
        <Link href={`/trip?destination=${destinationId}`}>Ouvrir Mon voyage</Link>
      </div>
    </div>
  );
}
