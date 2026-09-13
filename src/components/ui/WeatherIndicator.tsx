import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore } from '../../store/useStoryStore';
import { POPULAR_CITIES, fetchLiveWeather } from '../../services/weatherService';
import type { WeatherCondition, TimeOfDay } from '../../types';
import styles from './WeatherIndicator.module.css';

const PRESET_MODES: { label: string; icon: string; condition: WeatherCondition; timeOfDay: TimeOfDay; isDay: boolean; cloudCoverage: number; rainIntensity: number; fogDensity: number }[] = [
  { label: 'Live Weather', icon: '🌍', condition: 'clear', timeOfDay: 'night', isDay: false, cloudCoverage: 0.2, rainIntensity: 0, fogDensity: 0.05 },
  { label: 'Clear Day', icon: '☀️', condition: 'clear', timeOfDay: 'day', isDay: true, cloudCoverage: 0.05, rainIntensity: 0, fogDensity: 0.02 },
  { label: 'Golden Sunset', icon: '🌅', condition: 'clear', timeOfDay: 'sunset', isDay: false, cloudCoverage: 0.25, rainIntensity: 0, fogDensity: 0.08 },
  { label: 'Starlight Night', icon: '✨', condition: 'clear', timeOfDay: 'night', isDay: false, cloudCoverage: 0.1, rainIntensity: 0, fogDensity: 0.04 },
  { label: 'Rainy Night', icon: '🌧️', condition: 'rain', timeOfDay: 'night', isDay: false, cloudCoverage: 0.85, rainIntensity: 0.65, fogDensity: 0.25 },
  { label: 'Misty Dawn', icon: '🌫️', condition: 'fog', timeOfDay: 'dawn', isDay: true, cloudCoverage: 0.6, rainIntensity: 0, fogDensity: 0.65 },
  { label: 'Summer Storm', icon: '⚡', condition: 'storm', timeOfDay: 'night', isDay: false, cloudCoverage: 0.95, rainIntensity: 0.9, fogDensity: 0.4 },
];

function getWeatherIcon(condition: WeatherCondition, isDay: boolean): string {
  if (condition === 'storm') return '⚡';
  if (condition.includes('rain')) return '🌧️';
  if (condition === 'snow') return '❄️';
  if (condition === 'fog') return '🌫️';
  if (condition === 'cloudy' || condition === 'partly-cloudy') return isDay ? '⛅' : '☁️';
  return isDay ? '☀️' : '🌙';
}

export function WeatherIndicator() {
  const weather = useStoryStore((s) => s.weather);
  const setWeather = useStoryStore((s) => s.setWeather);
  const modalOpen = useStoryStore((s) => s.weatherModalOpen);
  const setModalOpen = useStoryStore((s) => s.setWeatherModalOpen);

  const [loading, setLoading] = useState(false);
  const [activePreset, setActivePreset] = useState<string>('Live Weather');

  const icon = getWeatherIcon(weather.condition, weather.isDay);

  const handleCitySelect = async (city: (typeof POPULAR_CITIES)[0]) => {
    setLoading(true);
    const data = await fetchLiveWeather(city.lat, city.lon, city.name);
    setWeather(data);
    setActivePreset('Live Weather');
    setLoading(false);
  };

  const handleApplyPreset = (p: (typeof PRESET_MODES)[0]) => {
    setActivePreset(p.label);
    if (p.label === 'Live Weather') {
      const city = POPULAR_CITIES.find((c) => c.name === weather.cityName) || POPULAR_CITIES[0];
      handleCitySelect(city);
    } else {
      setWeather({
        condition: p.condition,
        timeOfDay: p.timeOfDay,
        isDay: p.isDay,
        cloudCoverage: p.cloudCoverage,
        rainIntensity: p.rainIntensity,
        fogDensity: p.fogDensity,
      });
    }
  };

  return (
    <>
      {/* Sleek Minimalist Top Weather Pill */}
      <motion.button
        className={styles.weatherBadge}
        onClick={() => setModalOpen(true)}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        title="View Real-Time Weather & Atmosphere"
      >
        <span className={styles.icon}>{icon}</span>
        <span className={styles.city}>{weather.cityName}</span>
        <span className={styles.dot}>•</span>
        <span className={styles.temp}>{weather.temperature}°C</span>
        <span className={styles.dot}>•</span>
        <span className={styles.cond}>{weather.condition.replace('-', ' ')}</span>
      </motion.button>

      {/* Weather & Location Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className={styles.modalBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setModalOpen(false);
            }}
          >
            <motion.div
              className={styles.modalCard}
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.modalHeader}>
                <div>
                  <span className={styles.subTitle}>✦ REAL-TIME ATMOSPHERE ✦</span>
                  <h3 className={styles.title}>Tithi's Weather Universe</h3>
                </div>
                <button
                  className={styles.closeBtn}
                  onClick={() => setModalOpen(false)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Current Metrics */}
              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Condition</span>
                  <span className={styles.metricVal}>
                    {icon} {weather.condition.toUpperCase()}
                  </span>
                </div>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Temperature</span>
                  <span className={styles.metricVal}>{weather.temperature}°C</span>
                </div>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Wind</span>
                  <span className={styles.metricVal}>{weather.windSpeed} m/s</span>
                </div>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Sunset / Sunrise</span>
                  <span className={styles.metricVal}>{weather.sunset}</span>
                </div>
              </div>

              {/* City Switcher */}
              <div className={styles.sectionWrap}>
                <p className={styles.sectionLabel}>Real-World Location:</p>
                <div className={styles.pillsRow}>
                  {POPULAR_CITIES.map((c) => (
                    <button
                      key={c.name}
                      className={`${styles.pillBtn} ${weather.cityName === c.name ? styles.pillActive : ''}`}
                      onClick={() => handleCitySelect(c)}
                      disabled={loading}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulation Presets */}
              <div className={styles.sectionWrap}>
                <p className={styles.sectionLabel}>Atmosphere & Weather Simulation:</p>
                <div className={styles.presetGrid}>
                  {PRESET_MODES.map((p) => (
                    <button
                      key={p.label}
                      className={`${styles.presetBtn} ${activePreset === p.label ? styles.presetActive : ''}`}
                      onClick={() => handleApplyPreset(p)}
                    >
                      <span>{p.icon}</span>
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button className={styles.applyBtn} onClick={() => setModalOpen(false)}>
                  Return to Birthday World ✦
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

