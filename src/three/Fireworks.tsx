import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { playFireworkSound } from '../utils/music';

interface Particle {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  life: number;
  maxLife: number;
  gravity: number;
  drag: number;
  twinkleSpeed: number;
}

const FIREWORK_PALETTES = [
  ['#FFE5A4', '#FFF8EB', '#E8C872'], // Royal Champagne Gold
  ['#FF85A2', '#FFB7B2', '#FFFFFF'], // Sakura & Rose Blush
  ['#85E3FF', '#B5E2FA', '#FFFFFF'], // Celestial Sapphire
  ['#D8B4E2', '#FAD2E1', '#FFE5A4'], // Amethyst & Starlight
  ['#FF6B6B', '#FFE66D', '#FFFFFF'], // Amber Flame & Gold
] as const;

interface FireworksProps {
  active: boolean;
}

export function Fireworks({ active }: FireworksProps) {
  const { scene } = useThree();
  const particles = useRef<Particle[]>([]);
  const flashLightRef = useRef<THREE.PointLight | null>(null);
  const nextLaunchTime = useRef(0);

  // Setup dynamic fireworks flash light
  useEffect(() => {
    const light = new THREE.PointLight(0xFFE5A4, 0, 18);
    light.position.set(0, 4.5, -2.0);
    scene.add(light);
    flashLightRef.current = light;

    return () => {
      scene.remove(light);
    };
  }, [scene]);

  function spawnBurst(origin: THREE.Vector3, palette: readonly string[]) {
    playFireworkSound();

    // 1. Dynamic light flash in 3D world
    if (flashLightRef.current) {
      flashLightRef.current.position.copy(origin);
      flashLightRef.current.color = new THREE.Color(palette[0]);
      flashLightRef.current.intensity = 2.8;
    }

    // 2. Central Core Flash Mesh
    const flashMat = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
    });
    const flashMesh = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 10), flashMat);
    flashMesh.position.copy(origin);
    scene.add(flashMesh);
    particles.current.push({
      mesh: flashMesh,
      vel: new THREE.Vector3(0, 0, 0),
      life: 0,
      maxLife: 0.18,
      gravity: 0,
      drag: 0.96,
      twinkleSpeed: 0,
    });

    // 3. Multi-Spherical Willow Sparkler Cascade
    const count = 96;
    for (let i = 0; i < count; i++) {
      const colorStr = palette[i % palette.length];
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(colorStr),
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
      });

      const size = 0.045 + Math.random() * 0.035;
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(size, 6, 6), mat);
      mesh.position.copy(origin);
      scene.add(mesh);

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 2.8 + Math.random() * 4.2;

      const vel = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * speed,
        Math.cos(phi) * speed + 0.8,
        Math.sin(phi) * Math.sin(theta) * speed
      );

      particles.current.push({
        mesh,
        vel,
        life: 0,
        maxLife: 2.2 + Math.random() * 1.0,
        gravity: -1.6, // Realistic gravity fall
        drag: 0.962,   // Air resistance
        twinkleSpeed: 18 + Math.random() * 20,
      });
    }
  }

  useFrame((_, delta) => {
    // Dim flash light smoothly
    if (flashLightRef.current && flashLightRef.current.intensity > 0) {
      flashLightRef.current.intensity = Math.max(0, flashLightRef.current.intensity - delta * 3.5);
    }

    if (!active) return;

    // Continuous grand fireworks launches
    nextLaunchTime.current -= delta;
    if (nextLaunchTime.current <= 0) {
      nextLaunchTime.current = 0.4 + Math.random() * 0.55;

      const x = (Math.random() - 0.5) * 8.0 + 0.6;
      const y = 3.2 + Math.random() * 3.6;
      const z = -2.0 - Math.random() * 4.0;

      const palette = FIREWORK_PALETTES[Math.floor(Math.random() * FIREWORK_PALETTES.length)];
      spawnBurst(new THREE.Vector3(x, y, z), palette);
    }

    // Update particles physics & cascading willow glitter
    for (let i = particles.current.length - 1; i >= 0; i--) {
      const p = particles.current[i];
      p.life += delta;
      const t = p.life / p.maxLife;

      p.vel.y += p.gravity * delta;
      p.vel.multiplyScalar(p.drag);
      p.mesh.position.addScaledVector(p.vel, delta);

      const mat = p.mesh.material as THREE.MeshBasicMaterial;
      const sparkle = p.twinkleSpeed > 0 ? Math.sin(p.life * p.twinkleSpeed) * 0.2 : 0;
      mat.opacity = Math.max(0, (1 - Math.pow(t, 1.4)) + sparkle);
      p.mesh.scale.setScalar(Math.max(0.08, (1 - t * 0.4)));

      if (t >= 1) {
        scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        mat.dispose();
        particles.current.splice(i, 1);
      }
    }
  });

  // Cleanup on unmount or when inactive
  useEffect(() => {
    return () => {
      particles.current.forEach((p) => {
        scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        (p.mesh.material as THREE.Material).dispose();
      });
      particles.current = [];
    };
  }, [scene]);

  return null;
}
