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
                      <h2 className={styles.greeting}>Dear Doraemon (Tithi ✦)</h2>
                      <p className={styles.titleTag}>Wishing You the Happiest Birthday! 🎂✨</p>
                    </div>

                    {/* Section 1 */}
                    <div className={styles.paraBlock}>
                      <p className={styles.paraLine}>
                        Today is all about celebrating you, your existence, and the special light you bring into the world.
                      </p>
                      <p className={styles.paraLine}>
                        <strong>Happy Birthday, Doraemon!</strong> Another chapter begins today, and with every passing year, you bring even more warmth, uncontrollable laughter, and your own brand of brilliant magic.
                      </p>
                    </div>

                    {/* Highlight Box 1 */}
                    <div className={styles.highlightCard}>
                      <p className={styles.highlightText}>The real-life Doraemon with an endless pocket of smiles. ✦</p>
                    </div>

                    <div className={styles.paraBlock}>
                      <p className={styles.paraLine}>
                        I don’t think any nickname fits you more perfectly than <strong>"Doraemon"</strong>. Even without gadgets like an anywhere door or a bamboo-copter, you have this natural superpower to turn ordinary moments into unforgettable memories and make everyone around you laugh with pure joy.
                      </p>
                    </div>

                    {/* Checklist 1 */}
                    <p className={styles.subHeading}>What makes you so special:</p>
                    <div className={styles.checklistBlock}>
                      <div className={styles.checklistItem}>
                        <span className={styles.checkIcon}>✦</span>
                        <span>Mastermind of spontaneous, fun adventures.</span>
                      </div>
                      <div className={styles.checklistItem}>
                        <span className={styles.checkIcon}>✦</span>
                        <span>The person who always brings positive energy and laughter.</span>
                      </div>
                      <div className={styles.checklistItem}>
                        <span className={styles.checkIcon}>✦</span>
                        <span>The keeper of big dreams, great resilience, and pure kindness.</span>
                      </div>
                      <div className={styles.checklistItem}>
                        <span className={styles.checkIcon}>✦</span>
                        <span>And officially, another year more wonderful and legendary.</span>
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
                        Birthdays are life's gentle way of reminding you to pause, breathe, and celebrate everything you are.
                      </p>
                      <p className={styles.paraLine}>
                        So today, leave all the deadlines, stress, and overthinking behind. Today belongs only to you.
                      </p>
                    </div>

                    {/* Birthday Protocol Checklist */}
                    <p className={styles.subHeading}>The Official Birthday Rules:</p>
                    <div className={styles.checklistBlock}>
                      <div className={styles.checklistItem}>
                        <span className={styles.checkIcon}>✦</span>
                        <span>Treat yourself to something delicious with zero guilt.</span>
                      </div>
                      <div className={styles.checklistItem}>
                        <span className={styles.checkIcon}>✦</span>
                        <span>Laugh a little louder with the people who cherish you.</span>
                      </div>
                      <div className={styles.checklistItem}>
                        <span className={styles.checkIcon}>✦</span>
                        <span>Capture plenty of beautiful memories and candid photos.</span>
                      </div>
                      <div className={styles.checklistItem}>
                        <span className={styles.checkIcon}>✦</span>
                        <span>Make an audacious, secret wish when blowing out your candles.</span>
                      </div>
                      <div className={styles.checklistItem}>
                        <span className={styles.checkIcon}>✦</span>
                        <span>And enjoy every single heartbeat of being the birthday star.</span>
                      </div>
                    </div>

                    {/* Highlight Box 2 */}
                    <div className={styles.highlightCard}>
                      <p className={styles.highlightText}>May all your secret wishes find their way to reality. ✦</p>
                    </div>

                    {/* Closing wishes */}
                    <div className={styles.paraBlock}>
                      <p className={styles.paraLine}>
                        As you step into this brand new year of your life, I truly wish you: unshakeable peace of mind, vibrant health, exciting milestones, endless laughter, and days filled with quiet happiness.
                      </p>
                      <p className={styles.paraLine}>
                        May life surprise you with moments so special that you stop and whisper:
                      </p>
                      <p className={styles.quoteLine}>
                        "Yep, this is truly a blessed chapter."
                      </p>
                    </div>

                    <p className={styles.closingWish}>Have an extraordinary and magical birthday, Doraemon!</p>

                    {/* Signature */}
                    <div className={styles.signatureWrap}>
                      <span className={styles.signatureLabel}>Always wishing you the absolute best,</span>
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
