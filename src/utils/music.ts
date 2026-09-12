/**
 * High-Fidelity Web Audio Engine for Tithi's Celestial Birthday World:
 * - Polyphonic Celestial Music Box & Harpsichord sound generator
 * - Full Harmonized Polyphonic "Happy Birthday to You" Melody with warm chord accompaniment
 * - Realistic Multi-Layered Fireworks Sound Design (Launch whoosh -> Deep sub-bass boom -> Golden crackle tails)
 * - Tactile sound effects (chimes, star collection, balloon pop, flower bloom, breath extinguish)
 */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let bgmGain: GainNode | null = null;
let sfxGain: GainNode | null = null;

let isBgPlaying = false;
let bgTimer: ReturnType<typeof setTimeout> | null = null;

export function getAudioContext(): AudioContext {
  if (!ctx) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    ctx = new AudioCtx();

    masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.95, ctx.currentTime);
    masterGain.connect(ctx.destination);

    bgmGain = ctx.createGain();
    bgmGain.gain.setValueAtTime(0.35, ctx.currentTime);
    bgmGain.connect(masterGain);

    sfxGain = ctx.createGain();
    sfxGain.gain.setValueAtTime(0.85, ctx.currentTime);
    sfxGain.connect(masterGain);
  }
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  return ctx;
}

export function unlockAudio() {
  getAudioContext();
}

export function setMasterMute(muted: boolean) {
  if (masterGain && ctx) {
    masterGain.gain.setTargetAtTime(muted ? 0 : 0.95, ctx.currentTime, 0.05);
  }
}

/* ─── Luxury Bell / Music-Box Note Generator ─────────────────────── */
function playMusicBoxNote(
  freq: number,
  time: number,
  dur: number,
  gainNode: GainNode,
  vol = 0.2
) {
  if (!ctx) return;

  // Fundamental oscillator (sine + warm triangle)
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const noteGain = ctx.createGain();

  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(freq, time);

  // Subtle shimmer overtone
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(freq * 2.002, time);

  noteGain.gain.setValueAtTime(0.0001, time);
  noteGain.gain.linearRampToValueAtTime(vol, time + 0.015);
  noteGain.gain.exponentialRampToValueAtTime(vol * 0.45, time + 0.12);
  noteGain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

  osc1.connect(noteGain);
  osc2.connect(noteGain);
  noteGain.connect(gainNode);

  osc1.start(time);
  osc2.start(time);
  osc1.stop(time + dur + 0.05);
  osc2.stop(time + dur + 0.05);
}

/* ═════════════════════════════════════════════════════════════════
   INTERACTIVE SOUND EFFECTS (SFX)
══════════════════════════════════════════════════════════════════ */

/** Gentle chime when opening gift, envelope, or buttons */
export function playChime(pitch = 1.0) {
  try {
    const ac = getAudioContext();
    const now = ac.currentTime;

    [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((freq, idx) => {
      playMusicBoxNote(freq * pitch, now + idx * 0.045, 0.9, sfxGain!, 0.15);
    });
  } catch (e) {}
}

/** Crisp, satisfying pop sound when balloon is popped */
export function playPopSound() {
  try {
    const ac = getAudioContext();
    const now = ac.currentTime;

    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.09);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    osc.connect(gain);
    gain.connect(sfxGain!);

    osc.start(now);
    osc.stop(now + 0.12);

    setTimeout(() => playChime(1.35), 25);
  } catch (e) {}
}

/** Star collection chime with ascending sparkling pitch */
export function playStarCollectSound(starIndex = 1) {
  try {
    const ac = getAudioContext();
    const now = ac.currentTime;
    const baseFreqs = [
      523.25, 587.33, 659.25, 698.46, 783.99,
      880.0, 987.77, 1046.5, 1174.66, 1318.51, 1567.98, 1760.0
    ];
    const freq = baseFreqs[(starIndex - 1) % baseFreqs.length];

    playMusicBoxNote(freq, now, 0.7, sfxGain!, 0.24);
    playMusicBoxNote(freq * 1.5, now + 0.05, 0.6, sfxGain!, 0.12);
  } catch (e) {}
}

