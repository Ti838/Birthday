import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore } from '../../store/useStoryStore';
import { setMasterMute } from '../../utils/music';
import { SparkleIcon } from '../icons/CustomIcons';
import styles from './UI.module.css';

// ─── Caption Layer ────────────────────────────────────────────────
export function CaptionLayer() {
  const caption = useStoryStore((s) => s.caption);
  return (
    <div className={styles.captionLayer}>
      <AnimatePresence mode="wait">
        {caption && (
          <motion.p
            key={caption}
            className={styles.caption}
            initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            {caption}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Minimalist Top HUD Dock (Audio Control Only) ─────────────
export function TopControlsDock() {
  const soundEnabled = useStoryStore((s) => s.soundEnabled);
  const toggleSound = useStoryStore((s) => s.toggleSound);

  const handleSoundToggle = () => {
    const next = !soundEnabled;
    toggleSound();
    setMasterMute(!next);
  };

  return (
    <div className={styles.topDock}>
      {/* Sound Toggle */}
      <button
        className={styles.dockBtn}
        onClick={handleSoundToggle}
        aria-label="Toggle Sound"
        title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
      >
        {soundEnabled ? (
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="#ffe5a4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="#cfc5b3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
      </button>
    </div>
  );
}

// ─── Floating Interactive Instruction Banner (Prominent Guide for Tithi) ──────
interface InstructionBannerProps {
  onContinue?: () => void;
}

export function FloatingInstructionBanner({ onContinue }: InstructionBannerProps) {
  const hint = useStoryStore((s) => s.hint);
  const showContinue = useStoryStore((s) => s.showContinue);

  return (
    <div className={styles.instructionDock}>
      <AnimatePresence mode="wait">
        {showContinue ? (
          <motion.button
            key="continue-btn"
            className={styles.continueButton}
            onClick={onContinue}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <SparkleIcon size={16} /> Continue to Next Surprise ✦
            </span>
          </motion.button>
        ) : hint ? (
          <motion.div
            key={hint}
            className={styles.instructionCard}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.instructionPulse} />
            <p className={styles.instructionText}>{hint}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export const BottomActionCenter = FloatingInstructionBanner;

// ─── Loader ───────────────────────────────────────────────────────
export function Loader() {
  return (
    <motion.div
      className={styles.loader}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.85, ease: 'easeInOut' }}
    >
      <div className={styles.loaderContent}>
        <div className={styles.loaderMonogram}>
          <span className={styles.loaderMonogramLetter}>T</span>
        </div>
        <p className={styles.loaderText}>Opening Tithi's Birthday Celebration… ✦</p>
        <div className={styles.loaderDots}>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className={styles.loaderDot}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Wish bubble (balloon pop) ────────────────────────────────────
export function WishBubble({ text, x, y }: { text: string; x: number; y: number }) {
  return (
    <motion.p
      className={styles.wishBubble}
      style={{ left: x, top: y }}
      initial={{ opacity: 0, x: '-50%', y: 0, scale: 0.85 }}
      animate={{ opacity: 1, x: '-50%', y: -40, scale: 1 }}
      exit={{ opacity: 0, x: '-50%', y: -70, scale: 0.9 }}
      transition={{ duration: 1.8, ease: 'easeOut' }}
    >
      ✦ {text}
    </motion.p>
  );
}
