import { useRef, useEffect, useState, useCallback } from 'react';
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

import {
  CaptionLayer,
  TopControlsDock,
  FloatingInstructionBanner,
  Loader,
  WishBubble,
} from './ui/UI';
import { CountdownOverlay } from './ui/CountdownOverlay';
import { GuestShowcaseOverlay } from './ui/GuestShowcaseOverlay';
import { LetterOverlay } from './letter/LetterOverlay';
import { ConstellationOverlay } from './ui/ConstellationOverlay';
import { StarChallengeOverlay } from './ui/StarChallengeOverlay';
import { SecretGardenOverlay } from './ui/SecretGardenOverlay';
import { CakeWishOverlay } from './ui/CakeWishOverlay';
import { FinalHiddenSurprise } from './ui/FinalHiddenSurprise';

import { useStoryStore } from '../store/useStoryStore';
import { useParallax } from '../hooks/useParallax';
import { useResponsive } from '../hooks/useResponsive';
import { PALETTE } from '../utils/constants';
import {
  unlockAudio,
  startMusic,
  playChime,
  playFireworksBoom,
  playHappyBirthdaySong,
} from '../utils/music';

// ─── Camera controller with GSAP Choreography ─────────────────────
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

// ─── Scene Lighting (Environmental Day / Night) ───────────────────
function SceneLighting({ isNight }: { isNight: boolean }) {
  const pal = isNight ? PALETTE.night : PALETTE.day;
  return (
    <>
      <color attach="background" args={[pal.sky]} />
      <fogExp2 attach="fog" args={[pal.fog, isNight ? 0.024 : 0.036]} />

      {/* Ambient lighting */}
      <ambientLight
        color={isNight ? '#8FA5D8' : '#FFE8D0'}
        intensity={isNight ? 0.85 : 0.72}
      />

      {/* Key light */}
      <directionalLight
        color={isNight ? '#FFE5A4' : '#FFF0D8'}
        intensity={isNight ? 0.95 : 1.38}
        position={[5, 11, 6]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0016}
        shadow-radius={2.5}
      />

      {/* Warm Fill Light */}
      <directionalLight
        color={isNight ? '#FFE5A4' : '#FFD8A8'}
        intensity={isNight ? 0.45 : 0.44}
        position={[-5, 4, 8]}
      />

      {/* Back rim */}
      <directionalLight
        color={isNight ? '#7A8CDE' : '#E8F0FF'}
        intensity={isNight ? 0.35 : 0.2}
        position={[-4, 3, -8]}
      />

      {/* Hemisphere Light */}
      <hemisphereLight
        color={isNight ? '#8EA4E8' : '#FFF3E0'}
        groundColor={isNight ? '#0E1225' : '#B8914A'}
        intensity={isNight ? 0.45 : 0.35}
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

  // ─── Stage Handlers ──────────────────────────────────────────

  // Stage 01 -> Unlocked: Handles either VIP or Guest View
  const handleCountdownUnlock = useCallback(async () => {
    unlockAudio();
    startMusic();
    const currentIsVIP = useStoryStore.getState().isVIP;

    if (!currentIsVIP) {
      // Guest View: Panoramic celebration world & interactive showcase
      setStage('guest_showcase');
      tweenCam([0.0, 3.8, 7.2], [0.0, 0.6, -0.4], 3.2, 'power2.inOut', 0.25);
      setHint('');
      return;
    }

    // Tithi VIP View: Start personalized gift opening & journey
    setStage('02_gift');
    tweenCam([-1.2, 2.0, 4.8], [-2.6, 0.6, 1.5], 3.6, 'power2.inOut', 0.18);
    await showCaption('Every birthday needs a present...', 2400);
    await showCaption("So... let's open yours.", 2400);
    setHint('🎁 Tap the glowing gift box to open');
  }, [setStage, tweenCam, showCaption, setHint]);

  // Guest Camera Controls
  const handleGuestFocusView = useCallback(
    (view: 'world' | 'cake' | 'flowers' | 'balloons') => {
      switch (view) {
        case 'world':
          tweenCam([0.0, 3.8, 7.2], [0.0, 0.6, -0.4], 2.4, 'power2.inOut', 0.25);
          break;
        case 'cake':
          tweenCam([2.0, 2.0, 0.8], [2.0, 0.9, -2.2], 2.4, 'power2.inOut', 0.18);
          break;
        case 'flowers':
          tweenCam([-1.0, 1.15, 0.55], [-1.0, 0.72, -1.0], 2.4, 'power2.inOut', 0.18);
          break;
        case 'balloons':
          tweenCam([3.2, 2.4, 4.2], [2.4, 1.4, 1.6], 2.4, 'power2.inOut', 0.22);
          break;
      }
    },
    [tweenCam]
  );

  const handleGuestTriggerFireworks = useCallback(() => {
    setFireworksActive(true);
    setTimeout(() => setFireworksActive(false), 6000);
  }, []);

  const handleGuestUnlockVIP = useCallback(async () => {
    setVIP(true);
    setStage('02_gift');
    tweenCam([-1.2, 2.0, 4.8], [-2.6, 0.6, 1.5], 3.2, 'power2.inOut', 0.18);
    await showCaption('Every birthday needs a present...', 2400);
    await showCaption("So... let's open yours.", 2400);
    setHint('🎁 Tap the glowing gift box to open');
  }, [setVIP, setStage, tweenCam, showCaption, setHint]);

  // Stage 02 -> 03: Gift Opened -> World Reveal
  const handleGiftBoxClick = useCallback(async () => {
    if (stage !== '02_gift') return;
    setStage('03_world');
    setHint('');
    playChime(1.1);

    // Pan out to reveal full miniature world
    tweenCam([0.0, 3.8, 7.2], [0.0, 0.6, -0.4], 3.4, 'power2.inOut', 0.3);
    await showCaption('WELCOME TO YOUR BIRTHDAY WORLD ✦', 2800);
    await showCaption('There are a few surprises waiting for you.', 2600);

    // Push in to writing desk with envelope
    tweenCam([0.5, 1.6, 1.8], [0.4, 0.65, -0.5], 3.0, 'power2.inOut', 0.18, () => {
      setStage('04_letter');
      setHint('✉️ Tap the sealed letter on the desk to read');
      setEnvelopeInteractive(true);
    });
  }, [stage, setStage, setHint, tweenCam, showCaption]);

  // Stage 04: Envelope clicked -> Open Letter Modal
  const handleEnvelopeClick = useCallback(() => {
    setHint('');
    setEnvelopeInteractive(false);
    setShowLetter(true);
    playChime(1.2);
  }, [setHint]);

  // Stage 04 -> 05: Letter closed -> Constellation Stage
  const handleLetterClose = useCallback(() => {
    setShowLetter(false);
    setWishes([]);
    setTimeout(() => {
      setStage('05_constellation');
      setHint('✨ Tap all 5 celestial stars to connect your constellation');
      tweenCam([0.0, 3.2, 5.0], [0.0, 3.2, 0.0], 2.8, 'power2.inOut', 0.2);
    }, 500);
  }, [setStage, setHint, tweenCam]);

  // Stage 05 -> 06: Constellation Complete -> 5 Balloons Stage
  const handleConstellationComplete = useCallback(() => {
    setStage('06_balloons');
    setWishes([]);
    tweenCam([3.2, 2.4, 4.2], [2.4, 1.4, 1.6], 2.8, 'power2.inOut', 0.28, () => {
      setBalloonsInteractive(true);
      setHint('🎈 Tap and pop all 5 floating balloons to reveal your wishes (0/5)');
      setTimeout(() => setShowContinue(true), 5000);
    });
  }, [setStage, tweenCam, setHint, setShowContinue]);

  // Stage 06 -> 07: Balloons Done -> Mini Star Challenge
  const handleContinueToStarGame = useCallback(() => {
    setShowContinue(false);
    setBalloonsInteractive(false);
    setWishes([]);
    setHint('⭐ Mini Game: Catch 10 floating shooting stars!');
    setStage('07_stargame');
  }, [setShowContinue, setStage, setHint]);

  // Stage 07 -> 08: Star Game Done -> Secret Garden
  const handleStarGameComplete = useCallback(() => {
    setStage('08_garden');
    setWishes([]);
    setHint('🌸 Tap each flower in the vase to bloom and reveal 5 gentle reminders');
    tweenCam([-1.0, 1.15, 0.55], [-1.0, 0.72, -1.0], 2.8, 'power2.inOut', 0.18);
  }, [setStage, setHint, tweenCam]);

  // Stage 08 -> 09: Garden Done -> Cake & Make a Wish
  const handleGardenComplete = useCallback(async () => {
    setStage('09_cake');
    setWishes([]);
    const camPos: [number, number, number] = isMobile ? [2.0, 2.1, 1.2] : [2.0, 1.7, 0.5];
    const lookPos: [number, number, number] = [2.0, 0.9, -2.2];

    tweenCam(camPos, lookPos, 2.8, 'power2.inOut', 0.2, async () => {
      await showCaption('EVERY BIRTHDAY NEEDS A CAKE.', 2400);
      await showCaption('And every birthday cake needs a wish.', 2400);
      setStage('10_wish');
      setHint('🎂 Make a wish & tap the cake to blow out your candles');
    });
  }, [setStage, isMobile, tweenCam, showCaption, setHint]);

  // Stage 10 -> 11 -> 12: Wish Made -> Fireworks
  const handleWishComplete = useCallback(async () => {
    setStage('12_fireworks');
    setWishes([]);
    setHint('');
    tweenCam([1.0, 2.8, 3.2], [1.0, 3.4, -2.5], 2.8, 'power2.inOut', 0.2);
    setFireworksActive(true);
    playFireworksBoom();
    playHappyBirthdaySong();

    await showCaption('HAPPY BIRTHDAY, TITHI! 🎂', 3800);
    await showCaption(
      'May your year be full of good days, good people,\ngreat adventures, and plenty of reasons to smile. ✦',
      4800
    );

    setTimeout(() => {
      setStage('13_hidden_surprise');
    }, 2000);
  }, [setStage, tweenCam, showCaption, setHint]);

  // Stage 14: Replay whole experience
  const handleReplay = useCallback(() => {
    resetExperience();
    window.location.reload();
  }, [resetExperience]);

  // Boot & first touch unlock & balloon wish event listener with auto-cleanup
  useEffect(() => {
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
      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 4.6, 12], fov: 45, near: 0.1, far: 80 }}
        shadows
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <CameraController />
        <SceneLighting isNight={isNight} />

        <Environment isNight={isNight} />
        <Flowers />
        <Chocolates />

        <GiftBox onOpen={handleGiftBoxClick} />
        <Envelope
          interactive={envelopeInteractive}
          onOpen={handleEnvelopeClick}
        />
        <Balloons
          interactive={balloonsInteractive}
          onAllPopped={handleContinueToStarGame}
        />
        <Cake />
        <Fireworks active={fireworksActive} />

        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
      </Canvas>

      {/* Floating Controls Dock */}
      <TopControlsDock />

      {/* Caption & Story Layer */}
      <CaptionLayer />

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

      {/* Floating On-Screen Interactive Instruction & Action HUD (VIP Only) */}
      {isVIP && stage !== '01_night' && (
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
