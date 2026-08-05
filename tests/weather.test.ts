import assert from "node:assert/strict";
import test from "node:test";
import { createOpenMeteoUrl, getLombokWeatherCity, isLombokWeatherCityId, LOMBOK_WEATHER_CITIES, parseOpenMeteoCurrent } from "../app/lib/lombok-weather";

test("la météo propose les principales zones de Lombok avec Mataram par défaut", () => {
  assert.ok(LOMBOK_WEATHER_CITIES.length >= 8);
  assert.equal(getLombokWeatherCity(null).id, "mataram");
  assert.equal(getLombokWeatherCity("kuta").name, "Kuta Mandalika");
  assert.equal(isLombokWeatherCityId("sembalun"), true);
  assert.equal(isLombokWeatherCityId("paris"), false);
});

test("la requête météo utilise la ville choisie, les degrés Celsius et l'heure WITA", () => {
  const mataram = getLombokWeatherCity("mataram");
  const url = new URL(createOpenMeteoUrl(mataram));
  assert.equal(url.hostname, "api.open-meteo.com");
  assert.equal(url.searchParams.get("latitude"), String(mataram.lat));
  assert.equal(url.searchParams.get("longitude"), String(mataram.lng));
  assert.equal(url.searchParams.get("temperature_unit"), "celsius");
  assert.equal(url.searchParams.get("timezone"), "Asia/Makassar");
  assert.match(url.searchParams.get("current") || "", /apparent_temperature/);
});

test("la réponse Open-Meteo est validée avant affichage", () => {
  assert.deepEqual(parseOpenMeteoCurrent({ current: { temperature_2m: 29.4, apparent_temperature: 34.2, weather_code: 61, is_day: 1 } }), {
    temperature: 29,
    apparentTemperature: 34,
    code: 61,
    label: "Pluie",
    isDay: true,
  });
  assert.throws(() => parseOpenMeteoCurrent({ current: { temperature_2m: "29", apparent_temperature: 34, weather_code: 0, is_day: 1 } }));
});
