"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { MoonStar } from "lucide-react";
import {
  DEFAULT_LOMBOK_WEATHER_CITY_ID,
  getLombokWeatherCity,
  isLombokWeatherCityId,
  LOMBOK_WEATHER_CITY_CHANGE_EVENT,
  LOMBOK_WEATHER_CITY_STORAGE_KEY,
  type LombokWeatherCityId,
} from "../lib/lombok-weather";
import { formatCountdown, LOMBOK_TZ, prayerScheduleFor } from "../lib/prayer-times";

const WITA_DAY_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: LOMBOK_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

type PrayerSchedulePanelProps = {
  city: string;
  lat: number;
  lng: number;
  sourceLabel?: string;
  sourceUrl?: string;
  compact?: boolean;
};

function usePrayerClock(lat: number, lng: number) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const dayKey = WITA_DAY_FORMATTER.format(now);
  const referenceDay = useMemo(() => new Date(`${dayKey}T12:00:00.000Z`), [dayKey]);
  const schedule = useMemo(() => prayerScheduleFor(referenceDay, lat, lng), [referenceDay, lat, lng]);
  const tomorrow = useMemo(() => prayerScheduleFor(referenceDay, lat, lng, 1), [referenceDay, lat, lng]);
  const upcoming = useMemo(() => {
    const prayer = schedule.find((item) => item.time.getTime() > now.getTime()) ?? tomorrow[0];
    const msLeft = Math.max(0, prayer.time.getTime() - now.getTime());
    return { ...prayer, msLeft, countdown: formatCountdown(msLeft) };
  }, [now, schedule, tomorrow]);

  return { schedule, upcoming };
}

function PrayerSchedulePanel({ city, lat, lng, sourceLabel, sourceUrl, compact = false }: PrayerSchedulePanelProps) {
  const { schedule, upcoming } = usePrayerClock(lat, lng);
  const progress = Math.max(4, Math.min(100, 100 - upcoming.msLeft / (6 * 60 * 60 * 1000) * 100));
  const className = compact ? "prayer-card prayer-card--compact" : "prayer-card";

  return (
    <section className={className} aria-label={`Horaires de prière indicatifs à ${city}. Prochaine prière : ${upcoming.name} à ${upcoming.label}`}>
      <div className="prayer-card__summary">
        <span className="prayer-card__icon"><MoonStar aria-hidden="true" /></span>
        <div className="prayer-card__next">
          <small>{city} · prochaine prière · WITA</small>
          <strong aria-live="polite">{upcoming.name} à {upcoming.label}</strong>
          <p><b suppressHydrationWarning>{upcoming.countdown}</b> avant le prochain adhan</p>
        </div>
        <span
          className="prayer-card__progress"
          aria-hidden="true"
          style={{ "--prayer-progress": `${progress}%` } as CSSProperties}
        />
      </div>

      <ol className="prayer-card__times" aria-label={`Les cinq prières du jour à ${city}`}>
        {schedule.map((prayer) => (
          <li className={prayer.key === upcoming.key ? "is-next" : undefined} key={prayer.key}>
            <span>{prayer.name}</span>
            <time dateTime={prayer.time.toISOString()}>{prayer.label}</time>
          </li>
        ))}
      </ol>

      <footer className="prayer-card__notice">
        <span>Calcul indicatif Kemenag · Fajr 20° · Isha 18° · école shafi&apos;ite.</span>
        <span>Iqama et Jumu&apos;ah à vérifier auprès de la mosquée.</span>
        {sourceUrl && sourceLabel ? (
          <a href={sourceUrl} target="_blank" rel="noreferrer">Fiche de la mosquée · {sourceLabel}</a>
        ) : null}
      </footer>
    </section>
  );
}

/** Horaires calés sur la même ville que la météo, y compris dans le même onglet. */
export function PrayerCard() {
  const [cityId, setCityId] = useState<LombokWeatherCityId>(DEFAULT_LOMBOK_WEATHER_CITY_ID);
  const city = useMemo(() => getLombokWeatherCity(cityId), [cityId]);

  useEffect(() => {
    function applyCity(value: string | null) {
      if (isLombokWeatherCityId(value)) setCityId(value);
    }

    try {
      applyCity(localStorage.getItem(LOMBOK_WEATHER_CITY_STORAGE_KEY));
    } catch {
      // Mataram reste le choix par défaut lorsque le stockage est bloqué.
    }

    function onCityChange(event: Event) {
      const cityChange = event as CustomEvent<{ cityId?: string }>;
      applyCity(cityChange.detail?.cityId ?? null);
    }

    function onStorage(event: StorageEvent) {
      if (event.key === LOMBOK_WEATHER_CITY_STORAGE_KEY) applyCity(event.newValue);
    }

    window.addEventListener(LOMBOK_WEATHER_CITY_CHANGE_EVENT, onCityChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(LOMBOK_WEATHER_CITY_CHANGE_EVENT, onCityChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return <PrayerSchedulePanel city={city.name} lat={city.lat} lng={city.lng} />;
}

/** Réutilisable dans la fiche d'une mosquée, sans dépendre de la ville météo. */
export function MosquePrayerSchedule({ city, lat, lng, sourceLabel, sourceUrl }: Omit<PrayerSchedulePanelProps, "compact">) {
  return (
    <PrayerSchedulePanel
      city={city}
      lat={lat}
      lng={lng}
      sourceLabel={sourceLabel}
      sourceUrl={sourceUrl}
      compact
    />
  );
}
