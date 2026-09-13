import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStoryStore } from '../store/useStoryStore';
import { makeWoodTexture } from '../utils/textures';

export function Environment({ isNight }: { isNight: boolean }) {
  const weather = useStoryStore((s) => s.weather);
  const timeOfDay = weather.timeOfDay;
  const isRaining = (weather.rainIntensity ?? 0) > 0.05 || weather.condition.includes('rain');
  const windSpeed = weather.windSpeed ?? 3.5;

  const fireflyRefs = useRef<THREE.Mesh[]>([]);
  const treeRefs = useRef<THREE.Group[]>([]);

  const woodTex = useMemo(() => {
    const t = makeWoodTexture(512);
    t.repeat.set(6, 6);
    return t;
  }, []);

  // Firefly data
  const fireflyData = useMemo(
    () =>
      Array.from({ length: 24 }, () => {
        const angle = Math.random() * Math.PI * 2;
        const radius = 1.5 + Math.random() * 4.5;
        return {
          baseX: Math.cos(angle) * radius,
          baseZ: Math.sin(angle) * radius,
          baseY: 0.3 + Math.random() * 1.6,
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 0.6,
        };
      }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Fireflies floating
    fireflyRefs.current.forEach((m, i) => {
      if (!m) return;
      const d = fireflyData[i];
      m.position.x = d.baseX + Math.sin(t * 0.0006 * d.speed * 1000 + d.phase) * 0.4;
      m.position.z = d.baseZ + Math.cos(t * 0.0005 * d.speed * 1000 + d.phase) * 0.4;
      m.position.y = d.baseY + Math.sin(t * d.speed + d.phase * 2) * 0.25;
      const flicker = 0.65 + 0.35 * Math.sin(t * 3.5 + d.phase);
      const isDark = isNight || timeOfDay === 'night' || timeOfDay === 'dusk';
      (m.material as THREE.MeshBasicMaterial).opacity = isDark ? flicker * 0.9 : 0.05;
    });

    // Trees swaying with real-world wind
    treeRefs.current.forEach((tr, i) => {
      if (!tr) return;
      const windNorm = Math.min(1.0, windSpeed / 20.0);
      tr.rotation.z = Math.sin(t * (1.2 + i * 0.2) + i) * 0.03 * (1 + windNorm * 2.0);
      tr.rotation.x = Math.cos(t * (1.0 + i * 0.15) + i) * 0.02 * (1 + windNorm * 2.0);
    });
  });

  // Sun / Moon positioning based on time of day
  const celestialProps = useMemo(() => {
    switch (timeOfDay) {
      case 'dawn':
        return { pos: [6.0, 3.5, -7.0] as [number, number, number], color: '#FFD194', size: 0.55, isMoon: false };
      case 'day':
        return { pos: [3.5, 7.5, -6.5] as [number, number, number], color: '#FFF8E1', size: 0.65, isMoon: false };
      case 'sunset':
        return { pos: [6.5, 2.5, -6.5] as [number, number, number], color: '#FFA07A', size: 0.6, isMoon: false };
      case 'dusk':
        return { pos: [5.0, 4.0, -7.5] as [number, number, number], color: '#E1BEE7', size: 0.5, isMoon: true };
      default: // night
        return { pos: [4.5, 6.5, -8.0] as [number, number, number], color: '#F5F0E0', size: 0.5, isMoon: true };
    }
  }, [timeOfDay]);

  return (
    <group>
      {/* ── Ground disc (wet sheen when raining) ── */}
      <mesh position={[0, -0.2, 0]} receiveShadow rotation={[0, 0, 0]}>
        <cylinderGeometry args={[7.2, 7.4, 0.4, 64]} />
        <meshStandardMaterial
          map={woodTex}
          roughness={isRaining ? 0.45 : 0.92}
          metalness={isRaining ? 0.25 : 0.02}
        />
      </mesh>
      {/* Rim ring */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[7.3, 0.08, 12, 64]} />
        <meshStandardMaterial color={0x6b4e30} roughness={0.82} />
      </mesh>

      {/* ── Trees with Wind Sway ── */}
      {[
        [-4.8, -2.2, 1.0],
        [-5.4, 0.6, 0.82],
        [5.1, -1.6, 1.12],
        [5.6, 1.4, 0.92],
        [-4.2, 3.0, 0.72],
        [4.4, 3.4, 0.82],
      ].map(([x, z, s], i) => (
        <Tree
          key={i}
          ref={(el) => {
            if (el) treeRefs.current[i] = el;
          }}
          x={x}
          z={z}
          scale={s}
        />
      ))}

      {/* ── Small House Diorama ── */}
      <group position={[-3.6, 0, -3.4]} scale={[1.15, 1.15, 1.15]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[1.1, 0.8, 0.9]} />
          <meshStandardMaterial color={0xc9b08c} roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.05, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[0.85, 0.55, 4]} />
          <meshStandardMaterial color={0x8a5a42} roughness={0.86} />
        </mesh>
        {/* Glowing window */}
        <mesh position={[0, 0.45, 0.46]}>
          <planeGeometry args={[0.18, 0.18]} />
          <meshStandardMaterial
            color={0xffd79a}
            emissive={new THREE.Color(0xffb877)}
            emissiveIntensity={isNight || timeOfDay === 'night' || timeOfDay === 'dusk' ? 1.4 : 0.3}
          />
        </mesh>
      </group>

      {/* ── Dynamic Sun / Moon Celestial Disc ── */}
      <mesh position={celestialProps.pos}>
        <circleGeometry args={[celestialProps.size, 32]} />
        <meshBasicMaterial color={celestialProps.color} />
      </mesh>

      {/* ── Stars (visible during clear night, dusk, and dawn) ── */}
      {(isNight || timeOfDay === 'night' || timeOfDay === 'dusk') &&
        Array.from({ length: 60 }, (_, i) => {
          const a = Math.random() * Math.PI * 2;
          const r = 5 + Math.random() * 8;
          return (
            <mesh key={i} position={[Math.cos(a) * r, 5 + Math.random() * 4, Math.sin(a) * r - 6]}>
              <sphereGeometry args={[0.02 + Math.random() * 0.025, 4, 4]} />
              <meshBasicMaterial color={0xfff6e0} />
            </mesh>
          );
        })}

      {/* ── Fireflies ── */}
      {fireflyData.map((d, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) fireflyRefs.current[i] = el;
          }}
          position={[d.baseX, d.baseY, d.baseZ]}
        >
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshBasicMaterial color={0xffe6a8} transparent opacity={0} />
        </mesh>
      ))}

      {/* ── Warm Lantern ── */}
      <group position={[-2.6, 0, 1.4]}>
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.32, 10, 1, true]} />
          <meshStandardMaterial color={0x8a6a45} roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <coneGeometry args={[0.16, 0.12, 10]} />
          <meshStandardMaterial color={0x6b4e30} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.13, 0]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial
            color={0xffd79a}
            emissive={new THREE.Color(0xffb877)}
            emissiveIntensity={isNight || timeOfDay === 'night' || timeOfDay === 'dusk' ? 1.5 : 0.4}
          />
        </mesh>
        <pointLight
          color={0xffb877}
          intensity={isNight || timeOfDay === 'night' || timeOfDay === 'dusk' ? 1.1 : 0.2}
          distance={6}
          decay={2}
          position={[0, 0.13, 0]}
        />
      </group>
    </group>
  );
}

import React from 'react';

const Tree = React.forwardRef<THREE.Group, { x: number; z: number; scale: number }>(
  ({ x, z, scale }, ref) => {
    return (
      <group ref={ref} position={[x, 0, z]} scale={[scale, scale, scale]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.09, 0.6, 8]} />
          <meshStandardMaterial color={0x5c4530} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.85, 0]} castShadow>
          <coneGeometry args={[0.44, 0.78, 10]} />
          <meshStandardMaterial color={0x93a484} roughness={0.86} />
        </mesh>
        <mesh position={[0, 1.28, 0]} castShadow>
          <coneGeometry args={[0.33, 0.62, 10]} />
          <meshStandardMaterial color={0x93a484} roughness={0.86} />
        </mesh>
      </group>
    );
  }
);
Tree.displayName = 'Tree';
