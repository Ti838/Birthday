import { motion } from 'framer-motion';
import styles from './FinalKeepsakeCard.module.css';
import { playHappyBirthdaySong, playChime } from '../../utils/music';

interface FinalKeepsakeCardProps {
  onReadLetterAgain: () => void;
  onReplay: () => void;
}

export function FinalKeepsakeCard({ onReadLetterAgain, onReplay }: FinalKeepsakeCardProps) {
  const handleMusicReplay = () => {
    playChime(1.2);
    playHappyBirthdaySong();
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.card}>
        <div className={styles.monogramBadge}>✦</div>

        <h2 className={styles.heading}>Happy Birthday, Doraemon!</h2>
        <p className={styles.subheading}>For Tithi ✦ With all my warmest thoughts</p>

        <p className={styles.message}>
          May all the wishes you made under the fireworks tonight find their way into reality.
          Keep smiling, keep shining, and have the most enchanting, brilliant year ahead!
        </p>

        <div className={styles.buttonGroup}>
          <motion.button
            className={styles.actionBtn}
            onClick={onReadLetterAgain}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            📖 Read the Letter Again
          </motion.button>
          <motion.button
            className={styles.actionBtn}
            onClick={handleMusicReplay}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🎵 Play Birthday Song
          </motion.button>
          <motion.button
            className={styles.primaryBtn}
            onClick={onReplay}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            ✦ Experience Again ✦
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
