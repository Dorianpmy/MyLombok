export const LOMBOK_WEATHER_CITY_STORAGE_KEY = "my-lombok-weather-city";
/** Événement local pour synchroniser météo et horaires de prière dans le même onglet. */
export const LOMBOK_WEATHER_CITY_CHANGE_EVENT = "my-lombok:weather-city-change";

export const LOMBOK_WEATHER_CITIES = [
  { id: "mataram", name: "Mataram", lat: -8.5833, lng: 116.1167 },
  { id: "kuta", name: "Kuta Mandalika", lat: -8.8947, lng: 116.2832 },
  { id: "senggigi", name: "Senggigi", lat: -8.4939, lng: 116.0436 },
  { id: "praya", name: "Praya", lat: -8.7054, lng: 116.2704 },
  { id: "selong", name: "Selong", lat: -8.6529, lng: 116.5319 },
  { id: "tetebatu", name: "Tetebatu", lat: -8.5523, lng: 116.4197 },
  { id: "sembalun", name: "Sembalun", lat: -8.3632, lng: 116.5318 },
  { id: "tanjung", name: "Tanjung", lat: -8.356, lng: 116.1565 },
  { id: "gili-trawangan", name: "Gili Trawangan", lat: -8.3502, lng: 116.0387 },
] as const;

export type LombokWeatherCity = (typeof LOMBOK_WEATHER_CITIES)[number];
export type LombokWeatherCityId = LombokWeatherCity["id"];

export const DEFAULT_LOMBOK_WEATHER_CITY_ID: LombokWeatherCityId = "mataram";

export function isLombokWeatherCityId(value: string | null): value is LombokWeatherCityId {
  return LOMBOK_WEATHER_CITIES.some((city) => city.id === value);
}

export function getLombokWeatherCity(id: string | null | undefined): LombokWeatherCity {
  return LOMBOK_WEATHER_CITIES.find((city) => city.id === id)
    ?? LOMBOK_WEATHER_CITIES.find((city) => city.id === DEFAULT_LOMBOK_WEATHER_CITY_ID)!;
}

export function createOpenMeteoUrl(city: LombokWeatherCity) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(city.lat));
  url.searchParams.set("longitude", String(city.lng));
  url.searchParams.set("current", "temperature_2m,apparent_temperature,weather_code,is_day");
  url.searchParams.set("temperature_unit", "celsius");
  url.searchParams.set("timezone", "Asia/Makassar");
  return url.toString();
}

export function weatherLabelFor(code: number): string {
  if (code === 0) return "Ciel dégagé";
  if (code <= 2) return "Peu nuageux";
  if (code === 3) return "Couvert";
  if (code <= 48) return "Brume";
  if (code <= 55) return "Bruine";
  if (code <= 65) return "Pluie";
  if (code <= 86) return "Averses";
  if (code >= 95) return "Orage";
  return "Conditions inconnues";
}

type OpenMeteoPayload = {
  current?: {
    temperature_2m?: unknown;
    apparent_temperature?: unknown;
    weather_code?: unknown;
    is_day?: unknown;
  };
};

export function parseOpenMeteoCurrent(payload: OpenMeteoPayload) {
  const temperature = payload.current?.temperature_2m;
  const apparentTemperature = payload.current?.apparent_temperature;
  const code = payload.current?.weather_code;
  const isDay = payload.current?.is_day;

  if (
    typeof temperature !== "number"
    || !Number.isFinite(temperature)
    || typeof apparentTemperature !== "number"
    || !Number.isFinite(apparentTemperature)
    || typeof code !== "number"
    || !Number.isFinite(code)
    || (isDay !== 0 && isDay !== 1)
  ) {
    throw new Error("Réponse météo Open-Meteo invalide");
  }

  return {
    temperature: Math.round(temperature),
    apparentTemperature: Math.round(apparentTemperature),
    code,
    label: weatherLabelFor(code),
    isDay: isDay === 1,
  };
}
