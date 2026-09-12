import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStoryStore } from '../store/useStoryStore';
import { GARDEN_FLOWERS } from '../utils/constants';
import { playFlowerBloomSound } from '../utils/music';

/* ══════════════════════════════════════════════════════════════
   ORGANIC CURVED PETAL MESH
══════════════════════════════════════════════════════════════ */
function Petal({
  width = 0.08,
  length = 0.12,
  curvature = 0.35,
  color,
  roughness = 0.4,
}: {
  width?: number;
  length?: number;
  curvature?: number;
  color: THREE.Color;
  roughness?: number;
}) {
  const geom = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, length, 8, 8);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Cup the petal naturally along X and Y
      const z = -curvature * (1 - (2 * x / width) ** 2) * ((y + length / 2) / length);
      pos.setZ(i, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, [width, length, curvature]);

  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        roughness,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
    [color, roughness]
  );

  return <mesh geometry={geom} material={mat} castShadow receiveShadow />;
}

/* ══════════════════════════════════════════════════════════════
   REALISTIC BOTANICAL BLOOMING FLOWER
══════════════════════════════════════════════════════════════ */
function RealisticFlower({
  idx,
  colorHex,
  pos,
  rot = [0, 0, 0],
  scale = 1,
  phase = 0,
}: {
  idx: number;
  colorHex: string;
  pos: [number, number, number];
  rot?: [number, number, number];
  scale?: number;
  phase?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const bloomGroupRef = useRef<THREE.Group>(null);
  const pollenLightRef = useRef<THREE.PointLight>(null);
  const currentBloom = useRef(0.25); // bud state

  const gardenBloomed = useStoryStore((s) => s.gardenBloomed);
  const bloomFlower = useStoryStore((s) => s.bloomFlower);
  const isBloomed = gardenBloomed.includes(idx);

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (!isBloomed) {
      bloomFlower(idx);
      playFlowerBloomSound(idx);
    }
  };

  useFrame(({ clock }) => {
    if (!groupRef.current || !bloomGroupRef.current) return;
    const t = clock.getElapsedTime();

    // Natural botanical breeze sway
    groupRef.current.rotation.y = rot[1] + Math.sin(t * 0.5 + phase) * 0.04;
    groupRef.current.position.y = pos[1] + Math.sin(t * 0.65 + phase) * 0.008;

    // Organic blooming interpolation
    const target = isBloomed ? 1.0 : 0.28;
    currentBloom.current += (target - currentBloom.current) * 0.07;
    const b = currentBloom.current;

    bloomGroupRef.current.scale.set(b, b, b);
    bloomGroupRef.current.rotation.z = (1 - b) * 0.2;

    if (pollenLightRef.current) {
      pollenLightRef.current.intensity = isBloomed
        ? 0.75 + Math.sin(t * 3.5 + phase) * 0.25
        : 0;
    }
  });

  const baseColor = useMemo(() => new THREE.Color(colorHex), [colorHex]);
  const coreColor = useMemo(() => new THREE.Color(colorHex).multiplyScalar(0.75), [colorHex]);

  const stemMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#3A5A30'),
        roughness: 0.78,
      }),
    []
  );

  const leafMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#466E3A'),
        roughness: 0.65,
        side: THREE.DoubleSide,
      }),
    []
  );

  const goldPollenMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#FFE5A4'),
        emissive: isBloomed ? new THREE.Color('#FFA834') : new THREE.Color('#000000'),
        emissiveIntensity: isBloomed ? 0.8 : 0,
        roughness: 0.3,
      }),
    [isBloomed]
  );

  // 3-tier concentric petal layers for realistic botanical depth
  const innerPetals = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      angle: (i / 6) * Math.PI * 2,
      tilt: 0.28,
      rad: 0.035,
    }));
  }, []);

  const midPetals = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      angle: (i / 8) * Math.PI * 2 + 0.25,
      tilt: 0.48,
      rad: 0.065,
    }));
  }, []);

  const outerPetals = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      angle: (i / 10) * Math.PI * 2 + 0.12,
      tilt: 0.75,
      rad: 0.095,
    }));
  }, []);

  return (
    <group
      ref={groupRef}
      position={pos}
      rotation={rot}
      scale={[scale, scale, scale]}
      onClick={handleClick}
      onPointerOver={() => {
        if (!isBloomed) document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* Curved Botanical Stem */}
      <mesh material={stemMat} position={[0, -0.18, 0]} castShadow>
        <cylinderGeometry args={[0.012, 0.018, 0.36, 8]} />
      </mesh>

      {/* Organic Serrated Leaves */}
      <group position={[-0.04, -0.06, 0.02]} rotation={[0.25, 0.1, 0.65]}>
        <mesh material={leafMat}>
          <circleGeometry args={[0.065, 8]} />
        </mesh>
      </group>
      <group position={[0.04, -0.12, -0.01]} rotation={[-0.2, -0.1, -0.65]}>
        <mesh material={leafMat}>
          <circleGeometry args={[0.058, 8]} />
        </mesh>
      </group>

      {/* Sepal Calyx Cups */}
      {[0, 1.25, 2.5, 3.75, 5.0].map((a, i) => (
        <mesh
          key={i}
          material={leafMat}
          position={[Math.cos(a) * 0.032, 0.002, Math.sin(a) * 0.032]}
          rotation={[-0.22, a, 0]}
        >
          <coneGeometry args={[0.02, 0.07, 4]} />
        </mesh>
      ))}

      {/* ── Multi-Layered Blooming Corolla ── */}
      <group ref={bloomGroupRef} position={[0, 0.02, 0]}>
        {/* Layer 1: Inner Petals (Cupped Center) */}
        {innerPetals.map((p, i) => (
          <group
            key={`in-${i}`}
            position={[Math.cos(p.angle) * p.rad, 0.03, Math.sin(p.angle) * p.rad]}
            rotation={[-p.tilt, p.angle + Math.PI / 2, 0.1]}
          >
            <Petal width={0.065} length={0.085} curvature={0.4} color={coreColor} />
          </group>
        ))}

        {/* Layer 2: Mid Petals */}
        {midPetals.map((p, i) => (
          <group
            key={`mid-${i}`}
            position={[Math.cos(p.angle) * p.rad, 0.018, Math.sin(p.angle) * p.rad]}
            rotation={[-p.tilt, p.angle + Math.PI / 2, 0.08]}
          >
            <Petal width={0.085} length={0.11} curvature={0.35} color={baseColor} />
          </group>
        ))}

        {/* Layer 3: Outer Flared Petals */}
        {outerPetals.map((p, i) => (
          <group
            key={`out-${i}`}
            position={[Math.cos(p.angle) * p.rad, 0.005, Math.sin(p.angle) * p.rad]}
            rotation={[-p.tilt, p.angle + Math.PI / 2, 0.04]}
          >
            <Petal width={0.1} length={0.135} curvature={0.28} color={baseColor} />
          </group>
        ))}

        {/* Golden Central Stamen & Pistil Cluster */}
        <mesh position={[0, 0.035, 0]} material={goldPollenMat}>
          <sphereGeometry args={[0.035, 12, 10]} />
        </mesh>
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 0.028, 0.042, Math.sin(a) * 0.028]}
              material={goldPollenMat}
            >
              <sphereGeometry args={[0.008, 6, 6]} />
            </mesh>
          );
        })}
      </group>

      {/* Soft Pollen Glow Light when Bloomed */}
      <pointLight
        ref={pollenLightRef}
        color={colorHex}
        intensity={0}
        distance={2.2}
        decay={2}
        position={[0, 0.12, 0]}
      />
    </group>
  );
}

