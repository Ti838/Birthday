import fs from 'fs';
import path from 'path';

// 44.1kHz 16-bit Stereo WAV generator
const SAMPLE_RATE = 44100;
const BPM = 84;
const BEAT = 60 / BPM;

// Notes (Hz)
const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, Bb4 = 466.16, B4 = 493.88;
const C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99;
const C3 = 130.81, F3 = 174.61, G3 = 196.00, Bb3 = 233.08;

// Melody score: [melody_freq, chord_bass_freq, duration_in_beats]
const SCORE = [
  // Happy Birthday to you
  [C4, C3, 0.75],
  [C4, C3, 0.25],
  [D4, C3, 1.0],
  [C4, C3, 1.0],
  [F4, F3, 1.0],
  [E4, C3, 2.0],

  // Happy Birthday to you
  [C4, C3, 0.75],
  [C4, C3, 0.25],
  [D4, C3, 1.0],
  [C4, C3, 1.0],
  [G4, G3, 1.0],
  [F4, F3, 2.0],

  // Happy Birthday dear Tithi / Doraemon
  [C4, C3, 0.75],
  [C4, C3, 0.25],
  [C5, C4, 1.0],
  [A4, F3, 1.0],
  [F4, F3, 1.0],
  [E4, C3, 1.0],
  [D4, Bb3, 1.8],

  // Happy Birthday to you
  [Bb4, Bb3, 0.75],
  [Bb4, Bb3, 0.25],
  [A4, F3, 1.0],
  [F4, F3, 1.0],
  [G4, G3, 1.0],
  [F4, F3, 2.5],
];

// Calculate total length
let totalBeats = 0;
SCORE.forEach(s => totalBeats += s[2]);
const totalSeconds = totalBeats * BEAT + 2.0; // +2s reverb tail
const totalSamples = Math.floor(SAMPLE_RATE * totalSeconds);

const left = new Float32Array(totalSamples);
const right = new Float32Array(totalSamples);

function addNote(melodyFreq, bassFreq, startTime, duration) {
  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const noteSamples = Math.floor((duration + 1.2) * SAMPLE_RATE); // with decay tail

  for (let i = 0; i < noteSamples && (startSample + i) < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const idx = startSample + i;

    // ADSR Envelope
    let env = 0;
    if (t < 0.015) {
      env = t / 0.015;
    } else {
      env = Math.exp(-t * 2.2);
    }

    // Melody: Acoustic piano/bell with rich warm harmonics
    const h1 = Math.sin(2 * Math.PI * melodyFreq * t);
    const h2 = 0.45 * Math.sin(2 * Math.PI * melodyFreq * 2 * t);
    const h3 = 0.22 * Math.sin(2 * Math.PI * melodyFreq * 3 * t);
    const h4 = 0.12 * Math.sin(2 * Math.PI * melodyFreq * 4 * t);
    const bell = 0.18 * Math.sin(2 * Math.PI * melodyFreq * 2.76 * t) * Math.exp(-t * 3.5);

    const melodySample = (h1 + h2 + h3 + h4 + bell) * env * 0.38;

    // Bass: Warm acoustic cello/piano bass
    const bassEnv = Math.exp(-t * 1.5);
    const b1 = Math.sin(2 * Math.PI * bassFreq * t);
    const b2 = 0.35 * Math.sin(2 * Math.PI * bassFreq * 2 * t);
    const bassSample = (b1 + b2) * bassEnv * 0.22;

    // Stereo panning
    left[idx] += melodySample * 0.7 + bassSample * 0.5;
    right[idx] += melodySample * 0.5 + bassSample * 0.7;
  }
}

// Render song
let currentTime = 0.2;
SCORE.forEach(([m, b, dur]) => {
  addNote(m, b, currentTime, dur * BEAT);
  currentTime += dur * BEAT;
});

// Normalize audio
let maxVal = 0;
for (let i = 0; i < totalSamples; i++) {
  if (Math.abs(left[i]) > maxVal) maxVal = Math.abs(left[i]);
  if (Math.abs(right[i]) > maxVal) maxVal = Math.abs(right[i]);
}
if (maxVal > 0) {
  const norm = 0.88 / maxVal;
  for (let i = 0; i < totalSamples; i++) {
    left[i] *= norm;
    right[i] *= norm;
  }
}

// Encode to 16-bit PCM WAV
const buffer = Buffer.alloc(44 + totalSamples * 4);
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + totalSamples * 4, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16); // subchunk1 size
buffer.writeUInt16LE(1, 20);  // PCM format
buffer.writeUInt16LE(2, 22);  // Stereo
buffer.writeUInt32LE(SAMPLE_RATE, 24);
buffer.writeUInt32LE(SAMPLE_RATE * 4, 28); // byte rate
buffer.writeUInt16LE(4, 32);  // block align
buffer.writeUInt16LE(16, 34); // bits per sample
buffer.write('data', 36);
buffer.writeUInt32LE(totalSamples * 4, 40);

let offset = 44;
for (let i = 0; i < totalSamples; i++) {
  const l = Math.max(-1, Math.min(1, left[i])) * 32767;
  const r = Math.max(-1, Math.min(1, right[i])) * 32767;
  buffer.writeInt16LE(Math.floor(l), offset);
  buffer.writeInt16LE(Math.floor(r), offset + 2);
  offset += 4;
}

const outDir = path.resolve('public', 'audio');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(outDir, 'birthday-song.mp3'), buffer);
fs.writeFileSync(path.join(outDir, 'birthday-song.wav'), buffer);

console.log('Successfully generated full Happy Birthday song audio file at public/audio/birthday-song.mp3 and birthday-song.wav');
