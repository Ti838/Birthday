import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore } from '../../store/useStoryStore';
import { playStarCollectSound, playChime } from '../../utils/music';
import styles from './StarChallengeOverlay.module.css';

interface StarChallengeOverlayProps {
  onComplete: () => void;
}

interface StarItem {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

export function StarChallengeOverlay({ onComplete }: StarChallengeOverlayProps) {
  const starsCollected = useStoryStore((s) => s.starsCollected);
  const collectStar = useStoryStore((s) => s.collectStar);
  const [activeStars, setActiveStars] = useState<StarItem[]>([]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Spawn 12 glowing celestial stars distributed comfortably across screen
    const items: StarItem[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: 8 + (i % 4) * 22 + Math.random() * 8, // percentage across
      y: 22 + Math.floor(i / 4) * 18 + Math.random() * 8, // percentage down
      size: 52 + Math.random() * 14,
      delay: i * 0.15,
    }));
    setActiveStars(items);
  }, []);

  const handleCollect = (id: number) => {
    setActiveStars((prev) => prev.filter((s) => s.id !== id));
    collectStar();
    const newCount = starsCollected + 1;
    playStarCollectSound(newCount);

    if (newCount >= 10 && !completed) {
      setCompleted(true);
      setTimeout(() => {
        playChime(1.5);
        onComplete();
      }, 1800);
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <motion.div
        className={styles.headerCard}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className={styles.badge}>✦ MINI BIRTHDAY GAME ✦</span>
        <h2 className={styles.title}>Catch 10 Glowing Stars</h2>
        <p className={styles.subtitle}>
          Tap the floating stars in the sky to collect your birthday stardust ({starsCollected} / 10)
        </p>
        <div className={styles.counterPill}>
          <span>Collected: </span>
          <span className={styles.counterNum}>{starsCollected} / 10</span>
        </div>
      </motion.div>

      {/* Floating Interactive Stars */}
      <div className={styles.starsField}>
        {activeStars.map((star) => (
          <motion.button
            key={star.id}
            className={styles.floatingStar}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
            }}
            onClick={() => handleCollect(star.id)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [1, 1.22, 1],
              rotate: [0, 180, 360],
              y: [-10, 10, -10],
              opacity: 1,
            }}
            transition={{
              duration: 2.8 + (star.id % 3) * 0.6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: star.delay,
            }}
            whileHover={{ scale: 1.45, rotate: 45 }}
            whileTap={{ scale: 0.6 }}
          >
            <span className={styles.starGlyph}>✦</span>
            <span className={styles.starHalo} />
          </motion.button>
        ))}
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {completed && (
          <motion.div
            className={styles.completeModal}
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <h3 className={styles.completeTitle}>MISSION COMPLETE! ✦</h3>
            <p className={styles.completeText}>
              All stardust collected! Opening the Secret Garden…
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

