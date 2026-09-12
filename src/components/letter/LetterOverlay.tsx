import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore } from '../../store/useStoryStore';
import { playChime } from '../../utils/music';
import styles from './LetterOverlay.module.css';

interface LetterOverlayProps {
  visible: boolean;
  onClose: () => void;
}

const VALID_PASSCODES = ['1809', 'tithi', 'doraemon', '18/09', '18-09'];

export function LetterOverlay({ visible, onClose }: LetterOverlayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isVIP = useStoryStore((s) => s.isVIP);
  const setVIP = useStoryStore((s) => s.setVIP);

  const [showPassPrompt, setShowPassPrompt] = useState(false);
  const [inlinePass, setInlinePass] = useState('');
  const [inlineError, setInlineError] = useState('');

  useEffect(() => {
    if (visible && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [visible]);

  const handleInlineUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inlinePass.toLowerCase().trim();
    if (VALID_PASSCODES.includes(clean)) {
      setVIP(true);
      setShowPassPrompt(false);
      playChime(1.5);
    } else {
      setInlineError('Incorrect key. Try birthdate (1809) or your special name ✦');
    }
  };

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
                <span>
                  {isVIP
                    ? 'A Birthday Note for Tithi'
                    : 'Birthday Keepsake • For Tithi'}
                </span>
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
                {isVIP ? (
                  /* VIP SINGLE CONTINUOUS LETTER */
                  <div className={styles.letterContent}>
                    {/* Header */}
                    <div className={styles.headerCenter}>
                      <div className={styles.monogram}>T</div>
                      <h2 className={styles.greeting}>Dear Tithi,</h2>
                      <p className={styles.titleTag}>Happy Birthday! 🎂</p>
                    </div>

                    {/* Section 1 */}
                    <div className={styles.paraBlock}>
                      <p className={styles.paraLine}>Today is your day, so first things first...</p>
                      <p className={styles.paraLine}>
                        I hope your day is filled with good food, good laughs, good people, and absolutely no unnecessary stress.
                      </p>
                    </div>

                    {/* Highlight Box 1 */}
                    <div className={styles.highlightCard}>
                      <p className={styles.highlightText}>Another year unlocked. ✨</p>
                    </div>

                    {/* Checklist 1 */}
                    <p className={styles.subHeading}>Which means:</p>
                    <div className={styles.checklistBlock}>
                      <div className={styles.checklistItem}>
                        <span className={styles.checkIcon}>✦</span>
                        <span>More adventures.</span>
                      </div>
                      <div className={styles.checklistItem}>
                        <span className={styles.checkIcon}>✦</span>
                        <span>More random moments.</span>
                      </div>
                      <div className={styles.checklistItem}>
                        <span className={styles.checkIcon}>✦</span>
                        <span>More things to learn.</span>
                      </div>
                      <div className={styles.checklistItem}>
                        <span className={styles.checkIcon}>✦</span>
                        <span>More reasons to laugh.</span>
                      </div>
                    </div>

                    <div className={styles.paraBlock}>
                      <p className={styles.paraLine}>
                        And hopefully... fewer "I should have started earlier" moments. 😄
                      </p>
                    </div>

                    {/* Elegant Divider */}
                    <div className={styles.ornament}>
                      <span className={styles.ornamentLine} />
                      <span className={styles.ornamentDot}>✦ ✦ ✦</span>
                      <span className={styles.ornamentLine} />
                    </div>

                    {/* Section 2: Checkpoint */}
                    <div className={styles.paraBlock}>
                      <p className={styles.paraLine}>
                        Birthdays are basically life's way of giving you a little checkpoint.
                      </p>
                      <p className={styles.paraLine}>
                        So forget everything for a moment. No deadlines. No overthinking. Just enjoy your day.
                      </p>
                    </div>

                    {/* Birthday Girl Checklist */}
                    <div className={styles.checklistBlock}>
                      <div className={styles.checklistItem}>
                        <span className={styles.checkIcon}>✦</span>
                        <span>Eat something nice.</span>
                      </div>
                      <div className={styles.checklistItem}>
                        <span className={styles.checkIcon}>✦</span>
                        <span>Laugh a little louder.</span>
                      </div>
                      <div className={styles.checklistItem}>
                        <span className={styles.checkIcon}>✦</span>
                        <span>Take too many pictures.</span>
                      </div>
                      <div className={styles.checklistItem}>
                        <span className={styles.checkIcon}>✦</span>
                        <span>Make a ridiculous wish.</span>
                      </div>
                      <div className={styles.checklistItem}>
                        <span className={styles.checkIcon}>✦</span>
                        <span>And enjoy being the birthday girl.</span>
                      </div>
                    </div>

                    {/* Highlight Box 2 */}
                    <div className={styles.highlightCard}>
                      <p className={styles.highlightText}>Happy Birthday once again, Tithi. ✦</p>
                    </div>

                    {/* Closing wishes */}
                    <div className={styles.paraBlock}>
                      <p className={styles.paraLine}>
                        I hope this year brings you: more happiness, more adventures, more peaceful days, more reasons to laugh, and plenty of good memories.
                      </p>
                      <p className={styles.paraLine}>
                        Whatever this new year brings, I hope there are lots of little moments that make you think:
                      </p>
                      <p className={styles.quoteLine}>
                        "Yep, that was a good day."
                      </p>
                    </div>

                    <p className={styles.closingWish}>Have an amazing birthday!</p>

                    {/* Signature */}
                    <div className={styles.signatureWrap}>
                      <span className={styles.signatureLabel}>With thoughts,</span>
                      <p className={styles.signatureAuthor}>Timon ✦</p>
                    </div>
                  </div>
                ) : (
                  /* GUEST SHOWCASE VIEW */
                  <div className={styles.letterContent} style={{ textAlign: 'center' }}>
                    <div className={styles.headerCenter}>
                      <div className={styles.monogram}>T</div>
                      <h2 className={styles.greeting}>A Handcrafted Birthday Keepsake</h2>
                      <p className={styles.titleTag}>Dedicated to Tithi ✦</p>
                    </div>

                    <div className={styles.paraBlock}>
                      <p className={styles.paraLine}>
                        This interactive 3D birthday world was handcrafted with care by <strong>Timon</strong> to celebrate Tithi's special day.
                      </p>
                    </div>

                    <div className={styles.highlightCard}>
                      <p className={styles.highlightText}>
                        🔒 The full personal handwritten letter is exclusively sealed for Tithi.
                      </p>
                    </div>

                    {!showPassPrompt ? (
                      <div style={{ marginTop: 24 }}>
                        <p className={styles.paraLine} style={{ fontSize: 13, color: '#cfc5b3' }}>
                          Are you Tithi? You can unlock your personal letter with your secret passcode.
                        </p>
                        <button
                          className={styles.continueBtn}
                          style={{ margin: '16px auto 0' }}
                          onClick={() => setShowPassPrompt(true)}
                        >
                          🔑 Unlock Tithi's Personal Letter
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleInlineUnlock} style={{ marginTop: 24 }}>
                        <p className={styles.paraLine} style={{ fontSize: 14, color: '#ffe5a4', marginBottom: 12 }}>
                          Enter your secret birthday passcode:
                        </p>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                          <input
                            type="password"
                            placeholder="Passcode..."
                            value={inlinePass}
                            onChange={(e) => {
                              setInlinePass(e.target.value);
                              setInlineError('');
                            }}
                            style={{
                              background: 'rgba(7,9,19,0.85)',
                              border: '1px solid rgba(232,200,114,0.4)',
                              borderRadius: 999,
                              padding: '10px 20px',
                              color: '#ffe5a4',
                              textAlign: 'center',
                              fontSize: 14,
                              outline: 'none',
                            }}
                            autoFocus
                          />
                          <button type="submit" className={styles.continueBtn} style={{ margin: 0, padding: '10px 22px' }}>
                            Unlock
                          </button>
                        </div>
                        {inlineError && <p style={{ color: '#f2b5a5', fontSize: 12, marginTop: 8 }}>{inlineError}</p>}
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── Bottom Bar ── */}
            <div className={styles.cardBottomBar}>
              <span className={styles.scrollHint}>✦ Handcrafted with warmth ✦</span>
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
