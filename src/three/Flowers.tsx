import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStoryStore } from '../store/useStoryStore';
import { GARDEN_FLOWERS } from '../utils/constants';
import { playFlowerBloomSound, playChime } from '../utils/music';

/* ══════════════════════════════════════════════════════════════
   HIGH-FIDELITY BOTANICAL TEXTURES & PBR GENERATORS
   Smooth rounded curves • Zero polygon spikes • CC0 standards
══════════════════════════════════════════════════════════════ */

/** Creates a smooth organic velvet petal texture with delicate vein micro-gradients */
function createVelvetPetalTexture(baseHex: string, tipHex = '#FFFDF5'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Smooth linear velvet gradient: deep base to soft glowing tip
  const grad = ctx.createLinearGradient(0, 256, 0, 0);
  grad.addColorStop(0, baseHex);
  grad.addColorStop(0.55, baseHex);
  grad.addColorStop(1, tipHex);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 256);

  // Soft delicate micro-veining
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(64, 250);
    ctx.quadraticCurveTo(64 + (i - 1.5) * 16, 128, 64 + (i - 1.5) * 28, 30);
    ctx.stroke();
  }

  // Soft translucent edge halo
  const edgeGrad = ctx.createRadialGradient(64, 128, 30, 64, 128, 64);
  edgeGrad.addColorStop(0, 'transparent');
  edgeGrad.addColorStop(1, 'rgba(255, 255, 255, 0.25)');
  ctx.fillStyle = edgeGrad;
  ctx.fillRect(0, 0, 128, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/** Creates realistic organic green leaf texture with central midrib and lateral veins */
function createLeafTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 256, 0, 0);
  grad.addColorStop(0, '#1E3B16');
  grad.addColorStop(0.5, '#2D5822');
  grad.addColorStop(1, '#4A8537');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 256);

  // Central midrib vein
  ctx.strokeStyle = '#6FA854';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(64, 256);
  ctx.lineTo(64, 10);
  ctx.stroke();

  // Secondary lateral veins
  ctx.strokeStyle = 'rgba(125, 185, 95, 0.45)';
  ctx.lineWidth = 1.2;
  for (let y = 40; y < 220; y += 28) {
    ctx.beginPath();
    ctx.moveTo(64, y);
    ctx.quadraticCurveTo(88, y - 10, 118, y - 24);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(64, y);
    ctx.quadraticCurveTo(40, y - 10, 10, y - 24);
    ctx.stroke();
  }

  return new THREE.CanvasTexture(canvas);
}

/** Creates a smooth, rounded 3D petal mesh with natural organic curvature */
function createSmoothPetalGeometry(width = 0.09, length = 0.13, cupping = 0.24, curl = 0.08): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  // Smooth rounded teardrop petal profile with curved tip (no sharp corners)
  shape.moveTo(0, 0);
  shape.bezierCurveTo(-width * 0.45, length * 0.25, -width * 0.58, length * 0.72, 0, length);
  shape.bezierCurveTo(width * 0.58, length * 0.72, width * 0.45, length * 0.25, 0, 0);

  const geo = new THREE.ShapeGeometry(shape, 12);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const normY = Math.max(0, Math.min(1, y / length));
    const normX = x / (width * 0.5 || 1);

    // Natural 3D dish cupping along center + outward reflex curl at tip
    const cup = -cupping * Math.sin(normY * Math.PI) * (1 - Math.min(1, normX * normX * 0.6));
    const reflex = curl * Math.pow(normY, 2.5);
    pos.setZ(i, cup + reflex);
  }
  geo.computeVertexNormals();
  return geo;
}