/** Flower bloom harp arpeggio */
export function playFlowerBloomSound(flowerIndex = 0) {
  try {
    const ac = getAudioContext();
    const now = ac.currentTime;
    const chords = [
      [523.25, 659.25, 783.99, 1046.5],     // C Maj
      [587.33, 739.99, 880.0, 1174.66],    // D Maj
      [659.25, 830.61, 987.77, 1318.51],   // E Maj
      [698.46, 880.0, 1046.5, 1396.91],    // F Maj
      [783.99, 987.77, 1174.66, 1567.98],  // G Maj
    ];
    const notes = chords[flowerIndex % chords.length];

    notes.forEach((freq, idx) => {
      playMusicBoxNote(freq, now + idx * 0.07, 1.2, sfxGain!, 0.18);
    });
  } catch (e) {}
}

/** Paper rustle sound */
export function playPaperSound() {
  try {
    const ac = getAudioContext();
    const now = ac.currentTime;

    const bufferSize = ac.sampleRate * 0.15;
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ac.createBufferSource();
    noise.buffer = buffer;

    const filter = ac.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.Q.setValueAtTime(2.5, now);

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(sfxGain!);

    noise.start(now);
    noise.stop(now + 0.15);
  } catch (e) {}
}

/** Gentle whoosh for camera pans */
export function playWhoosh() {
  try {
    const ac = getAudioContext();
    const now = ac.currentTime;

    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.25);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.6);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(sfxGain!);

    osc.start(now);
    osc.stop(now + 0.65);
  } catch (e) {}
}

/** Realistic gentle breath / wind blowing out candle */
export function playBlowSound() {
  try {
    const ac = getAudioContext();
    const now = ac.currentTime;

    const bufferSize = ac.sampleRate * 0.6;
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ac.createBufferSource();
    noise.buffer = buffer;

    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.linearRampToValueAtTime(200, now + 0.55);

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(sfxGain!);

    noise.start(now);
    noise.stop(now + 0.6);
  } catch (e) {}
}

/** Realistic Multi-Layered Fireworks Explosion SFX */
export function playFireworksBoom() {
  try {
    const ac = getAudioContext();
    const now = ac.currentTime;

    // 1. Heavy resonant sub-bass boom
    const subOsc = ac.createOscillator();
    const subGain = ac.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(160, now);
    subOsc.frequency.exponentialRampToValueAtTime(28, now + 0.5);

    subGain.gain.setValueAtTime(0.65, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    subOsc.connect(subGain);
    subGain.connect(sfxGain!);
    subOsc.start(now);
    subOsc.stop(now + 0.6);

    // 2. High-end burst blast crackle
    const burstSize = Math.floor(ac.sampleRate * 0.35);
    const buffer = ac.createBuffer(1, burstSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < burstSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ac.sampleRate * 0.08));
    }

    const noise = ac.createBufferSource();
    noise.buffer = buffer;

    const filter = ac.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(1.5, now);

    const burstGain = ac.createGain();
    burstGain.gain.setValueAtTime(0.4, now);
    burstGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    noise.connect(filter);
    filter.connect(burstGain);
    burstGain.connect(sfxGain!);
    noise.start(now);
    noise.stop(now + 0.38);

    // 3. Delayed glittering crackles
    setTimeout(() => {
      [800, 1100, 1400].forEach((freq, idx) => {
        playMusicBoxNote(freq * (1 + Math.random() * 0.2), now + 0.15 + idx * 0.06, 0.4, sfxGain!, 0.08);
      });
    }, 100);
  } catch (e) {}
}

export const playFireworkSound = playFireworksBoom;

/* ═════════════════════════════════════════════════════════════════
   AMBIENT MUSIC & HARMONIZED HAPPY BIRTHDAY SYNTHESIZER
══════════════════════════════════════════════════════════════════ */

export function startMusic() {
  if (isBgPlaying) return;
  isBgPlaying = true;
  playAmbientLoop();
}

export function stopMusic() {
  isBgPlaying = false;
  if (bgTimer) clearTimeout(bgTimer);
}

function playAmbientLoop() {
  if (!isBgPlaying) return;

  const ac = getAudioContext();
  const now = ac.currentTime;

  const chords = [
    [261.63, 329.63, 392.0, 523.25], // C Major
    [220.0, 261.63, 329.63, 440.0],  // A Minor
    [174.61, 220.0, 261.63, 349.23], // F Major
    [196.0, 246.94, 293.66, 392.0],  // G Major
  ];

  const randomChord = chords[Math.floor(Math.random() * chords.length)];

  randomChord.forEach((freq, idx) => {
    playMusicBoxNote(freq, now + idx * 0.14, 3.5, bgmGain!, 0.09);
  });

  bgTimer = setTimeout(playAmbientLoop, 4000);
}

