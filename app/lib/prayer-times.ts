/**
 * Heures de prière calculées par la librairie `adhan`, pas à la main.
 * Convention : Fajr 20° / Isha 18° = paramètres du Kemenag indonésien,
 * portés par CalculationMethod.Singapore(). Madhab Shafi'i pour le Asr.
 * À vérifier sur une journée complète contre le tableau du Kemenag.
 */
import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from "adhan";

export const LOMBOK = { lat: -8.8947, lng: 116.2832 } as const;
export const LOMBOK_TZ = "Asia/Makassar";
const IHTIYAT_MINUTES = 2;
const WITA_DATE_PARTS_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: LOMBOK_TZ,
  year: "numeric",
  month: "numeric",
  day: "numeric",
});
const WITA_TIME_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
  timeZone: LOMBOK_TZ,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export const DAILY_PRAYERS = [
  { key: "fajr", name: "Fajr" },
  { key: "dhuhr", name: "Dhuhr" },
  { key: "asr", name: "Asr" },
  { key: "maghrib", name: "Maghrib" },
  { key: "isha", name: "Isha" },
] as const;

export type DailyPrayerKey = (typeof DAILY_PRAYERS)[number]["key"];

function params() {
  const p = CalculationMethod.Singapore();
  p.madhab = Madhab.Shafi;
  return p;
}

function shift(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60000);
}

/**
 * `adhan` lit la date civile dans le fuseau du navigateur. On lui fournit donc
 * explicitement le jour civil WITA afin qu'un voyageur encore en Europe voie
 * bien les horaires du jour à Lombok.
 */
function lombokCalendarDate(reference: Date, dayOffset = 0) {
  const parts = WITA_DATE_PARTS_FORMATTER.formatToParts(reference);
  const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value);
  return new Date(value("year"), value("month") - 1, value("day") + dayOffset, 12);
}

function timesForDay(reference: Date, dayOffset: number, lat: number, lng: number) {
  const t = new PrayerTimes(new Coordinates(lat, lng), lombokCalendarDate(reference, dayOffset), params());
  return {
    fajr: shift(t.fajr, IHTIYAT_MINUTES),
    sunrise: t.sunrise,
    dhuhr: shift(t.dhuhr, IHTIYAT_MINUTES),
    asr: shift(t.asr, IHTIYAT_MINUTES),
    maghrib: shift(t.maghrib, IHTIYAT_MINUTES),
    isha: shift(t.isha, IHTIYAT_MINUTES),
  };
}

export function timesFor(date = new Date(), lat: number = LOMBOK.lat, lng: number = LOMBOK.lng) {
  return timesForDay(date, 0, lat, lng);
}

export function formatWita(date: Date) {
  return WITA_TIME_FORMATTER.format(date);
}

export function formatCountdown(ms: number) {
  const total = Math.floor(ms / 1000);
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return h + ":" + m + ":" + s;
}

function scheduleForDay(reference: Date, dayOffset: number, lat: number, lng: number) {
  const times = timesForDay(reference, dayOffset, lat, lng);
  return DAILY_PRAYERS.map((prayer) => ({
    ...prayer,
    time: times[prayer.key],
    label: formatWita(times[prayer.key]),
  }));
}

export function prayerScheduleFor(
  date = new Date(),
  lat: number = LOMBOK.lat,
  lng: number = LOMBOK.lng,
  dayOffset = 0,
) {
  return scheduleForDay(date, dayOffset, lat, lng);
}

/** La prochaine des cinq prières obligatoires (le lever du soleil est exclu). */
export function nextPrayer(now = new Date(), lat: number = LOMBOK.lat, lng: number = LOMBOK.lng) {
  const today = scheduleForDay(now, 0, lat, lng);
  const tomorrow = scheduleForDay(now, 1, lat, lng);
  const prayer = today.find((item) => item.time.getTime() > now.getTime()) ?? tomorrow[0];
  const msLeft = Math.max(0, prayer.time.getTime() - now.getTime());

  return {
    ...prayer,
    msLeft,
    countdown: formatCountdown(msLeft),
  };
}