/* ── Realistic Crystal Glass Vase ── */
function CrystalVase({ pos }: { pos: [number, number, number] }) {
  const glassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#EBF6FA'),
        roughness: 0.03,
        metalness: 0.05,
        transmission: 0.85,
        transparent: true,
        opacity: 0.9,
        thickness: 0.75,
        ior: 1.5,
      }),
    []
  );

  return (
    <group position={pos}>
      {/* Vase Body */}
      <mesh material={glassMat} castShadow>
        <cylinderGeometry args={[0.135, 0.09, 0.34, 28, 1, true]} />
      </mesh>
      {/* Solid Base */}
      <mesh material={glassMat} position={[0, -0.17, 0]}>
        <cylinderGeometry args={[0.09, 0.088, 0.012, 28]} />
      </mesh>
      {/* Gold Plated Rim */}
      <mesh position={[0, 0.17, 0]}>
        <torusGeometry args={[0.135, 0.009, 8, 28]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.25} metalness={0.75} />
      </mesh>
      {/* Water inside with light refraction tint */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.118, 0.085, 0.22, 20]} />
        <meshBasicMaterial color="#D2F0FB" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   FLOWERS SCENE OBJECT (Artisan Bouquet & Wood Table)
══════════════════════════════════════════════════════════════ */
export function Flowers() {
  return (
    <group position={[-1.0, 0.01, -1.0]}>
      {/* Dedicated Warm Accent Light for Flowers */}
      <pointLight color="#FFE5A4" intensity={0.85} distance={5.0} position={[0, 1.3, 0]} />

      {/* Artisan Pedestal Side Table */}
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.34, 0.06, 28]} />
        <meshStandardMaterial color="#7A5636" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.28, 12]} />
        <meshStandardMaterial color="#5C3E24" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.31, 0]}>
        <torusGeometry args={[0.38, 0.007, 6, 28]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Crystal Glass Vase */}
      <CrystalVase pos={[0, 0.49, 0]} />

      {/* 5 Distinct Lifelike Interactive Blooming Flowers */}
      {/* 0. Blush Camellia (Soft Rose Pink) */}
      <RealisticFlower
        idx={0}
        colorHex={GARDEN_FLOWERS[0].color}
        pos={[-0.08, 0.84, 0.04]}
        rot={[0.1, -0.2, -0.1]}
        scale={1.1}
        phase={0}
      />
      {/* 1. Golden Marigold (Warm Honey Gold) */}
      <RealisticFlower
        idx={1}
        colorHex={GARDEN_FLOWERS[1].color}
        pos={[0.08, 0.90, -0.04]}
        rot={[-0.1, 0.3, 0.12]}
        scale={1.05}
        phase={0.8}
      />
      {/* 2. Lavender Aster (Gentle Violet) */}
      <RealisticFlower
        idx={2}
        colorHex={GARDEN_FLOWERS[2].color}
        pos={[0.0, 0.88, 0.08]}
        rot={[0.15, 0.0, 0.0]}
        scale={1.15}
        phase={1.6}
      />
      {/* 3. Sage Blossom (Pale Emerald / Mint) */}
      <RealisticFlower
        idx={3}
        colorHex={GARDEN_FLOWERS[3].color}
        pos={[-0.1, 0.78, -0.05]}
        rot={[-0.15, -0.4, -0.12]}
        scale={0.98}
        phase={2.4}
      />
      {/* 4. Starlight Daisy (Ivory Starlight) */}
      <RealisticFlower
        idx={4}
        colorHex={GARDEN_FLOWERS[4].color}
        pos={[0.1, 0.80, 0.06]}
        rot={[0.12, 0.4, 0.15]}
        scale={1.02}
        phase={3.0}
      />

      {/* Fallen Velvet Petals on Table */}
      {[0, 1.25, 2.5, 3.75, 5.0].map((rot, i) => (
        <group
          key={i}
          position={[Math.cos(rot) * 0.24, 0.312, Math.sin(rot) * 0.2]}
          rotation={[-Math.PI / 2, 0, rot + 0.4]}
        >
          <Petal
            width={0.06}
            length={0.08}
            curvature={0.2}
            color={new THREE.Color(i % 2 === 0 ? '#F2B5A5' : '#FFE5A4')}
          />
        </group>
      ))}
    </group>
  );
}
