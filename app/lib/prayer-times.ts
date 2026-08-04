/**
 * Heures de prière calculées par la librairie `adhan`, pas à la main.
 * Convention : Fajr 20° / Isha 18° = paramètres du Kemenag indonésien,
 * portés par CalculationMethod.Singapore(). Madhab Shafi'i pour le Asr.
 * À vérifier sur une journée complète contre le tableau du Kemenag.
 */
import { CalculationMethod, Coordinates, Madhab, Prayer, PrayerTimes } from "adhan";

export const LOMBOK = { lat: -8.8947, lng: 116.2832 } as const;
export const LOMBOK_TZ = "Asia/Makassar";
const IHTIYAT_MINUTES = 2;

const NAMES: Record<string, string> = {
  fajr: "Fajr", sunrise: "Lever du soleil", dhuhr: "Dhuhr",
  asr: "Asr", maghrib: "Maghrib", isha: "Isha",
};

function params() {
  const p = CalculationMethod.Singapore();
  p.madhab = Madhab.Shafi;
  return p;
}

function shift(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60000);
}

export function timesFor(date = new Date(), lat = LOMBOK.lat, lng = LOMBOK.lng) {
  const t = new PrayerTimes(new Coordinates(lat, lng), date, params());
  return {
    fajr: shift(t.fajr, IHTIYAT_MINUTES),
    sunrise: t.sunrise,
    dhuhr: shift(t.dhuhr, IHTIYAT_MINUTES),
    asr: shift(t.asr, IHTIYAT_MINUTES),
    maghrib: shift(t.maghrib, IHTIYAT_MINUTES),
    isha: shift(t.isha, IHTIYAT_MINUTES),
  };
}

export function formatWita(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: LOMBOK_TZ, hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).format(date);
}

export function formatCountdown(ms: number) {
  const total = Math.floor(ms / 1000);
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return h + ":" + m + ":" + s;
}

/** Le nom et l'heure viennent du même objet : plus de décalage possible. */
export function nextPrayer(now = new Date(), lat = LOMBOK.lat, lng = LOMBOK.lng) {
  const coords = new Coordinates(lat, lng);
  const today = new PrayerTimes(coords, now, params());
  let key = today.nextPrayer(now);
  let time: Date | null = key === Prayer.None ? null : today.timeForPrayer(key);

  if (!time) {
    const tomorrow = new Date(now.getTime() + 86400000);
    key = Prayer.Fajr;
    time = new PrayerTimes(coords, tomorrow, params()).fajr;
  }

  const shifted = shift(time, key === Prayer.Sunrise ? 0 : IHTIYAT_MINUTES);
  const msLeft = Math.max(0, shifted.getTime() - now.getTime());

  return {
    key: String(key),
    name: NAMES[String(key)] ?? String(key),
    time: shifted,
    label: formatWita(shifted),
    msLeft,
    countdown: formatCountdown(msLeft),
  };
}
