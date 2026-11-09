import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore } from '../../store/useStoryStore';
import { playChime } from '../../utils/music';
import { triggerCelebrationConfetti } from '../../utils/confetti';
import { CrownIcon, SparkleIcon, KeyIcon } from '../icons/CustomIcons';
import styles from './CountdownOverlay.module.css';

interface CountdownOverlayProps {
  onUnlock: () => void;
}

const PASSCODES = ['timon', 'showcase', 'preview', 'admin', '1809'];

export function CountdownOverlay({ onUnlock }: CountdownOverlayProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const setVIP = useStoryStore((s) => s.setVIP);

  // 1. Full Story Mode: Launches guided cinematic interactive journey
  const handleStartStory = () => {
    setVIP(true);
    setUnlocked(true);
    playChime(1.5);
    triggerCelebrationConfetti();
    onUnlock();
  };

  // 2. Free Exploration Mode: Quick access to the diorama & camera switcher
  const handleExploreShowcase = () => {
    setVIP(false);
    setUnlocked(true);
    playChime(1.2);
    onUnlock();
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passInput.toLowerCase().trim();
    if (PASSCODES.includes(clean)) {
      handleStartStory();
    } else {
      setErrorMsg('Passcode not recognized. Click "Begin Story Journey" to enter directly!');
    }
  };

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
            {/* Monogram Seal */}
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
                <span>IMMERSIVE 3D WEBGL SHOWCASE</span>
                <span>✦</span>
              </div>
            </div>

            <h1 className={styles.title}>CELESTIAL DIORAMA ✦</h1>
            <p className={styles.subtitle}>
              An interactive 3D WebGL world and creative storytelling experience designed and developed by Timon.
            </p>

            {/* Action Buttons */}
            {!showPassModal ? (
              <div className={styles.actionRow}>
                <motion.button
                  className={styles.vipBtn}
                  onClick={handleStartStory}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CrownIcon size={17} color="#070913" />
                  <span>Begin Story Journey ✦</span>
                </motion.button>

                <motion.button
                  className={styles.guestBtn}
                  onClick={handleExploreShowcase}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SparkleIcon size={16} color="var(--text-starlight)" />
                  <span>Explore Free Showcase</span>
                </motion.button>
              </div>
            ) : (
              <motion.div
                className={styles.passcodeModal}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <p className={styles.passcodePrompt}>
                  <KeyIcon
                    size={15}
                    color="var(--text-starlight)"
                    style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}
                  />
                  <span>Developer & VIP Access Key:</span>
                </p>
                <form onSubmit={handlePasscodeSubmit} className={styles.inputGroup}>
                  <input
                    type="password"
                    placeholder="Enter key (e.g. timon)..."
                    value={passInput}
                    onChange={(e) => {
                      setPassInput(e.target.value);
                      setErrorMsg('');
                    }}
                    className={styles.passInput}
                    autoFocus
                  />
                  <button type="submit" className={styles.unlockSubmitBtn}>
                    Enter ✦
                  </button>
                </form>
                {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
                <div>
                  <button
                    type="button"
                    className={styles.cancelLink}
                    onClick={() => setShowPassModal(false)}
                  >
                    Back to main choices
                  </button>
                </div>
              </motion.div>
            )}

            {/* Clean Footer Status */}
            <div className={styles.bottomStatus}>
              <span>Three.js & React Three Fiber</span>
              <span className={styles.bottomStatusDot}>•</span>
              <span>Crafted by Timon</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
