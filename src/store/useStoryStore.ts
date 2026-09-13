import { create } from 'zustand';
import type { Stage, Theme, WorldWeatherState } from '../types';
import { getDefaultWeatherState } from '../services/weatherService';

interface StoryState {
  stage: Stage;
  theme: Theme;
  weather: WorldWeatherState;
  weatherModalOpen: boolean;
  soundEnabled: boolean;
  musicOn: boolean;
  isVIP: boolean;
  giftOpened: boolean;
  letterOpened: boolean;
  letterPage: number;
  constellationStars: string[];
  poppedBalloons: number[];
  starsCollected: number;
  gardenBloomed: number[];
  gardenCompleted: boolean;
  activeFlowerIndex: number | null;
  candlesBlown: boolean;
  wishMade: boolean;
  fireworksStarted: boolean;
  finalSurpriseOpened: boolean;
  caption: string;
  hint: string;
  showContinue: boolean;
  showReplay: boolean;

  setStage: (s: Stage) => void;
  setTheme: (t: Theme) => void;
  setWeather: (w: Partial<WorldWeatherState>) => void;
  setWeatherModalOpen: (open: boolean) => void;
  toggleSound: () => void;
  setSoundEnabled: (v: boolean) => void;
  setVIP: (v: boolean) => void;
  openGift: () => void;
  openLetter: () => void;
  closeLetter: () => void;
  setLetterPage: (page: number) => void;
  collectConstellationStar: (name: string) => void;
  popBalloon: (idx: number) => void;
  collectStar: () => void;
  bloomFlower: (idx: number) => void;
  setActiveFlowerIndex: (idx: number | null) => void;
  completeGarden: () => void;
  blowCandles: () => void;
  makeWish: () => void;
  startFireworks: () => void;
  openFinalSurprise: () => void;
  setCaption: (text: string) => void;
  setHint: (text: string) => void;
  setShowContinue: (v: boolean) => void;
  setShowReplay: (v: boolean) => void;
  resetExperience: () => void;
}

export const useStoryStore = create<StoryState>((set) => ({
  stage: '01_night',
  theme: 'night',
  weather: getDefaultWeatherState('Dhaka'),
  weatherModalOpen: false,
  soundEnabled: true,
  musicOn: true,
  isVIP: false,
  giftOpened: false,
  letterOpened: false,
  letterPage: 0,
  constellationStars: [],
  poppedBalloons: [],
  starsCollected: 0,
  gardenBloomed: [],
  gardenCompleted: false,
  activeFlowerIndex: null,
  candlesBlown: false,
  wishMade: false,
  fireworksStarted: false,
  finalSurpriseOpened: false,
  caption: '',
  hint: '',
  showContinue: false,
  showReplay: false,

  setStage: (stage) => set({ stage }),
  setTheme: (theme) => set({ theme }),
  setWeather: (w) =>
    set((s) => ({
      weather: { ...s.weather, ...w },
      theme: (w.isDay ?? s.weather.isDay) ? 'day' : 'night',
    })),
  setWeatherModalOpen: (weatherModalOpen) => set({ weatherModalOpen }),
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled, musicOn: !s.soundEnabled })),
  setSoundEnabled: (soundEnabled) => set({ soundEnabled, musicOn: soundEnabled }),
  setVIP: (isVIP) => set({ isVIP }),
  openGift: () => set({ giftOpened: true }),
  openLetter: () => set({ letterOpened: true }),
  closeLetter: () => set({ letterOpened: false }),
  setLetterPage: (letterPage) => set({ letterPage }),
  collectConstellationStar: (name) =>
    set((s) => ({
      constellationStars: s.constellationStars.includes(name)
        ? s.constellationStars
        : [...s.constellationStars, name],
    })),
  popBalloon: (idx) =>
    set((s) => ({
      poppedBalloons: s.poppedBalloons.includes(idx)
        ? s.poppedBalloons
        : [...s.poppedBalloons, idx],
    })),
  collectStar: () =>
    set((s) => ({
      starsCollected: Math.min(10, s.starsCollected + 1),
    })),
  bloomFlower: (idx) =>
    set((s) => {
      const next = s.gardenBloomed.includes(idx)
        ? s.gardenBloomed
        : [...s.gardenBloomed, idx];
      return {
        gardenBloomed: next,
        gardenCompleted: next.length >= 5,
        activeFlowerIndex: idx,
      };
    }),
  setActiveFlowerIndex: (activeFlowerIndex) => set({ activeFlowerIndex }),
  completeGarden: () => set({ gardenCompleted: true }),
  blowCandles: () => set({ candlesBlown: true }),
  makeWish: () => set({ wishMade: true }),
  startFireworks: () => set({ fireworksStarted: true }),
  openFinalSurprise: () => set({ finalSurpriseOpened: true }),
  setCaption: (caption) => set({ caption }),
  setHint: (hint) => set({ hint }),
  setShowContinue: (showContinue) => set({ showContinue }),
  setShowReplay: (showReplay) => set({ showReplay }),
  resetExperience: () =>
    set({
      stage: '01_night',
      theme: 'night',
      weather: getDefaultWeatherState('Dhaka'),
      weatherModalOpen: false,
      isVIP: false,
      giftOpened: false,
      letterOpened: false,
      letterPage: 0,
      constellationStars: [],
      poppedBalloons: [],
      starsCollected: 0,
      gardenBloomed: [],
      gardenCompleted: false,
      activeFlowerIndex: null,
      candlesBlown: false,
      wishMade: false,
      fireworksStarted: false,
      finalSurpriseOpened: false,
      caption: '',
      hint: '',
      showContinue: false,
      showReplay: false,
    }),
}));
