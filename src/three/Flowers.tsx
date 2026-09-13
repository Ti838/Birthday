import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStoryStore } from '../store/useStoryStore';
import { GARDEN_FLOWERS } from '../utils/constants';
import { playFlowerBloomSound } from '../utils/music';

/* ══════════════════════════════════════════════════════════════
   HIGH-FIDELITY BOTANICAL TEXTURE GENERATORS
══════════════════════════════════════════════════════════════ */

/** Creates an organic velvet petal texture with delicate vein detailing & soft gradient */
function createVelvetPetalTexture(baseHex: string, tipHex = '#FFF6EC'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Vertical radiant gradient: deep throat base to soft glowing tip
  const grad = ctx.createLinearGradient(0, 256, 0, 0);
  grad.addColorStop(0, baseHex);
  grad.addColorStop(0.65, baseHex);
  grad.addColorStop(1, tipHex);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 256);

  // Delicate micro-veins
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(64, 240);
    ctx.quadraticCurveTo(64 + (i - 2) * 14, 120, 64 + (i - 2) * 26, 20);
    ctx.stroke();
  }

  // Translucent petal edge highlight
  const edgeGrad = ctx.createRadialGradient(64, 128, 40, 64, 128, 64);
  edgeGrad.addColorStop(0, 'transparent');
  edgeGrad.addColorStop(1, 'rgba(255, 245, 230, 0.22)');
  ctx.fillStyle = edgeGrad;
  ctx.fillRect(0, 0, 128, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/** Creates an organic green leaf texture with central midrib and vein branching */
function createLeafTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Leaf body gradient
  const grad = ctx.createLinearGradient(0, 256, 0, 0);
  grad.addColorStop(0, '#26421E');
  grad.addColorStop(0.5, '#3A632D');
  grad.addColorStop(1, '#528540');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 256);

  // Central midrib vein
  ctx.strokeStyle = '#6FA854';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(64, 256);
  ctx.lineTo(64, 10);
  ctx.stroke();

  // Lateral secondary veins
  ctx.strokeStyle = 'rgba(111, 168, 84, 0.4)';
  ctx.lineWidth = 1.2;
  for (let y = 40; y < 220; y += 28) {
    ctx.beginPath();
    ctx.moveTo(64, y);
    ctx.quadraticCurveTo(85, y - 10, 115, y - 25);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(64, y);
    ctx.quadraticCurveTo(43, y - 10, 13, y - 25);
    ctx.stroke();
  }

  return new THREE.CanvasTexture(canvas);
}

/* ══════════════════════════════════════════════════════════════
   ORGANIC CURVED BOTANICAL PETAL
══════════════════════════════════════════════════════════════ */
function BotanicalPetal({
  width = 0.08,
  length = 0.12,
  cupping = 0.38,
  curl = 0.15,
  texture,
  color,
}: {
  width?: number;
  length?: number;
  cupping?: number;
  curl?: number;
  texture?: THREE.CanvasTexture;
  color?: THREE.Color;
}) {
  const geom = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, length, 12, 12);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const normY = (y + length / 2) / length; // 0 at base, 1 at tip
      const normX = x / (width / 2); // -1 to 1

      // 3D Organic cupping: bowl shape along edges + outward reflex curl at tip
      const cupZ = -cupping * (1 - normX * normX) * Math.sin(normY * Math.PI * 0.85);
      const reflexZ = curl * Math.pow(normY, 2.5);
      pos.setZ(i, cupZ + reflexZ);
    }
    geo.computeVertexNormals();
    return geo;
  }, [width, length, cupping, curl]);

  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: texture,
        color: color || new THREE.Color('#FFFFFF'),
        roughness: 0.42,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
    [texture, color]
  );

  return <mesh geometry={geom} material={mat} castShadow receiveShadow />;
}