/* ══════════════════════════════════════════════════════════════
   LIFELIKE BOTANICAL STEM WITH PHYLLOTAXIS LEAVES & SEPALS
══════════════════════════════════════════════════════════════ */
function BotanicalStem({
  height = 0.45,
  curveX = 0.03,
  curveZ = 0.02,
  leafTex,
}: {
  height?: number;
  curveX?: number;
  curveZ?: number;
  leafTex: THREE.CanvasTexture;
}) {
  const stemGeom = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -height, 0),
      new THREE.Vector3(curveX * 0.4, -height * 0.5, curveZ * 0.4),
      new THREE.Vector3(curveX, 0, curveZ),
    ]);
    return new THREE.TubeGeometry(curve, 16, 0.011, 8, false);
  }, [height, curveX, curveZ]);

  const stemMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#2C5220'),
        roughness: 0.65,
      }),
    []
  );

  const leafMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: leafTex,
        roughness: 0.5,
        side: THREE.DoubleSide,
      }),
    [leafTex]
  );

  const leafGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.bezierCurveTo(-0.035, 0.035, -0.045, 0.09, 0, 0.13);
    s.bezierCurveTo(0.045, 0.09, 0.035, 0.035, 0, 0);
    const g = new THREE.ShapeGeometry(s, 8);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const ny = y / 0.13;
      pos.setZ(i, -0.015 * Math.sin(ny * Math.PI));
    }
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <group>
      <mesh geometry={stemGeom} material={stemMat} castShadow />

      {/* Paired Curved Botanical Leaves */}
      <group position={[curveX * 0.35 + 0.02, -height * 0.35, curveZ * 0.35]} rotation={[0.4, 0.6, 0.7]}>
        <mesh geometry={leafGeo} material={leafMat} castShadow />
      </group>
      <group position={[curveX * 0.65 - 0.02, -height * 0.62, curveZ * 0.65]} rotation={[-0.3, -0.7, -0.75]}>
        <mesh geometry={leafGeo} material={leafMat} castShadow />
      </group>

      {/* Calyx (Green Sepals embracing bloom base) */}
      {[0, 1.25, 2.5, 3.75, 5.0].map((angle, i) => (
        <group
          key={i}
          position={[curveX + Math.cos(angle) * 0.02, -0.005, curveZ + Math.sin(angle) * 0.02]}
          rotation={[-0.25, angle, 0]}
        >
          <mesh material={stemMat}>
            <coneGeometry args={[0.014, 0.045, 4]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   MASTERPIECE BOTANICAL BLOOMING FLOWER COMPONENT
══════════════════════════════════════════════════════════════ */
interface MasterpieceFlowerProps {
  idx: number;
  species: 'camellia' | 'marigold' | 'aster' | 'sage' | 'daisy';
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
  const currentBloom = useRef(0.35); // bud state
  const physicalSway = useRef(0);

  const gardenBloomed = useStoryStore((s) => s.gardenBloomed);
  const bloomFlower = useStoryStore((s) => s.bloomFlower);
  const isBloomed = gardenBloomed.includes(idx);

  const petalTexture = useMemo(
    () => createVelvetPetalTexture(colorHex, tipHex),
    [colorHex, tipHex]
  );

  const petalMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: petalTexture,
        roughness: 0.38,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
    [petalTexture]
  );

  const budPetalGeo = useMemo(() => createSmoothPetalGeometry(0.065, 0.085, 0.35, 0.04), []);
  const midPetalGeo = useMemo(() => createSmoothPetalGeometry(0.082, 0.11, 0.28, 0.1), []);
  const outerPetalGeo = useMemo(() => createSmoothPetalGeometry(0.095, 0.13, 0.2, 0.16), []);

  const handleClick = (e: any) => {
    e.stopPropagation();
    physicalSway.current = 0.22; // Physical impulse
    if (!isBloomed) {
      bloomFlower(idx);
      playFlowerBloomSound(idx);
    } else {
      playChime(1.2 + idx * 0.1);
    }
  };

  useFrame(({ clock }) => {
    if (!groupRef.current || !bloomGroupRef.current) return;
    const t = clock.getElapsedTime();

    // Dampen physical sway impulse
    physicalSway.current *= 0.92;

    // Natural botanical breeze sway + physical reaction
    groupRef.current.rotation.y = rot[1] + Math.sin(t * 0.7 + phase) * 0.03 + physicalSway.current;
    groupRef.current.rotation.z = rot[2] + Math.sin(t * 0.9 + phase) * 0.02 + physicalSway.current * 0.5;
    groupRef.current.position.y = pos[1] + Math.sin(t * 0.85 + phase) * 0.005;

    // Smooth blooming spring interpolation
    const target = isBloomed ? 1.0 : 0.36;
    currentBloom.current += (target - currentBloom.current) * 0.075;
    const b = currentBloom.current;

    bloomGroupRef.current.scale.set(b, b, b);
    bloomGroupRef.current.rotation.y = (1 - b) * 0.3;

    if (pollenLightRef.current) {
      pollenLightRef.current.intensity = isBloomed
        ? 0.85 + Math.sin(t * 3.0 + phase) * 0.2
        : 0;
    }
  });

  const pollenMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#FFD54F'),
        emissive: isBloomed ? new THREE.Color('#FFA000') : new THREE.Color('#000000'),
        emissiveIntensity: isBloomed ? 1.1 : 0,
        roughness: 0.35,
      }),
    [isBloomed]
  );

  const innerBudPetals = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        angle: (i / 5) * Math.PI * 2,
        tilt: 0.25,
        rad: 0.02,
      })),
    []
  );

  const midWhorlPetals = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        angle: (i / 7) * Math.PI * 2 + 0.3,
        tilt: 0.55,
        rad: 0.045,
      })),
    []
  );

  const outerReflexPetals = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        angle: (i / 9) * Math.PI * 2 + 0.15,
        tilt: 0.82,
        rad: 0.075,
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
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* Invisible Large Hitbox for Easy Touch Interaction on Mobile */}
      <mesh position={[0, 0.2, 0]} visible={false}>
        <sphereGeometry args={[0.3, 8, 8]} />
      </mesh>

      {/* Botanical Stem with Leaves and Calyx */}
      <BotanicalStem height={0.42} curveX={0.03} curveZ={0.02} leafTex={leafTex} />

      {/* ── Multi-Layered Realistic Blooming Corolla ── */}
      <group ref={bloomGroupRef} position={[0.03, 0.015, 0.02]}>
        {/* Layer 1: Tight Inner Bud Spiral */}
        {innerBudPetals.map((p, i) => (
          <group
            key={`bud-${i}`}
            position={[Math.cos(p.angle) * p.rad, 0.03, Math.sin(p.angle) * p.rad]}
            rotation={[-p.tilt, p.angle + Math.PI / 2, 0.1]}
          >
            <mesh geometry={budPetalGeo} material={petalMat} castShadow />
          </group>
        ))}

        {/* Layer 2: Mid Blooming Whorl */}
        {midWhorlPetals.map((p, i) => (
          <group
            key={`mid-${i}`}
            position={[Math.cos(p.angle) * p.rad, 0.018, Math.sin(p.angle) * p.rad]}
            rotation={[-p.tilt, p.angle + Math.PI / 2, 0.06]}
          >
            <mesh geometry={midPetalGeo} material={petalMat} castShadow />
          </group>
        ))}

        {/* Layer 3: Reflexed Outermost Petals */}
        {outerReflexPetals.map((p, i) => (
          <group
            key={`out-${i}`}
            position={[Math.cos(p.angle) * p.rad, 0.006, Math.sin(p.angle) * p.rad]}
            rotation={[-p.tilt, p.angle + Math.PI / 2, 0.02]}
          >
            <mesh geometry={outerPetalGeo} material={petalMat} castShadow />
          </group>
        ))}

        {/* Golden Central Pistil & Stamen Radiance */}
        <mesh position={[0, 0.035, 0]} material={pollenMat}>
          <sphereGeometry args={[0.03, 16, 12]} />
        </mesh>
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 0.024, 0.042, Math.sin(a) * 0.024]}
              material={pollenMat}
            >
              <sphereGeometry args={[0.007, 6, 6]} />
            </mesh>
          );
        })}
      </group>

      {/* Warm Pollen Glow Point Light when bloomed */}
      <pointLight
        ref={pollenLightRef}
        color={colorHex}
        intensity={0}
        distance={2.4}
        decay={2}
        position={[0, 0.14, 0]}
      />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   MINIATURE COBBLESTONE GARDEN PATHWAY & ARCH GATE
