export type Stage =
  | 'loading'
  | '01_night'
  | 'guest_showcase'
  | '02_gift'
  | '03_world'
  | '04_letter'
  | '05_constellation'
  | '06_balloons'
  | '07_stargame'
  | '08_garden'
  | '09_cake'
  | '10_wish'
  | '11_wish_stars'
  | '12_fireworks'
  | '13_hidden_surprise'
  | '14_quiet_night';

export type Theme = 'day' | 'night';

export type WeatherCondition =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rain'
  | 'heavy-rain'
  | 'storm'
  | 'fog'
  | 'snow'
  | 'wind';

export type TimeOfDay = 'dawn' | 'day' | 'sunset' | 'dusk' | 'night';

export interface WorldWeatherState {
  condition: WeatherCondition;
  timeOfDay: TimeOfDay;
  cityName: string;
  temperature: number;
  humidity: number;
  cloudCoverage: number; // 0 to 1
  precipitation: number; // mm/h
  rainIntensity: number; // 0 to 1
  windSpeed: number; // m/s
  windNormalized: number; // 0 to 1
  fogDensity: number; // 0 to 1
  sunrise: string;
  sunset: string;
  isDay: boolean;
  lastUpdated?: number;
}

export interface CameraWaypoint {
  pos: [number, number, number];
  look: [number, number, number];
  fov?: number;
  duration?: number;
}

export interface Palette {
  sky: string;
  fog: string;
  ambient: string;
  ambientI: number;
  sun: string;
  sunI: number;
  ground: string;
  giftBody: string;
  ribbon: string;
}
