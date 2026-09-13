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

/* ── Handcrafted Luxury Envelope Texture ── */
function makeEnvelopeFaceTexture(size = 512): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = Math.floor(size * 0.65);
  const ctx = c.getContext('2d')!;

  // Smooth warm handmade cotton-parchment background
  const grad = ctx.createLinearGradient(0, 0, c.width, c.height);
  grad.addColorStop(0, '#FAF6EE');
  grad.addColorStop(0.5, '#F5EDE0');
  grad.addColorStop(1, '#EDE2D0');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, c.width, c.height);

  // Micro paper fibers
  for (let i = 0; i < 3000; i++) {
    ctx.fillStyle = `rgba(160, 130, 90, ${0.015 + Math.random() * 0.025})`;
    ctx.fillRect(Math.random() * c.width, Math.random() * c.height, 1.2, 1.2);
  }

  // Elegant Gold Foil Border Trim
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, c.width - 20, c.height - 20);

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(16, 16, c.width - 32, c.height - 32);

  // Diagonal envelope fold creases (soft shadow)
  ctx.strokeStyle = 'rgba(120, 100, 75, 0.18)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(10, 10);
  ctx.lineTo(c.width / 2, c.height * 0.6);
  ctx.lineTo(c.width - 10, 10);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(10, c.height - 10);
  ctx.lineTo(c.width / 2, c.height * 0.6);
  ctx.lineTo(c.width - 10, c.height - 10);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(c);
  return tex;
}

/* ── Realistic Folded Flap Texture ── */
function makeFlapTexture(size = 512): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = Math.floor(size * 0.45);
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#F8F1E5';
  ctx.fillRect(0, 0, c.width, c.height);

  // Gold trim along the V-flap edges
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(8, 6);
  ctx.lineTo(c.width / 2, c.height - 12);
  ctx.lineTo(c.width - 8, 6);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(14, 6);
  ctx.lineTo(c.width / 2, c.height - 18);
  ctx.lineTo(c.width - 14, 6);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(c);
  return tex;
}