══════════════════════════════════════════════════════════════ */
function GardenEntrancePathway() {
  const stoneMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#4E453D'),
        roughness: 0.85,
        metalness: 0.04,
      }),
    []
  );

  const archStoneMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#3A322C'),
        roughness: 0.8,
        metalness: 0.05,
      }),
    []
  );

  const goldFilletMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D4AF37'),
        roughness: 0.3,
        metalness: 0.8,
      }),
    []
  );

  const lanternGlowMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#FFE5A4'),
        emissive: new THREE.Color('#FFB877'),
        emissiveIntensity: 1.8,
        transparent: true,
        opacity: 0.95,
      }),
    []
  );

  // Curved cobblestone stepping stones from main table disc toward secret garden
  const steppingStones = useMemo(
    () => [
      { x: -0.25, y: 0.015, z: -0.15, rx: 0.22, rz: 0.16, rot: 0.2 },
      { x: -0.42, y: 0.018, z: -0.35, rx: 0.24, rz: 0.17, rot: -0.15 },
      { x: -0.62, y: 0.020, z: -0.58, rx: 0.26, rz: 0.18, rot: 0.3 },
      { x: -0.80, y: 0.022, z: -0.80, rx: 0.28, rz: 0.20, rot: -0.1 },
    ],
    []
  );

  return (
    <group>
      {/* Cobblestone Stepping Stones */}
      {steppingStones.map((s, i) => (
        <group key={i} position={[s.x, s.y, s.z]} rotation={[0, s.rot, 0]}>
          <mesh material={stoneMat} receiveShadow castShadow>
            <cylinderGeometry args={[s.rx, s.rx * 1.05, 0.03, 14]} />
          </mesh>
          <mesh position={[0, 0.016, 0]} material={goldFilletMat}>
            <torusGeometry args={[s.rx * 0.92, 0.004, 4, 14]} />
          </mesh>
        </group>
      ))}

      {/* Miniature Wrought-Stone Garden Arch Gate at [-0.68, 0, -0.65] */}
      <group position={[-0.68, 0.0, -0.65]} rotation={[0, Math.PI / 4, 0]}>
        {/* Left Stone Pillar */}
        <mesh position={[-0.32, 0.35, 0]} material={archStoneMat} castShadow>
          <boxGeometry args={[0.09, 0.7, 0.09]} />
        </mesh>
        <mesh position={[-0.32, 0.72, 0]} material={goldFilletMat}>
          <sphereGeometry args={[0.038, 8, 8]} />
        </mesh>

        {/* Right Stone Pillar */}
        <mesh position={[0.32, 0.35, 0]} material={archStoneMat} castShadow>
          <boxGeometry args={[0.09, 0.7, 0.09]} />
        </mesh>
        <mesh position={[0.32, 0.72, 0]} material={goldFilletMat}>
          <sphereGeometry args={[0.038, 8, 8]} />
        </mesh>

        {/* Overhead Curved Arch */}
        <mesh position={[0, 0.68, 0]} material={goldFilletMat}>
          <torusGeometry args={[0.32, 0.016, 8, 20, Math.PI]} />
        </mesh>

        {/* Hanging Lantern 1 (Left) */}
        <group position={[-0.26, 0.52, 0]}>
          <mesh position={[0, 0, 0]} material={goldFilletMat}>
            <cylinderGeometry args={[0.024, 0.024, 0.05, 8]} />
          </mesh>
          <mesh position={[0, -0.01, 0]} material={lanternGlowMat}>
            <sphereGeometry args={[0.022, 8, 8]} />
          </mesh>
          <pointLight color="#FFE5A4" intensity={0.65} distance={2.5} decay={2} position={[0, -0.01, 0]} />
        </group>

        {/* Hanging Lantern 2 (Right) */}
        <group position={[0.26, 0.52, 0]}>
          <mesh position={[0, 0, 0]} material={goldFilletMat}>
            <cylinderGeometry args={[0.024, 0.024, 0.05, 8]} />
          </mesh>
          <mesh position={[0, -0.01, 0]} material={lanternGlowMat}>
            <sphereGeometry args={[0.022, 8, 8]} />
          </mesh>
          <pointLight color="#FFE5A4" intensity={0.65} distance={2.5} decay={2} position={[0, -0.01, 0]} />
        </group>
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   LUSH ARTISAN STONE & MOSSY TERRACOTTA GARDEN PLANTER BED
══════════════════════════════════════════════════════════════ */
function GardenPlanterBed() {
  const earthMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#24180E'),
        roughness: 0.95,
      }),
    []
  );

  const mossMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#3B5E28'),
        roughness: 0.85,
      }),
    []
  );

  const stoneMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#4A3E38'),
        roughness: 0.75,
      }),
    []
  );

  const goldFilletMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D4AF37'),
        roughness: 0.3,
        metalness: 0.75,
      }),
    []
  );

  return (
    <group position={[0, 0.22, 0]}>
      {/* Stone Pedestal Planter */}
      <mesh material={stoneMat} castShadow receiveShadow>
        <cylinderGeometry args={[0.44, 0.38, 0.28, 32]} />
      </mesh>
      {/* Gold Trim Ring */}
      <mesh position={[0, 0.14, 0]} material={goldFilletMat}>
        <torusGeometry args={[0.44, 0.012, 8, 32]} />
      </mesh>
      {/* Rich Moist Earth Soil Top */}
      <mesh position={[0, 0.13, 0]} material={earthMat} receiveShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.02, 32]} />
      </mesh>
      {/* Lush Green Moss Mound */}
      <mesh position={[0, 0.145, 0]} material={mossMat}>
        <sphereGeometry args={[0.40, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.35]} />
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   DORAEMON EASTER EGG (Miniature Handcrafted Blue Bell Charm)
   Nestled subtly in the mossy rocks for Tithi to discover!
