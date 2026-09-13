import { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { unlockAudio, startMusic } from '../utils/music';

interface GiftBoxProps {
  onOpen: () => void;
}

/* ── Wrapping paper texture – rich pastel pink with luxury gold polka dots ── */
function makeWrappingTexture(size = 512): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;

  // Smooth warm rose-pink gradient
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#E58A9E');
  grad.addColorStop(0.5, '#DE7B90');
  grad.addColorStop(1, '#CE687E');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Subtle gold polka dots
  const step = size / 10;
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const x = col * step + step / 2 + (row % 2 === 0 ? 0 : step / 2);
      const y = row * step + step / 2;
      ctx.beginPath();
      ctx.arc(x, y, 4.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 235, 190, 0.45)';
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/* ── Satin ribbon texture – silky ivory sheen ── */
function makeSatinTexture(size = 256): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  const grad = ctx.createLinearGradient(0, 0, size, 0);
  grad.addColorStop(0, '#FAF6EE');
  grad.addColorStop(0.5, '#FFFFFF');
  grad.addColorStop(1, '#F2EBDC');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/* ── Gift tag texture ── */
function makeTagTexture(size = 256): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = size; c.height = Math.floor(size * 0.65);
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#FFFDF8';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 4;
  ctx.strokeRect(6, 6, c.width - 12, c.height - 12);
  ctx.fillStyle = '#4A2A2A';
  ctx.font = `italic bold ${Math.floor(size * 0.13)}px "Playfair Display", Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('For Tithi ✦', c.width / 2, c.height / 2);
  return new THREE.CanvasTexture(c);
}

export function GiftBox({ onOpen }: GiftBoxProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);
  const glowLightRef = useRef<THREE.PointLight>(null);
  const innerGiftRef = useRef<THREE.Group>(null);
  const opened = useRef(false);
  const hoverScale = useRef(1.0);
  const hoverOn = useRef(false);

  /* ── Textures ── */
  const wrapTex = useMemo(() => makeWrappingTexture(512), []);
  const satinTex = useMemo(() => makeSatinTexture(256), []);
  const tagTex = useMemo(() => makeTagTexture(256), []);

  /* ── Materials ── */
  const wrapMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: wrapTex,
    roughness: 0.6,
    metalness: 0.05,
    side: THREE.DoubleSide,
  }), [wrapTex]);

  const innerVelvetMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#3A101C'),
    roughness: 0.95,
    metalness: 0.0,
    side: THREE.DoubleSide,
  }), []);

  const ribbonMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: satinTex,
    color: new THREE.Color('#FFFDF5'),
    roughness: 0.2,
    metalness: 0.1,
  }), [satinTex]);

  const bowOuterMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: satinTex,
    color: new THREE.Color('#FFFDF5'),
    roughness: 0.2,
    metalness: 0.1,
    side: THREE.DoubleSide,
  }), [satinTex]);

  const bowInnerMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#F0E6D2'),
    roughness: 0.35,
    side: THREE.DoubleSide,
  }), []);

  const tagMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: tagTex,
    roughness: 0.8,
    side: THREE.DoubleSide,
  }), [tagTex]);

  /* ── Click & Open Sequence ── */
  const handleClick = useCallback(() => {
    if (opened.current) return;
    opened.current = true;
    document.body.style.cursor = 'default';

    // Start background music automatically if not started
    unlockAudio();
    startMusic();

    const tl = gsap.timeline();

    // 1. Squash & stretch anticipation
    tl.to(groupRef.current!.scale, { x: 1.08, y: 0.92, z: 1.08, duration: 0.18, ease: 'power2.out' });
    tl.to(groupRef.current!.scale, { x: 1, y: 1, z: 1, duration: 0.35, ease: 'elastic.out(1.2, 0.4)' });

    // 2. Lid flings back smoothly
    tl.to(lidRef.current!.rotation, { x: -2.35, duration: 1.6, ease: 'power3.out' }, 0.25);

    // 3. Golden light inside powers up
    tl.to(glowLightRef.current!, { intensity: 3.5, duration: 0.8 }, 0.3);

    // 4. Magical item inside rises up gently
    if (innerGiftRef.current) {
      innerGiftRef.current.visible = true;
      tl.to(innerGiftRef.current.position, { y: 0.95, duration: 1.4, ease: 'back.out(1.4)' }, 0.45);
      tl.to(innerGiftRef.current.rotation, { y: Math.PI * 2, duration: 2.0, ease: 'power2.out' }, 0.45);
    }

    // 5. Trigger transition to world/letter
    tl.call(onOpen, undefined, 2.0);
  }, [onOpen]);

  /* ── Idle Animation ── */
  useFrame(({ clock }) => {
    if (!groupRef.current || opened.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.6) * 0.015;
    groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.02;

    const target = hoverOn.current ? 1.05 : 1.0;
    hoverScale.current += (target - hoverScale.current) * 0.1;
    const s = hoverScale.current;
    groupRef.current.scale.set(s, s, s);
  });

  const W = 1.15; // Box width
  const H = 0.78; // Box height
  const D = 1.15; // Box depth
  const T = 0.04; // Wall thickness

  return (
    <group
      ref={groupRef}
      position={[-2.4, 0.0, 1.2]}
      onClick={handleClick}
      onPointerOver={() => {
        if (!opened.current) {
          hoverOn.current = true;
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        hoverOn.current = false;
        document.body.style.cursor = 'default';
      }}
    >
      {/* ═════════════════════════════════════════════════════
          HOLLOW BOX BODY (Realistic 5-sided box with interior)
      ══════════════════════════════════════════════════════ */}
      <group position={[0, 0, 0]}>
        {/* Bottom */}
        <mesh position={[0, T / 2, 0]} material={wrapMat} castShadow receiveShadow>
          <boxGeometry args={[W, T, D]} />
        </mesh>
        <mesh position={[0, T + 0.001, 0]} material={innerVelvetMat}>
          <planeGeometry args={[W - 2 * T, D - 2 * T]} />
        </mesh>

        {/* Front Wall */}
        <mesh position={[0, H / 2, D / 2 - T / 2]} material={wrapMat} castShadow>
          <boxGeometry args={[W, H, T]} />
        </mesh>
        {/* Back Wall */}
        <mesh position={[0, H / 2, -D / 2 + T / 2]} material={wrapMat} castShadow>
          <boxGeometry args={[W, H, T]} />
        </mesh>
        {/* Left Wall */}
        <mesh position={[-W / 2 + T / 2, H / 2, 0]} material={wrapMat} castShadow>
          <boxGeometry args={[T, H, D - 2 * T]} />
        </mesh>
        {/* Right Wall */}
        <mesh position={[W / 2 - T / 2, H / 2, 0]} material={wrapMat} castShadow>
          <boxGeometry args={[T, H, D - 2 * T]} />
        </mesh>

        {/* ── Outer Ribbons (only on outside faces, never blocking the top!) ── */}
        {/* Front & Back vertical ribbons */}
        <mesh position={[0, H / 2, D / 2 + 0.005]} material={ribbonMat}>
          <planeGeometry args={[0.16, H]} />
        </mesh>
        <mesh position={[0, H / 2, -D / 2 - 0.005]} rotation={[0, Math.PI, 0]} material={ribbonMat}>
          <planeGeometry args={[0.16, H]} />
        </mesh>
        {/* Left & Right vertical ribbons */}
        <mesh position={[-W / 2 - 0.005, H / 2, 0]} rotation={[0, -Math.PI / 2, 0]} material={ribbonMat}>
          <planeGeometry args={[0.16, H]} />
        </mesh>
        <mesh position={[W / 2 + 0.005, H / 2, 0]} rotation={[0, Math.PI / 2, 0]} material={ribbonMat}>
          <planeGeometry args={[0.16, H]} />
        </mesh>
        {/* Horizontal wrapping ribbon around waist */}
        <mesh position={[0, H * 0.5, D / 2 + 0.006]} material={ribbonMat}>
          <planeGeometry args={[W, 0.16]} />
        </mesh>
        <mesh position={[0, H * 0.5, -D / 2 - 0.006]} rotation={[0, Math.PI, 0]} material={ribbonMat}>
          <planeGeometry args={[W, 0.16]} />
        </mesh>
        <mesh position={[-W / 2 - 0.006, H * 0.5, 0]} rotation={[0, -Math.PI / 2, 0]} material={ribbonMat}>
          <planeGeometry args={[D, 0.16]} />
        </mesh>
        <mesh position={[W / 2 + 0.006, H * 0.5, 0]} rotation={[0, Math.PI / 2, 0]} material={ribbonMat}>
          <planeGeometry args={[D, 0.16]} />
        </mesh>
      </group>

      {/* ═════════════════════════════════════════════════════
          INTERIOR GLOW & SURPRISE ITEM
      ══════════════════════════════════════════════════════ */}
      <pointLight
        ref={glowLightRef}
        color="#FFE4A0"
        intensity={0.2}
        distance={3.5}
        decay={2}
        position={[0, H * 0.6, 0]}
      />

      {/* Floating Golden Heart / Surprise inside */}
      <group ref={innerGiftRef} position={[0, H * 0.3, 0]} visible={false}>
        {/* Golden Glowing Crystal Heart */}
        <mesh castShadow>
          <octahedronGeometry args={[0.18, 2]} />
          <meshStandardMaterial
            color="#FFF2A8"
            emissive="#FFA834"
            emissiveIntensity={1.8}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
        {/* Sparkle ring */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.3, Math.sin(i) * 0.05, Math.sin(a) * 0.3]}>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshBasicMaterial color="#FFF8D6" />
            </mesh>
          );
        })}
      </group>

      {/* ═════════════════════════════════════════════════════
          REALISTIC LID (Hinged at top-back edge)
      ══════════════════════════════════════════════════════ */}
      <group ref={lidRef} position={[0, H, -D / 2]}>
        {/* Lid Top Panel */}
        <RoundedBox
          args={[W + 0.08, 0.16, D + 0.08]}
          radius={0.02}
          smoothness={4}
          position={[0, 0.08, D / 2]}
          castShadow
        >
          <primitive object={wrapMat} attach="material" />
        </RoundedBox>

        {/* Lid Ribbon Cross - V */}
        <mesh position={[0, 0.08, D / 2]}>
          <boxGeometry args={[0.17, 0.17, D + 0.09]} />
          <primitive object={ribbonMat} attach="material" />
        </mesh>
        {/* Lid Ribbon Cross - H */}
        <mesh position={[0, 0.08, D / 2]}>
          <boxGeometry args={[W + 0.09, 0.17, 0.17]} />
          <primitive object={ribbonMat} attach="material" />
        </mesh>

        {/* ═════════════════════════════════════════════════════
            LUXURY 3D SATIN BOW (On top of lid)
        ══════════════════════════════════════════════════════ */}
        <group position={[0, 0.18, D / 2]}>
          {/* Main Left Loop */}
          <mesh position={[-0.24, 0.16, 0]} scale={[1, 0.72, 0.48]} rotation={[0.1, 0, 0.62]} castShadow material={bowOuterMat}>
            <sphereGeometry args={[0.26, 18, 16]} />
          </mesh>
          <mesh position={[-0.22, 0.15, 0.01]} scale={[0.72, 0.52, 0.36]} rotation={[0.1, 0, 0.58]} material={bowInnerMat}>
            <sphereGeometry args={[0.26, 14, 12]} />
          </mesh>

          {/* Main Right Loop */}
          <mesh position={[0.24, 0.16, 0]} scale={[1, 0.72, 0.48]} rotation={[0.1, 0, -0.62]} castShadow material={bowOuterMat}>
            <sphereGeometry args={[0.26, 18, 16]} />
          </mesh>
          <mesh position={[0.22, 0.15, 0.01]} scale={[0.72, 0.52, 0.36]} rotation={[0.1, 0, -0.58]} material={bowInnerMat}>
            <sphereGeometry args={[0.26, 14, 12]} />
          </mesh>

          {/* Secondary depth loops */}
          <mesh position={[-0.16, 0.12, -0.1]} scale={[0.75, 0.55, 0.4]} rotation={[-0.2, 0.15, 0.5]} material={bowOuterMat}>
            <sphereGeometry args={[0.24, 14, 12]} />
          </mesh>
          <mesh position={[0.16, 0.12, -0.1]} scale={[0.75, 0.55, 0.4]} rotation={[-0.2, -0.15, -0.5]} material={bowOuterMat}>
            <sphereGeometry args={[0.24, 14, 12]} />
          </mesh>

          {/* Flowing Ribbon Tails */}
          <mesh position={[-0.2, -0.02, 0.16]} rotation={[0.55, 0.1, 0.25]} scale={[0.55, 1.1, 0.4]} material={bowOuterMat}>
            <sphereGeometry args={[0.16, 10, 8]} />
          </mesh>
          <mesh position={[0.2, -0.02, 0.16]} rotation={[0.55, -0.1, -0.25]} scale={[0.55, 1.1, 0.4]} material={bowOuterMat}>
            <sphereGeometry args={[0.16, 10, 8]} />
          </mesh>

          {/* Center Ribbon Knot */}
          <mesh position={[0, 0.08, 0]} castShadow>
            <sphereGeometry args={[0.09, 16, 14]} />
            <meshStandardMaterial color="#FFF8EB" roughness={0.25} metalness={0.1} />
          </mesh>
        </group>
      </group>

      {/* ═════════════════════════════════════════════════════
          ELEGANT GIFT TAG
      ══════════════════════════════════════════════════════ */}
      <mesh position={[0.58, 0.62, 0.62]} rotation={[0, -0.12, 0.24]} material={tagMat} castShadow>
        <planeGeometry args={[0.22, 0.14]} />
      </mesh>
      <mesh position={[0.52, 0.70, 0.61]} rotation={[0, 0, 0.45]}>
        <cylinderGeometry args={[0.003, 0.003, 0.12, 4]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Soft Contact Shadow under gift box */}
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.7, 1.7]} />
        <meshBasicMaterial color="#1E120C" transparent opacity={0.18} />
      </mesh>

      {/* ── 3D Interactive Floating Indicator (Tap to Open) ── */}
      {!opened.current && (
        <group position={[0, 1.45, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.22, 0.26, 32]} />
            <meshBasicMaterial color="#FFE5A4" transparent opacity={0.65} side={THREE.DoubleSide} />
          </mesh>
          <pointLight color="#FFE5A4" intensity={1.2} distance={2.5} />
        </group>
      )}
    </group>
  );
}