export function Envelope({ onOpen, interactive }: EnvelopeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const flapPivotRef = useRef<THREE.Group>(null);
  const waxRef = useRef<THREE.Mesh>(null);
  const letterPaperRef = useRef<THREE.Mesh>(null);
  const opened = useRef(false);
  const hoverRef = useRef(false);

  const envFaceTex = useMemo(() => makeEnvelopeFaceTexture(512), []);
  const flapTex = useMemo(() => makeFlapTexture(512), []);
  const waxTex = useMemo(() => makeWaxTexture(128), []);
  const paperTex = useMemo(() => makePaperTexture(512), []);

  const envMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: envFaceTex,
        roughness: 0.6,
        metalness: 0.05,
      }),
    [envFaceTex]
  );

  const flapMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: flapTex,
        roughness: 0.6,
        metalness: 0.05,
        side: THREE.DoubleSide,
      }),
    [flapTex]
  );

  const waxMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: waxTex,
        color: new THREE.Color('#B52824'),
        roughness: 0.35,
        metalness: 0.25,
      }),
    [waxTex]
  );

  const paperMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: paperTex,
        color: new THREE.Color('#FAF5EC'),
        roughness: 0.75,
        side: THREE.DoubleSide,
      }),
    [paperTex]
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

  // Flap shape (flat triangular flap)
  const flapGeo = useMemo(() => {
    const shape = new THREE.Shape();
    const w = 0.78;
    const h = 0.28;
    shape.moveTo(-w / 2, 0);
    shape.lineTo(w / 2, 0);
    shape.lineTo(0, -h);
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.008,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.004,
      bevelThickness: 0.004,
    });
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Gentle floating breathing when waiting to be opened
    if (interactive && !opened.current) {
      groupRef.current.position.y = 0.42 + Math.sin(state.clock.elapsedTime * 2.2) * 0.015;
    }
  });

  const handleClick = useCallback(() => {
    if (opened.current || !interactive) return;
    opened.current = true;

    playPaperSound();
    playChime(1.2);

    const tl = gsap.timeline();

    // Wax seal scales down and fades
    if (waxRef.current) {
      tl.to(waxRef.current.scale, { x: 0.1, y: 0.1, z: 0.1, duration: 0.35, ease: 'power2.in' }, 0);
      tl.to((waxRef.current.material as THREE.MeshStandardMaterial), { opacity: 0, duration: 0.35 }, 0.05);
      (waxRef.current.material as THREE.MeshStandardMaterial).transparent = true;
    }

    // Flap swings open upward
    if (flapPivotRef.current) {
      tl.to(flapPivotRef.current.rotation, { x: -Math.PI * 0.85, duration: 0.9, ease: 'power2.out' }, 0.3);
    }

    // Letter paper slides out gracefully
    if (letterPaperRef.current) {
      tl.call(() => {
        if (letterPaperRef.current) letterPaperRef.current.visible = true;
      }, undefined, 0.75);
      tl.to(letterPaperRef.current.position, { y: 0.28, z: 0.12, duration: 0.9, ease: 'power2.out' }, 0.8);
      tl.to(letterPaperRef.current.rotation, { x: -Math.PI / 6, duration: 0.9 }, 0.8);
    }

    tl.call(onOpen, undefined, 1.6);
  }, [interactive, onOpen]);

  return (
    <group ref={groupRef} position={[0.0, 0.42, 1.4]} rotation={[-0.15, 0, 0]}>
      {/* ── Antique Writing Desk Tabletop ── */}
      <mesh position={[0, -0.14, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.08, 0.9]} />
        <meshStandardMaterial color="#3A2214" roughness={0.75} />
      </mesh>
      {/* Desk legs */}
      {[[-0.55, -0.35], [0.55, -0.35], [-0.55, 0.35], [0.55, 0.35]].map(([x, z], i) => (
        <mesh key={i} position={[x, -0.28, z]} castShadow>
          <cylinderGeometry args={[0.035, 0.028, 0.28, 8]} />
          <meshStandardMaterial color="#2B180D" roughness={0.85} />
        </mesh>
      ))}

      {/* ── Desk Mat / Presentation Tray ── */}
      <mesh position={[0, -0.016, 0]} receiveShadow>
        <boxGeometry args={[0.96, 0.014, 0.68]} />
        <meshStandardMaterial color="#2B1E16" roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Desk Mat Gold Filigree Inlay Border */}
      <mesh position={[0, -0.008, 0]}>
        <boxGeometry args={[0.92, 0.004, 0.64]} />
        <primitive object={goldTrimMat} attach="material" />
      </mesh>
      <mesh position={[0, -0.006, 0]}>
        <boxGeometry args={[0.88, 0.004, 0.60]} />
        <meshStandardMaterial color="#1C140E" roughness={0.8} />
      </mesh>

      {/* ── Envelope Body (Sleek Handcrafted Rectangular Pocket) ── */}
      <mesh material={envMat} position={[0, 0.01, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.80, 0.018, 0.52]} />
      </mesh>

      {/* ── Gold Edge Trimming ── */}
      <mesh position={[0, 0.018, 0]}>
        <boxGeometry args={[0.805, 0.003, 0.525]} />
        <primitive object={goldTrimMat} attach="material" />
      </mesh>

      {/* ── Folded Triangular Flap (Flap Pivot at Back Edge) ── */}
      <group ref={flapPivotRef} position={[0, 0.022, -0.26]}>
        <mesh
          geometry={flapGeo}
          material={flapMat}
          position={[0, 0, 0.26]}
          rotation={[-Math.PI / 2, 0, 0]}
          castShadow
        />
      </group>

      {/* ── Royal Wax Seal with Monogram "T" ── */}
      <group position={[0, 0.034, 0.015]}>
        <mesh
          ref={waxRef}
          material={waxMat}
          castShadow
          onPointerOver={() => { hoverRef.current = true; }}
          onPointerOut={() => { hoverRef.current = false; }}
        >
          <cylinderGeometry args={[0.075, 0.08, 0.018, 24]} />
        </mesh>
        {/* Embossed Gold Seal Ring */}
        <mesh position={[0, 0.01, 0]}>
          <ringGeometry args={[0.052, 0.062, 24]} />
          <meshStandardMaterial color="#FFE5A4" roughness={0.3} metalness={0.7} />
        </mesh>
      </group>

      {/* ── Letter Paper Inside (Revealed on Open) ── */}
      <mesh
        ref={letterPaperRef}
        material={paperMat}
        position={[0, 0.02, 0.0]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
      >
        <planeGeometry args={[0.72, 0.46]} />
      </mesh>

      {/* ── Soft Ambient Contact Shadow ── */}
      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.86, 0.58]} />
        <meshBasicMaterial color="#0A0705" transparent opacity={0.35} />
      </mesh>

      {/* ── 3D Interactive Floating Indicator (Tap to Read) ── */}
      {interactive && !opened.current && (
        <group position={[0, 0.38, 0.0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.16, 0.20, 32]} />
            <meshBasicMaterial color="#FFE5A4" transparent opacity={0.75} side={THREE.DoubleSide} />
          </mesh>
          <pointLight color="#FFE5A4" intensity={1.2} distance={2.2} />
        </group>
      )}

      {/* ── Invisible Touch / Click Hitbox ── */}
      {interactive && (
        <mesh
          onClick={handleClick}
          visible={false}
          position={[0, 0.05, 0]}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'default'; }}
        >
          <boxGeometry args={[0.9, 0.35, 0.65]} />
        </mesh>
      )}
    </group>
  );
}

