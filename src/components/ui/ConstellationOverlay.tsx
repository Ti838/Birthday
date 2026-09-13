import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore } from '../../store/useStoryStore';
import { CONSTELLATION_STARS } from '../../utils/constants';
import { playStarCollectSound, playChime } from '../../utils/music';
import styles from './ConstellationOverlay.module.css';

interface ConstellationOverlayProps {
  onComplete: () => void;
}

// ─── Bespoke Celestial SVG Emblems (Zero Platform Emojis) ────────────

function JoyStarIcon({ active }: { active: boolean }) {
  return (
    <svg className={styles.starSvg} viewBox="0 0 48 48" fill="none">
      <defs>
        <radialGradient id="joyGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={active ? '#FFFBEB' : '#E8C872'} />
          <stop offset="100%" stopColor={active ? '#F59E0B' : '#B4882F'} />
        </radialGradient>
      </defs>
      {/* 8-Point Starlight */}
      <path
        d="M24 3 L27 18 L42 21 L30 30 L34 45 L24 36 L14 45 L18 30 L6 21 L21 18 Z"
        fill="url(#joyGrad)"
        opacity={active ? 1 : 0.75}
      />
      <circle cx="24" cy="24" r="3.5" fill="#FFFFFF" />
      {active && (
        <circle cx="24" cy="24" r="16" stroke="#FFE5A4" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      )}
    </svg>
  );
}

function CompassIcon({ active }: { active: boolean }) {
  return (
    <svg className={styles.starSvg} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="18" stroke={active ? '#F2B5A5' : '#8A95A5'} strokeWidth="1.5" strokeDasharray="2 4" />
      <circle cx="24" cy="24" r="13" stroke={active ? '#FFE5A4' : '#64748B'} strokeWidth="1" />
      {/* Compass Needles */}
      <path d="M24 6 L28 24 L24 22 L20 24 Z" fill={active ? '#F2B5A5' : '#D1D5DB'} />
      <path d="M24 42 L20 24 L24 26 L28 24 Z" fill={active ? '#FFE5A4' : '#9CA3AF'} />
      <path d="M6 24 L24 20 L22 24 L24 28 Z" fill={active ? '#E8C872' : '#9CA3AF'} />
      <path d="M42 24 L24 28 L26 24 L24 20 Z" fill={active ? '#E8C872' : '#9CA3AF'} />
      <circle cx="24" cy="24" r="2.5" fill="#FFFFFF" />
    </svg>
  );
}

function ZenithIcon({ active }: { active: boolean }) {
  return (
    <svg className={styles.starSvg} viewBox="0 0 48 48" fill="none">
      {/* Crown of Luminary Rays */}
      <path d="M24 4 L28 17 L41 11 L33 23 L44 31 L30 33 L32 46 L24 37 L16 46 L18 33 L4 31 L15 23 L7 11 L20 17 Z" fill={active ? '#FDE047' : '#B89B48'} opacity={active ? 0.95 : 0.7} />
      <circle cx="24" cy="25" r="4.5" fill={active ? '#FFFFFF' : '#FFF5D6'} />
      {active && <circle cx="24" cy="25" r="19" stroke="#FDE047" strokeWidth="1" opacity="0.4" />}
    </svg>
  );
}

function BloomIcon({ active }: { active: boolean }) {
  return (
    <svg className={styles.starSvg} viewBox="0 0 48 48" fill="none">
      {/* Solar Aurora Petals */}
      <path d="M24 7 C24 16 16 24 7 24 C16 24 24 32 24 41 C24 32 32 24 41 24 C32 24 24 16 24 7 Z" fill={active ? '#FB7185' : '#8E6E7E'} />
      <path d="M24 12 C24 18 18 24 12 24 C18 24 24 30 24 36 C24 30 30 24 36 24 C30 24 24 18 24 12 Z" fill={active ? '#FFE4E6' : '#D4AFB9'} />
      <circle cx="24" cy="24" r="3" fill="#FFFFFF" />
    </svg>
  );
}

