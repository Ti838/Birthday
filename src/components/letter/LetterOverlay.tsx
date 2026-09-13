import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore } from '../../store/useStoryStore';
import { playChime } from '../../utils/music';
import { KeyIcon } from '../icons/CustomIcons';
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
                      <p className={styles.titleTag}>a.k.a. Doraemon ✦ Happy Birthday!</p>
                    </div>

                    {/* Section 1 */}
                    <div className={styles.paraBlock}>
                      <p className={styles.paraLine}>Today is entirely your day, so first things first — <strong>Happy Birthday!</strong></p>
                      <p className={styles.paraLine}>
                        Another year unlocked, another level achieved, and without a doubt, equipped with even more chaotic energy and brilliant ideas.
                      </p>
                    </div>

                    {/* Highlight Box 1 */}
                    <div className={styles.highlightCard}>
                      <p className={styles.highlightText}>A true real-life Doraemon. ✦</p>
                    </div>

                    <div className={styles.paraBlock}>
                      <p className={styles.paraLine}>
                        I still find it hilarious how well the nickname "Doraemon" fits you. Maybe you don’t pull bamboo-copters or anywhere doors out of a 4D pocket, but you certainly have an uncanny magic of bringing spontaneous smiles, wild enthusiasm, and warmth wherever you go.
                      </p>
                    </div>

                    {/* Checklist 1 */}
                    <p className={styles.subHeading}>Unlocked this year:</p>
                    <div className={styles.checklistBlock}>
                      <div className={styles.checklistItem}>
                        <span className={styles.checkIcon}>✦</span>
                        <span>Master of unexpected solutions.</span>
                      </div>
                      <div className={styles.checklistItem}>
                        <span className={styles.checkIcon}>✦</span>
                        <span>Spreader of endless contagious laughter.</span>
                      </div>
                      <div className={styles.checklistItem}>
                        <span className={styles.checkIcon}>✦</span>
                        <span>Guardian of chaotic yet brilliant plans.</span>
                      </div>
                      <div className={styles.checklistItem}>
                        <span className={styles.checkIcon}>✦</span>
                        <span>And officially another year more awesome.</span>
                      </div>
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
                        Birthdays are basically life’s favorite checkpoint.
                      </p>
                      <p className={styles.paraLine}>
                        A moment to pause the endless to-do lists, silence all the deadlines, put away the overthinking, and just soak in being celebrated.
                      </p>
                    </div>

                    {/* Birthday Protocol Checklist */}
                    <p className={styles.subHeading}>The Official Birthday Protocol:</p>
                    <div className={styles.checklistBlock}>
                      <div className={styles.checklistItem}>
                        <span className={styles.checkIcon}>✦</span>
                        <span>Eat something truly delicious (zero guilt today).</span>
                      </div>
                      <div className={styles.checklistItem}>
                        <span className={styles.checkIcon}>✦</span>
                        <span>Laugh until your stomach hurts.</span>
                      </div>
                      <div className={styles.checklistItem}>
                        <span className={styles.checkIcon}>✦</span>
                        <span>Take way too many aesthetic pictures.</span>
                      </div>
                      <div className={styles.checklistItem}>
                        <span className={styles.checkIcon}>✦</span>
                        <span>Make a secret, audacious birthday wish.</span>
                      </div>
                      <div className={styles.checklistItem}>
                        <span className={styles.checkIcon}>✦</span>
                        <span>And enjoy every second of being the star today.</span>
                      </div>
                    </div>

                    {/* Highlight Box 2 */}
                    <div className={styles.highlightCard}>
                      <p className={styles.highlightText}>Happy Birthday once again, Doraemon! ✦</p>
                    </div>

                    {/* Closing wishes */}
                    <div className={styles.paraBlock}>
                      <p className={styles.paraLine}>
                        As you step into this exciting new chapter, I hope this year brings you: unshakeable peace of mind, boundless joy, radiant health, exciting adventures, and fewer "I should have started earlier" moments.
                      </p>
                      <p className={styles.paraLine}>
                        May life gift you countless little moments where you pause, smile, and think:
                      </p>
                      <p className={styles.quoteLine}>
                        "Yep, this is going to be a legendary year."
                      </p>
                    </div>

                    <p className={styles.closingWish}>Have the brightest & happiest birthday!</p>

                    {/* Signature */}
                    <div className={styles.signatureWrap}>
                      <span className={styles.signatureLabel}>Always cheering for you,</span>
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
                        The full personal handwritten letter is exclusively sealed for Tithi.
                      </p>
                    </div>

                    {!showPassPrompt ? (
                      <div style={{ marginTop: 24 }}>
                        <p className={styles.paraLine} style={{ fontSize: 13, color: '#cfc5b3' }}>
                          Are you Tithi? You can unlock your personal letter with your secret passcode.
                        </p>
                        <button
                          className={styles.continueBtn}
                          style={{ margin: '16px auto 0', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                          onClick={() => setShowPassPrompt(true)}
                        >
                          <KeyIcon size={16} color="#070913" />
                          <span>Unlock Tithi's Personal Letter</span>
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
