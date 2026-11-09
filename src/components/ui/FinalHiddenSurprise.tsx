import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore } from '../../store/useStoryStore';
import { playHappyBirthdaySong, playChime } from '../../utils/music';
import { SparkleIcon, EnvelopeIcon, MusicIcon } from '../icons/CustomIcons';
import styles from './FinalHiddenSurprise.module.css';

interface FinalHiddenSurpriseProps {
  onOpenLetterAgain: () => void;
  onReplay: () => void;
}

export function FinalHiddenSurprise({ onOpenLetterAgain, onReplay }: FinalHiddenSurpriseProps) {
  const stage = useStoryStore((s) => s.stage);
  const setStage = useStoryStore((s) => s.setStage);
  const [missionDone, setMissionDone] = useState(false);

  const handleCompleteMission = () => {
    setMissionDone(true);
    playChime(1.5);
    setTimeout(() => {
      setStage('14_quiet_night');
    }, 1500);
  };

  const handlePlaySong = () => {
    playChime(1.2);
    playHappyBirthdaySong();
  };

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        {stage === '13_hidden_surprise' && !missionDone && (
          <motion.div
            key="surprise-card"
            className={styles.card}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
          >
            <span className={styles.badge}>✦ A FINAL REFLECTION ✦</span>
            <h2 className={styles.heading}>A NOTE FOR THE JOURNEY</h2>
            <p className={styles.subheading}>Before this world becomes a lasting memory ✦</p>

            <div className={styles.missionBox}>
              <p className={styles.missionTitle}>3 simple reminders for your creative path:</p>
              <ul className={styles.missionList}>
                <li>✦ Stay curious and keep creating.</li>
                <li>✦ Cherish every milestone and adventure.</li>
                <li>✦ And always find reasons to smile. ✦</li>
              </ul>
            </div>

            <motion.button
              className={styles.primaryBtn}
              onClick={handleCompleteMission}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <span>JOURNEY COMPLETE ✦</span>
            </motion.button>
          </motion.div>
        )}

        {stage === '14_quiet_night' && (
          <motion.div
            key="quiet-night"
            className={styles.quietCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <div className={styles.monogramBadge}>✦</div>
            <h1 className={styles.quietTitle}>THANK YOU FOR VISITING ✦</h1>
            <p className={styles.quietText}>
              May your journey ahead be full of light.<br />
              Find inspiration in every little moment.<br />
              And keep reaching for the stars.
            </p>

            <div className={styles.signatureBox}>
              <p className={styles.madeFor}>Designed & Developed by</p>
              <p className={styles.sigName}>Timon ✦</p>
            </div>

            <div className={styles.actionRow}>
              <button className={styles.secondaryBtn} onClick={onOpenLetterAgain}>
                <EnvelopeIcon size={16} /> Read Creator Note
              </button>
              <button className={styles.secondaryBtn} onClick={handlePlaySong}>
                <MusicIcon size={16} /> Play Celestial Melody
              </button>
              <button className={styles.replayBtn} onClick={onReplay}>
                <SparkleIcon size={15} /> Begin Again ✦
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

