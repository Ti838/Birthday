/**
 * ThemeSync — Real-time weather + day/night CSS variable injector.
 *
 * Reads live WorldWeatherState from the Zustand store and syncs
 * CSS custom properties on :root so every HTML overlay, card,
 * and glassmorphism surface automatically reacts to weather/time.
 *
 * No UI rendered — pure side-effect component.
 */

import { useEffect } from 'react';
import { useStoryStore } from '../store/useStoryStore';
import type { TimeOfDay, WeatherCondition } from '../types';

// ─── Per-TimeOfDay palette tokens ───────────────────────────────────────────

interface PaletteTokens {
  bgObsidian: string;
  bgVelvet: string;
  bgSurfaceLow: string;
  bgSurfaceMid: string;
  bgSurfaceHigh: string;
  textStarlight: string;
  textMuted: string;
  textSubtle: string;
  glassSurface1: string;
  glassSurface2: string;
  glassBorderGold: string;
  starlightGlow: string;
  inkColor: string;
  bodyBg: string;
}

const DAY_PALETTE: PaletteTokens = {
  // Warm sunlit world — light body bg, but cards/glass stay deep for readability
  bodyBg:           '#c8bfae',
  bgObsidian:       '#c8bfae',
  bgVelvet:         '#b8af9e',
  bgSurfaceLow:     '#c2b9a8',
  bgSurfaceMid:     '#b5ac9b',
  bgSurfaceHigh:    '#a89f8e',
  // Cards/overlays stay dark so text is always readable
  textStarlight:    '#fdf6e8',
  textMuted:        '#f0e4c8',
  textSubtle:       '#d4c4a0',
  glassSurface1:    'rgba(18, 14, 8, 0.80)',
  glassSurface2:    'rgba(26, 20, 12, 0.90)',
  glassBorderGold:  'rgba(220, 170, 60, 0.45)',
  starlightGlow:    '0 20px 50px -10px rgba(10, 6, 2, 0.70), 0 0 30px 0 rgba(220, 170, 60, 0.22)',
  inkColor:         '#120d04',
};

const DAWN_PALETTE: PaletteTokens = {
  // Lavender-rose misty morning
  bodyBg:           '#1e1530',
  bgObsidian:       '#1e1530',
  bgVelvet:         '#2a1e40',
  bgSurfaceLow:     '#251840',
  bgSurfaceMid:     '#2e2048',
  bgSurfaceHigh:    '#3a2858',
  textStarlight:    '#fde8f5',
  textMuted:        '#e8d0f0',
  textSubtle:       '#c0a0d0',
  glassSurface1:    'rgba(30, 21, 48, 0.70)',
  glassSurface2:    'rgba(42, 30, 64, 0.85)',
  glassBorderGold:  'rgba(240, 160, 200, 0.30)',
  starlightGlow:    '0 20px 50px -10px rgba(10, 5, 20, 0.75), 0 0 30px 0 rgba(240, 160, 200, 0.18)',
  inkColor:         '#1e1530',
};

const SUNSET_PALETTE: PaletteTokens = {
  // Warm coral-amber — golden hour
  bodyBg:           '#1a0f0a',
  bgObsidian:       '#1a0f0a',
  bgVelvet:         '#261610',
  bgSurfaceLow:     '#221408',
  bgSurfaceMid:     '#2e1c10',
  bgSurfaceHigh:    '#3c2416',
  textStarlight:    '#fff0e0',
  textMuted:        '#f0d0b0',
  textSubtle:       '#d0a878',
  glassSurface1:    'rgba(26, 15, 10, 0.70)',
  glassSurface2:    'rgba(38, 22, 16, 0.86)',
  glassBorderGold:  'rgba(255, 160, 60, 0.38)',
  starlightGlow:    '0 20px 50px -10px rgba(10, 4, 2, 0.80), 0 0 30px 0 rgba(255, 160, 60, 0.20)',
  inkColor:         '#1a0f0a',
};

const DUSK_PALETTE: PaletteTokens = {
  // Deep violet-indigo — evening transition
  bodyBg:           '#0e0a1a',
  bgObsidian:       '#0e0a1a',
  bgVelvet:         '#160e28',
  bgSurfaceLow:     '#120c22',
  bgSurfaceMid:     '#1a1230',
  bgSurfaceHigh:    '#22183c',
  textStarlight:    '#ece8ff',
  textMuted:        '#c8c0f0',
  textSubtle:       '#9888c8',
  glassSurface1:    'rgba(14, 10, 26, 0.72)',
  glassSurface2:    'rgba(22, 14, 40, 0.87)',
  glassBorderGold:  'rgba(160, 120, 255, 0.28)',
  starlightGlow:    '0 20px 50px -10px rgba(5, 3, 12, 0.82), 0 0 30px 0 rgba(160, 120, 255, 0.16)',
  inkColor:         '#0e0a1a',
};