══════════════════════════════════════════════════════════════ */
function DoraemonEasterEggBell() {
  const bellRef = useRef<THREE.Group>(null);
  const bellMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1E88E5'), // Vibrant Doraemon Sky Blue
        metalness: 0.85,
        roughness: 0.25,
      }),
    []
  );

  const goldTrimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#FFD700'),
        metalness: 0.9,
        roughness: 0.2,
      }),
    []
  );

  const handleEasterEggClick = (e: any) => {
    e.stopPropagation();
    playChime(1.8);
    if (bellRef.current) {
      bellRef.current.rotation.z += 0.4;
      setTimeout(() => {
        if (bellRef.current) bellRef.current.rotation.z -= 0.4;
      }, 300);
    }
  };

  return (
    <group
      ref={bellRef}
      position={[-0.24, 0.38, 0.18]}
      rotation={[0.2, 0.4, -0.1]}
      scale={[0.65, 0.65, 0.65]}
      onClick={handleEasterEggClick}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* Small Doraemon Blue Sphere Bell */}
      <mesh material={bellMat} castShadow>
        <sphereGeometry args={[0.032, 16, 16]} />
      </mesh>
      {/* Gold Collar Ring */}
      <mesh position={[0, 0.012, 0]} material={goldTrimMat}>
        <torusGeometry args={[0.033, 0.005, 6, 16]} />
      </mesh>
      {/* Tiny Bell Sound Slot Hole */}
      <mesh position={[0, -0.015, 0.028]}>
        <circleGeometry args={[0.006, 8]} />
        <meshBasicMaterial color="#0B132B" />
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   INTELLIGENT GUIDE FIREFLY WITH LIGHT TRAIL
   Naturally leads player to unbloomed flowers & illuminates exit!
