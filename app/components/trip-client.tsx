"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Baby,
  BedDouble,
  CalendarDays,
  FolderHeart,
  MapPin,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  UsersRound,
  X,
} from "lucide-react";
import type { DestinationId, PrivateTrip, TravelPlaceTag } from "../data/destination-types";
import { destinationRepository } from "../lib/repositories/destination-repository";
import { placeRepository } from "../lib/repositories/place-repository";
import { buildTripDays, tripRepository, type TripSnapshot } from "../lib/repositories/trip-repository";

const preferenceChoices: Array<{ value: TravelPlaceTag; label: string }> = [
  { value: "family-friendly", label: "En famille" },
  { value: "baby-friendly", label: "Avec bébé" },
  { value: "stroller-friendly", label: "Accessible en poussette" },
  { value: "indoor", label: "À l’intérieur" },
  { value: "outdoor", label: "En plein air" },
  { value: "rain-friendly", label: "Adapté à la pluie" },
  { value: "halal-verified", label: "Halal vérifié" },
  { value: "prayer-room", label: "Salle de prière" },
  { value: "evening", label: "En soirée" },
  { value: "short-visit", label: "Visite courte" },
];

function formatDay(date: string) {
  return new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" })
    .format(new Date(`${date}T00:00:00Z`));
}

function uniqueIds(ids: string[]) {
  return Array.from(new Set(ids));
}