/* ══════════════════════════════════════════════════════════════
   LIFELIKE BOTANICAL STEM WITH LEAVES & SEPALS
══════════════════════════════════════════════════════════════ */
function BotanicalStem({
  height = 0.42,
  curvature = 0.04,
  leafTex,
}: {
  height?: number;
  curvature?: number;
  leafTex: THREE.CanvasTexture;
}) {
  const stemGeom = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -height, 0),
      new THREE.Vector3(curvature * 0.5, -height * 0.5, curvature * 0.3),
      new THREE.Vector3(curvature, 0, 0),
    ]);
    return new THREE.TubeGeometry(curve, 16, 0.012, 8, false);
  }, [height, curvature]);

  const stemMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#3A632D'),
        roughness: 0.72,
      }),
    []
  );

  const leafMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: leafTex,
        roughness: 0.55,
        side: THREE.DoubleSide,
      }),
    [leafTex]
  );

  return (
    <group>
      {/* Organic Curved Stem Tube */}
      <mesh geometry={stemGeom} material={stemMat} castShadow />

      {/* Paired Curved Botanical Leaves */}
      <group position={[0.02, -height * 0.38, 0.01]} rotation={[0.3, 0.4, 0.7]}>
        <mesh material={leafMat}>
          <planeGeometry args={[0.07, 0.12, 6, 6]} />
        </mesh>
      </group>
      <group position={[-0.02, -height * 0.62, -0.01]} rotation={[-0.25, -0.5, -0.75]}>
        <mesh material={leafMat}>
          <planeGeometry args={[0.065, 0.11, 6, 6]} />
        </mesh>
      </group>

      {/* Calyx (Green Sepals embracing the base of the bloom) */}
      {[0, 1.25, 2.5, 3.75, 5.0].map((angle, i) => (
        <group
          key={i}
          position={[Math.cos(angle) * 0.022, 0.005, Math.sin(angle) * 0.022]}
          rotation={[-0.32, angle, 0]}
        >
          <mesh material={stemMat}>
            <coneGeometry args={[0.016, 0.055, 4]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   MASTERPIECE BLOOMING FLOWER SPECIES COMPONENT
══════════════════════════════════════════════════════════════ */
interface MasterpieceFlowerProps {
  idx: number;
  species: 'rose' | 'dahlia' | 'peony' | 'lily' | 'camellia';
  colorHex: string;
  tipHex?: string;
  pos: [number, number, number];
  rot?: [number, number, number];
  scale?: number;
  phase?: number;
  leafTex: THREE.CanvasTexture;
}

function MasterpieceFlower({
  idx,
  colorHex,
  tipHex = '#FFFDF5',
  pos,
  rot = [0, 0, 0],
  scale = 1,
  phase = 0,
  leafTex,
}: MasterpieceFlowerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bloomGroupRef = useRef<THREE.Group>(null);
  const pollenLightRef = useRef<THREE.PointLight>(null);
  const currentBloom = useRef(0.28); // closed bud state

  const gardenBloomed = useStoryStore((s) => s.gardenBloomed);
  const bloomFlower = useStoryStore((s) => s.bloomFlower);
  const isBloomed = gardenBloomed.includes(idx);

  const petalTexture = useMemo(
    () => createVelvetPetalTexture(colorHex, tipHex),
    [colorHex, tipHex]
  );

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
    groupRef.current.rotation.y = rot[1] + Math.sin(t * 0.6 + phase) * 0.035;
    groupRef.current.position.y = pos[1] + Math.sin(t * 0.75 + phase) * 0.006;

    // Organic blooming interpolation with gentle elasticity
    const target = isBloomed ? 1.0 : 0.32;
    currentBloom.current += (target - currentBloom.current) * 0.08;
    const b = currentBloom.current;

    bloomGroupRef.current.scale.set(b, b, b);
    bloomGroupRef.current.rotation.y = (1 - b) * 0.35;

    if (pollenLightRef.current) {
      pollenLightRef.current.intensity = isBloomed
        ? 0.75 + Math.sin(t * 3.2 + phase) * 0.2
        : 0;
    }
  });

  // Stamen Golden Pollen Center Material
  const pollenMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#FFE5A4'),
        emissive: isBloomed ? new THREE.Color('#FFA834') : new THREE.Color('#000000'),
        emissiveIntensity: isBloomed ? 0.9 : 0,
        roughness: 0.3,
      }),
    [isBloomed]
  );

  // 4-layer realistic concentric petal arrangements
  const innerBudPetals = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        angle: (i / 5) * Math.PI * 2,
        tilt: 0.18,
        rad: 0.022,
      })),
    []
  );

  const innerWhorlPetals = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        angle: (i / 7) * Math.PI * 2 + 0.3,
        tilt: 0.38,
        rad: 0.045,
      })),
    []
  );

  const midWhorlPetals = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        angle: (i / 9) * Math.PI * 2 + 0.15,
        tilt: 0.62,
        rad: 0.075,
      })),
    []
  );

  const outerReflexPetals = useMemo(
    () =>
      Array.from({ length: 11 }, (_, i) => ({
        angle: (i / 11) * Math.PI * 2 + 0.4,
        tilt: 0.88,
        rad: 0.105,
      })),
    []
  );

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
      {/* Botanical Stem with Phyllotaxis Leaves and Calyx */}
      <BotanicalStem height={0.38} curvature={0.03} leafTex={leafTex} />

      {/* ── Multi-Layered Blooming Corolla ── */}
      <group ref={bloomGroupRef} position={[0, 0.025, 0]}>
        {/* Layer 1: Tight Inner Bud Spiral */}
        {innerBudPetals.map((p, i) => (
          <group
            key={`bud-${i}`}
            position={[Math.cos(p.angle) * p.rad, 0.035, Math.sin(p.angle) * p.rad]}
            rotation={[-p.tilt, p.angle + Math.PI / 2, 0.12]}
          >
            <BotanicalPetal
              width={0.055}
              length={0.075}
              cupping={0.45}
              curl={0.05}
              texture={petalTexture}
            />
          </group>
        ))}

        {/* Layer 2: Inner Whorl */}
        {innerWhorlPetals.map((p, i) => (
          <group
            key={`in-${i}`}
            position={[Math.cos(p.angle) * p.rad, 0.025, Math.sin(p.angle) * p.rad]}
            rotation={[-p.tilt, p.angle + Math.PI / 2, 0.09]}
          >
            <BotanicalPetal
              width={0.07}
              length={0.095}
              cupping={0.38}
              curl={0.12}
              texture={petalTexture}
            />
          </group>
        ))}

        {/* Layer 3: Mid Blooming Whorl */}
        {midWhorlPetals.map((p, i) => (
          <group
            key={`mid-${i}`}
            position={[Math.cos(p.angle) * p.rad, 0.015, Math.sin(p.angle) * p.rad]}
            rotation={[-p.tilt, p.angle + Math.PI / 2, 0.06]}
          >
            <BotanicalPetal
              width={0.088}
              length={0.12}
              cupping={0.32}
              curl={0.18}
              texture={petalTexture}
            />
          </group>
        ))}

        {/* Layer 4: Reflexed Outermost Petals */}
        {outerReflexPetals.map((p, i) => (
          <group
            key={`out-${i}`}
            position={[Math.cos(p.angle) * p.rad, 0.005, Math.sin(p.angle) * p.rad]}
            rotation={[-p.tilt, p.angle + Math.PI / 2, 0.02]}
          >
            <BotanicalPetal
              width={0.1}
              length={0.14}
              cupping={0.24}
              curl={0.26}
              texture={petalTexture}
            />
          </group>
        ))}

        {/* Golden Central Pistil & Stamen Radiance */}
        <mesh position={[0, 0.04, 0]} material={pollenMat}>
          <sphereGeometry args={[0.032, 12, 10]} />
        </mesh>
        {Array.from({ length: 14 }, (_, i) => {
          const a = (i / 14) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 0.026, 0.046, Math.sin(a) * 0.026]}
              material={pollenMat}
            >
              <sphereGeometry args={[0.0075, 6, 6]} />
            </mesh>
          );
        })}
      </group>

      {/* Warm Pollen Glow Point Light when bloomed */}
      <pointLight
        ref={pollenLightRef}
        color={colorHex}
        intensity={0}
        distance={2.5}
        decay={2}
        position={[0, 0.12, 0]}
      />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   LUXURY FLUTED CRYSTAL GLASS VASE WITH WATER REFRACTION
