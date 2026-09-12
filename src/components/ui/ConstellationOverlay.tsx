import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore } from '../../store/useStoryStore';
import { CONSTELLATION_STARS } from '../../utils/constants';
import { playStarCollectSound, playChime } from '../../utils/music';
import styles from './ConstellationOverlay.module.css';

interface ConstellationOverlayProps {
  onComplete: () => void;
}

export function ConstellationOverlay({ onComplete }: ConstellationOverlayProps) {
  const constellationStars = useStoryStore((s) => s.constellationStars);
  const collectConstellationStar = useStoryStore((s) => s.collectConstellationStar);

  const handleStarClick = (name: string, idx: number) => {
    if (!constellationStars.includes(name)) {
      collectConstellationStar(name);
      playStarCollectSound(idx + 1);
      if (constellationStars.length + 1 >= CONSTELLATION_STARS.length) {
        setTimeout(() => {
          playChime(1.4);
          onComplete();
        }, 1400);
      }
    }
  };

  const isComplete = constellationStars.length === CONSTELLATION_STARS.length;

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.promptCard}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <span className={styles.badge}>✦ CELESTIAL CONSTELLATION ✦</span>
        <h2 className={styles.title}>Touch the 5 Guiding Stars ✨</h2>
        <p className={styles.subtitle}>
          Tap each celestial star to awaken the birthday world ({constellationStars.length} / {CONSTELLATION_STARS.length})
        </p>
      </motion.div>

      <div className={styles.starsGrid}>
        {CONSTELLATION_STARS.map((star, idx) => {
          const collected = constellationStars.includes(star.name);
          return (
            <motion.button
              key={star.id}
              className={`${styles.starNode} ${collected ? styles.starCollected : ''}`}
              onClick={() => handleStarClick(star.name, idx)}
              whileHover={{ scale: 1.14, y: -4 }}
              whileTap={{ scale: 0.92 }}
            >
              <span className={styles.starIcon}>{star.icon}</span>
              <span className={styles.starLabel}>{star.name}</span>
              {collected && <span className={styles.starGlow} />}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {isComplete && (
          <motion.div
            className={styles.completedToast}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            ✦ Constellation Complete! Moving to your birthday balloons… ✦
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

