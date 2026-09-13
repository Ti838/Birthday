<div align="center">
  <h1>Immersive 3D WebGL Showcase</h1>
  <p>A highly optimized, cinematic 3D storytelling experience built with React Three Fiber.</p>

  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
</div>

<br />

## 📖 Overview

This project is a sophisticated **3D WebGL single-page application** initially designed as a highly personalized, interactive birthday celebration, now structured as a template for high-end digital experiences, interactive storytelling, and creative portfolio showcases. It blends advanced 3D rendering, real-time API integrations, and cinematic camera choreography into a seamless, highly optimized environment.

## ✨ Core Systems & Architecture

- **🎬 Cinematic State Machine:** A dual-state routing system featuring an open "Guest Showcase" and an authenticated "Premium Mode". Mode transitions trigger sweeping, GSAP-powered cinematic camera drops that seamlessly re-orient the 3D world.
- **⛅ Dynamic Atmosphere Engine:** Integrates with real-world weather data to dynamically adjust the 3D environment's lighting (dawn, day, sunset, night), fog density, cloud coverage, and injects real-time CSS variables to sync the UI glassmorphism with the 3D canvas.
- **🎥 Advanced Camera Choreography:** Utilizes custom GSAP tweening logic coupled with `@react-three/drei`'s `OrbitControls` to smoothly interpolate the camera between different spatial zones, ensuring perfect framing across both mobile and desktop viewports.
- **🎮 Interactive Sub-Systems:**
  - **Procedural Flora:** Clickable, animated geometry that responds to raycasted interactions.
  - **Physics Particles:** GPU-accelerated particle systems for fireworks and explosions with gravity and drag mechanics.
  - **Spatial Audio:** Event-driven audio engine managed via Howler.js for seamless UI and 3D soundscapes.
- **📱 Ultra-Responsive Glassmorphism UI:** Built with Framer Motion, CSS Modules, and CSS variables synced to the 3D time-of-day for a consistent, premium aesthetic across all devices.

## 🛠️ Tech Stack

| Category | Technology |
| --- | --- |
| **Core Framework** | React 18, TypeScript, Vite |
| **3D Rendering** | Three.js, `@react-three/fiber`, `@react-three/drei` |
| **Animations** | GSAP (Camera Tweens), Framer Motion (UI Transitions) |
| **State Management**| Zustand (Global Story & Weather State) |
| **Audio Engine** | Howler.js (Background music, SFX) |
| **Styling** | CSS Modules (Glassmorphism, Responsive `clamp()`) |
| **Linting** | Oxlint, ESLint |

## ⚡ Performance & GPU Optimizations

Built with a strict focus on maintaining 60 FPS across mobile and desktop devices:

- **Strict Memory Management:** Aggressive manual garbage collection and `dispose()` calls on all temporary particle geometries and materials to prevent WebGL GPU memory leaks.
- **Instance Meshes:** Extensive use of Three.js instancing (`InstancedMesh`) for heavy environmental elements like fireflies and particles to drastically reduce WebGL draw calls.
- **Adaptive FOV & Positioning:** Automatically scales device pixel ratio (DPR) and adjusts camera vectors dynamically based on device capabilities and aspect ratio.
- **Optimized Lighting:** Capped shadow maps, custom canvas textures for organic gradients, and highly performant Tone Mapping (ACESFilmic).

## 🚀 Local Development

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18+) installed.

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ti838/Birthday.git
   cd tithi-gift-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## 📦 Build & Deployment

To create a production-ready optimized build:

```bash
npm run build
```

This architecture is pre-configured with a `vercel.json` file for zero-config deployment on **Vercel**, including fallback routing for SPAs and aggressive cache headers for immutable static assets.

## 📂 Project Structure

```text
src/
├── components/
│   ├── ui/                 # React UI Overlays (Glassmorphism, Menus)
│   ├── Experience.tsx      # Core R3F Canvas and Stage Router
│   ├── ThemeSync.tsx       # Bridges 3D Weather state to DOM CSS Variables
│   └── ...
├── three/                  # 3D Scene Components (Models, Particles)
│   ├── Flowers.tsx         # Flora logic & meshes
│   ├── Fireworks.tsx       # Physics-based Particle Engine
│   └── ...
├── store/
│   └── useStoryStore.ts    # Zustand Global State
├── utils/
│   ├── music.ts            # Howler.js Audio Controllers
│   ├── textures.ts         # Procedural Canvas Textures
│   └── constants.ts        # Configs
└── services/               # API integratons (Live Weather fetcher)
```

## 📝 License

Designed and developed with 🩵 by Timon.
