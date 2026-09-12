import { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { makePaperTexture, makeWaxTexture } from '../utils/textures';
import { playPaperSound, playChime } from '../utils/music';

interface EnvelopeProps {
  onOpen: () => void;
  interactive: boolean;
}

export function Envelope({ onOpen, interactive }: EnvelopeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const flapPivotRef = useRef<THREE.Group>(null);
  const waxRef = useRef<THREE.Mesh>(null);
  const letterPaperRef = useRef<THREE.Mesh>(null);
  const opened = useRef(false);
  const hoverRef = useRef(false);

  const paperTex = useMemo(() => makePaperTexture(512), []);
  const waxTex = useMemo(() => makeWaxTexture(128), []);

  const envMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: paperTex,
    color: new THREE.Color(0xEFE6D3),
    roughness: 0.92,
    metalness: 0.0,
  }), [paperTex]);

  const waxMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: waxTex,
    color: new THREE.Color(0xB5473F),
    roughness: 0.68,
    metalness: 0.08,
  }), [waxTex]);

  const paperMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: paperTex,
    color: new THREE.Color(0xF6F0E4),
    roughness: 0.9,
    side: THREE.DoubleSide,
  }), [paperTex]);

  // Glow highlight on wax when hovered
  useFrame(() => {
    if (!waxRef.current) return;
    const mat = waxRef.current.material as THREE.MeshStandardMaterial;
    const target = hoverRef.current ? 0.15 : 0;
    mat.emissiveIntensity += (target - mat.emissiveIntensity) * 0.08;
  });

  const handleClick = useCallback(() => {
    if (opened.current || !interactive) return;
    opened.current = true;

    playPaperSound();
    playChime(1.15);

    const tl = gsap.timeline();

    // wax seal shatters (scale down + fade)
    tl.to(waxRef.current!.scale, { x: 0.15, y: 0.15, z: 0.15, duration: 0.4, ease: 'power2.in' }, 0);
    tl.to((waxRef.current!.material as THREE.MeshStandardMaterial), { opacity: 0, duration: 0.4 }, 0.1);
    (waxRef.current!.material as THREE.MeshStandardMaterial).transparent = true;

    // flap swings open
    tl.to(flapPivotRef.current!.rotation, { x: 2.7, duration: 1.0, ease: 'power2.out' }, 0.35);

    // letter paper slides out
    tl.call(() => {
      if (letterPaperRef.current) letterPaperRef.current.visible = true;
    }, undefined, 0.9);
    tl.to(letterPaperRef.current!.position, { y: 0.5, z: -0.15, duration: 1.0, ease: 'power2.out' }, 1.0);
    tl.to(letterPaperRef.current!.rotation, { x: -0.12, duration: 1.0 }, 1.0);

    tl.call(onOpen, undefined, 1.85);
  }, [interactive, onOpen]);

  return (
    <group ref={groupRef} position={[0, 0.62, 0.05]}>
      {/* ── Envelope body ── */}
      <mesh material={envMat} castShadow receiveShadow>
        <boxGeometry args={[0.62, 0.03, 0.42]} />
      </mesh>

      {/* ── Thin champagne border line ── */}
      <mesh position={[0, 0.018, 0]}>
        <boxGeometry args={[0.65, 0.004, 0.45]} />
        <meshStandardMaterial color={0xC9A667} roughness={0.5} metalness={0.25} />
      </mesh>

      {/* ── Flap pivot at back ── */}
      <group ref={flapPivotRef} position={[0, 0.017, -0.21]}>
        <mesh material={envMat} position={[0, 0.001, 0.21]} rotation={[Math.PI / 2, Math.PI / 4, 0]}>
          <coneGeometry args={[0.32, 0.24, 3]} />
        </mesh>
      </group>

      {/* ── Wax seal ── */}
      <mesh ref={waxRef} material={waxMat} position={[0, 0.028, -0.06]} rotation={[Math.PI / 2, 0, 0]}
        onPointerOver={() => { hoverRef.current = true; }}
        onPointerOut={() => { hoverRef.current = false; }}
      >
        <cylinderGeometry args={[0.055, 0.055, 0.022, 20]} />
      </mesh>

      {/* ── Letter paper (hidden, revealed on open) ── */}
      <mesh ref={letterPaperRef} material={paperMat} position={[0, 0.03, 0.02]}
        rotation={[-Math.PI / 2.4, 0, 0]} visible={false}
      >
        <planeGeometry args={[0.5, 0.66]} />
      </mesh>

      {/* ── 3D Interactive Floating Indicator (Tap to Read) ── */}
      {interactive && !opened.current && (
        <group position={[0, 0.45, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.15, 0.18, 24]} />
            <meshBasicMaterial color="#FFE5A4" transparent opacity={0.7} side={THREE.DoubleSide} />
          </mesh>
          <pointLight color="#FFE5A4" intensity={0.9} distance={2.0} />
        </group>
      )}

      {/* Interactive click area */}
      {interactive && (
        <mesh
          onClick={handleClick}
          visible={false}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'default'; }}
        >
          <boxGeometry args={[0.7, 0.25, 0.5]} />
        </mesh>
      )}
    </group>
  );
}
