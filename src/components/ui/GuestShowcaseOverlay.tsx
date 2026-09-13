import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore } from '../../store/useStoryStore';
import { triggerCelebrationConfetti } from '../../utils/confetti';
import {
  playFireworksBoom,
  playChime,
  playHappyBirthdaySong,
  stopMusic,
} from '../../utils/music';
import {
  SparkleIcon,
  CakeIcon,
  FlowerIcon,
  FireworksIcon,
  BalloonIcon,
  MusicIcon,
  CrownIcon,
} from '../icons/CustomIcons';
import styles from './GuestShowcaseOverlay.module.css';

interface GuestShowcaseOverlayProps {
  onUnlockVIP: () => void;
  onFocusView: (view: 'world' | 'cake' | 'flowers' | 'balloons') => void;
  onTriggerFireworks: () => void;
}

const VALID_PASSCODES = ['1809', 'tithi', 'doraemon', '18/09', '18-09'];

export function GuestShowcaseOverlay({
  onUnlockVIP,
  onFocusView,
  onTriggerFireworks,
}: GuestShowcaseOverlayProps) {
  const isVIP = useStoryStore((s) => s.isVIP);
  const setVIP = useStoryStore((s) => s.setVIP);
  const [showPassModal, setShowPassModal] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'world' | 'cake' | 'flowers' | 'balloons'>('world');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  if (isVIP) return null;

  const handleFireworks = () => {
    playFireworksBoom();
    onTriggerFireworks();
    triggerCelebrationConfetti();
  };

  const handleConfettiBalloons = () => {
    playChime(1.3);
    onFocusView('balloons');
    setActiveTab('balloons');
    triggerCelebrationConfetti();
  };

  const handleMusicPlay = () => {
    if (isPlayingMusic) {
      stopMusic();
      setIsPlayingMusic(false);
    } else {
      stopMusic();
      playHappyBirthdaySong();
      setIsPlayingMusic(true);
      setTimeout(() => setIsPlayingMusic(false), 17000);
    }
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passInput.toLowerCase().trim();
    if (VALID_PASSCODES.includes(clean)) {
      setVIP(true);
      playChime(1.5);
      onUnlockVIP();
    } else {
      setErrorMsg('Incorrect key ✦ Try birthdate (1809) or Tithi ✦');
    }
  };

  return (
    <div className={styles.guestContainer}>
      {/* Top Floating Guest Header */}
      <motion.header
        className={styles.guestHeader}
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.tagline}>
          <span className={styles.tagDot} />
          <span>GUEST SHOWCASE MODE</span>
          <span className={styles.tagDot} />
        </div>
        <h1 className={styles.title}>Tithi's Birthday Celebration ✦</h1>
        <p className={styles.subtitle}>
          Explore the 3D universe, enjoy the fireworks, and celebrate Tithi's special day!
        </p>
      </motion.header>

      {/* Bottom Interactive Showcase Control Deck */}
      <motion.footer
        className={styles.controlDeck}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Camera Scenic Quick Switcher */}
        <div className={styles.viewRow}>
          <button
            className={`${styles.viewTab} ${activeTab === 'world' ? styles.viewTabActive : ''}`}
            onClick={() => {
              setActiveTab('world');
              onFocusView('world');
            }}
          >
            <SparkleIcon size={14} color={activeTab === 'world' ? '#FFE5A4' : '#C9C3B8'} />
            <span>Panoramic World</span>
          </button>
          <button
            className={`${styles.viewTab} ${activeTab === 'cake' ? styles.viewTabActive : ''}`}
            onClick={() => {
              setActiveTab('cake');
              onFocusView('cake');
            }}
          >
            <CakeIcon size={14} color={activeTab === 'cake' ? '#FFE5A4' : '#C9C3B8'} />
            <span>Birthday Cake</span>
          </button>
          <button
            className={`${styles.viewTab} ${activeTab === 'flowers' ? styles.viewTabActive : ''}`}
            onClick={() => {
              setActiveTab('flowers');
              onFocusView('flowers');
            }}
          >
            <FlowerIcon size={14} color={activeTab === 'flowers' ? '#FFE5A4' : '#C9C3B8'} />
            <span>Flower Garden</span>
          </button>
        </div>

        {/* Action Showcase Buttons */}
        <div className={styles.actionButtons}>
          <button className={styles.actionBtn} onClick={handleFireworks}>
            <FireworksIcon size={16} color="#E8C872" />
            <span>Launch Fireworks</span>
          </button>

          <button className={styles.actionBtn} onClick={handleConfettiBalloons}>
            <BalloonIcon size={16} color="#F2B5A5" />
            <span>Celebrate & Confetti</span>
          </button>

          <button className={styles.actionBtn} onClick={handleMusicPlay}>
            <MusicIcon size={16} color="#FFE5A4" />
            <span>Birthday Symphony</span>
          </button>

          <button
            className={styles.vipSwitchBtn}
            onClick={() => setShowPassModal(true)}
          >
            <CrownIcon size={16} color="#0B0E1D" />
            <span>Are You Tithi? (VIP Unlock)</span>
          </button>
        </div>
      </motion.footer>

      {/* VIP Unlock Passcode Modal */}
      <AnimatePresence>
        {showPassModal && (
          <motion.div
            className={styles.modalBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.passModal}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h3 className={styles.modalTitle}>Unlock Tithi's VIP Experience ✦</h3>
              <p className={styles.modalDesc}>
                Enter your secret key (e.g. <strong>1809</strong> or your name) to open your personalized letter and gifts.
              </p>
              <form onSubmit={handlePasscodeSubmit} className={styles.formRow}>
                <input
                  type="password"
                  placeholder="Enter passcode..."
                  value={passInput}
                  onChange={(e) => {
                    setPassInput(e.target.value);
                    setErrorMsg('');
                  }}
                  className={styles.passInput}
                  autoFocus
                />
                <button type="submit" className={styles.submitBtn}>
                  Unlock ✦
                </button>
              </form>
              {errorMsg && <p className={styles.errorText}>{errorMsg}</p>}
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setShowPassModal(false)}
              >
                Close & Return to Showcase
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
