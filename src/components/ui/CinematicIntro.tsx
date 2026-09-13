import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStoryStore } from '../../store/useStoryStore';

export function CinematicIntro() {
  const setStage = useStoryStore((s) => s.setStage);

  // Auto transition to 02_gift after the cinematic text plays out
  useEffect(() => {
    const timer = setTimeout(() => {
      setStage('02_gift');
    }, 5500); // Wait 5.5 seconds before showing the gift
    return () => clearTimeout(timer);
  }, [setStage]);

  return (
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#040508',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5, ease: 'easeInOut' } }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      {/* Subtle background glow */}
      <motion.div
        style={{
          position: 'absolute',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, rgba(232, 200, 114, 0.08) 0%, transparent 60%)',
          filter: 'blur(40px)',
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 3 }}
      />

      <motion.h1
        style={{
          fontFamily: '"Bodoni Moda", "Playfair Display", serif',
          fontSize: 'clamp(28px, 5vw, 42px)',
          fontWeight: 400,
          color: '#ffffff',
          letterSpacing: '0.04em',
          margin: '0 0 16px 0',
          textShadow: '0 4px 20px rgba(255, 255, 255, 0.2)',
        }}
        initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.8, delay: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
      >
        Welcome, Tithi.
      </motion.h1>

      <motion.p
        style={{
          fontFamily: '"Manrope", sans-serif',
          fontSize: 'clamp(11px, 1.5vw, 13px)',
          fontWeight: 600,
          color: '#e8c872',
          textTransform: 'uppercase',
          letterSpacing: '0.4em',
          margin: 0,
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 2.2, ease: 'easeOut' }}
      >
        The Universe Awaits
      </motion.p>
    </motion.div>
  );
}
