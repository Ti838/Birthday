import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore } from '../../store/useStoryStore';
import { playChime } from '../../utils/music';
import { triggerCelebrationConfetti } from '../../utils/confetti';
import styles from './CountdownOverlay.module.css';

interface CountdownOverlayProps {
  onUnlock: () => void;
}

function getTargetBirthday(): number {
  const now = new Date();
  const currentYear = now.getFullYear();
  const targetThisYear = new Date(currentYear, 8, 18, 0, 0, 0).getTime();
  
  if (now.getTime() > targetThisYear + 24 * 60 * 60 * 1000) {
    return new Date(currentYear + 1, 8, 18, 0, 0, 0).getTime();
  }
  return targetThisYear;
}

// Valid secret passcodes for Tithi (case-insensitive & trimmed)
const VALID_PASSCODES = ['1809', 'tithi', 'doraemon', '18/09', '18-09'];

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isUnlocked: boolean;
}

function calculateTimeLeft(): TimeLeft {
  const now = new Date().getTime();
  const target = getTargetBirthday();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isUnlocked: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isUnlocked: false,
  };
}

export function CountdownOverlay({ onUnlock }: CountdownOverlayProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [unlocked, setUnlocked] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const setVIP = useStoryStore((s) => s.setVIP);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pass = params.get('pass')?.toLowerCase().trim();
    const isVipParam = params.get('vip') === 'true' || params.get('preview') === 'true';

    if (isVipParam || (pass && VALID_PASSCODES.includes(pass))) {
      setVIP(true);
      setUnlocked(true);
      onUnlock();
      return;
    }

    // Check if 18 September has already arrived on initial load
    const initial = calculateTimeLeft();
    if (initial.isUnlocked) {
      setUnlocked(true);
      onUnlock();
      return;
    }

    const timer = setInterval(() => {
      const updated = calculateTimeLeft();
      setTimeLeft(updated);
      // Auto unlock when 18 September midnight arrives
      if (updated.isUnlocked) {
        setUnlocked(true);
        onUnlock();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [onUnlock, setVIP]);

  // Guest Mode: Explores the celebration showcase
  const handleGuestUnlock = () => {
    setVIP(false);
    setUnlocked(true);
    playChime(1.2);
    triggerCelebrationConfetti();
    onUnlock();
  };

  // Tithi VIP Mode: Verifies passcode and unlocks the secret 3D universe
  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passInput.toLowerCase().trim();
    if (VALID_PASSCODES.includes(clean)) {
      setVIP(true);
      setUnlocked(true);
      playChime(1.5);
      triggerCelebrationConfetti();
      onUnlock();
    } else {
      setErrorMsg('Incorrect key. Try birthdate (1809) or your special name ✦');
    }
  };

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  return (
    <AnimatePresence>
      {!unlocked && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.85, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <div className={styles.ambientGlow} />

          <motion.div
            className={styles.card}
            initial={{ scale: 0.92, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: -25, opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Monogram */}
            <motion.div
              className={styles.monogramSeal}
              initial={{ rotate: -15, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className={styles.monogramLetter}>T</span>
            </motion.div>

            {/* Badge */}
            <div>
              <div className={styles.eyebrowBadge}>
                <span>✦</span>
                <span>BIRTHDAY CELEBRATION</span>
                <span>✦</span>
              </div>
            </div>

            <h1 className={styles.title}>HAPPY BIRTHDAY, TITHI ✦</h1>
            <p className={styles.subtitle}>
              A celebration universe created with thought by Timon.
            </p>

            {/* Countdown Grid */}
            <div className={styles.timerGrid}>
              <div className={styles.timeBox}>
                <span className={styles.timeNumber}>{formatNumber(timeLeft.days)}</span>
                <span className={styles.timeLabel}>Days</span>
              </div>
              <span className={styles.colon}>:</span>

              <div className={styles.timeBox}>
                <span className={styles.timeNumber}>{formatNumber(timeLeft.hours)}</span>
                <span className={styles.timeLabel}>Hours</span>
              </div>
              <span className={styles.colon}>:</span>

              <div className={styles.timeBox}>
                <span className={styles.timeNumber}>{formatNumber(timeLeft.minutes)}</span>
                <span className={styles.timeLabel}>Mins</span>
              </div>
              <span className={styles.colon}>:</span>

              <div className={styles.timeBox}>
                <span className={styles.timeNumber}>{formatNumber(timeLeft.seconds)}</span>
                <span className={styles.timeLabel}>Secs</span>
              </div>
            </div>

            {/* Clear 2-Choice Action Buttons */}
            {!showPassModal ? (
              <div className={styles.actionRow}>
                <motion.button
                  className={styles.vipBtn}
                  onClick={() => setShowPassModal(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>👑</span>
                  <span>Are You Tithi? ✦</span>
                </motion.button>

                <motion.button
                  className={styles.guestBtn}
                  onClick={handleGuestUnlock}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>✨</span>
                  <span>Explore Celebration (Guest View)</span>
                </motion.button>
              </div>
            ) : (
              <motion.div
                className={styles.passcodeModal}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <p className={styles.passcodePrompt}>
                  🔑 Enter Your Secret Birthday Key:
                </p>
                <form onSubmit={handlePasscodeSubmit} className={styles.inputGroup}>
                  <input
                    type="password"
                    placeholder="Enter Passcode..."
                    value={passInput}
                    onChange={(e) => {
                      setPassInput(e.target.value);
                      setErrorMsg('');
                    }}
                    className={styles.passInput}
                    autoFocus
                  />
                  <button type="submit" className={styles.unlockSubmitBtn}>
                    Unlock ✦
                  </button>
                </form>
                {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
                <div>
                  <button
                    type="button"
                    className={styles.cancelLink}
                    onClick={() => setShowPassModal(false)}
                  >
                    Back to celebration card
                  </button>
                </div>
              </motion.div>
            )}

            {/* Clean Heartfelt Footer */}
            <div className={styles.bottomStatus}>
              <span>A Special Celebration for Tithi</span>
              <span className={styles.bottomStatusDot}>•</span>
              <span>September 18</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

