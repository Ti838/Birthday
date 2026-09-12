import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore } from '../../store/useStoryStore';
import { GARDEN_FLOWERS } from '../../utils/constants';
import { playFlowerBloomSound, playChime } from '../../utils/music';
import styles from './SecretGardenOverlay.module.css';

interface SecretGardenOverlayProps {
  onComplete: () => void;
}

export function SecretGardenOverlay({ onComplete }: SecretGardenOverlayProps) {
  const gardenBloomed = useStoryStore((s) => s.gardenBloomed);
  const bloomFlower = useStoryStore((s) => s.bloomFlower);

  const handleBloom = (idx: number) => {
    if (!gardenBloomed.includes(idx)) {
      bloomFlower(idx);
      playFlowerBloomSound(idx);

      if (gardenBloomed.length + 1 >= GARDEN_FLOWERS.length) {
        setTimeout(() => {
          playChime(1.4);
          onComplete();
        }, 1800);
      }
    }
  };

  const isAllBloomed = gardenBloomed.length === GARDEN_FLOWERS.length;

  return (
    <div className={styles.container}>
      {/* Top Instructions Banner */}
      <motion.div
        className={styles.headerCard}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <span className={styles.badge}>✦ THE SECRET GARDEN ✦</span>
        <h2 className={styles.title}>Tap the Flowers to Bloom 🌸</h2>
        <p className={styles.subtitle}>
          Click the flowers in the vase or tap the cards below to reveal 5 gentle reminders ({gardenBloomed.length} / {GARDEN_FLOWERS.length})
        </p>
      </motion.div>

      {/* Sleek Bottom Flower Dock */}
      <div className={styles.bottomDock}>
        <div className={styles.flowersGrid}>
          {GARDEN_FLOWERS.map((flower, idx) => {
            const isBloomed = gardenBloomed.includes(idx);
            return (
              <motion.button
                key={flower.id}
                className={`${styles.flowerCard} ${isBloomed ? styles.bloomed : ''}`}
                onClick={() => handleBloom(idx)}
                whileHover={{ scale: 1.06, y: -4 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  borderColor: isBloomed ? flower.color : 'rgba(232, 200, 114, 0.25)',
                }}
              >
                <div className={styles.flowerHeader}>
                  <span className={styles.flowerIcon}>
                    {isBloomed ? '🌸' : '🌱'}
                  </span>
                  <span className={styles.flowerName} style={{ color: isBloomed ? flower.color : '#cfc5b3' }}>
                    {flower.name}
                  </span>
                </div>
                <div className={styles.adviceContainer}>
                  {isBloomed ? (
                    <motion.p
                      className={styles.flowerAdvice}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      "{flower.advice}"
                    </motion.p>
                  ) : (
                    <span className={styles.tapToBloom}>Tap to bloom</span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {isAllBloomed && (
          <motion.div
            className={styles.allBloomedToast}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            ✦ The secret garden is in full bloom! Moving to your birthday cake… ✦
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

