import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { AnimatePresence } from 'framer-motion';

import { GiftBox } from '../three/GiftBox';
import { Envelope } from '../three/Envelope';
import { Balloons } from '../three/Balloons';
import { Cake } from '../three/Cake';
import { Fireworks } from '../three/Fireworks';
import { Environment } from '../three/Environment';
import { Flowers } from '../three/Flowers';
import { Chocolates } from '../three/Chocolates';
import { WeatherSystem } from '../three/WeatherSystem';

import {
  CaptionLayer,
  TopControlsDock,
  FloatingInstructionBanner,
  Loader,
  WishBubble,
} from './ui/UI';
import { CountdownOverlay } from './ui/CountdownOverlay';
import { CinematicIntro } from './ui/CinematicIntro';
import { GuestShowcaseOverlay } from './ui/GuestShowcaseOverlay';
import { LetterOverlay } from './letter/LetterOverlay';
import { ConstellationOverlay } from './ui/ConstellationOverlay';
import { StarChallengeOverlay } from './ui/StarChallengeOverlay';
import { SecretGardenOverlay } from './ui/SecretGardenOverlay';
import { CakeWishOverlay } from './ui/CakeWishOverlay';
import { FinalHiddenSurprise } from './ui/FinalHiddenSurprise';
import { ThemeSync } from './ThemeSync';

import { useStoryStore } from '../store/useStoryStore';
import { useParallax } from '../hooks/useParallax';
import { useResponsive } from '../hooks/useResponsive';
import { fetchLiveWeather } from '../services/weatherService';
import {
  unlockAudio,
  startMusic,
  playChime,
  playFireworksBoom,
  playHappyBirthdaySong,
} from '../utils/music';

// ─── Camera controller with GSAP Choreography ─────────────────────
// oxlint-disable react/immutability -- camera.position mutation is the standard R3F useFrame pattern
function CameraController() {
  const { camera } = useThree();
  const parallax = useParallax();
  const basePos = useRef(new THREE.Vector3(0, 4.6, 12));
  const lookTarget = useRef(new THREE.Vector3(0, 0.6, 0));
  const parallaxStrength = useRef(0.25);

  useEffect(() => {
    (window as any).__tweenCamera = (
      pos: [number, number, number],
      look: [number, number, number],
      duration = 2.6,
      ease = 'power2.inOut',
      strength = 0.28,
      onComplete?: () => void
    ) => {
      const from = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
        lx: lookTarget.current.x,
        ly: lookTarget.current.y,
        lz: lookTarget.current.z,
      };
      gsap.to(from, {
        x: pos[0],
        y: pos[1],
        z: pos[2],
        lx: look[0],
        ly: look[1],
        lz: look[2],
        duration,
        ease,
        onUpdate: () => {
          camera.position.set(from.x, from.y, from.z);
          lookTarget.current.set(from.lx, from.ly, from.lz);
        },
        onComplete: () => {
          basePos.current.set(pos[0], pos[1], pos[2]);
          parallaxStrength.current = strength;
          onComplete?.();
        },
      });
    };
    camera.position.set(0, 4.6, 12);
    camera.lookAt(0, 0.6, 0);
  }, [camera]);

  useFrame(() => {
    if (!gsap.isTweening(camera.position)) {
      const px = parallax.current.x;
      const py = parallax.current.y;
      const s = parallaxStrength.current;
      camera.position.x += (basePos.current.x + px * s - camera.position.x) * 0.04;
      camera.position.y += (basePos.current.y + py * s * 0.5 - camera.position.y) * 0.04;
      camera.position.z += (basePos.current.z - camera.position.z) * 0.04;
    }
    camera.lookAt(lookTarget.current);
  });

  return null;
}
// oxlint-enable react/immutability