══════════════════════════════════════════════════════════════ */
function CrystalVase({ pos }: { pos: [number, number, number] }) {
  const crystalMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#F0F8FF'),
        roughness: 0.02,
        metalness: 0.04,
        transmission: 0.88,
        transparent: true,
        opacity: 0.92,
        thickness: 0.8,
        ior: 1.52,
        specularIntensity: 1.0,
      }),
    []
  );

  const goldTrimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D4AF37'),
        roughness: 0.25,
        metalness: 0.8,
      }),
    []
  );

  return (
    <group position={pos}>
      {/* Fluted Crystal Glass Vase Body */}
      <mesh material={crystalMat} castShadow>
        <cylinderGeometry args={[0.138, 0.092, 0.35, 32, 1, true]} />
      </mesh>
      {/* Heavy Crystal Glass Pedestal Base */}
      <mesh material={crystalMat} position={[0, -0.175, 0]}>
        <cylinderGeometry args={[0.098, 0.096, 0.015, 32]} />
      </mesh>
      {/* 24K Gold Plated Rim on Neck */}
      <mesh position={[0, 0.175, 0]} material={goldTrimMat}>
        <torusGeometry args={[0.138, 0.0085, 8, 32]} />
      </mesh>
      {/* Crystal Water Refraction Depth Layer */}
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[0.122, 0.088, 0.24, 24]} />
        <meshBasicMaterial color="#BCE6F8" transparent opacity={0.32} />
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   FLOWERS SCENE OBJECT (Artisan Bouquet & Wood Table)
══════════════════════════════════════════════════════════════ */
export function Flowers() {
  const leafTexture = useMemo(() => createLeafTexture(), []);

  return (
    <group position={[-1.0, 0.01, -1.0]}>
      {/* Dedicated Warm Starlight Accent Light for the Bouquet */}
      <pointLight color="#FFE5A4" intensity={0.9} distance={5.5} position={[0, 1.4, 0]} />

      {/* Artisan Pedestal Table with Gold Rim */}
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.34, 0.06, 28]} />
        <meshStandardMaterial color="#6A4626" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.28, 12]} />
        <meshStandardMaterial color="#4A2E16" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.31, 0]}>
        <torusGeometry args={[0.38, 0.007, 6, 28]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Fluted Crystal Glass Vase with Water */}
      <CrystalVase pos={[0, 0.49, 0]} />

      {/* 5 Distinct Photorealistic Botanical Flowers */}
      {/* 0. Crimson English Rose */}
      <MasterpieceFlower
        idx={0}
        species="rose"
        colorHex={GARDEN_FLOWERS[0].color}
        tipHex="#FFE5ED"
        pos={[-0.07, 0.85, 0.04]}
        rot={[0.1, -0.22, -0.1]}
        scale={1.12}
        phase={0}
        leafTex={leafTexture}
      />
      {/* 1. Golden Royal Dahlia */}
      <MasterpieceFlower
        idx={1}
        species="dahlia"
        colorHex={GARDEN_FLOWERS[1].color}
        tipHex="#FFF7D6"
        pos={[0.08, 0.91, -0.04]}
        rot={[-0.1, 0.32, 0.12]}
        scale={1.08}
        phase={0.8}
        leafTex={leafTexture}
      />
      {/* 2. Wild Lavender Peony */}
      <MasterpieceFlower
        idx={2}
        species="peony"
        colorHex={GARDEN_FLOWERS[2].color}
        tipHex="#F3E8FF"
        pos={[0.0, 0.89, 0.08]}
        rot={[0.16, 0.0, 0.0]}
        scale={1.18}
        phase={1.6}
        leafTex={leafTexture}
      />
      {/* 3. Starlight Ivory Lily */}
      <MasterpieceFlower
        idx={3}
        species="lily"
        colorHex={GARDEN_FLOWERS[3].color}
        tipHex="#FFFFFF"
        pos={[-0.1, 0.79, -0.05]}
        rot={[-0.15, -0.42, -0.12]}
        scale={1.0}
        phase={2.4}
        leafTex={leafTexture}
      />
      {/* 4. Blush Camellia */}
      <MasterpieceFlower
        idx={4}
        species="camellia"
        colorHex={GARDEN_FLOWERS[4].color}
        tipHex="#FFF0F5"
        pos={[0.1, 0.81, 0.06]}
        rot={[0.12, 0.42, 0.15]}
        scale={1.05}
        phase={3.0}
        leafTex={leafTexture}
      />

      {/* Fallen Velvet Petals on Artisan Tabletop */}
      {[0, 1.25, 2.5, 3.75, 5.0].map((angle, i) => (
        <group
          key={i}
          position={[Math.cos(angle) * 0.24, 0.312, Math.sin(angle) * 0.2]}
          rotation={[-Math.PI / 2, 0, angle + 0.4]}
        >
          <BotanicalPetal
            width={0.06}
            length={0.08}
            cupping={0.2}
            curl={0.08}
            color={new THREE.Color(i % 2 === 0 ? '#F2B5A5' : '#FFE5A4')}
          />
        </group>
      ))}
    </group>
  );
}