const NIGHT_PALETTE: PaletteTokens = {
  // Deep obsidian — original design
  bodyBg:           '#070913',
  bgObsidian:       '#070913',
  bgVelvet:         '#0e1225',
  bgSurfaceLow:     '#090d20',
  bgSurfaceMid:     '#161a2e',
  bgSurfaceHigh:    '#1b1e32',
  textStarlight:    '#fbf9f5',
  textMuted:        '#dee1fc',
  textSubtle:       '#cfc5b3',
  glassSurface1:    'rgba(14, 18, 37, 0.65)',
  glassSurface2:    'rgba(22, 26, 46, 0.82)',
  glassBorderGold:  'rgba(232, 200, 114, 0.28)',
  starlightGlow:    '0 20px 50px -10px rgba(3, 5, 11, 0.80), 0 0 30px 0 rgba(232, 200, 114, 0.15)',
  inkColor:         '#070913',
};

function getPaletteForTime(timeOfDay: TimeOfDay): PaletteTokens {
  switch (timeOfDay) {
    case 'day':    return DAY_PALETTE;
    case 'dawn':   return DAWN_PALETTE;
    case 'sunset': return SUNSET_PALETTE;
    case 'dusk':   return DUSK_PALETTE;
    case 'night':
    default:       return NIGHT_PALETTE;
  }
}

// ─── Weather overlay tint (applied on top of time palette) ──────────────────

interface WeatherTint {
  glassTintMultiplier: string; // CSS filter on glass overlays
  fogOverlay: string;          // extra fog opacity CSS var
}

function getWeatherTint(condition: WeatherCondition): WeatherTint {
  switch (condition) {
    case 'storm':
      return { glassTintMultiplier: 'saturate(0.7) brightness(0.85)', fogOverlay: '0.18' };
    case 'heavy-rain':
      return { glassTintMultiplier: 'saturate(0.8) brightness(0.90)', fogOverlay: '0.12' };
    case 'rain':
      return { glassTintMultiplier: 'saturate(0.85) brightness(0.93)', fogOverlay: '0.08' };
    case 'fog':
      return { glassTintMultiplier: 'saturate(0.65) brightness(0.92)', fogOverlay: '0.22' };
    case 'snow':
      return { glassTintMultiplier: 'saturate(0.6) brightness(1.08)', fogOverlay: '0.10' };
    case 'cloudy':
      return { glassTintMultiplier: 'saturate(0.88) brightness(0.95)', fogOverlay: '0.04' };
    case 'partly-cloudy':
      return { glassTintMultiplier: 'saturate(0.95) brightness(0.98)', fogOverlay: '0.02' };
    case 'clear':
    default:
      return { glassTintMultiplier: 'saturate(1) brightness(1)', fogOverlay: '0' };
  }
}

// ─── Apply all tokens to :root ───────────────────────────────────────────────

function applyTheme(timeOfDay: TimeOfDay, condition: WeatherCondition) {
  const p = getPaletteForTime(timeOfDay);
  const w = getWeatherTint(condition);
  const root = document.documentElement;

  // Set time-of-day attribute for CSS selector targeting
  root.setAttribute('data-timeofday', timeOfDay);
  root.setAttribute('data-weather', condition);

  // Core background tokens
  root.style.setProperty('--bg-obsidian',       p.bgObsidian);
  root.style.setProperty('--bg-velvet',         p.bgVelvet);
  root.style.setProperty('--bg-surface-lowest', p.bgSurfaceLow);
  root.style.setProperty('--bg-surface-low',    p.bgSurfaceLow);
  root.style.setProperty('--bg-surface-mid',    p.bgSurfaceMid);
  root.style.setProperty('--bg-surface-high',   p.bgSurfaceHigh);

  // Text tokens
  root.style.setProperty('--text-starlight',    p.textStarlight);
  root.style.setProperty('--text-muted',        p.textMuted);
  root.style.setProperty('--text-subtle',       p.textSubtle);

  // Glass surface tokens
  root.style.setProperty('--glass-surface-1',   p.glassSurface1);
  root.style.setProperty('--glass-surface-2',   p.glassSurface2);
  root.style.setProperty('--glass-border-gold', p.glassBorderGold);
  root.style.setProperty('--starlight-glow',    p.starlightGlow);

  // Legacy aliases
  root.style.setProperty('--ink',               p.inkColor);
  root.style.setProperty('--caption-color',     p.textStarlight);

  // Body background (the canvas backdrop HTML)
  document.body.style.background = p.bodyBg;

  // Weather tint custom props for optional overlay consumers
  root.style.setProperty('--weather-tint',      w.glassTintMultiplier);
  root.style.setProperty('--weather-fog-alpha', w.fogOverlay);
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ThemeSync() {
  const timeOfDay = useStoryStore((s) => s.weather.timeOfDay);
  const condition = useStoryStore((s) => s.weather.condition);

  useEffect(() => {
    applyTheme(timeOfDay, condition);
  }, [timeOfDay, condition]);

  // Run once on mount with initial store state
  useEffect(() => {
    const { weather } = useStoryStore.getState();
    applyTheme(weather.timeOfDay, weather.condition);
  }, []);

  return null;
}


// 

