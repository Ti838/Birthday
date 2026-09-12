import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FLOATING_STAR_WISHES } from '../../utils/constants';
import { playBlowSound, playChime } from '../../utils/music';
import styles from './CakeWishOverlay.module.css';

interface CakeWishOverlayProps {
  onWishComplete: () => void;
}

export function CakeWishOverlay({ onWishComplete }: CakeWishOverlayProps) {
  const [wishing, setWishing] = useState(false);
  const [wishSent, setWishSent] = useState(false);

  const handleMakeWish = () => {
    if (wishing) return;
    setWishing(true);
    playBlowSound();

    setTimeout(() => {
      setWishSent(true);
      playChime(1.4);
    }, 1800);

    setTimeout(() => {
      onWishComplete();
    }, 4500);
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
            <h2 className={styles.title}>Think of One Thing You'd Like This Year</h2>
            <p className={styles.subtitle}>Close your eyes, make your wish in your heart, then tap below 🎂</p>

            <motion.button
              className={styles.wishBtn}
              onClick={handleMakeWish}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <span>🎂</span>
              <span>MAKE A WISH ✦</span>
              <span>✨</span>
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
                <span className={styles.sentIcon}>✨</span>
                <span className={styles.sentText}>WISH SENT. ✨</span>
                <p className={styles.sentSub}>The stars have heard your wish. Get ready for fireworks! 🎆</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

