"use client";

import { CloudSun, Sun } from "lucide-react";
import { useWeather } from "../lib/use-weather";

export function WeatherChip() {
  const { weather } = useWeather();
  const Icon = weather?.code === 0 ? Sun : CloudSun;
  return (
    <div className="weather-chip" aria-live="polite" title={weather ? `${weather.label}, météo actualisée` : "Météo en cours de chargement"}>
      <Icon aria-hidden="true" />
      <span>{weather ? `${weather.temperature}°` : "—°"}</span>
      <small>Kuta</small>
    </div>
  );
}
