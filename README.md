<div align="center">
  <h1>✨ Tithi's Cosmic Birthday Experience</h1>
  <p>An ultra-premium, interactive 3D WebGL journey built with React Three Fiber.</p>
  <h1>🌌 Immersive 3D WebGL Showcase</h1>
  <p>A highly optimized, cinematic 3D experience built with React Three Fiber.</p>

  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</div>

<br />

## 📖 Overview

This project is a highly personalized, interactive **3D WebGL birthday celebration** designed to feel like a premium, cinematic experience. It combines real-time weather synchronization, dynamic 3D lighting, complex camera animations, and interactive mini-games (balloon popping, secret gardens, star collecting) into a seamless, single-page application.
This project is a sophisticated **3D WebGL single-page application** designed as a template for high-end digital experiences, interactive storytelling, and creative portfolio showcases. It blends advanced 3D rendering, real-time API integrations, and cinematic camera choreography into a seamless, highly optimized environment.

## 🚀 Key Features
## 🚀 Core Systems & Architecture

- **🎭 Cinematic VIP Flow:** A dual-state system featuring a "Guest Showcase" and a "VIP Unlock". Unlocking VIP triggers a sweeping 5-second cinematic sky-dive camera animation that seamlessly resets the world.
- **🌤️ Live Weather & Atmosphere Engine:** Fetches real-world weather data to dynamically adjust the 3D environment's time of day (dawn, day, sunset, night), fog density, cloud coverage, and global CSS UI themes.
- **🎥 Advanced Camera Choreography:** Powered by GSAP and custom tweening logic to smoothly interpolate the camera between different points of interest (the Cake, the Letter, the Garden) with responsive mobile/desktop framing.
- **✨ Interactive 3D Elements:**
  - **The Secret Garden:** Clickable, blooming flowers with custom audio cues and advice quotes.
  - **Confetti & Fireworks:** GPU-accelerated particle systems with gravity, drag, and optimized memory management.
  - **Balloon Pop:** Interactive physical balloons that burst into particles.
- **📱 Ultra-Responsive Glassmorphism UI:** Built with Framer Motion, CSS Modules, and CSS variables synced to the 3D time-of-day for a consistent Apple-like aesthetic across all devices.
- **🎭 Cinematic State Machine:** A dual-state routing system featuring an open "Guest Showcase" and an authenticated "Premium Mode". Mode transitions trigger sweeping, GSAP-powered cinematic camera drops that seamlessly re-orient the 3D world.
- **🌤️ Dynamic Atmosphere Engine:** Integrates with real-world weather data to dynamically adjust the 3D environment's lighting (dawn, day, sunset, night), fog density, cloud coverage, and injects real-time CSS variables to sync the UI glassmorphism with the 3D canvas.
- **🎥 Advanced Camera Choreography:** Utilizes custom GSAP tweening logic to smoothly interpolate the camera between different spatial zones, ensuring perfect framing across both mobile and desktop viewports.
- **✨ Interactive Sub-Systems:**
  - **Procedural Flora:** Clickable, animated geometry that responds to raycasted interactions.
  - **Physics Particles:** GPU-accelerated particle systems for fireworks and explosions with gravity and drag mechanics.
  - **Spatial Audio:** Event-driven audio engine managed via Howler.js for seamless UI/3D soundscapes.

## 🛠️ Tech Stack

| Category | Technology |
| --- | --- |
| **Core Framework** | React 18, TypeScript, Vite |
| **3D Rendering** | Three.js, `@react-three/fiber`, `@react-three/drei` |
| **Animations** | GSAP (Camera Tweens), Framer Motion (UI Transitions) |
| **State Management**| Zustand (Global Story & Weather State) |
| **Audio Engine** | Howler.js (Background music, SFX, spatial cues) |
| **Audio Engine** | Howler.js (Background music, SFX) |
| **Styling** | CSS Modules (Glassmorphism, Responsive `clamp()`) |
| **Linting** | Oxlint, ESLint |

## 🏎️ Performance & GPU Optimizations

- **Memory Leak Prevention:** Strict `dispose()` calls on all temporary particle geometries and materials during explosions (Fireworks, Balloons).
- **Instance Meshes:** Extensive use of Three.js instancing for heavy elements like grass blades and fireflies to reduce draw calls to `1`.
- **Adaptive DPR:** Automatically scales device pixel ratio (DPR) to maintain 60 FPS on lower-end mobile devices.
- **Lazy Lighting:** Shadows and intensive calculations are bounded, with Tone Mapping (ACESFilmic) optimized for WebGL.
Built with a strict focus on maintaining 60 FPS across mobile and desktop devices:

- **Strict Memory Management:** Aggressive manual garbage collection and `dispose()` calls on all temporary particle geometries and materials to prevent WebGL GPU memory leaks.
- **Instance Meshes:** Extensive use of Three.js instancing (`InstancedMesh`) for heavy environmental elements to drastically reduce WebGL draw calls.
- **Adaptive DPR:** Automatically scales device pixel ratio (DPR) dynamically based on device capabilities.
- **Optimized Lighting:** Capped shadow maps, baked lighting fallbacks where appropriate, and highly performant Tone Mapping (ACESFilmic).

## 💻 Local Development

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) installed.
Ensure you have [Node.js](https://nodejs.org/) (v18+) installed.

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ti838/Birthday.git
   cd tithi-gift-react
   git clone <your-repo-url>
   cd immersive-webgl-showcase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.
   The application will be available at `http://localhost:5173`.

## 🏗️ Build & Deployment

To create a production-ready optimized build:

```bash
npm run build
```

This project is configured with a `vercel.json` file for zero-config deployment on **Vercel**. It includes rules for SPA routing fallbacks and aggressive caching for immutable static assets.
This architecture is pre-configured with a `vercel.json` file for zero-config deployment on **Vercel**, including fallback routing for SPAs and aggressive cache headers for immutable static assets.

## 📁 Project Architecture
## 📁 Project Structure

```text
src/
├── components/
│   ├── ui/                 # React UI Overlays (Glassmorphism, Menus)
│   ├── Experience.tsx      # Core R3F Canvas and Stage Router
│   ├── ThemeSync.tsx       # Bridges 3D Weather state to DOM CSS Variables
│   └── ...
├── three/                  # 3D Scene Components (Models, Particles)
│   ├── Flowers.tsx         # The Secret Garden
│   ├── Fireworks.tsx       # Particle Engine
│   ├── Flowers.tsx         # Flora logic & meshes
│   ├── Fireworks.tsx       # Physics-based Particle Engine
│   └── ...
├── store/
│   └── useStoryStore.ts    # Zustand Global State (Stages, Unlockables)
│   └── useStoryStore.ts    # Zustand Global State
├── utils/
│   ├── music.ts            # Howler.js Audio Controllers
│   ├── textures.ts         # Procedural Canvas Textures (Noise, Gradients)
│   └── constants.ts        # Story Text, Colors, Configurations
│   └── textures.ts         # Procedural Canvas Textures
└── services/               # API integratons (Live Weather fetcher)
```

## 📜 License

Designed and developed with ❤️ for Tithi.
All rights reserved.
MIT License. Free to use for personal and commercial projects.