// ─── Real-Time Weather & Time-of-Day Scene Lighting ───────────────────
function SceneLighting() {
  const weather = useStoryStore((s) => s.weather);
  const timeOfDay = weather.timeOfDay;
  const cloudCoverage = weather.cloudCoverage ?? 0.15;
  const fogDensity = weather.fogDensity ?? 0.05;

  const lighting = useMemo(() => {
    // Clear / Cloudy Daytime (10:00 AM - 4:30 PM) -> Radiant Blue Sky!
    if (timeOfDay === 'day') {
      const isCloudy = cloudCoverage > 0.45;
      return {
        sky: isCloudy ? '#7D9BB8' : '#4E92E8',
        fog: isCloudy ? '#96B1CB' : '#7CB4F8',
        fogDensity: 0.015 + fogDensity * 0.025,
        ambientColor: '#FFFFFF',
        ambientIntensity: isCloudy ? 0.95 : 1.18,
        sunColor: '#FFF8E7',
        sunIntensity: isCloudy ? 1.05 : 1.55,
        fillColor: '#E3F2FD',
        fillIntensity: 0.55,
        hemiSky: '#E1F5FE',
        hemiGround: '#8D6E63',
      };
    }
    // Dawn (Sunrise)
    if (timeOfDay === 'dawn') {
      return {
        sky: '#3F4E75',
        fog: '#5C6B94',
        fogDensity: 0.022 + fogDensity * 0.03,
        ambientColor: '#FFE0B2',
        ambientIntensity: 0.88,
        sunColor: '#FFCC80',
        sunIntensity: 1.25 * (1 - cloudCoverage * 0.3),
        fillColor: '#CE93D8',
        fillIntensity: 0.45,
        hemiSky: '#E8EAF6',
        hemiGround: '#3E2723',
      };
    }
    // Golden Sunset (Golden Hour)
    if (timeOfDay === 'sunset') {
      return {
        sky: '#E06D53',
        fog: '#C85A48',
        fogDensity: 0.022 + fogDensity * 0.03,
        ambientColor: '#FFE0B2',
        ambientIntensity: 0.92,
        sunColor: '#FFA726',
        sunIntensity: 1.35 * (1 - cloudCoverage * 0.3),
        fillColor: '#FF7043',
        fillIntensity: 0.52,
        hemiSky: '#FFCCBC',
        hemiGround: '#4E342E',
      };
    }
    // Dusk (Twilight)
    if (timeOfDay === 'dusk') {
      return {
        sky: '#1E1B38',
        fog: '#2A244D',
        fogDensity: 0.025 + fogDensity * 0.035,
        ambientColor: '#B39DDB',
        ambientIntensity: 0.78,
        sunColor: '#D1C4E9',
        sunIntensity: 0.85,
        fillColor: '#7E57C2',
        fillIntensity: 0.4,
        hemiSky: '#9FA8DA',
        hemiGround: '#1A237E',
      };
    }
    // Midnight Stars & Moon Night
    return {
      sky: '#070B19',
      fog: '#0C1226',
      fogDensity: 0.024 + fogDensity * 0.035,
      ambientColor: '#8FA5D8',
      ambientIntensity: 0.78,
      sunColor: '#FFE5A4',
      sunIntensity: 0.88 * (1 - cloudCoverage * 0.3),
      fillColor: '#7A8CDE',
      fillIntensity: 0.38,
      hemiSky: '#8EA4E8',
      hemiGround: '#0E1225',
    };
  }, [timeOfDay, cloudCoverage, fogDensity]);

  return (
    <>
      <color attach="background" args={[lighting.sky]} />
      <fogExp2 attach="fog" args={[lighting.fog, lighting.fogDensity]} />

      {/* Ambient lighting */}
      <ambientLight color={lighting.ambientColor} intensity={lighting.ambientIntensity} />

      {/* Key sun/moon light */}
      <directionalLight
        color={lighting.sunColor}
        intensity={lighting.sunIntensity}
        position={[5, 12, 6]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0016}
        shadow-radius={2.5}
      />

      {/* Warm Fill Light */}
      <directionalLight
        color={lighting.fillColor}
        intensity={lighting.fillIntensity}
        position={[-5, 4, 8]}
      />

      {/* Back rim */}
      <directionalLight
        color={timeOfDay === 'day' ? '#FFF' : '#7A8CDE'}
        intensity={timeOfDay === 'day' ? 0.45 : 0.3}
        position={[-4, 3, -8]}
      />

      {/* Hemisphere Light */}
      <hemisphereLight
        color={lighting.hemiSky}
        groundColor={lighting.hemiGround}
        intensity={0.45}
      />
    </>
  );
}

