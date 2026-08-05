"use client";
import { useEffect, useState } from "react";
import { createOpenMeteoUrl, parseOpenMeteoCurrent, type LombokWeatherCity } from "./lombok-weather";

/** Météo réelle via Open-Meteo — gratuit, sans clé, CORS ouvert. */
export type Weather = {
  temperature: number;
  apparentTemperature: number;
  code: number;
  label: string;
  isDay: boolean;
  updatedAt: Date;
  cityId: string;
};

export function useWeather(city: LombokWeatherCity) {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();
    async function load() {
      try {
        const res = await fetch(createOpenMeteoUrl(city), { cache: "no-store", signal: controller.signal });
        if (!res.ok) throw new Error(String(res.status));
        const current = parseOpenMeteoCurrent(await res.json());
        if (!alive) return;
        setWeather({
          ...current,
          updatedAt: new Date(),
          cityId: city.id,
        });
        setError(false);
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        if (alive) {
          setWeather(null);
          setError(true);
        }
      }
    }
    load();
    const timer = setInterval(load, 15 * 60 * 1000);
    return () => { alive = false; controller.abort(); clearInterval(timer); };
  }, [city]);

  return { weather: weather?.cityId === city.id ? weather : null, error };
}
