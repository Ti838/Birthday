import type { WorldWeatherState } from '../types';

const CACHE_KEY = 'tithi_weather_cache_v1';
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

// Default fallback coordinates (Dhaka, Bangladesh)
const DEFAULT_COORDS = {
  latitude: 23.8103,
  longitude: 90.4125,
  cityName: 'Dhaka',
};

// Common city presets
export const POPULAR_CITIES = [
  { name: 'Dhaka', lat: 23.8103, lon: 90.4125 },
  { name: 'Chittagong', lat: 22.3569, lon: 91.7832 },
  { name: 'Sylhet', lat: 24.8949, lon: 91.8687 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', lat: 40.7128, lon: -74.0060 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  { name: 'Paris', lat: 48.8566, lon: 2.3522 },
];

/** Maps WMO weather code to internal condition */
function mapWmoCodeToCondition(code: number): WorldWeatherState['condition'] {
  if (code === 0) return 'clear';
  if (code === 1 || code === 2) return 'partly-cloudy';
  if (code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 67) return 'rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 80 && code <= 82) return 'heavy-rain';
  if (code >= 95) return 'storm';
  return 'clear';
}

/** Determines time of day based on current time and sunrise/sunset */
function determineTimeOfDay(now: Date, sunriseStr?: string, sunsetStr?: string): WorldWeatherState['timeOfDay'] {
  const currentHour = now.getHours() + now.getMinutes() / 60;

  let sunriseHour = 6.0;
  let sunsetHour = 18.0;

  if (sunriseStr && sunsetStr) {
    try {
      const sr = new Date(sunriseStr);
      const ss = new Date(sunsetStr);
      sunriseHour = sr.getHours() + sr.getMinutes() / 60;
      sunsetHour = ss.getHours() + ss.getMinutes() / 60;
    } catch {
      // fallback
    }
  }

  // Dawn: 45 min before to 45 min after sunrise
  if (currentHour >= sunriseHour - 0.75 && currentHour < sunriseHour + 0.75) {
    return 'dawn';
  }
  // Day: after sunrise dawn to 1 hour before sunset
  if (currentHour >= sunriseHour + 0.75 && currentHour < sunsetHour - 1.0) {
    return 'day';
  }
  // Sunset: 1 hour before sunset to 20 min after sunset
  if (currentHour >= sunsetHour - 1.0 && currentHour < sunsetHour + 0.35) {
    return 'sunset';
  }
  // Dusk: 20 min after sunset to 1.5 hour after sunset
  if (currentHour >= sunsetHour + 0.35 && currentHour < sunsetHour + 1.5) {
    return 'dusk';
  }
  // Night
  return 'night';
}

/** Fallback weather state when offline or API fails */
export function getDefaultWeatherState(cityName = 'Dhaka'): WorldWeatherState {
  const now = new Date();
  const timeOfDay = determineTimeOfDay(now);
  const isDay = timeOfDay === 'day' || timeOfDay === 'dawn';

  return {
    condition: 'clear',
    timeOfDay,
    cityName,
    temperature: 26,
    humidity: 65,
    cloudCoverage: 0.15,
    precipitation: 0,
    rainIntensity: 0,
    windSpeed: 3.2,
    windNormalized: 0.25,
    fogDensity: 0.05,
    sunrise: '06:00 AM',
    sunset: '06:00 PM',
    isDay,
    lastUpdated: Date.now(),
  };
}

/** Fetch live real weather from Open-Meteo API */
export async function fetchLiveWeather(
  latitude = DEFAULT_COORDS.latitude,
  longitude = DEFAULT_COORDS.longitude,
  cityName = DEFAULT_COORDS.cityName
): Promise<WorldWeatherState> {
  // Check local cache
  try {
    const cached = localStorage.getItem(`${CACHE_KEY}_${cityName}`);
    if (cached) {
      const data: WorldWeatherState = JSON.parse(cached);
      if (Date.now() - (data.lastUpdated || 0) < CACHE_DURATION_MS) {
        // Refresh time of day live
        data.timeOfDay = determineTimeOfDay(new Date());
        return data;
      }
    }
  } catch {
    // ignore storage error
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&daily=sunrise,sunset&timezone=auto`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);

    const json = await res.json();
    const current = json.current;
    const daily = json.daily;

    const weatherCode = current.weather_code ?? 0;
    const condition = mapWmoCodeToCondition(weatherCode);

    const now = new Date();
    const sunriseStr = daily?.sunrise?.[0];
    const sunsetStr = daily?.sunset?.[0];
    const timeOfDay = determineTimeOfDay(now, sunriseStr, sunsetStr);

    const cloudCoverage = Math.max(0, Math.min(1, (current.cloud_cover ?? 10) / 100));
    const precipitation = current.precipitation ?? current.rain ?? 0;
    const rainIntensity = Math.max(0, Math.min(1, precipitation > 0 ? precipitation / 8.0 : condition.includes('rain') ? 0.4 : 0));
    const windSpeed = current.wind_speed_10m ?? 3.5;
    const windNormalized = Math.max(0.1, Math.min(1.0, windSpeed / 25.0));
    const fogDensity = condition === 'fog' ? 0.75 : Math.max(0.02, Math.min(0.35, ((current.relative_humidity_2m ?? 50) - 40) / 160));

    const state: WorldWeatherState = {
      condition,
      timeOfDay,
      cityName,
      temperature: Math.round(current.temperature_2m ?? 26),
      humidity: Math.round(current.relative_humidity_2m ?? 60),
      cloudCoverage,
      precipitation,
      rainIntensity,
      windSpeed: Math.round(windSpeed * 10) / 10,
      windNormalized,
      fogDensity,
      sunrise: sunriseStr ? new Date(sunriseStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '06:00 AM',
      sunset: sunsetStr ? new Date(sunsetStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '06:00 PM',
      isDay: Boolean(current.is_day ?? (timeOfDay === 'day' || timeOfDay === 'dawn')),
      lastUpdated: Date.now(),
    };

    try {
      localStorage.setItem(`${CACHE_KEY}_${cityName}`, JSON.stringify(state));
    } catch {
      // ignore storage error
    }

    return state;
  } catch (err) {
    console.warn('Weather fetch error, using graceful fallback:', err);
    return getDefaultWeatherState(cityName);
  }
}

