import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './LetterOverlay.module.css';

interface LetterOverlayProps {
  visible: boolean;
  onClose: () => void;
}

export function LetterOverlay({ visible, onClose }: LetterOverlayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div className={styles.ambientOrb} />

          <motion.div
            className={styles.letterContainer}
            initial={{ y: 35, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 25, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* ── Top Bar ── */}
            <div className={styles.cardTopBar}>
              <div className={styles.topPill}>
                <span>✦</span>
                <span>Creator's Note & Journal • Timon</span>
                <span>✦</span>
              </div>
              <button
                className={styles.closeIconBtn}
                onClick={onClose}
                aria-label="Close Letter"
              >
                ✕
              </button>
            </div>

            {/* ── Single Smooth Scrollable Letter Content ── */}
            <div ref={scrollRef} className={styles.scrollArea}>
              <div className={styles.parchmentPaper}>
                <div className={styles.letterContent}>
                  {/* Header */}
                  <div className={styles.headerCenter}>
                    <div className={styles.monogram}>T</div>
                    <h2 className={styles.greeting}>Dear Dreamer & Explorer,</h2>
                    <p className={styles.titleTag}>Welcome to the Celestial World ✨</p>
                  </div>

                  {/* Section 1 */}
                  <div className={styles.paraBlock}>
                    <p className={styles.paraLine}>
                      Welcome to this interactive space. This 3D world was crafted as an exploration of digital art, light, and atmosphere — a quiet corner of the web to pause, reflect, and experience wonder.
                    </p>
                    <p className={styles.paraLine}>
                      In a world that often moves too fast, this project is an invitation to slow down, gaze at the starlight, and appreciate the craftsmanship in subtle details.
                    </p>
                  </div>

                  {/* Highlight Box 1 */}
                  <div className={styles.highlightCard}>
                    <p className={styles.highlightText}>A journey of curiosity, light, and boundless imagination. ✦</p>
                  </div>

                  <div className={styles.paraBlock}>
                    <p className={styles.paraLine}>
                      Every element you encounter here — from the procedural botanical flora and ambient weather system to the physics particle fireworks and interactive constellation — was built with deliberate care and passion for creative engineering.
                    </p>
                  </div>

                  {/* Checklist 1 */}
                  <p className={styles.subHeading}>Principles behind this world:</p>
                  <div className={styles.checklistBlock}>
                    <div className={styles.checklistItem}>
                      <span className={styles.checkIcon}>✦</span>
                      <span>Stay curious and embrace spontaneous adventures.</span>
                    </div>
                    <div className={styles.checklistItem}>
                      <span className={styles.checkIcon}>✦</span>
                      <span>Find wonder in code, design, and creative expression.</span>
                    </div>
                    <div className={styles.checklistItem}>
                      <span className={styles.checkIcon}>✦</span>
                      <span>Build things with genuine passion and attention to detail.</span>
                    </div>
                    <div className={styles.checklistItem}>
                      <span className={styles.checkIcon}>✦</span>
                      <span>And always celebrate the milestones along your journey.</span>
                    </div>
                  </div>

                  {/* Elegant Divider */}
                  <div className={styles.ornament}>
                    <span className={styles.ornamentLine} />
                    <span className={styles.ornamentDot}>✦ ✦ ✦</span>
                    <span className={styles.ornamentLine} />
                  </div>

                  {/* Section 2: Reflections */}
                  <div className={styles.paraBlock}>
                    <p className={styles.paraLine}>
                      Interactive experiences are a gentle reminder of the magic that happens when art and technology meet.
                    </p>
                    <p className={styles.paraLine}>
                      So take your time, explore every corner, and let yourself enjoy the atmosphere.
                    </p>
                  </div>

                  {/* The Explorer's Creed */}
                  <p className={styles.subHeading}>The Explorer's Creed:</p>
                  <div className={styles.checklistBlock}>
                    <div className={styles.checklistItem}>
                      <span className={styles.checkIcon}>✦</span>
                      <span>Pause to appreciate the craft in everyday things.</span>
                    </div>
                    <div className={styles.checklistItem}>
                      <span className={styles.checkIcon}>✦</span>
                      <span>Dare to dream audaciously and build what inspires you.</span>
                    </div>
                    <div className={styles.checklistItem}>
                      <span className={styles.checkIcon}>✦</span>
                      <span>Capture memories that bring warmth to your heart.</span>
                    </div>
                    <div className={styles.checklistItem}>
                      <span className={styles.checkIcon}>✦</span>
                      <span>Never lose your sense of childlike curiosity and wonder.</span>
                    </div>
                    <div className={styles.checklistItem}>
                      <span className={styles.checkIcon}>✦</span>
                      <span>And enjoy every single heartbeat of this journey.</span>
                    </div>
                  </div>

                  {/* Highlight Box 2 */}
                  <div className={styles.highlightCard}>
                    <p className={styles.highlightText}>May all your aspirations find their way into reality. ✦</p>
                  </div>

                  {/* Closing wishes */}
                  <div className={styles.paraBlock}>
                    <p className={styles.paraLine}>
                      As you explore the different scenes in this world — the blooming secret garden, the constellation sky, and the midnight celebration — I hope you feel a spark of inspiration and quiet joy.
                    </p>
                    <p className={styles.paraLine}>
                      May your journey ahead be filled with vibrant health, exciting milestones, meaningful connections, and days of quiet happiness.
                    </p>
                    <p className={styles.quoteLine}>
                      "Yep, this is truly a wonderful chapter."
                    </p>
                  </div>

                  <p className={styles.closingWish}>Thank you for exploring this world! ✨</p>

                  {/* Signature */}
                  <div className={styles.signatureWrap}>
                    <span className={styles.signatureLabel}>Warmest wishes,</span>
                    <p className={styles.signatureAuthor}>Timon ✦</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Bottom Bar ── */}
            <div className={styles.cardBottomBar}>
              <span className={styles.scrollHint}>✦ Designed & Written by Timon ✦</span>
              <button className={styles.continueBtn} onClick={onClose}>
                <span>Keep in Heart & Continue ✦</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
