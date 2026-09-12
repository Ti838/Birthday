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
            <span className={styles.badge}>✦ A FINAL BIRTHDAY SURPRISE ✦</span>
            <h2 className={styles.heading}>ONE LAST THING, TITHI.</h2>
            <p className={styles.subheading}>Before this world becomes your keepsake memory ✦</p>

            <div className={styles.missionBox}>
              <p className={styles.missionTitle}>Your 3 simple wishes for this year:</p>
              <ul className={styles.missionList}>
                <li>✦ Enjoy your year to the fullest.</li>
                <li>✦ Make plenty of great memories.</li>
                <li>✦ And smile a lot. ✦</li>
              </ul>
            </div>

            <motion.button
              className={styles.primaryBtn}
              onClick={handleCompleteMission}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <span>MISSION COMPLETE ✦</span>
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
            <h1 className={styles.quietTitle}>HAPPY BIRTHDAY, TITHI. ✦</h1>
            <p className={styles.quietText}>
              Have a wonderful year ahead.<br />
              Enjoy every little moment.<br />
              And make it a good one.
            </p>

            <div className={styles.signatureBox}>
              <p className={styles.madeFor}>Made for your birthday.</p>
              <p className={styles.sigName}>Timon ✦</p>
            </div>

            <div className={styles.actionRow}>
              <button className={styles.secondaryBtn} onClick={onOpenLetterAgain}>
                <EnvelopeIcon size={16} /> Read Letter Again
              </button>
              <button className={styles.secondaryBtn} onClick={handlePlaySong}>
                <MusicIcon size={16} /> Play Birthday Melody
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

