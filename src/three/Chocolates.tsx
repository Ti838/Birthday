import { useMemo } from 'react';
import * as THREE from 'three';

/* ══════════════════════════════════════════════════════════════
   CHOCOLATE BOX  –  elegant premium open box with chocolates
══════════════════════════════════════════════════════════════ */

function makeChocolateBoxTex(size = 256): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#2A1810');
  grad.addColorStop(0.5, '#3A2218');
  grad.addColorStop(1, '#1E1008');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  // gold border lines
  ctx.strokeStyle = 'rgba(212,175,90,0.55)';
  ctx.lineWidth = 5;
  ctx.strokeRect(8, 8, size - 16, size - 16);
  ctx.lineWidth = 2;
  ctx.strokeRect(14, 14, size - 28, size - 28);
  // small fleur-de-lis in center
  ctx.fillStyle = 'rgba(212,175,90,0.30)';
  ctx.font = `${size * 0.28}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✦', size / 2, size / 2);
  return new THREE.CanvasTexture(c);
}

/* Single chocolate piece */
function Choc({
  pos, type, color,
}: {
  pos: [number, number, number];
  type: 'square' | 'round' | 'oval';
  color: number;
}) {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.22,
    metalness: 0.06,
  }), [color]);

  const hlMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(color).multiplyScalar(1.4),
    roughness: 0.18,
    metalness: 0.04,
    transparent: true,
    opacity: 0.55,
  }), [color]);

  if (type === 'square') {
    return (
      <group position={pos}>
        <mesh material={mat} castShadow>
          <boxGeometry args={[0.075, 0.032, 0.075]} />
        </mesh>
        {/* highlight line */}
        <mesh material={hlMat} position={[0, 0.016, 0]}>
          <boxGeometry args={[0.068, 0.004, 0.010]} />
        </mesh>
      </group>
    );
  }
  if (type === 'round') {
    return (
      <group position={pos}>
        <mesh material={mat} castShadow scale={[1, 0.52, 1]}>
          <sphereGeometry args={[0.044, 14, 12]} />
        </mesh>
        {/* gloss highlight */}
        <mesh material={hlMat} position={[-0.012, 0.022, 0.012]} scale={[0.35, 0.25, 0.35]}>
          <sphereGeometry args={[0.044, 8, 8]} />
        </mesh>
      </group>
    );
  }
  // oval
  return (
    <group position={pos}>
      <mesh material={mat} castShadow scale={[1.35, 0.48, 1]}>
        <sphereGeometry args={[0.038, 12, 10]} />
      </mesh>
    </group>
  );
}

/* Gold paper cup */
function Cup({ pos }: { pos: [number, number, number] }) {
  return (
    <mesh position={pos}>
      <cylinderGeometry args={[0.046, 0.040, 0.018, 10]} />
      <meshStandardMaterial color={0xD4AF5A} roughness={0.45} metalness={0.35} />
    </mesh>
  );
}

const CHOCOLATE_LAYOUT: Array<{
  pos: [number, number, number];
  type: 'square' | 'round' | 'oval';
  color: number;
}> = [
  { pos: [-0.12,  0.016,  -0.12], type: 'round',  color: 0x2A1408 },
  { pos: [0.0,    0.016,  -0.12], type: 'square', color: 0x3C1A08 },
  { pos: [0.12,   0.016,  -0.12], type: 'oval',   color: 0x4A2810 },
  { pos: [-0.12,  0.016,  0.0  ], type: 'square', color: 0x5C3520 },
  { pos: [0.0,    0.016,  0.0  ], type: 'round',  color: 0x2A1408 },
  { pos: [0.12,   0.016,  0.0  ], type: 'square', color: 0x3C1A08 },
  { pos: [-0.12,  0.016,  0.12 ], type: 'oval',   color: 0x4A2810 },
  { pos: [0.0,    0.016,  0.12 ], type: 'round',  color: 0x5C3520 },
  { pos: [0.12,   0.016,  0.12 ], type: 'square', color: 0x2A1408 },
];

/* ══════════════════════════════════════════════════════════════
   Exported component
══════════════════════════════════════════════════════════════ */
export function Chocolates() {
  const boxTex = useMemo(() => makeChocolateBoxTex(256), []);

  const boxMat = useMemo(() => new THREE.MeshStandardMaterial({
    map:       boxTex,
    color:     new THREE.Color(0xFFFFFF),
    roughness: 0.62,
    metalness: 0.04,
  }), [boxTex]);

  const satinLineMat = useMemo(() => new THREE.MeshStandardMaterial({
    color:     new THREE.Color(0xD4AF5A),
    roughness: 0.28,
    metalness: 0.55,
  }), []);

  const innerMat = useMemo(() => new THREE.MeshStandardMaterial({
    color:     new THREE.Color(0x1A0C06),
    roughness: 0.88,
  }), []);

  return (
    <group position={[1.4, 0.0, -1.6]}>
      {/* Low round side table */}
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.24, 0.055, 22]} />
        <meshStandardMaterial color={0xC8A878} roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.030, 0.030, 0.18, 8]} />
        <meshStandardMaterial color={0x8A6A45} roughness={0.88} />
      </mesh>

      {/* Chocolate box on table */}
      <group position={[0, 0.215, 0]}>
        {/* Box base sides */}
        <mesh material={boxMat} position={[0, 0.030, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.38, 0.060, 0.32]} />
        </mesh>

        {/* Gold trim – front/back */}
        <mesh material={satinLineMat} position={[0, 0.061, 0.162]}>
          <boxGeometry args={[0.382, 0.006, 0.003]} />
        </mesh>
        <mesh material={satinLineMat} position={[0, 0.061, -0.162]}>
          <boxGeometry args={[0.382, 0.006, 0.003]} />
        </mesh>
        {/* Gold trim – sides */}
        <mesh material={satinLineMat} position={[0.192, 0.061, 0]}>
          <boxGeometry args={[0.003, 0.006, 0.326]} />
        </mesh>
        <mesh material={satinLineMat} position={[-0.192, 0.061, 0]}>
          <boxGeometry args={[0.003, 0.006, 0.326]} />
        </mesh>

        {/* Dark velvet inner tray */}
        <mesh material={innerMat} position={[0, 0.062, 0]}>
          <boxGeometry args={[0.355, 0.008, 0.295]} />
        </mesh>

        {/* Chocolates */}
        {CHOCOLATE_LAYOUT.map((ch, i) => (
          <group key={i}>
            <Cup pos={[ch.pos[0], 0.066, ch.pos[2]]} />
            <Choc pos={[ch.pos[0], 0.072, ch.pos[2]]} type={ch.type} color={ch.color} />
          </group>
        ))}

        {/* Ribbon around box */}
        <mesh material={satinLineMat} position={[0, 0.032, 0]}>
          <boxGeometry args={[0.384, 0.064, 0.015]} />
        </mesh>
        <mesh material={satinLineMat} position={[0, 0.032, 0]}>
          <boxGeometry args={[0.015, 0.064, 0.324]} />
        </mesh>

        {/* Small gold bow on ribbon crossing */}
        {[0.04, -0.04].map((ox, i) => (
          <mesh key={i} position={[ox, 0.072, 0]} scale={[0.8, 0.55, 0.38]} rotation={[0, 0, i === 0 ? 0.5 : -0.5]} material={satinLineMat}>
            <sphereGeometry args={[0.038, 10, 8]} />
          </mesh>
        ))}
        <mesh position={[0, 0.075, 0]} material={satinLineMat}>
          <sphereGeometry args={[0.014, 8, 8]} />
        </mesh>
      </group>

      {/* "With Love" card leaning against box */}
      <mesh position={[0.22, 0.28, -0.08]} rotation={[0, -0.3, 0.1]}>
        <planeGeometry args={[0.10, 0.07]} />
        <meshStandardMaterial color={0xF8F4EC} roughness={0.88} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
