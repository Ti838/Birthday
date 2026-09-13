import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';

/* ── Name Plaque Texture (Fondant with Gold Border & Calligraphy) ── */
function makeCakeNamePlaqueTex(size = 512): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = Math.floor(size * 0.45);
  const ctx = c.getContext('2d')!;

  // Smooth ivory velvet fondant gradient
  const grad = ctx.createLinearGradient(0, 0, c.width, c.height);
  grad.addColorStop(0, '#FFFDF8');
  grad.addColorStop(0.5, '#FDF7EB');
  grad.addColorStop(1, '#F8EED9');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, c.width, c.height);

  // Ornate Double Gold Filigree Border
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, c.width - 16, c.height - 16);

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
  ctx.lineWidth = 2;
  ctx.strokeRect(14, 14, c.width - 28, c.height - 28);

  // Corner Gold Accents
  const cornerSize = 14;
  ctx.fillStyle = '#D4AF37';
  ctx.fillRect(8, 8, cornerSize, cornerSize);
  ctx.fillRect(c.width - 8 - cornerSize, 8, cornerSize, cornerSize);
  ctx.fillRect(8, c.height - 8 - cornerSize, cornerSize, cornerSize);
  ctx.fillRect(c.width - 8 - cornerSize, c.height - 8 - cornerSize, cornerSize, cornerSize);

  // Top line: "Happy Birthday"
  ctx.fillStyle = '#8B263E';
  ctx.font = 'italic bold 32px "Playfair Display", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Happy Birthday', c.width / 2, c.height * 0.35);

  // Main line: "TITHI ✦"
  ctx.fillStyle = '#C5A15A';
  ctx.font = 'bold 46px "Playfair Display", Georgia, serif';
  ctx.fillText('TITHI  ✦', c.width / 2, c.height * 0.72);

  return new THREE.CanvasTexture(c);
}

/* ── Frosting Velvet Texture ── */
function makeVelvetFrostingTex(size = 256, baseColor = '#FAF3E8'): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, size, size);

  // Velvet micro-texture
  for (let i = 0; i < 2400; i++) {
    ctx.fillStyle = `rgba(180, 150, 120, ${0.015 + Math.random() * 0.025})`;
    ctx.fillRect(Math.random() * size, Math.random() * size, 1.2, 1.2);
  }
  return new THREE.CanvasTexture(c);
}

/* ── Marble Cake Stand Texture ── */
function makeMarbleTex(size = 256): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#F4EFE6';
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 20; i++) {
    ctx.strokeStyle = `rgba(160, 140, 120, ${0.03 + Math.random() * 0.05})`;
    ctx.lineWidth = 1 + Math.random() * 3;
    ctx.beginPath();
    const y = Math.random() * size;
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(
      size * 0.33, y + (Math.random() - 0.5) * 25,
      size * 0.66, y + (Math.random() - 0.5) * 25,
      size, y + (Math.random() - 0.5) * 15
    );
    ctx.stroke();
  }
  return new THREE.CanvasTexture(c);
}

/* ── Wood table texture ── */
function makeWoodTex(size = 256): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#8C6741';
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 40; i++) {
    ctx.strokeStyle = `rgba(45, 25, 10, ${0.04 + Math.random() * 0.07})`;
    ctx.lineWidth = 0.8 + Math.random() * 2;
    ctx.beginPath();
    const y = Math.random() * size;
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(
      size * 0.33, y + (Math.random() - 0.5) * 18,
      size * 0.66, y + (Math.random() - 0.5) * 18,
      size, y + (Math.random() - 0.5) * 12
    );
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  return tex;
}

/* ── Flame material ── */
function useFlame(color = 0xFFD08A): THREE.MeshStandardMaterial {
  return useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        emissive: new THREE.Color(0xFF8C40),
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 1,
        depthWrite: false,
      }),
    [color]
  );
}

