import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore } from '../../store/useStoryStore';
import { GARDEN_FLOWERS } from '../../utils/constants';
import { playFlowerBloomSound, playChime } from '../../utils/music';
import { FlowerIcon, CakeIcon } from '../icons/CustomIcons';
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
    }
  };

  const handleBloomAll = () => {
    GARDEN_FLOWERS.forEach((_, i) => {
      if (!gardenBloomed.includes(i)) {
        setTimeout(() => {
          bloomFlower(i);
          playFlowerBloomSound(i);
        }, i * 150);
      }
    });
    playChime(1.5);
    setTimeout(() => {
      onComplete();
    }, 1600);
  };

  const isAllBloomed = gardenBloomed.length === GARDEN_FLOWERS.length;

  // Auto-advance when all 5 flowers are bloomed (from either 3D clicking or dock clicking)
  useEffect(() => {
    if (isAllBloomed) {
      const timer = setTimeout(() => {
        playChime(1.4);
        onComplete();
      }, 2400);
      return () => clearTimeout(timer);
    }
  }, [isAllBloomed, onComplete]);

  return (
    <div className={styles.container}>
      {/* Top Instructions Header */}
      <motion.div
        className={styles.headerCard}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <span className={styles.badge}>✦ THE SECRET GARDEN ✦</span>
        <h2 className={styles.title}>Tap the Flowers to Bloom</h2>
        <p className={styles.subtitle}>
          Click the glowing garden blooms or tap the cards below ({gardenBloomed.length} / {GARDEN_FLOWERS.length} bloomed)
        </p>
      </motion.div>

      {/* Sleek Bottom Flower Dock & Cake Action Button */}
      <div className={styles.bottomDock}>
        <div className={styles.flowersGrid}>
          {GARDEN_FLOWERS.map((flower, idx) => {
            const isBloomed = gardenBloomed.includes(idx);
            return (
              <motion.button
                key={flower.id}
                className={`${styles.flowerCard} ${isBloomed ? styles.bloomed : ''}`}
                onClick={() => handleBloom(idx)}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  borderColor: isBloomed ? flower.color : 'rgba(232, 200, 114, 0.25)',
                }}
              >
                <div className={styles.flowerHeader}>
                  <FlowerIcon size={18} color={isBloomed ? flower.color : '#8E95A5'} />
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

        {/* Quick Action Button: Proceed to Cake */}
        <motion.div
          className={styles.actionRow}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <button
            className={styles.cakeProceedBtn}
            onClick={isAllBloomed ? onComplete : handleBloomAll}
          >
            <CakeIcon size={18} color="#070913" />
            <span>{isAllBloomed ? 'PROCEED TO BIRTHDAY CAKE 🎂 ✦' : 'BLOOM ALL & GO TO CAKE 🎂 ✦'}</span>
          </button>
        </motion.div>
      </div>

      {/* Celebratory Full Bloom Toast */}
      <AnimatePresence>
        {isAllBloomed && (
          <div className={styles.allBloomedToastWrapper}>
            <motion.div
              className={styles.allBloomedToast}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              ✦ The garden is in full bloom! Lighting your birthday cake candles… ✦
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