══════════════════════════════════════════════════════════════ */
function GuideFirefly() {
  const fireflyGroupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const gardenBloomed = useStoryStore((s) => s.gardenBloomed);

  // Flower target coordinates
  const flowerTargets = useMemo(
    () => [
      [-0.14, 0.62, 0.05],
      [0.13, 0.65, -0.04],
      [0.0, 0.70, 0.09],
      [-0.1, 0.59, -0.09],
      [0.11, 0.60, 0.08],
    ],
    []
  );

  // Next target position
  const targetPos = useMemo(() => {
    for (let i = 0; i < GARDEN_FLOWERS.length; i++) {
      if (!gardenBloomed.includes(i)) {
        return flowerTargets[i];
      }
    }
    // If all bloomed, hover above the illuminated exit path
    return [0.0, 1.2, 0.3];
  }, [gardenBloomed, flowerTargets]);

  useFrame(({ clock }) => {
    if (!fireflyGroupRef.current) return;
    const t = clock.getElapsedTime();

    // Smooth asymptotic glide toward target
    fireflyGroupRef.current.position.x +=
      (targetPos[0] + Math.sin(t * 2.2) * 0.04 - fireflyGroupRef.current.position.x) * 0.06;
    fireflyGroupRef.current.position.y +=
      (targetPos[1] + Math.cos(t * 1.8) * 0.04 - fireflyGroupRef.current.position.y) * 0.06;
    fireflyGroupRef.current.position.z +=
      (targetPos[2] + Math.sin(t * 2.5) * 0.04 - fireflyGroupRef.current.position.z) * 0.06;

    // Glowing pulse
    if (lightRef.current) {
      lightRef.current.intensity = 0.95 + Math.sin(t * 5.0) * 0.35;
    }
  });

  return (
    <group ref={fireflyGroupRef} position={[-0.14, 0.6, 0.05]}>
      {/* Luminous Firefly Core */}
      <mesh>
        <sphereGeometry args={[0.016, 8, 8]} />
        <meshBasicMaterial color="#FFF9C4" />
      </mesh>
      {/* Translucent Golden Halo */}
      <mesh>
        <sphereGeometry args={[0.038, 8, 8]} />
        <meshBasicMaterial color="#FFE5A4" transparent opacity={0.45} depthWrite={false} />
      </mesh>
      {/* Guide Firefly Point Light */}
      <pointLight ref={lightRef} color="#FFE5A4" intensity={1.1} distance={2.2} decay={2} />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   AMBIENT GLOWING GARDEN FIREFLIES SWARM
══════════════════════════════════════════════════════════════ */
function GardenFireflies() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 42;

  const [positions, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 0.18 + Math.random() * 0.62;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = 0.35 + Math.random() * 0.8;
      pos[i * 3 + 2] = Math.sin(angle) * r;
      ph[i] = Math.random() * Math.PI * 2;
    }
    return [pos, ph];
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      const origY = positions[i * 3 + 1];
      const p = phases[i];
      posAttr.setY(i, origY + Math.sin(t * 1.5 + p) * 0.06);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#FFE5A4"
        size={0.032}
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ══════════════════════════════════════════════════════════════
   ENCHANTED 3D SECRET GARDEN SCENE OBJECT
══════════════════════════════════════════════════════════════ */
export function Flowers() {
  const leafTexture = useMemo(() => createLeafTexture(), []);

  return (
    <group position={[-1.0, 0.01, -1.0]}>
      {/* Warm Ambient Starlight for the Garden */}
      <pointLight color="#FFE5A4" intensity={1.15} distance={5.5} position={[0, 1.3, 0]} />

      {/* Cobblestone Garden Path & Arch Gate */}
      <GardenEntrancePathway />

      {/* Lush Stone Planter Bed with Earth & Moss Mound */}
      <GardenPlanterBed />

      {/* Ambient Floating Fireflies Swarm */}
      <GardenFireflies />

      {/* Intelligent Golden Guide Firefly */}
      <GuideFirefly />

      {/* Doraemon Easter Egg Blue Bell */}
      <DoraemonEasterEggBell />

      {/* 5 Distinct Photorealistic Botanical Garden Blooms */}
      {/* 0. Blush Camellia (Velvet Rose Pink) — "Stay curious." */}
      <MasterpieceFlower
        idx={0}
        species="camellia"
        colorHex={GARDEN_FLOWERS[0].color}
        tipHex="#FFF0F5"
        pos={[-0.14, 0.44, 0.05]}
        rot={[0.12, -0.3, -0.15]}
        scale={1.1}
        phase={0}
        leafTex={leafTexture}
      />

      {/* 1. Golden Marigold (Radiant Amber Gold) — "Keep learning." */}
      <MasterpieceFlower
        idx={1}
        species="marigold"
        colorHex={GARDEN_FLOWERS[1].color}
        tipHex="#FFF8E1"
        pos={[0.13, 0.47, -0.04]}
        rot={[-0.1, 0.35, 0.15]}
        scale={1.08}
        phase={0.8}
        leafTex={leafTexture}
      />

      {/* 2. Lavender Aster (Royal Velvet Lavender) — "Keep laughing." */}
      <MasterpieceFlower
        idx={2}
        species="aster"
        colorHex={GARDEN_FLOWERS[2].color}
        tipHex="#F3E5F5"
        pos={[0.0, 0.52, 0.09]}
        rot={[0.15, 0.0, 0.0]}
        scale={1.18}
        phase={1.6}
        leafTex={leafTexture}
      />

      {/* 3. Sage Blossom (Mint & Emerald Blossom) — "Try new things." */}
      <MasterpieceFlower
        idx={3}
        species="sage"
        colorHex={GARDEN_FLOWERS[3].color}
        tipHex="#E8F5E9"
        pos={[-0.1, 0.41, -0.09]}
        rot={[-0.15, -0.45, -0.12]}
        scale={1.02}
        phase={2.4}
        leafTex={leafTexture}
      />

      {/* 4. Starlight Daisy (Pure Ivory with Golden Pistil) — "Enjoy the little things." */}
      <MasterpieceFlower
        idx={4}
        species="daisy"
        colorHex={GARDEN_FLOWERS[4].color}
        tipHex="#FFFFFF"
        pos={[0.11, 0.42, 0.08]}
        rot={[0.12, 0.4, 0.18]}
        scale={1.05}
        phase={3.0}
        leafTex={leafTexture}
      />
    </group>
  );
}
