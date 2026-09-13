import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FLOATING_STAR_WISHES } from '../../utils/constants';
import { playBlowSound, playChime } from '../../utils/music';
import { CakeIcon, SparkleIcon } from '../icons/CustomIcons';
import styles from './CakeWishOverlay.module.css';

interface CakeWishOverlayProps {
  onWishComplete: () => void;
}

export function CakeWishOverlay({ onWishComplete }: CakeWishOverlayProps) {
  const [wishing, setWishing] = useState(false);
  const [wishSent, setWishSent] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [breathLevel, setBreathLevel] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const blownRef = useRef(false);

  const executeBlowSequence = useCallback(() => {
    if (blownRef.current) return;
    blownRef.current = true;
    setWishing(true);

    // Stop mic stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    // 1. Dispatch WebGL event to extinguish 3D candles on cake
    window.dispatchEvent(new CustomEvent('blowCandles'));
    playBlowSound();

    setTimeout(() => {
      setWishSent(true);
      playChime(1.4);
    }, 1800);

    setTimeout(() => {
      onWishComplete();
    }, 4500);
  }, [onWishComplete]);

  // Setup Microphone breath detection
  useEffect(() => {
    let active = true;

    async function initMic() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.3;
        source.connect(analyser);
        analyserRef.current = analyser;
        setMicActive(true);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        let blowCount = 0;
        const checkAudio = () => {
          if (!active || blownRef.current) return;
          analyser.getByteFrequencyData(dataArray);

          // Calculate overall volume energy
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          const normalized = Math.min(1, avg / 80);
          setBreathLevel(normalized);

          // Detect air blowing burst (sustained high energy)
          if (avg > 52) {
            blowCount++;
            if (blowCount > 5) {
              executeBlowSequence();
              return;
            }
          } else {
            blowCount = Math.max(0, blowCount - 1);
          }

          animFrameRef.current = requestAnimationFrame(checkAudio);
        };

        animFrameRef.current = requestAnimationFrame(checkAudio);
      } catch (err) {
        // Mic denied or unavailable - fallback to tap
        setMicActive(false);
      }
    }

    initMic();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [executeBlowSequence]);

  const handleMakeWish = () => {
    executeBlowSequence();
  };

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        {!wishing && (
          <motion.div
            key="prompt"
            className={styles.wishCard}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
          >
            <span className={styles.badge}>✦ MAKE A BIRTHDAY WISH ✦</span>
            <h2 className={styles.title}>Make Your Wish & Blow Out the Candles</h2>
            <p className={styles.subtitle}>
              {micActive
                ? '🌬️ Blow gently into your microphone or tap the button below'
                : 'Close your eyes, make your wish in your heart, then tap to blow'}
            </p>

            {/* Live Breath Meter when Microphone is Listening */}
            {micActive && (
              <div className={styles.breathMeterContainer}>
                <div
                  className={styles.breathMeterFill}
                  style={{ width: `${Math.min(100, Math.round(breathLevel * 100))}%` }}
                />
                <span className={styles.breathLabel}>
                  {breathLevel > 0.4 ? '🌬️ Blowing Detected!' : '🎙️ Microphone Ready — Blow now!'}
                </span>
              </div>
            )}

            <motion.button
              className={styles.wishBtn}
              onClick={handleMakeWish}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <CakeIcon size={18} color="#070913" />
              <span>BLOW CANDLES & MAKE WISH ✦</span>
              <SparkleIcon size={16} color="#070913" />
            </motion.button>
          </motion.div>
        )}

        {wishing && (
          <motion.div
            key="smoke-stars"
            className={styles.starsWrapper}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className={styles.smokeParticles}>
              {FLOATING_STAR_WISHES.map((wish, idx) => (
                <motion.div
                  key={wish}
                  className={styles.starWishTag}
                  initial={{ opacity: 0, y: 40, scale: 0.6 }}
                  animate={{
                    opacity: [0, 1, 1, 0.8],
                    y: [-20 - idx * 40, -60 - idx * 50],
                    scale: 1,
                  }}
                  transition={{ duration: 2.5, delay: idx * 0.35, ease: 'easeOut' }}
                >
                  ✦ {wish} ✦
                </motion.div>
              ))}
            </div>

            {wishSent && (
              <motion.div
                className={styles.wishSentBadge}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
              >
                <span className={styles.sentIcon}><SparkleIcon size={20} color="#070913" /></span>
                <span className={styles.sentText}>WISH SENT. ✦</span>
                <p className={styles.sentSub}>The stars have received your wish. Enjoy the celebration fireworks!</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

