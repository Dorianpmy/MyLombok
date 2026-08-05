"use client";

import { CloudLightning, CloudRain, CloudSun, Sun } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DEFAULT_LOMBOK_WEATHER_CITY_ID, getLombokWeatherCity, isLombokWeatherCityId, LOMBOK_WEATHER_CITIES, LOMBOK_WEATHER_CITY_CHANGE_EVENT, LOMBOK_WEATHER_CITY_STORAGE_KEY, type LombokWeatherCityId } from "../lib/lombok-weather";
import { useWeather } from "../lib/use-weather";

export function WeatherChip() {
  const [cityId, setCityId] = useState<LombokWeatherCityId>(DEFAULT_LOMBOK_WEATHER_CITY_ID);
  const city = useMemo(() => getLombokWeatherCity(cityId), [cityId]);
  const { weather, error } = useWeather(city);
  const Icon = !weather ? CloudSun : weather.code === 0 ? Sun : weather.code >= 95 ? CloudLightning : weather.code >= 51 ? CloudRain : CloudSun;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = localStorage.getItem(LOMBOK_WEATHER_CITY_STORAGE_KEY);
        if (isLombokWeatherCityId(stored)) setCityId(stored);
      } catch {
        // Le choix par défaut reste utilisable si le stockage est bloqué.
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function selectCity(value: string) {
    if (!isLombokWeatherCityId(value)) return;
    setCityId(value);
    try { localStorage.setItem(LOMBOK_WEATHER_CITY_STORAGE_KEY, value); } catch {
      // La météo continue de fonctionner pour la session courante.
    }
    window.dispatchEvent(new CustomEvent(LOMBOK_WEATHER_CITY_CHANGE_EVENT, {
      detail: { cityId: value },
    }));
  }

  const status = weather
    ? `${weather.label} à ${city.name}, ressenti ${weather.apparentTemperature}°, météo actualisée`
    : error
      ? `Météo temporairement indisponible à ${city.name}`
      : `Météo de ${city.name} en cours de chargement`;

  return (
    <div className="weather-chip" title={status}>
      <Icon aria-hidden="true" />
      <div className="weather-chip__reading">
        <span aria-live="polite">{weather ? `${weather.temperature}°` : error ? "N/D" : "—°"}</span>
        <label>
          <span className="sr-only">Ville pour la météo</span>
          <select value={cityId} onChange={(event) => selectCity(event.target.value)} aria-label="Ville pour la météo">
            {LOMBOK_WEATHER_CITIES.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
          </select>
        </label>
      </div>
      <small>{weather ? `${weather.label} · ressenti ${weather.apparentTemperature}°` : error ? "Service indisponible" : "Actualisation…"}</small>
    </div>
  );
}