// ─── Main 14-Stage Experience Orchestrator ────────────────────────
export default function Experience() {
  const stage = useStoryStore((s) => s.stage);
  const isVIP = useStoryStore((s) => s.isVIP);
  const setVIP = useStoryStore((s) => s.setVIP);
  const theme = useStoryStore((s) => s.theme);
  const weather = useStoryStore((s) => s.weather);
  const setStage = useStoryStore((s) => s.setStage);
  const setCaption = useStoryStore((s) => s.setCaption);
  const setHint = useStoryStore((s) => s.setHint);
  const setShowContinue = useStoryStore((s) => s.setShowContinue);
  const resetExperience = useStoryStore((s) => s.resetExperience);
  const { isMobile } = useResponsive();

  const [loaded, setLoaded] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [envelopeInteractive, setEnvelopeInteractive] = useState(false);
  const [balloonsInteractive, setBalloonsInteractive] = useState(false);
  const [fireworksActive, setFireworksActive] = useState(false);
  const [wishes, setWishes] = useState<{ id: number; text: string; x: number; y: number }[]>([]);

  const isNight =
    theme === 'night' ||
    !weather.isDay ||
    stage === '12_fireworks' ||
    stage === '13_hidden_surprise' ||
    stage === '14_quiet_night';

  const tweenCam = useCallback(
    (
      pos: [number, number, number],
      look: [number, number, number],
      dur = 2.6,
      ease = 'power2.inOut',
      strength = 0.28,
      cb?: () => void
    ) => {
      (window as any).__tweenCamera?.(pos, look, dur, ease, strength, cb);
    },
    []
  );

  const showCaption = useCallback(
    (text: string, holdMs = 2600): Promise<void> => {
      return new Promise((resolve) => {
        setCaption(text);
        setTimeout(() => {
          setCaption('');
          setTimeout(resolve, 600);
        }, holdMs);
      });
    },
    [setCaption]
  );

  // ─── Stage Handlers with Harmonious Spatial Coordinates ──────────────

  // Stage 01 -> Unlocked: Handles either VIP or Guest View
  const handleCountdownUnlock = useCallback(async () => {
    unlockAudio();
    startMusic();
    const currentIsVIP = useStoryStore.getState().isVIP;

    if (!currentIsVIP) {
      // Guest View: Cinematic framing right in front of cake and celebration
      setStage('guest_showcase');
      const camPos: [number, number, number] = isMobile ? [0.0, 2.4, 5.2] : [0.0, 2.2, 4.6];
      tweenCam(camPos, [0.0, 0.85, -0.2], 3.2, 'power2.inOut', 0.25);
      setHint('');
      return;
    }

    // Tithi VIP View: Grand Cinematic Intro from the sky
    setStage('01_intro_cinematic');
    
    // Jump camera high into the sky instantly, then sweep down
    tweenCam([0, 18, 10], [0, 0, 0], 0, 'none', 0, () => {
      const camPos: [number, number, number] = isMobile ? [-2.4, 1.8, 3.8] : [-2.4, 1.6, 3.2];
      tweenCam(camPos, [-2.4, 0.5, 1.2], 5.0, 'power2.inOut', 0.18);
    });
    
    setTimeout(() => {
      showCaption('Every birthday needs a present... ✦', 2000);
      setHint('Tap the glowing gift box to open ✦');
    }, 5500);
  }, [setStage, isMobile, tweenCam, showCaption, setHint]);

  const handleGuestFocusView = useCallback(
    (view: 'world' | 'cake' | 'flowers' | 'balloons' | 'letter' | 'gift') => {
      // Only runs when Guest is active
      if (useStoryStore.getState().isVIP) return;

      switch (view) {
        case 'world':
          tweenCam(isMobile ? [0, 2.8, 5.6] : [0, 2.4, 5.0], [0, 0.6, 0], 2.4, 'power2.inOut');
          break;
        case 'cake':
          tweenCam(isMobile ? [0, 0.8, 2.0] : [0, 0.8, 1.8], [0, 0.2, 0], 2.0, 'power2.out');
          break;
        case 'letter':
          tweenCam(isMobile ? [0, 1.45, 2.8] : [0, 1.35, 2.5], [0, 0.42, 1.4], 2.4, 'power2.inOut');
          break;
        case 'flowers':
          tweenCam(isMobile ? [-2.2, 3.2, 3.2] : [-2.2, 2.8, 2.8], [-2.2, 0.4, -1.4], 2.4, 'power2.inOut');
          break;
        case 'gift':
          tweenCam(isMobile ? [-2.4, 1.2, 2.8] : [-2.4, 1.0, 2.4], [-2.4, 0.2, 1.2], 2.4, 'power2.inOut');
          break;
        case 'balloons':
          tweenCam(isMobile ? [2.5, 2.2, 2.2] : [2.5, 1.8, 1.8], [2.5, 0.8, -0.5], 2.4, 'power2.inOut');
          break;
      }
    },
    [isMobile, tweenCam]
  );

  const handleGuestTriggerFireworks = useCallback(() => {
    setFireworksActive(true);
    setTimeout(() => setFireworksActive(false), 6000);
  }, []);

  const handleGuestUnlockVIP = useCallback(async () => {
    setVIP(true);
    // Restart the experience from absolute beginning with cinematic intro!
    setStage('01_intro_cinematic');
    
    // Jump camera high into the sky instantly, then sweep down
    tweenCam([0, 18, 10], [0, 0, 0], 0, 'none', 0, () => {
      const camPos: [number, number, number] = isMobile ? [-2.4, 1.8, 3.8] : [-2.4, 1.6, 3.2];
      tweenCam(camPos, [-2.4, 0.5, 1.2], 5.0, 'power2.inOut', 0.18);
    });
    
    setTimeout(() => {
      showCaption('Every birthday needs a present... ✦', 2000);
      setHint('Tap the glowing gift box to open ✦');
    }, 5500);
  }, [setVIP, setStage, isMobile, tweenCam, showCaption, setHint]);

  // Stage 02 -> 03: Gift Opened -> World Reveal & Push to Letter Desk
  const handleGiftBoxClick = useCallback(async () => {
    if (stage !== '02_gift') return;
    setStage('03_world');
    setCaption('');
    setHint('');
    playChime(1.1);

    // Push smoothly into dedicated writing desk with centered letter envelope
    const camPos: [number, number, number] = isMobile ? [0.0, 1.45, 2.8] : [0.0, 1.35, 2.5];
    tweenCam(camPos, [0.0, 0.42, 1.4], 3.0, 'power2.inOut', 0.18, () => {
      setStage('04_letter');
      setHint('Tap the sealed letter on the desk to read ✦');
      setEnvelopeInteractive(true);
    });
    showCaption('WELCOME TO YOUR BIRTHDAY WORLD ✦', 2400);
  }, [stage, isMobile, setStage, setHint, tweenCam, showCaption, setCaption]);

  // Stage 04: Envelope clicked -> Open Letter Modal
  const handleEnvelopeClick = useCallback(() => {
    setCaption('');
    setHint('');
    setEnvelopeInteractive(false);
    setShowLetter(true);
    playChime(1.2);
  }, [setHint, setCaption]);

  // Stage 04 -> 05: Letter closed -> Constellation Stage
  const handleLetterClose = useCallback(() => {
    setShowLetter(false);
    setWishes([]);
    setCaption('');
    setHint('');
    setTimeout(() => {
      setStage('05_constellation');
      const camPos: [number, number, number] = isMobile ? [0.0, 3.2, 5.5] : [0.0, 3.2, 5.0];
      tweenCam(camPos, [0.0, 3.2, 0.0], 2.4, 'power2.inOut', 0.2);
    }, 300);
  }, [setStage, isMobile, setHint, setCaption, tweenCam]);

  // Stage 05 -> 06: Constellation Complete -> 5 Balloons Stage
  const handleConstellationComplete = useCallback(() => {
    setStage('06_balloons');
    setWishes([]);
    setCaption('');
    const camPos: [number, number, number] = isMobile ? [2.2, 1.85, 3.2] : [2.2, 1.75, 2.6];
    tweenCam(camPos, [2.2, 1.55, 0.8], 2.4, 'power2.inOut', 0.25, () => {
      setBalloonsInteractive(true);
      setHint('Tap and pop the floating balloons to reveal your wishes ✦');
      setTimeout(() => setShowContinue(true), 3500);
    });
  }, [setStage, isMobile, tweenCam, setHint, setShowContinue, setCaption]);

  // Stage 06 -> 07: Balloons Done -> Mini Star Challenge
  const handleContinueToStarGame = useCallback(() => {
    setShowContinue(false);
    setBalloonsInteractive(false);
    setWishes([]);
    setCaption('');
    setHint('');
    setStage('07_stargame');
  }, [setShowContinue, setStage, setHint, setCaption]);

  // Stage 07 -> 08: Star Game Done -> Secret Garden
  const handleStarGameComplete = useCallback(() => {
    setStage('08_garden');
    setWishes([]);
    setCaption('');
    setHint('');
    // Pull back & up so the full botanical garden is beautifully framed
    const camPos: [number, number, number] = isMobile ? [-2.2, 3.2, 3.2] : [-2.2, 2.8, 2.8];
    tweenCam(camPos, [-2.2, 0.4, -1.4], 2.8, 'power2.inOut', 0.15);
    showCaption('✦ ENTERING THE SECRET GARDEN ✦', 2000);
  }, [setStage, isMobile, setHint, setCaption, tweenCam, showCaption]);

  // Stage 08 -> 09: Garden Done -> Cake & Make a Wish
  const handleGardenComplete = useCallback(async () => {
    setStage('09_cake');
    setWishes([]);
    setCaption('');
    setHint('');
    const camPos: [number, number, number] = isMobile ? [0.0, 1.6, 2.2] : [0.0, 1.5, 1.8];
    const lookPos: [number, number, number] = [0.0, 0.95, -0.4];

    tweenCam(camPos, lookPos, 2.8, 'power2.inOut', 0.2, () => {
      setStage('10_wish');
      setHint('Make a wish & tap the cake to blow out your candles ✦');
    });
    showCaption('EVERY BIRTHDAY CAKE NEEDS A WISH ✦', 2200);
  }, [setStage, isMobile, tweenCam, showCaption, setHint, setCaption]);

  // Stage 10 -> 11 -> 12: Wish Made -> Fireworks
  const handleWishComplete = useCallback(async () => {
    setStage('12_fireworks');
    setWishes([]);
    setHint('');
    const camPos: [number, number, number] = isMobile ? [0.0, 2.6, 5.8] : [0.0, 2.4, 4.8];
    tweenCam(camPos, [0.0, 2.8, -2.5], 2.4, 'power2.inOut', 0.2);
    setFireworksActive(true);
    playFireworksBoom();
    playHappyBirthdaySong();

    await showCaption('HAPPY BIRTHDAY, TITHI! ✦', 3200);
    await showCaption(
      'May your year be full of good days, good people,\ngreat adventures, and plenty of reasons to smile. ✦',
      3800
    );

    setTimeout(() => {
      setStage('13_hidden_surprise');
    }, 1500);
  }, [setStage, isMobile, tweenCam, showCaption, setHint]);

  // Stage 14: Replay whole experience
  const handleReplay = useCallback(() => {
    resetExperience();
    window.location.reload();
  }, [resetExperience]);

  // Boot & live weather fetch & touch listener
  useEffect(() => {
    // Initial live weather fetch
    fetchLiveWeather().then((data) => {
      useStoryStore.getState().setWeather(data);
    });

    const onFirstTouch = () => {
      unlockAudio();
      startMusic();
      window.removeEventListener('pointerdown', onFirstTouch);
    };
    window.addEventListener('pointerdown', onFirstTouch);

    const onBalloonPopped = (e: any) => {
      const text = e.detail?.wish || 'A Really Good Year!';
      const id = Date.now() + Math.random();
      setWishes((prev) => [
        ...prev,
        { id, text, x: window.innerWidth / 2, y: window.innerHeight * 0.38 },
      ]);
      setTimeout(() => {
        setWishes((prev) => prev.filter((w) => w.id !== id));
      }, 2400);
    };
    window.addEventListener('balloonPopped', onBalloonPopped);

    const timer = setTimeout(() => {
      setLoaded(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('pointerdown', onFirstTouch);
      window.removeEventListener('balloonPopped', onBalloonPopped);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Real-time weather+time CSS variable sync — no UI, pure side-effect */}
      <ThemeSync />

      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: isMobile ? [0, 4.4, 13.5] : [0, 4.6, 12], fov: isMobile ? 54 : 45, near: 0.1, far: 80 }}
        shadows
        onCreated={({ gl }) => {
          gl.shadowMap.type = THREE.PCFShadowMap;
        }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <CameraController />
        <SceneLighting />

        <Environment isNight={isNight} />
        <WeatherSystem />
        <Fireworks active={fireworksActive} />

        {/* 3D Visual World Objects (Separated across distinct spatial zones with ZERO clipping) */}
        <Flowers />
        <Chocolates />
        <Balloons
          interactive={isVIP && balloonsInteractive}
          onAllPopped={handleContinueToStarGame}
        />
        <Cake />

        {/* Story Gift Box & Antique Letter Writing Desk */}
        <GiftBox onOpen={handleGiftBoxClick} />
        <Envelope
          interactive={isVIP ? envelopeInteractive : false}
          onOpen={handleEnvelopeClick}
        />

        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
      </Canvas>

      {/* Floating Controls Dock */}
      <TopControlsDock />

      {/* Caption & Story Layer */}
      <CaptionLayer />

      {/* Cinematic Login Wipe Sequence */}
      {stage === '01_intro_cinematic' && <CinematicIntro />}

      {/* Stage 01: Countdown / Hero Invitation Overlay */}
      {stage === '01_night' && (
        <CountdownOverlay onUnlock={handleCountdownUnlock} />
      )}

      {/* Guest Mode: Interactive Showcase Overlay */}
      {stage === 'guest_showcase' && !isVIP && (
        <GuestShowcaseOverlay
          onUnlockVIP={handleGuestUnlockVIP}
          onFocusView={handleGuestFocusView}
          onTriggerFireworks={handleGuestTriggerFireworks}
        />
      )}

      {/* Stage 04: Birthday Letter Overlay (VIP Only) */}
      <LetterOverlay visible={showLetter} onClose={handleLetterClose} />

      {/* Stage 05: Constellation Overlay (VIP Only) */}
      {stage === '05_constellation' && isVIP && (
        <ConstellationOverlay onComplete={handleConstellationComplete} />
      )}

      {/* Floating On-Screen Interactive Instruction & Action HUD (VIP Only, hidden when modals are open) */}
      {isVIP &&
        stage !== '01_night' &&
        stage !== 'guest_showcase' &&
        !showLetter &&
        stage !== '05_constellation' &&
        stage !== '07_stargame' &&
        stage !== '08_garden' &&
        stage !== '10_wish' &&
        stage !== '13_hidden_surprise' &&
        stage !== '14_quiet_night' && (
          <FloatingInstructionBanner onContinue={handleContinueToStarGame} />
        )}

      {/* Stage 07: Mini Star Challenge (VIP Only) */}
      {stage === '07_stargame' && isVIP && (
        <StarChallengeOverlay onComplete={handleStarGameComplete} />
      )}

      {/* Stage 08: Secret Garden Overlay (VIP Only) */}
      {stage === '08_garden' && isVIP && (
        <SecretGardenOverlay onComplete={handleGardenComplete} />
      )}

      {/* Stage 10 & 11: Make a Wish & Smoke to Stars Overlay (VIP Only) */}
      {stage === '10_wish' && isVIP && (
        <CakeWishOverlay onWishComplete={handleWishComplete} />
      )}

      {/* Stage 13 & 14: Final Hidden Surprise & Quiet Night Ending */}
      {(stage === '13_hidden_surprise' || stage === '14_quiet_night') && (
        <FinalHiddenSurprise
          onOpenLetterAgain={() => setShowLetter(true)}
          onReplay={handleReplay}
        />
      )}

      {/* Floating Balloon Wish Bubbles */}
      <AnimatePresence>
        {wishes.map((w) => (
          <WishBubble key={w.id} text={w.text} x={w.x} y={w.y} />
        ))}
      </AnimatePresence>

      {/* Initial Loader */}
      <AnimatePresence>{!loaded && <Loader />}</AnimatePresence>
    </div>
  );
}