function PrismIcon({ active }: { active: boolean }) {
  return (
    <svg className={styles.starSvg} viewBox="0 0 48 48" fill="none">
      {/* Diamond / Infinity Prism */}
      <polygon points="24,6 40,24 24,42 8,24" stroke={active ? '#C084FC' : '#7E6B9B'} strokeWidth="1.8" fill={active ? 'rgba(192, 132, 252, 0.25)' : 'none'} />
      <polygon points="24,14 34,24 24,34 14,24" stroke={active ? '#F3E8FF' : '#5E4E77'} strokeWidth="1.2" />
      <circle cx="24" cy="24" r="2.5" fill="#FFFFFF" />
    </svg>
  );
}

const ICON_MAP: Record<string, React.FC<{ active: boolean }>> = {
  joy: JoyStarIcon,
  compass: CompassIcon,
  zenith: ZenithIcon,
  bloom: BloomIcon,
  prism: PrismIcon,
};

export function ConstellationOverlay({ onComplete }: ConstellationOverlayProps) {
  const constellationStars = useStoryStore((s) => s.constellationStars);
  const collectConstellationStar = useStoryStore((s) => s.collectConstellationStar);

  const handleStarClick = (name: string, idx: number) => {
    if (!constellationStars.includes(name)) {
      collectConstellationStar(name);
      playStarCollectSound(idx + 1);
      if (constellationStars.length + 1 >= CONSTELLATION_STARS.length) {
        setTimeout(() => {
          playChime(1.4);
          onComplete();
        }, 1500);
      }
    }
  };

  const isComplete = constellationStars.length === CONSTELLATION_STARS.length;

  return (
    <div className={styles.container}>
      {/* Top Header Card */}
      <motion.div
        className={styles.promptCard}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className={styles.badgeRow}>
          <span className={styles.badgeLine} />
          <span className={styles.badge}>CELESTIAL CONSTELLATION</span>
          <span className={styles.badgeLine} />
        </div>
        <h2 className={styles.title}>Touch the 5 Guiding Stars</h2>
        <p className={styles.subtitle}>
          Tap each star emblem to awaken the constellation in your night sky ({constellationStars.length} / {CONSTELLATION_STARS.length})
        </p>
      </motion.div>

      {/* Constellation Celestial Map Area */}
      <div className={styles.constellationMap}>
        {/* Dynamic Glowing Starlight Lines linking the 5 nodes */}
        <svg className={styles.connectionsSvg} viewBox="0 0 1000 200" preserveAspectRatio="none">
          <polyline
            points="100,90 280,40 500,24 720,52 900,100"
            className={`${styles.starlightTrack} ${isComplete ? styles.starlightTrackComplete : ''}`}
          />
        </svg>

        <div className={styles.starsGrid}>
          {CONSTELLATION_STARS.map((star, idx) => {
            const collected = constellationStars.includes(star.name);
            const IconComponent = ICON_MAP[star.type] || JoyStarIcon;

            return (
              <motion.button
                key={star.id}
                className={`${styles.starNode} ${collected ? styles.starCollected : ''}`}
                onClick={() => handleStarClick(star.name, idx)}
                whileHover={{ scale: 1.08, y: -6 }}
                whileTap={{ scale: 0.94 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                {/* Floating Starlight Ring */}
                <div className={styles.haloRing} />
                
                {/* Icon Emblem Container */}
                <div className={styles.iconWrapper}>
                  <IconComponent active={collected} />
                </div>

                <span className={styles.starLabel}>{star.name}</span>
                <span className={styles.starSubtitle}>{star.subtitle}</span>

                {collected && (
                  <motion.div
                    className={styles.sparklePulse}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Bottom Status Toast on Completion */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            className={styles.completedToast}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            ✦ Constellation Awakened! Unfolding your celebration balloons… ✦
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


