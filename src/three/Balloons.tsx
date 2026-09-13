import { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStoryStore } from '../store/useStoryStore';
import { playPopSound } from '../utils/music';

const BALLOON_COLORS = [0xE9DCC3, 0xC99A93, 0x9AA58F, 0xC9BFE0, 0xC9A667] as const;
const BALLOON_WISHES = [
  'More reasons to smile.',
  'More unexpected happiness.',
  'More beautiful days.',
  'More memories worth keeping.',
  'And a year that feels like yours.',
] as const;

interface BalloonParticle {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  life: number;
}

interface BalloonsProps {
  interactive: boolean;
  onAllPopped?: () => void;
}

export function Balloons({ interactive, onAllPopped }: BalloonsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const poppedBalloons = useStoryStore((s) => s.poppedBalloons);
  const popBalloon = useStoryStore((s) => s.popBalloon);
  const balloonRefs = useRef<(THREE.Group | null)[]>([]);
  const particles = useRef<BalloonParticle[]>([]);
  const sceneRef = useRef<THREE.Scene | null>(null);

  // Per-balloon data with tight, harmonious fan cluster
  const balloonData = useMemo(
    () =>
      BALLOON_COLORS.map((_, i) => {
        const angle = (i / 4) * Math.PI * 0.9 - 0.45; // balanced fan
        const r = 0.55 + (i % 2) * 0.22;
        return {
          baseX: Math.sin(angle) * r,
          baseY: 1.55 + (i % 3) * 0.2,
          baseZ: Math.cos(angle) * r * 0.35,
          phase: i * 1.2,
        };
      }),
    []
  );

  // Balloon materials
  const mats = useMemo(
    () =>
      BALLOON_COLORS.map(
        (c) =>
          new THREE.MeshStandardMaterial({
            color: new THREE.Color(c),
            roughness: 0.32,
            metalness: 0.06,
            transparent: true,
            opacity: 1,
          })
      ),
    []
  );

  const handleBalloonClick = useCallback(
    (idx: number, worldPos: THREE.Vector3, scene: THREE.Scene) => {
      if (poppedBalloons.includes(idx)) return;
      popBalloon(idx);
      playPopSound();

      const balloon = balloonRefs.current[idx];
      if (!balloon) return;

      // Compress-stretch-pop animation
      const mat = mats[idx];
      const startTime = performance.now();
      const animate = () => {
        const t = (performance.now() - startTime) / 1000;
        if (t < 0.15) {
          balloon.scale.set(1.28, 0.82, 1.28);
        } else if (t < 0.3) {
          balloon.scale.set(0.02, 0.02, 0.02);
          mat.opacity = 0;
          // Spawn burst particles
          for (let i = 0; i < 16; i++) {
            const pMat = new THREE.MeshBasicMaterial({
              color: BALLOON_COLORS[idx],
              transparent: true,
              opacity: 1,
              blending: THREE.AdditiveBlending,
            });
            const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.024, 6, 6), pMat);
            mesh.position.copy(worldPos);
            scene.add(mesh);
            const vel = new THREE.Vector3(
              (Math.random() - 0.5) * 1.5,
              Math.abs(Math.random()) * 1.0 + 0.5,
              (Math.random() - 0.5) * 1.5
            );
            particles.current.push({ mesh, vel, life: 0 });
          }
          balloon.visible = false;

          // Show wish text overlay via custom event
          const event = new CustomEvent('balloonPopped', {
            detail: { wish: BALLOON_WISHES[idx], worldPos },
          });
          window.dispatchEvent(event);
          return;
        } else {
          return;
        }
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);

      // Trigger continue if all popped
      if (poppedBalloons.length + 1 >= 5 && onAllPopped) {
        setTimeout(onAllPopped, 1500);
      }
    },
    [poppedBalloons, popBalloon, mats, onAllPopped]
  );

  // Animation loop
  useFrame(({ clock, scene }) => {
    sceneRef.current = scene;
    const t = clock.getElapsedTime();

    // Bob and wind sway balloons
    const windSpeed = useStoryStore.getState().weather.windSpeed ?? 3.5;
    const windNorm = Math.min(1.0, windSpeed / 20.0);
    balloonData.forEach((data, i) => {
      const g = balloonRefs.current[i];
      if (!g || poppedBalloons.includes(i)) return;
      g.position.y = data.baseY + Math.sin(t * 0.9 + data.phase) * 0.08;
      g.rotation.z = Math.sin(t * (0.7 + windNorm * 0.5) + data.phase) * (0.045 + windNorm * 0.08);
      g.rotation.x = Math.cos(t * (0.6 + windNorm * 0.4) + data.phase) * (0.03 + windNorm * 0.06);
    });

    // Update burst particles
    for (let i = particles.current.length - 1; i >= 0; i--) {
      const p = particles.current[i];
      p.life += 0.016;
      p.vel.y -= 1.2 * 0.016;
      p.mesh.position.addScaledVector(p.vel, 0.016);
      (p.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - p.life / 1.0);
      p.mesh.scale.setScalar(1 - p.life * 0.4);
      if (p.life >= 1.0) {
        sceneRef.current?.remove(p.mesh);
        p.mesh.geometry.dispose();
        (p.mesh.material as THREE.Material).dispose();
        particles.current.splice(i, 1);
      }
    }
  });

  // Cleanup particles on unmount
  useEffect(() => {
    return () => {
      particles.current.forEach((p) => {
        sceneRef.current?.remove(p.mesh);
        p.mesh.geometry.dispose();
        (p.mesh.material as THREE.Material).dispose();
      });
      particles.current = [];
    };
  }, []);

  return (
    <group ref={groupRef} position={[2.2, 0, 0.8]}>
      {BALLOON_COLORS.map((color, i) => (
        <group
          key={i}
          ref={(el) => {
            balloonRefs.current[i] = el;
          }}
          position={[balloonData[i].baseX, balloonData[i].baseY, balloonData[i].baseZ]}
          onClick={(e) => {
            if (!interactive) return;
            e.stopPropagation();
            handleBalloonClick(
              i,
              e.object.getWorldPosition(new THREE.Vector3()),
              (e.object.parent?.parent?.parent as THREE.Scene) ?? new THREE.Scene()
            );
          }}
          onPointerOver={() => {
            if (interactive) document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'default';
          }}
        >
          {/* Balloon body */}
          <mesh material={mats[i]} castShadow scale={[1, 1.24, 1]}>
            <sphereGeometry args={[0.27, 22, 22]} />
          </mesh>
          {/* Knot at bottom */}
          <mesh position={[0, -0.35, 0]}>
            <coneGeometry args={[0.042, 0.075, 8]} />
            <meshStandardMaterial color={new THREE.Color(color)} roughness={0.6} />
          </mesh>
          {/* String */}
          <mesh position={[0, -0.8, 0]}>
            <cylinderGeometry args={[0.004, 0.004, 0.92, 4]} />
            <meshStandardMaterial color={0x9c8b6e} roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
