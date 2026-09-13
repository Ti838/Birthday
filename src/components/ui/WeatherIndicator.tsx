/**
 * WeatherIndicator — Pure auto-display pill.
 * Shows live weather info. No click, no modal, no button.
 * Auto-updates from the live weather store every 10 mins via weatherService.
 */

import { motion } from 'framer-motion';
import { useStoryStore } from '../../store/useStoryStore';
import type { WeatherCondition } from '../../types';
import styles from './WeatherIndicator.module.css';

function getWeatherIcon(condition: WeatherCondition, isDay: boolean): string {
  if (condition === 'storm') return '⛈️';
  if (condition === 'heavy-rain') return '🌧️';
  if (condition === 'rain') return '🌦️';
  if (condition === 'snow') return '❄️';
  if (condition === 'fog') return '🌫️';
  if (condition === 'cloudy') return isDay ? '☁️' : '☁️';
  if (condition === 'partly-cloudy') return isDay ? '⛅' : '🌥️';
  return isDay ? '☀️' : '🌙';
}

export function WeatherIndicator() {
  const weather = useStoryStore((s) => s.weather);
  const icon = getWeatherIcon(weather.condition, weather.isDay);

  return (
    <motion.div
      className={styles.weatherBadge}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <span className={styles.icon}>{icon}</span>
      <span className={styles.city}>{weather.cityName}</span>
      <span className={styles.dot}>•</span>
      <span className={styles.temp}>{weather.temperature}°C</span>
      <span className={styles.dot}>•</span>
      <span className={styles.cond}>{weather.condition.replace(/-/g, ' ')}</span>
    </motion.div>
  );
}
