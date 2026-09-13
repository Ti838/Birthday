import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore } from '../../store/useStoryStore';
import { playChime } from '../../utils/music';
import { triggerCelebrationConfetti } from '../../utils/confetti';
import { CrownIcon, SparkleIcon, KeyIcon } from '../icons/CustomIcons';
import styles from './CountdownOverlay.module.css';

interface CountdownOverlayProps {
  onUnlock: () => void;
}

let timeOffsetMs = 0; // Difference between real internet time and local device time
let hasSyncedTime = false;

function getTargetBirthday(nowTime: number): number {
  const d = new Date(nowTime);
  const currentYear = d.getUTCFullYear();
  // Target: September 18, 00:00:00 Bangladesh Time (UTC+6) => September 17, 18:00:00 UTC
  let target = new Date(`${currentYear}-09-17T18:00:00Z`).getTime();
  
  // If we are more than 24 hours past the birthday, target next year
  if (nowTime > target + 24 * 60 * 60 * 1000) {
    target = new Date(`${currentYear + 1}-09-17T18:00:00Z`).getTime();
  }
  return target;
}

// Valid secret passcodes for Tithi (case-insensitive & trimmed)
const VALID_PASSCODES = ['1809', 'tithi', 'doraemon', '18/09', '18-09'];

// Master developer/testing passcodes for Timon to preview anytime
const MASTER_PASSCODES = ['timon', 'ti838', 'timon18', 'preview', 'admin'];

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isUnlocked: boolean;
}

function calculateTimeLeft(): TimeLeft {
  const now = Date.now() + timeOffsetMs;
  const target = getTargetBirthday(now);
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
  const [guestNotice, setGuestNotice] = useState('');
  const setVIP = useStoryStore((s) => s.setVIP);

  useEffect(() => {
    // 1. Sync real internet time exactly once to prevent device-time cheating
    if (!hasSyncedTime) {
      fetch('https://worldtimeapi.org/api/timezone/Asia/Dhaka')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.unixtime) {
            const realTimeMs = data.unixtime * 1000;
            timeOffsetMs = realTimeMs - Date.now();
            hasSyncedTime = true;
            setTimeLeft(calculateTimeLeft());
          }
        })
        .catch(() => {
          console.warn('Network time sync failed, falling back to local device time.');
        });
    }

    const params = new URLSearchParams(window.location.search);
    const pass = params.get('pass')?.toLowerCase().trim();
    const isVipParam =
      params.get('vip') === 'true' ||
      params.get('preview') === 'true' ||
      params.get('preview') === 'timon' ||
      params.get('test') === 'true';

    const isGuestParam = params.get('guest') === 'true';

    // Master preview for Timon (bypasses countdown anytime)
    if (isVipParam || (pass && MASTER_PASSCODES.includes(pass))) {
      setVIP(true);
      setUnlocked(true);
      onUnlock();
      return;
    }

    // Direct guest showcase preview
    if (isGuestParam) {
      setVIP(false);
      setUnlocked(true);
      onUnlock();
      return;
    }

    // No auto-bypass for Tithi anymore, we want her to see the beautiful countdown text on the 18th!

    const timer = setInterval(() => {
      const updated = calculateTimeLeft();
      setTimeLeft(updated);
    }, 1000);

    return () => clearInterval(timer);
  }, [onUnlock, setVIP]);

  // Guest Mode: Explores celebration only if 18 September has arrived (or on localhost)
  const handleGuestUnlock = () => {
    const isDevEnv =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.search.includes('test'));

    if (!timeLeft.isUnlocked && !isDevEnv) {
      playChime(0.9);
      setGuestNotice('✦ The celebration showcase unlocks for everyone on September 18 at midnight! ✦');
      setTimeout(() => setGuestNotice(''), 5000);
      return;
    }
    setVIP(false);
    setUnlocked(true);
    playChime(1.2);
    triggerCelebrationConfetti();
    onUnlock();
  };

  // Tithi VIP Mode: Verifies passcode and checks if 18 September has arrived
  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passInput.toLowerCase().trim();
    const isDevEnv =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.search.includes('test'));

    // 1. Master Passcode for Timon (Developer/Tester bypass anytime)
    if (MASTER_PASSCODES.includes(clean)) {
      setVIP(true);
      setUnlocked(true);
      playChime(1.5);
      triggerCelebrationConfetti();
      onUnlock();
      return;
    }

    // 2. Tithi's Passcode
    if (VALID_PASSCODES.includes(clean)) {
      if (timeLeft.isUnlocked || isDevEnv) {
        setVIP(true);
        setUnlocked(true);
        playChime(1.5);
        triggerCelebrationConfetti();
        onUnlock();
      } else {
        // Elegant teasing message before 18 September (in Production)
        playChime(0.8);
        setErrorMsg('A little more patience, Tithi ✦ Your birthday celebration is sealed until September 18 at midnight. Please wait for the countdown to complete! ✦');
      }
    } else {
      setErrorMsg('Incorrect key ✦ Try your birthdate (1809) or special name (or "timon") ✦');
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
                <span>{timeLeft.isUnlocked ? 'BIRTHDAY CELEBRATION' : 'CELEBRATION COUNTDOWN'}</span>
                <span>✦</span>
              </div>
            </div>

            <h1 className={styles.title}>
              {timeLeft.isUnlocked ? 'HAPPY BIRTHDAY, TITHI ✦' : 'COUNTING DOWN FOR TITHI ✦'}
            </h1>
            <p className={styles.subtitle}>
              {timeLeft.isUnlocked
                ? 'A celebration universe created with thought by Timon.'
                : 'A special birthday universe is arriving on September 18.'}
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
                  <CrownIcon size={17} color="#070913" />
                  <span>Are You Tithi? ✦</span>
                </motion.button>

                <motion.button
                  className={styles.guestBtn}
                  onClick={handleGuestUnlock}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SparkleIcon size={16} color="var(--text-starlight)" />
                  <span>Explore Celebration (Guest View)</span>
                </motion.button>

                {guestNotice && (
                  <motion.p
                    className={styles.guestNotice}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {guestNotice}
                  </motion.p>
                )}
              </div>
            ) : (
              <motion.div
                className={styles.passcodeModal}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <p className={styles.passcodePrompt}>
                  <KeyIcon size={15} color="var(--text-starlight)" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }} />
                  <span>Enter Your Secret Birthday Key:</span>
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

