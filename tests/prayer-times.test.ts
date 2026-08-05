import assert from "node:assert/strict";
import test from "node:test";
import { nextPrayer, prayerScheduleFor } from "../app/lib/prayer-times";
import { getLombokWeatherCity } from "../app/lib/lombok-weather";

test("les cinq prières obligatoires sont calculées pour la ville choisie", () => {
  const mataram = getLombokWeatherCity("mataram");
  const schedule = prayerScheduleFor(new Date("2026-08-05T04:00:00.000Z"), mataram.lat, mataram.lng);

  assert.deepEqual(schedule.map((prayer) => prayer.key), ["fajr", "dhuhr", "asr", "maghrib", "isha"]);
  assert.ok(schedule.every((prayer) => /^\d{2}:\d{2}$/.test(prayer.label)));
  assert.ok(schedule.every((prayer, index) => index === 0 || prayer.time > schedule[index - 1].time));
});

test("la prochaine prière exclut le lever du soleil", () => {
  const mataram = getLombokWeatherCity("mataram");
  const schedule = prayerScheduleFor(new Date("2026-08-05T04:00:00.000Z"), mataram.lat, mataram.lng);
  const afterFajr = new Date((schedule[0].time.getTime() + schedule[1].time.getTime()) / 2);
  const upcoming = nextPrayer(afterFajr, mataram.lat, mataram.lng);

  assert.equal(upcoming.key, "dhuhr");
  assert.equal(upcoming.name, "Dhuhr");
  assert.match(upcoming.countdown, /^\d{2}:\d{2}:\d{2}$/);
});

test("le jour affiché reste le jour WITA même depuis un autre fuseau", () => {
  const mataram = getLombokWeatherCity("mataram");
  const afterMidnightWita = new Date("2026-08-05T18:30:00.000Z");
  const schedule = prayerScheduleFor(afterMidnightWita, mataram.lat, mataram.lng);
  const witaDay = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Makassar",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(schedule[0].time);

  assert.equal(witaDay, "2026-08-06");
});