/**
 * Rich Polyphonic "Happy Birthday to You" Concert Music Box
 * Full harmony in F Major with warm bass accompaniment and chords
 */
export function playHappyBirthdaySong() {
  try {
    const ac = getAudioContext();
    const now = ac.currentTime + 0.05;

    // F Major Note Frequencies (Hz)
    const C4 = 261.63;
    const D4 = 293.66;
    const E4 = 329.63;
    const F4 = 349.23;
    const G4 = 392.0;
    const A4 = 440.0;
    const Bb4 = 466.16;
    const C5 = 523.25;
    const F5 = 698.46;

    // Bass notes
    const F2 = 87.31;
    const C3 = 130.81;
    const Bb2 = 116.54;

    // Lead Melody: [freq, startDelay, duration, volume]
    const leadNotes: [number, number, number, number][] = [
      // Phrase 1: "Happy Birthday to you"
      [C4, 0.0,  0.35, 0.28], // Hap-
      [C4, 0.4,  0.25, 0.28], // py
      [D4, 0.7,  0.6,  0.32], // Birth-
      [C4, 1.35, 0.6,  0.30], // day
      [F4, 2.0,  0.6,  0.34], // to
      [E4, 2.65, 1.1,  0.32], // you

      // Phrase 2: "Happy Birthday to you"
      [C4, 3.9,  0.35, 0.28], // Hap-
      [C4, 4.3,  0.25, 0.28], // py
      [D4, 4.6,  0.6,  0.32], // Birth-
      [C4, 5.25, 0.6,  0.30], // day
      [G4, 5.9,  0.6,  0.34], // to
      [F4, 6.55, 1.1,  0.32], // you

      // Phrase 3: "Happy Birthday dear Tithi"
      [C4, 7.8,  0.35, 0.28], // Hap-
      [C4, 8.2,  0.25, 0.28], // py
      [C5, 8.5,  0.6,  0.36], // Birth-
      [A4, 9.15, 0.6,  0.34], // day
      [F4, 9.8,  0.6,  0.32], // dear
      [E4, 10.45, 0.6, 0.30], // Ti-
      [D4, 11.1, 1.0,  0.34], // thi

      // Phrase 4: "Happy Birthday to you!"
      [Bb4, 12.3, 0.35, 0.32], // Hap-
      [Bb4, 12.7, 0.25, 0.32], // py
      [A4,  13.0, 0.6,  0.34], // Birth-
      [F4,  13.65, 0.6, 0.34], // day
      [G4,  14.3, 0.6,  0.34], // to
      [F4,  14.95, 1.8, 0.38], // you! ✦
    ];

    // Harmony & Bass Chords: [freq, startDelay, duration, volume]
    const chords: [number, number, number, number][] = [
      // F Major Chord on Phrase 1
      [F2, 0.0, 1.8, 0.18],
      [A4, 0.7, 1.1, 0.12],
      [C4, 2.0, 1.6, 0.12],

      // C7 Chord on Phrase 2
      [C3, 3.9, 1.8, 0.18],
      [Bb4, 4.6, 1.1, 0.12],
      [E4, 5.9, 1.6, 0.12],

      // F Major to Bb on Phrase 3
      [F2, 7.8, 1.8, 0.2],
      [C4, 8.5, 1.1, 0.14],
      [Bb2, 9.8, 2.0, 0.2],
      [F4, 11.1, 1.2, 0.14],

      // F to C to F Finale on Phrase 4
      [Bb2, 12.3, 1.2, 0.18],
      [F2, 13.0, 1.2, 0.18],
      [C3, 14.3, 0.8, 0.18],
      [F2, 14.95, 2.2, 0.24],
      [C4, 14.95, 2.0, 0.14],
      [A4, 14.95, 2.0, 0.14],
      [F5, 15.1, 2.0, 0.16],
    ];

    // Play melody
    leadNotes.forEach(([freq, delay, dur, vol]) => {
      playMusicBoxNote(freq, now + delay, dur, bgmGain!, vol);
    });

    // Play accompaniment
    chords.forEach(([freq, delay, dur, vol]) => {
      playMusicBoxNote(freq, now + delay, dur, bgmGain!, vol);
    });
  } catch (e) {}
}