/* ══════════════════════════════════════════════════════════
   LUXURY ARTISAN BIRTHDAY CAKE (HIGH-END PATISSERIE)
══════════════════════════════════════════════════════════ */
export function Cake() {
  const groupRef = useRef<THREE.Group>(null);
  const candleLightRef = useRef<THREE.PointLight>(null);
  const flameRefs = [
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
  ];
  const smokeRefs = [
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
  ];
  const blown = useRef(false);

  /* ── Textures & Materials ── */
  const namePlaqueTex = useMemo(() => makeCakeNamePlaqueTex(512), []);
  const tier1FrostTex = useMemo(() => makeVelvetFrostingTex(256, '#FAF3E8'), []);
  const tier2FrostTex = useMemo(() => makeVelvetFrostingTex(256, '#F8E8E9'), []);
  const marbleTex = useMemo(() => makeMarbleTex(256), []);
  const woodTex = useMemo(() => makeWoodTex(256), []);

  const namePlaqueMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: namePlaqueTex,
        roughness: 0.35,
        metalness: 0.15,
      }),
    [namePlaqueTex]
  );

  const tier1Mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: tier1FrostTex,
        roughness: 0.6,
        metalness: 0.02,
      }),
    [tier1FrostTex]
  );

  const tier2Mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: tier2FrostTex,
        roughness: 0.6,
        metalness: 0.02,
      }),
    [tier2FrostTex]
  );

  const goldMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D4AF37'),
        roughness: 0.25,
        metalness: 0.75,
      }),
    []
  );

  const pearlMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#FFFBF0'),
        roughness: 0.2,
        metalness: 0.3,
      }),
    []
  );

  const standMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: marbleTex,
        roughness: 0.25,
        metalness: 0.08,
      }),
    [marbleTex]
  );

  const woodMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: woodTex,
        roughness: 0.85,
        metalness: 0.01,
      }),
    [woodTex]
  );

  const strawberryMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D6223A'),
        roughness: 0.3,
        metalness: 0.05,
      }),
    []
  );

  const macaronMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#F2B880'),
        roughness: 0.45,
        metalness: 0.1,
      }),
    []
  );

  const flameMats = [useFlame(0xFFD08A), useFlame(0xFFB870), useFlame(0xFFBF75)];

  /* ── Blow out event: Extinguish candles with smoke puff & cheering ── */
  useEffect(() => {
    const handler = () => {
      if (blown.current) return;
      blown.current = true;

      // 1. Extinguish flames with soft scale fade
      flameRefs.forEach((ref, i) => {
        if (!ref.current) return;
        const mat = ref.current.material as THREE.MeshStandardMaterial;
        gsap.to(ref.current.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.45,
          delay: i * 0.1,
          ease: 'power2.in',
        });
        gsap.to(mat, {
          opacity: 0,
          duration: 0.45,
          delay: i * 0.1,
          onComplete: () => {
            if (ref.current) ref.current.visible = false;
          },
        });
      });

      // 2. Light smoke puffs rising
      smokeRefs.forEach((sRef, i) => {
        if (!sRef.current) return;
        sRef.current.visible = true;
        gsap.to(sRef.current.position, {
          y: 1.85,
          duration: 1.2,
          delay: 0.2 + i * 0.08,
          ease: 'power1.out',
        });
        gsap.to(sRef.current.scale, {
          x: 1.8,
          y: 1.8,
          z: 1.8,
          duration: 1.2,
          delay: 0.2 + i * 0.08,
          ease: 'power1.out',
        });
        const sMat = sRef.current.material as THREE.MeshStandardMaterial;
        gsap.to(sMat, {
          opacity: 0,
          duration: 1.2,
          delay: 0.2 + i * 0.08,
          onComplete: () => {
            if (sRef.current) sRef.current.visible = false;
          },
        });
      });
    };

    window.addEventListener('blowCandles', handler);
    return () => window.removeEventListener('blowCandles', handler);
  }, []);

  /* ── Flame flicker + Light ── */
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    flameRefs.forEach((ref, i) => {
      if (!ref.current || blown.current) return;
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      const flicker =
        2.2 + Math.sin(t * 24 + i * 1.3) * 0.5 + Math.sin(t * 9 + i * 2.1) * 0.3;
      mat.emissiveIntensity = flicker;
      ref.current.scale.x = 1 + Math.sin(t * 14 + i * 1.1) * 0.07;
      ref.current.scale.z = 1 + Math.cos(t * 10 + i * 1.4) * 0.07;
    });

    if (candleLightRef.current) {
      candleLightRef.current.intensity = blown.current
        ? 0
        : 0.85 + Math.sin(t * 14) * 0.15;
    }
  });

  const CYL_SEGS = 48;

  return (
    <group
      ref={groupRef}
      position={[0.0, 0.0, -0.4]}
      onClick={(e) => {
        e.stopPropagation();
        if (!blown.current) {
          window.dispatchEvent(new Event('cakeClicked'));
        }
      }}
      onPointerOver={() => {
        if (!blown.current) document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* ── Large Invisible Click Hitbox ── */}
      <mesh position={[0, 0.9, 0]} visible={false}>
        <boxGeometry args={[1.8, 2.4, 1.8]} />
      </mesh>

      {/* ── Candle Warm Glow Light ── */}
      <pointLight
        ref={candleLightRef}
        color={0xFFB878}
        intensity={0.85}
        distance={6.0}
        decay={2}
        position={[0, 1.6, 0]}
      />

      {/* ═══════════════════ TABLE ═══════════════════ */}
      <mesh material={woodMat} position={[0, 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.1, 1.6]} />
      </mesh>
      {/* Table legs */}
      {[[1.05, 0.68], [-1.05, 0.68], [1.05, -0.68], [-1.05, -0.68]].map(
        ([x, z], i) => (
          <mesh key={i} material={woodMat} position={[x, 0.14, z]}>
            <cylinderGeometry args={[0.045, 0.042, 0.28, 8]} />
          </mesh>
        )
      )}

      {/* ═══════════════════ MARBLE PEDESTAL STAND ═══════════════════ */}
      {/* Base Plate */}
      <mesh material={standMat} position={[0, 0.355, 0]} castShadow>
        <cylinderGeometry args={[0.66, 0.68, 0.03, CYL_SEGS]} />
      </mesh>
      {/* Gold Rim on Stand Base */}
      <mesh material={goldMat} position={[0, 0.36, 0]}>
        <torusGeometry args={[0.67, 0.012, 8, CYL_SEGS]} />
      </mesh>
      {/* Pedestal Stem */}
      <mesh material={standMat} position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.08, 0.14, 0.1, 16]} />
      </mesh>
      <mesh material={goldMat} position={[0, 0.42, 0]}>
        <torusGeometry args={[0.11, 0.012, 8, 16]} />
      </mesh>
      {/* Top Platter */}
      <mesh material={standMat} position={[0, 0.475, 0]} castShadow>
        <cylinderGeometry args={[0.64, 0.64, 0.025, CYL_SEGS]} />
      </mesh>
      {/* Gold Rim on Top Platter */}
      <mesh material={goldMat} position={[0, 0.485, 0]}>
        <torusGeometry args={[0.64, 0.014, 8, CYL_SEGS]} />
      </mesh>

      {/* ═══════════════════ CAKE BODY ═══════════════════ */}

      {/* ── TIER 1 (French Vanilla) ── */}
      <mesh material={tier1Mat} position={[0, 0.77, 0]} castShadow>
        <cylinderGeometry args={[0.52, 0.52, 0.56, CYL_SEGS]} />
      </mesh>

      {/* Pearl Beading around Base of Tier 1 */}
      {Array.from({ length: 32 }, (_, i) => {
        const a = (i / 32) * Math.PI * 2;
        return (
          <mesh
            key={i}
            material={i % 2 === 0 ? pearlMat : goldMat}
            position={[Math.cos(a) * 0.528, 0.505, Math.sin(a) * 0.528]}
          >
            <sphereGeometry args={[0.018, 8, 8]} />
          </mesh>
        );
      })}

      {/* Gold Ribbon Rim on Tier 1 Top */}
      <mesh material={goldMat} position={[0, 1.052, 0]}>
        <torusGeometry args={[0.52, 0.01, 8, CYL_SEGS]} />
      </mesh>

      {/* ══════════════════════════════════════════════════
          PROMINENT NAME PLAQUE "HAPPY BIRTHDAY TITHI ✦"
      ═══════════════════════════════════════════════════ */}
      <mesh
        position={[0, 0.77, 0.53]}
        rotation={[-0.04, 0, 0]}
        material={namePlaqueMat}
        castShadow
      >
        <planeGeometry args={[0.62, 0.28]} />
      </mesh>
      {/* Gold frame background */}
      <mesh position={[0, 0.77, 0.526]} rotation={[-0.04, 0, 0]}>
        <planeGeometry args={[0.65, 0.31]} />
        <meshStandardMaterial color={0xD4AF37} roughness={0.25} metalness={0.8} />
      </mesh>

      {/* ── TIER 2 (Velvet Blush Pink) ── */}
      <mesh material={tier2Mat} position={[0, 1.27, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.34, 0.44, CYL_SEGS]} />
      </mesh>

      {/* Pearl Beading around Base of Tier 2 */}
      {Array.from({ length: 22 }, (_, i) => {
        const a = (i / 22) * Math.PI * 2;
        return (
          <mesh
            key={i}
            material={i % 2 === 0 ? pearlMat : goldMat}
            position={[Math.cos(a) * 0.348, 1.06, Math.sin(a) * 0.348]}
          >
            <sphereGeometry args={[0.016, 8, 8]} />
          </mesh>
        );
      })}

      {/* Top Tier Beading Rim */}
      {Array.from({ length: 18 }, (_, i) => {
        const a = (i / 18) * Math.PI * 2;
        return (
          <mesh
            key={i}
            material={pearlMat}
            position={[Math.cos(a) * 0.34, 1.492, Math.sin(a) * 0.34]}
          >
            <sphereGeometry args={[0.015, 8, 8]} />
          </mesh>
        );
      })}

      {/* ═══════════════════ TOPPING: FRESH STRAWBERRIES & MACARONS ═══════════════════ */}
      {/* Strawberries */}
      {[
        { x: -0.16, z: 0.16, r: 0.3 },
        { x: 0.18, z: 0.14, r: -0.2 },
        { x: -0.18, z: -0.14, r: 0.6 },
        { x: 0.16, z: -0.16, r: -0.5 },
      ].map((st, i) => (
        <group key={i} position={[st.x, 1.51, st.z]} rotation={[0, st.r, 0]}>
          {/* Strawberry cone body */}
          <mesh material={strawberryMat} castShadow>
            <coneGeometry args={[0.04, 0.065, 10]} />
          </mesh>
          {/* Green Calyx Leaves */}
          <mesh position={[0, -0.03, 0]}>
            <cylinderGeometry args={[0.025, 0.005, 0.006, 6]} />
            <meshStandardMaterial color={0x2D7A38} roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Gold Macarons */}
      {[
        { x: 0.0, z: 0.22, rot: 0.2 },
        { x: 0.0, z: -0.22, rot: -0.3 },
      ].map((m, i) => (
        <group key={i} position={[m.x, 1.515, m.z]} rotation={[0.2, m.rot, 0.3]}>
          <mesh material={macaronMat} castShadow>
            <cylinderGeometry args={[0.042, 0.042, 0.028, 14]} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.044, 0.044, 0.008, 14]} />
            <meshStandardMaterial color={0xFFF8E7} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Sugar Flowers with Gold Center */}
      {[
        { x: -0.1, z: 0.05, c: 0xE87A90 },
        { x: 0.1, z: 0.06, c: 0xF29BAA },
        { x: 0.0, z: 0.0, c: 0xFFFDF8 },
      ].map((f, fi) => (
        <group key={fi} position={[f.x, 1.505, f.z]}>
          {[0, 1, 2, 3, 4].map((pi) => {
            const pa = (pi / 5) * Math.PI * 2;
            return (
              <mesh
                key={pi}
                position={[Math.cos(pa) * 0.032, 0, Math.sin(pa) * 0.032]}
              >
                <sphereGeometry args={[0.018, 6, 6]} />
                <meshStandardMaterial color={new THREE.Color(f.c)} roughness={0.5} />
              </mesh>
            );
          })}
          <mesh position={[0, 0.003, 0]} material={goldMat}>
            <sphereGeometry args={[0.012, 6, 6]} />
          </mesh>
        </group>
      ))}

      {/* ═══════════════════ 3 METALLIC SPIRAL CANDLES ═══════════════════ */}
      {[
        { x: -0.15, color: '#F7E7CE', stripe: '#D4AF37' }, // Champagne Gold
        { x: 0.0, color: '#F0C2C8', stripe: '#FFF5F7' },  // Soft Rose
        { x: 0.15, color: '#CBE3D5', stripe: '#D4AF37' }, // Mint Pearl
      ].map(({ x, color, stripe }, ci) => (
        <group key={ci} position={[x, 1.49, 0]}>
          {/* Candle Body */}
          <mesh position={[0, 0.125, 0]} castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.25, 12]} />
            <meshStandardMaterial
              color={new THREE.Color(color)}
              roughness={0.4}
              metalness={0.2}
            />
          </mesh>

          {/* Gold Spiral Stripe */}
          {Array.from({ length: 8 }, (_, si) => (
            <mesh
              key={si}
              position={[
                Math.cos(si * 0.95) * 0.019,
                0.035 + si * 0.026,
                Math.sin(si * 0.95) * 0.019,
              ]}
            >
              <sphereGeometry args={[0.007, 5, 5]} />
              <meshStandardMaterial
                color={new THREE.Color(stripe)}
                roughness={0.3}
                metalness={0.6}
              />
            </mesh>
          ))}

          {/* Gold Candle Base Cup */}
          <mesh position={[0, 0.008, 0]} material={goldMat}>
            <cylinderGeometry args={[0.028, 0.02, 0.016, 12]} />
          </mesh>

          {/* Wick */}
          <mesh position={[0, 0.255, 0]}>
            <cylinderGeometry args={[0.0025, 0.0025, 0.02, 4]} />
            <meshStandardMaterial color={0x201008} />
          </mesh>

          {/* Teardrop Flame */}
          <mesh
            ref={flameRefs[ci]}
            material={flameMats[ci]}
            position={[0, 0.285, 0]}
          >
            <coneGeometry args={[0.022, 0.075, 10]} />
          </mesh>

          {/* Luminous Flame Inner Core */}
          <mesh position={[0, 0.278, 0]}>
            <coneGeometry args={[0.01, 0.036, 8]} />
            <meshStandardMaterial
              color={0xFFFFF0}
              emissive={new THREE.Color(0xFFFFB0)}
              emissiveIntensity={3.5}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* Smoke Puff upon extinguish */}
          <mesh
            ref={smokeRefs[ci]}
            position={[0, 0.32, 0]}
            visible={false}
          >
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshStandardMaterial
              color={0xCCCCCC}
              transparent
              opacity={0.6}
              roughness={1}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
