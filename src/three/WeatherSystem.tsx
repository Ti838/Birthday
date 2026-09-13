import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStoryStore } from '../store/useStoryStore';

/* ══════════════════════════════════════════════════════════════
   GLOBAL 3D WEATHER & REAL-TIME ATMOSPHERE ENGINE
   Instanced Rain • Wind Physics • Dynamic Clouds • Fog
══════════════════════════════════════════════════════════════ */

export function WeatherSystem() {
  const weather = useStoryStore((s) => s.weather);
  const rainIntensity = weather.rainIntensity ?? 0;
  const isRaining = rainIntensity > 0.05 || weather.condition.includes('rain') || weather.condition === 'storm';

  return (
    <group>
      {/* Dynamic Drifting Clouds */}
      <DynamicClouds coverage={weather.cloudCoverage} windSpeed={weather.windSpeed} />

      {/* Real-time Rain Particle System */}
      {isRaining && (
        <RainParticles
          intensity={rainIntensity > 0 ? rainIntensity : 0.45}
          windSpeed={weather.windSpeed}
        />
      )}
    </group>
  );
}

/* ── Dynamic Volumetric Clouds ── */
function DynamicClouds({ coverage, windSpeed }: { coverage: number; windSpeed: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const cloudCount = Math.floor(6 + coverage * 14);

  const clouds = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => {
      const angle = (i / 20) * Math.PI * 2;
      const r = 4.0 + (i % 4) * 1.5;
      return {
        x: Math.cos(angle) * r,
        y: 4.8 + (i % 3) * 0.5,
        z: Math.sin(angle) * r,
        scale: 0.8 + (i % 3) * 0.4,
        speed: (0.15 + (i % 2) * 0.1) * (windSpeed / 10.0 + 0.5),
      };
    });
  }, [windSpeed]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      const c = clouds[i];
      if (!c) return;
      child.position.x = c.x + Math.sin(t * 0.08 * c.speed + i) * 0.8;
      child.position.z = c.z + Math.cos(t * 0.08 * c.speed + i) * 0.8;
    });
  });

  const cloudMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D8E2EC'),
        roughness: 0.95,
        transparent: true,
        opacity: Math.max(0.15, Math.min(0.65, coverage * 0.75)),
        depthWrite: false,
      }),
    [coverage]
  );

  if (coverage < 0.1) return null;

  return (
    <group ref={groupRef}>
      {clouds.slice(0, cloudCount).map((c, i) => (
        <group key={i} position={[c.x, c.y, c.z]} scale={[c.scale, c.scale * 0.45, c.scale]}>
          <mesh material={cloudMat}>
            <sphereGeometry args={[0.7, 12, 10]} />
          </mesh>
          <mesh position={[0.4, 0.1, 0.2]} material={cloudMat}>
            <sphereGeometry args={[0.55, 10, 8]} />
          </mesh>
          <mesh position={[-0.45, -0.05, -0.2]} material={cloudMat}>
            <sphereGeometry args={[0.5, 10, 8]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ── Instanced Velocity-Driven Rain Particle System ── */
function RainParticles({ intensity, windSpeed }: { intensity: number; windSpeed: number }) {
  const count = Math.min(800, Math.floor(120 + intensity * 680));
  const instRef = useRef<THREE.InstancedMesh>(null);
  const splashRef = useRef<THREE.InstancedMesh>(null);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12.0;
      pos[i * 3 + 1] = 0.5 + Math.random() * 6.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12.0;
      spd[i] = 7.0 + Math.random() * 5.0;
    }
    return [pos, spd];
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const dummySplash = useMemo(() => new THREE.Object3D(), []);

  const windTilt = useMemo(() => Math.min(0.35, (windSpeed / 25.0) * 0.4), [windSpeed]);

  useFrame((_, delta) => {
    if (!instRef.current) return;
    const d = Math.min(delta, 0.05);

    for (let i = 0; i < count; i++) {
      let y = positions[i * 3 + 1] - speeds[i] * d;
      let x = positions[i * 3] + windTilt * speeds[i] * d;
      let z = positions[i * 3 + 2];

      if (y < 0.05) {
        // Reset to top
        y = 6.5 + Math.random() * 1.5;
        x = (Math.random() - 0.5) * 12.0;
        z = (Math.random() - 0.5) * 12.0;

        // Trigger splash ring
        if (splashRef.current && Math.random() > 0.6) {
          dummySplash.position.set(positions[i * 3], 0.02, positions[i * 3 + 2]);
          dummySplash.scale.set(0.08, 0.08, 0.08);
          dummySplash.updateMatrix();
          splashRef.current.setMatrixAt(i % 60, dummySplash.matrix);
          splashRef.current.instanceMatrix.needsUpdate = true;
        }
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      dummy.position.set(x, y, z);
      dummy.rotation.z = -windTilt * 0.8;
      dummy.scale.set(1, 1 + intensity * 0.5, 1);
      dummy.updateMatrix();
      instRef.current.setMatrixAt(i, dummy.matrix);
    }
    instRef.current.instanceMatrix.needsUpdate = true;
  });

  const rainMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#C4D9F2'),
        transparent: true,
        opacity: Math.max(0.35, Math.min(0.75, 0.3 + intensity * 0.45)),
        depthWrite: false,
      }),
    [intensity]
  );

  const splashMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#E0EEFF'),
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
      }),
    []
  );

  return (
    <group>
      {/* Falling Raindrop Cylinders */}
      <instancedMesh
        ref={instRef}
        args={[undefined, undefined, count]}
        material={rainMat}
      >
        <cylinderGeometry args={[0.003, 0.003, 0.18, 4]} />
      </instancedMesh>

      {/* Ground Splash Rings */}
      <instancedMesh
        ref={splashRef}
        args={[undefined, undefined, 60]}
        material={splashMat}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.02, 0.05, 8]} />
      </instancedMesh>
    </group>
  );
}

