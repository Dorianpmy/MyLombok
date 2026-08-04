"use client";
import { useEffect, useState } from "react";

/** Météo réelle via Open-Meteo — gratuit, sans clé, CORS ouvert. */
export const KUTA = { lat: -8.8947, lng: 116.2832 } as const;

export type Weather = {
  temperature: number;
  code: number;
  label: string;
  isDay: boolean;
  updatedAt: Date;
};

function labelFor(code: number): string {
  if (code === 0) return "Ciel dégagé";
  if (code <= 2) return "Peu nuageux";
  if (code === 3) return "Couvert";
  if (code <= 48) return "Brume";
  if (code <= 55) return "Bruine";
  if (code <= 65) return "Pluie";
  if (code <= 86) return "Averses";
  if (code >= 95) return "Orage";
  return "—";
}

export function useWeather(lat: number = KUTA.lat, lng: number = KUTA.lng) {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const url =
          "https://api.open-meteo.com/v1/forecast?latitude=" + lat +
          "&longitude=" + lng +
          "&current=temperature_2m,weather_code,is_day&timezone=Asia%2FMakassar";
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const json = await res.json();
        if (!alive) return;
        setWeather({
          temperature: Math.round(json.current.temperature_2m),
          code: json.current.weather_code,
          label: labelFor(json.current.weather_code),
          isDay: json.current.is_day === 1,
          updatedAt: new Date(),
        });
        setError(false);
      } catch {
        if (alive) setError(true);
      }
    }
    load();
    const timer = setInterval(load, 15 * 60 * 1000);
    return () => { alive = false; clearInterval(timer); };
  }, [lat, lng]);

  return { weather, error };
}
