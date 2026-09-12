import { useEffect, useRef, useCallback } from 'react';
import { Howl } from 'howler';
import { useStoryStore } from '../store/useStoryStore';

// Audio is optional – if files don't exist, it fails gracefully
const AUDIO: Record<string, Howl | null> = {};

function tryLoad(key: string, src: string[], loop = false, volume = 0.4) {
  try {
    AUDIO[key] = new Howl({ src, loop, volume, preload: false });
    AUDIO[key]!.on('loaderror', () => { AUDIO[key] = null; });
  } catch {
    AUDIO[key] = null;
  }
}

// Declare sounds (graceful no-op if files missing)
tryLoad('ambient', ['/audio/ambient.mp3', '/audio/ambient.ogg'], true, 0.25);
tryLoad('gift',    ['/audio/gift.mp3'],   false, 0.6);
tryLoad('paper',   ['/audio/paper.mp3'],  false, 0.5);
tryLoad('pop',     ['/audio/pop.mp3'],    false, 0.4);
tryLoad('piano',   ['/audio/piano.mp3'],  true,  0.3);

let ambientId: number | null = null;

export function useAudio() {
  const musicOn = useStoryStore((s) => s.musicOn);
  const fadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (musicOn) {
      if (AUDIO.ambient) {
        if (ambientId === null) {
          ambientId = AUDIO.ambient.play() as number;
        }
        AUDIO.ambient.fade(0, 0.25, 1200, ambientId);
      }
    } else {
      if (AUDIO.ambient && ambientId !== null) {
        AUDIO.ambient.fade(0.25, 0, 1200, ambientId);
        if (fadeRef.current) clearTimeout(fadeRef.current);
        fadeRef.current = setTimeout(() => {
          AUDIO.ambient?.stop(ambientId!);
          ambientId = null;
        }, 1300);
      }
    }
  }, [musicOn]);

  const play = useCallback((key: string) => {
    if (musicOn && AUDIO[key]) {
      try { AUDIO[key]!.play(); } catch { /* no-op */ }
    }
  }, [musicOn]);

  return { play };
}