export function TripClient() {
  const [snapshot, setSnapshot] = useState<TripSnapshot | null>(null);
  const [trip, setTrip] = useState<PrivateTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [groupByNeighborhood, setGroupByNeighborhood] = useState(false);
  const [exclusionCandidate, setExclusionCandidate] = useState("");

  useEffect(() => {
    let active = true;
    void tripRepository.load().then((result) => {
      if (!active) return;
      setSnapshot(result);
      setTrip(result.trip);
      setLoading(false);
    });
    const refresh = (event: Event) => {
      const detail = (event as CustomEvent<{ trip?: PrivateTrip; userId?: string | null }>).detail;
      if (!detail?.trip) return;
      setTrip(detail.trip);
    };
    window.addEventListener(tripRepository.eventName, refresh);
    return () => {
      active = false;
      window.removeEventListener(tripRepository.eventName, refresh);
    };
  }, []);

  const destination = trip ? destinationRepository.resolve(trip.destinationId) : destinationRepository.getDefault();
  const tripDestinationId = trip?.destinationId;
  const destinationPlaces = useMemo(
    () => tripDestinationId ? placeRepository.listByDestination(tripDestinationId).filter((place) => place.verificationStatus !== "archived") : [],
    [tripDestinationId],
  );
  const placeById = useMemo(() => new Map(destinationPlaces.map((place) => [place.id, place])), [destinationPlaces]);
  const excludedPlaces = trip?.excludedPlaceIds.map((id) => placeById.get(id)).filter(Boolean) ?? [];

  const neighborhoodGroups = useMemo(() => {
    if (!trip) return [];
    const selectedIds = uniqueIds(trip.days.flatMap((day) => day.placeIds));
    const groups = new Map<string, typeof destinationPlaces>();
    for (const id of selectedIds) {
      const place = placeById.get(id);
      if (!place) continue;
      const name = place.neighborhood || "Quartier à préciser";
      groups.set(name, [...(groups.get(name) ?? []), place]);
    }
    return Array.from(groups.entries()).sort(([left], [right]) => left.localeCompare(right, "fr"));
  }, [placeById, trip]);

  function updateTrip(patch: Partial<PrivateTrip>) {
    setTrip((current) => current ? { ...current, ...patch } : current);
    setStatus("Modifications non enregistrées");
  }

  async function persist(next: PrivateTrip, message: string) {
    setTrip(next);
    setStatus("Enregistrement…");
    const result = await tripRepository.save(next, snapshot?.userId);
    setSnapshot(result);
    setTrip(result.trip);
    setStatus(result.userId ? result.cloudSynced ? `${message} · synchronisé` : `${message} · conservé sur cet appareil` : `${message} · conservé sur cet appareil`);
  }

  async function saveTripForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trip) return;
    if (trip.startDate && trip.endDate && trip.endDate < trip.startDate) {
      setStatus("La date de départ doit être postérieure à la date d’arrivée.");
      return;
    }
    const validPlaceIds = new Set(destinationPlaces.map((place) => place.id));
    const days = buildTripDays(trip.startDate, trip.endDate, trip.days).map((day) => ({
      ...day,
      placeIds: day.placeIds.filter((id) => validPlaceIds.has(id)),
      notes: Object.fromEntries(Object.entries(day.notes).filter(([id]) => validPlaceIds.has(id))),
    }));
    await persist({ ...trip, days, excludedPlaceIds: trip.excludedPlaceIds.filter((id) => validPlaceIds.has(id)) }, "Votre voyage est enregistré");
  }

  function togglePreference(value: TravelPlaceTag) {
    if (!trip) return;
    updateTrip({ preferences: trip.preferences.includes(value) ? trip.preferences.filter((tag) => tag !== value) : [...trip.preferences, value] });
  }

  function updateAccommodationCoordinates(rawValue: string) {
    if (!trip?.accommodation) return;
    if (!rawValue.trim()) {
      updateTrip({ accommodation: { ...trip.accommodation, coordinates: undefined } });
      return;
    }
    const [latitude, longitude] = rawValue.split(",").map((part) => Number(part.trim()));
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
      setStatus("Saisissez les deux coordonnées séparées par une virgule.");
      return;
    }
    updateTrip({
      accommodation: {
        ...trip.accommodation,
        coordinates: { latitude, longitude },
      },
    });
  }

  function addExclusion() {
    if (!trip || !exclusionCandidate) return;
    updateTrip({
      excludedPlaceIds: uniqueIds([...trip.excludedPlaceIds, exclusionCandidate]),
      days: trip.days.map((day) => ({ ...day, placeIds: day.placeIds.filter((id) => id !== exclusionCandidate) })),
    });
    setExclusionCandidate("");
  }

  async function addPlace(dayDate: string, placeId: string) {
    if (!trip || !placeId || trip.excludedPlaceIds.includes(placeId)) return;
    await persist({
      ...trip,
      days: trip.days.map((day) => day.date === dayDate ? { ...day, placeIds: uniqueIds([...day.placeIds, placeId]) } : day),
    }, "Lieu ajouté à la journée");
  }

  async function removePlace(dayDate: string, placeId: string) {
    if (!trip) return;
    await persist({
      ...trip,
      days: trip.days.map((day) => day.date === dayDate ? {
        ...day,
        placeIds: day.placeIds.filter((id) => id !== placeId),
        notes: Object.fromEntries(Object.entries(day.notes).filter(([id]) => id !== placeId)),
      } : day),
    }, "Lieu retiré de la journée");
  }

  async function movePlace(dayDate: string, placeId: string, direction: -1 | 1) {
    if (!trip) return;
    const nextDays = trip.days.map((day) => {
      if (day.date !== dayDate) return day;
      const index = day.placeIds.indexOf(placeId);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= day.placeIds.length) return day;
      const placeIds = [...day.placeIds];
      [placeIds[index], placeIds[target]] = [placeIds[target], placeIds[index]];
      return { ...day, placeIds };
    });
    await persist({ ...trip, days: nextDays }, "Ordre mis à jour");
  }

  async function saveNote(dayDate: string, placeId: string, note: string) {
    if (!trip) return;
    await persist({
      ...trip,
      days: trip.days.map((day) => day.date === dayDate ? { ...day, notes: { ...day.notes, [placeId]: note.slice(0, 600) } } : day),
    }, "Note privée enregistrée");
  }

  async function clearTrip() {
    if (!window.confirm("Effacer ce voyage et toutes ses notes privées sur cet appareil ?")) return;
    setStatus("Effacement…");
    const result = await tripRepository.clear(snapshot?.userId);
    setSnapshot(result);
    setTrip(result.trip);
    setStatus("Votre voyage a été effacé.");
  }

  if (loading || !trip) {
    return <div className="travel-loading" role="status">Ouverture de votre voyage privé…</div>;
  }

  return (
    <div className="travel-layout">
      <section className="travel-privacy" aria-label="Confidentialité du voyage">
        <ShieldCheck aria-hidden="true" />
        <div>
          <strong>Votre voyage est privé.</strong>
          <p>{snapshot?.userId ? "Il est synchronisé uniquement avec votre compte MyLombok." : "Sans compte, il reste uniquement sur cet appareil."}</p>
        </div>
      </section>

      <form className="travel-form" onSubmit={saveTripForm}>
        <div className="travel-section-heading">
          <div><span className="eyebrow">Préparer</span><h2>Les bases de votre séjour</h2></div>
          <CalendarDays aria-hidden="true" />
        </div>

        <div className="travel-field-grid">
          <label>Destination
            <select value={trip.destinationId} onChange={(event) => updateTrip({ destinationId: event.target.value as DestinationId, days: [], excludedPlaceIds: [] })}>
              {destinationRepository.list().map((item) => <option key={item.id} value={item.id}>{item.name} · {item.country}</option>)}
            </select>
          </label>
          <label>Arrivée
            <input type="date" value={trip.startDate} onChange={(event) => updateTrip({ startDate: event.target.value })} />
          </label>
          <label>Départ
            <input type="date" min={trip.startDate || undefined} value={trip.endDate} onChange={(event) => updateTrip({ endDate: event.target.value })} />
          </label>
        </div>

        <fieldset className="travel-accommodation">
          <legend><BedDouble aria-hidden="true" /> Hébergement</legend>
          <label>Nom de l’hôtel ou du logement
            <input value={trip.accommodation?.name || ""} maxLength={120} autoComplete="organization" placeholder={`Votre adresse à ${destination.shortName}`} onChange={(event) => updateTrip({ accommodation: event.target.value ? { ...trip.accommodation, name: event.target.value } : null })} />
          </label>
          <label>Adresse (facultatif)
            <input value={trip.accommodation?.address || ""} maxLength={220} autoComplete="street-address" placeholder="Adresse privée, non publiée" onChange={(event) => updateTrip({ accommodation: trip.accommodation ? { ...trip.accommodation, address: event.target.value } : event.target.value ? { name: "Mon logement", address: event.target.value } : null })} />
          </label>
          <div className="travel-accommodation__coordinates">
            <p><strong>Autour de mon hôtel</strong><span>Ajoutez les coordonnées visibles dans votre application de cartes. Elles restent privées et servent uniquement au tri par distance approximative.</span></p>
            <label>Latitude, longitude
              <input inputMode="decimal" defaultValue={trip.accommodation?.coordinates ? `${trip.accommodation.coordinates.latitude}, ${trip.accommodation.coordinates.longitude}` : ""} disabled={!trip.accommodation} placeholder="3.1595, 101.7048" onBlur={(event) => updateAccommodationCoordinates(event.target.value)} />
            </label>
          </div>
        </fieldset>

        <fieldset className="travel-travelers">
          <legend><UsersRound aria-hidden="true" /> Voyageurs</legend>
          <label>Adultes<input type="number" min={1} max={12} inputMode="numeric" value={trip.travelers.adults} onChange={(event) => updateTrip({ travelers: { ...trip.travelers, adults: Number(event.target.value) } })} /></label>
          <label>Enfants<input type="number" min={0} max={12} inputMode="numeric" value={trip.travelers.children} onChange={(event) => updateTrip({ travelers: { ...trip.travelers, children: Number(event.target.value) } })} /></label>
          <label className="travel-check"><input type="checkbox" checked={trip.travelers.baby} onChange={(event) => updateTrip({ travelers: { ...trip.travelers, baby: event.target.checked } })} /><Baby aria-hidden="true" /><span>Nous voyageons avec un bébé</span></label>
        </fieldset>

        <fieldset className="travel-preferences">
          <legend>Vos préférences</legend>
          <div>{preferenceChoices.map((choice) => <label key={choice.value} className={trip.preferences.includes(choice.value) ? "is-selected" : ""}><input type="checkbox" checked={trip.preferences.includes(choice.value)} onChange={() => togglePreference(choice.value)} /><span>{choice.label}</span></label>)}</div>
        </fieldset>

        <fieldset className="travel-exclusions">
          <legend>À ne pas proposer</legend>
          <div className="travel-inline-control">
            <select aria-label="Lieu à exclure" value={exclusionCandidate} onChange={(event) => setExclusionCandidate(event.target.value)}>
              <option value="">Choisir un lieu</option>
              {destinationPlaces.filter((place) => !trip.excludedPlaceIds.includes(place.id)).map((place) => <option key={place.id} value={place.id}>{place.name}</option>)}
            </select>
            <button type="button" className="button button--outline" onClick={addExclusion} disabled={!exclusionCandidate}><Plus aria-hidden="true" /> Exclure</button>
          </div>
          {excludedPlaces.length > 0 && <ul>{excludedPlaces.map((place) => place && <li key={place.id}>{place.name}<button type="button" onClick={() => updateTrip({ excludedPlaceIds: trip.excludedPlaceIds.filter((id) => id !== place.id) })} aria-label={`Ne plus exclure ${place.name}`}><X aria-hidden="true" /></button></li>)}</ul>}
        </fieldset>

        <div className="travel-form-actions">
          <button className="button button--primary button--large" type="submit"><Save aria-hidden="true" /> Enregistrer et créer les journées</button>
          {status && <p role="status">{status}</p>}
        </div>
      </form>

      <section className="travel-itinerary" aria-labelledby="itinerary-title">
        <div className="travel-section-heading">
          <div><span className="eyebrow">Organiser</span><h2 id="itinerary-title">Votre programme</h2></div>
          <div className="travel-view-toggle" role="group" aria-label="Mode d’organisation">
            <button type="button" aria-pressed={!groupByNeighborhood} onClick={() => setGroupByNeighborhood(false)}>Par jour</button>
            <button type="button" aria-pressed={groupByNeighborhood} onClick={() => setGroupByNeighborhood(true)}>Par quartier</button>
          </div>
        </div>

        {!trip.days.length ? (
          <div className="travel-empty">
            <CalendarDays aria-hidden="true" />
            <h3>Commencez par vos dates.</h3>
            <p>Après enregistrement, une journée sera créée pour chaque date du séjour.</p>
          </div>
        ) : groupByNeighborhood ? (
          neighborhoodGroups.length ? <div className="travel-neighborhoods">{neighborhoodGroups.map(([name, places]) => <article key={name}><div><MapPin aria-hidden="true" /><h3>{name}</h3></div><ul>{places.map((place) => <li key={place.id}><Link href={`/activity/${place.slug}`}>{place.name}</Link></li>)}</ul></article>)}</div> : <div className="travel-empty"><MapPin aria-hidden="true" /><h3>Aucun lieu ajouté.</h3><p>Ajoutez vos favoris à une journée pour les regrouper ensuite par quartier.</p></div>
        ) : (
          <div className="travel-days">
            {trip.days.map((day, dayIndex) => {
              const candidates = destinationPlaces.filter((place) => !trip.excludedPlaceIds.includes(place.id) && !day.placeIds.includes(place.id));
              return <article className="travel-day" key={day.date}>
                <header><span>Jour {dayIndex + 1}</span><h3>{formatDay(day.date)}</h3></header>
                {day.placeIds.length ? <ol>{day.placeIds.map((placeId, index) => {
                  const place = placeById.get(placeId);
                  if (!place) return null;
                  return <li key={placeId}>
                    <div className="travel-place-row">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <div><Link href={`/activity/${place.slug}`}>{place.name}</Link><small>{place.neighborhood || destination.shortName}</small></div>
                      <div className="travel-place-actions">
                        <button type="button" disabled={index === 0} onClick={() => movePlace(day.date, placeId, -1)} aria-label={`Monter ${place.name}`}><ArrowUp aria-hidden="true" /></button>
                        <button type="button" disabled={index === day.placeIds.length - 1} onClick={() => movePlace(day.date, placeId, 1)} aria-label={`Descendre ${place.name}`}><ArrowDown aria-hidden="true" /></button>
                        <button type="button" onClick={() => removePlace(day.date, placeId)} aria-label={`Retirer ${place.name}`}><Trash2 aria-hidden="true" /></button>
                      </div>
                    </div>
                    <label className="travel-note">Note privée
                      <textarea defaultValue={day.notes[placeId] || ""} maxLength={600} placeholder="Réservation, envie, détail utile…" onBlur={(event) => saveNote(day.date, placeId, event.target.value)} />
                    </label>
                  </li>;
                })}</ol> : <p className="travel-day__empty">Cette journée est encore libre.</p>}
                <div className="travel-add-place">
                  <select id={`place-${day.date}`} defaultValue="" aria-label={`Ajouter un lieu au ${formatDay(day.date)}`}>
                    <option value="">Choisir un lieu vérifié</option>
                    {candidates.map((place) => <option key={place.id} value={place.id}>{place.name} · {place.neighborhood || destination.shortName}</option>)}
                  </select>
                  <button type="button" className="button button--outline" onClick={(event) => {
                    const select = event.currentTarget.previousElementSibling as HTMLSelectElement | null;
                    if (select?.value) { void addPlace(day.date, select.value); select.value = ""; }
                  }}><Plus aria-hidden="true" /> Ajouter</button>
                </div>
              </article>;
            })}
          </div>
        )}
      </section>

      <section className="travel-shortcuts" aria-label="Raccourcis du voyage">
        <Link href="/saved"><FolderHeart aria-hidden="true" /><span><strong>Mes favoris</strong><small>Ajoutez vos adresses à une journée</small></span></Link>
        <Link href={`/destination/${trip.destinationId}`}><MapPin aria-hidden="true" /><span><strong>Explorer {destination.shortName}</strong><small>Trouver de nouvelles idées</small></span></Link>
      </section>

      <button type="button" className="travel-clear" onClick={clearTrip}><Trash2 aria-hidden="true" /> Effacer ce voyage privé</button>
    </div>
  );
}
