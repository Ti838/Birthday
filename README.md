# ✨ Interactive 3D Birthday Celebration & Keepsake Web Experience

A high-performance, cinematic **3D Interactive Birthday Web Application** built with **React**, **Three.js / React Three Fiber**, **TypeScript**, and the **Web Audio API**.

Designed to deliver an unforgettable, immersive celebration experience featuring interactive 3D elements, mini-games, organic realistic flower garden, polyphonic music box melodies, customizable personal letter, and realistic cascading fireworks.

---

## 🌟 Key Features

- 🌌 **Cinematic 3D Interactive Stages**:
  - 🎁 **Stage 1: The Magic Gift Box** – Glowing 3D gift box with interactive ribbon untying and particle burst.
  - ✉️ **Stage 2: Personal Parchment Letter** – Elegant single-column luxury letter with smooth scrolling.
  - ✨ **Stage 3: Celestial Constellations** – Interactive star-linking cosmic map with glowing zodiac lines.
  - 🎈 **Stage 4: Balloon Pop Fiesta** – Floating 3D helium balloons with pop physics and surprise messages.
  - 🌟 **Stage 5: Star Catcher Mini-Game** – Interactive star collection game with live score tracker and sound effects.
  - 🌸 **Stage 6: Realistic Blooming Flower Garden** – Curved organic multi-tier velvet petals in a refractive crystal glass vase.
  - 🎂 **Stage 7: Birthday Cake & Candle Blowout** – Artisanal 3D birthday cake with realistic flickering candlelight and blow-out physics.
  - 🎆 **Stage 8: Grand Fireworks Spectacle** – Cascading golden willow fireworks with dynamic 3D lighting, gravity physics, and spatial audio.
  - 📜 **Stage 9: Final Keepsake Memory Card** – Heartfelt celebratory sign-off with golden seal.

- 🎵 **Polyphonic Web Audio Synthesizer**:
  - Harmonized F-Major "Happy Birthday to You" orchestral celesta/music-box score.
  - Launch whoosh, resonant bass boom, and glitter crackle for fireworks.
  - Zero external MP3 download dependencies — 100% synthesized natively in the browser.

- 🔐 **Dual-Mode Access System**:
  - **Public Guest Showcase**: Anyone can view the 3D world, cake, balloons, fireworks, and music.
  - **VIP Celebrant Mode**: Dedicated mode for the birthday person with personal letter & gifts, unlocked via passcodes or URL query parameter (`?pass=tithi` or `?vip=true`).

- 📱 **Universal Responsive Support**:
  - Optimized for iOS, Android, Tablets, and Desktop screens.
  - Smooth 60fps WebGL rendering with mobile touch interaction and gyro parallax.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI components, state coordination, and overlays |
| **Three.js** | 3D rendering engine and WebGL shaders |
| **@react-three/fiber** | Declarative Three.js scene graph for React |
| **@react-three/drei** | 3D helpers, lighting presets, and controls |
| **Zustand** | Centralized reactive stage & game state management |
| **TypeScript** | Type-safe architecture and interfaces |
| **Vite** | Ultra-fast bundling, HMR, and build pipeline |
| **Canvas Confetti** | Multi-directional celebratory particle bursts |

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or higher recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/) / [yarn](https://yarnpkg.com/)

### 1. Clone the repository
```bash
git clone https://github.com/Ti838/Birthday.git
cd Birthday
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start local development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the project.

### 4. Build for production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

### 5. Preview production build locally
```bash
npm run preview
```

---

## 🎨 How to Customize for Any Birthday

This project is built to be easily customizable for anyone's birthday in minutes:

### 1. Change the Celebrant's Name & Birthday Date
Open `src/utils/constants.ts` and edit:
```typescript
export const CELEBRANT_NAME = 'Your Friend Name';
export const TARGET_BIRTHDAY = new Date('2026-09-18T00:00:00');
```

### 2. Change the Personal Letter & Wishes
Open `src/components/letter/LetterOverlay.tsx` to customize the letter content, compliments, and signature:
```typescript
// Customize your heartfelt message in LetterOverlay.tsx
```

### 3. Change VIP Passcodes
Open `src/store/useStoryStore.ts` and update the accepted passcode list:
```typescript
const VALID_PASSCODES = ['1809', 'friendname', 'secretcode'];
```

### 4. Modify Page Title & Icon
Open `index.html` to update the browser tab title:
```html
<title>For Your Friend</title>
```
Replace `public/favicon.svg` with your own custom vector badge or icon.

---

## ☁️ Deployment

### Deploy to Vercel (Recommended)
The repository includes a ready-to-use `vercel.json` with SPA rewrites and asset caching.

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Deploy:
   ```bash
   vercel --prod
   ```
Or simply connect your GitHub repository directly on [Vercel Dashboard](https://vercel.com/new).

### Deploy to Netlify / GitHub Pages
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- Set single-page rewrite redirect rule to route `/*` to `/index.html`.

---

## 📁 Project Directory Structure

```text
Birthday/
├── public/                  # Static assets & favicon
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/          # React UI Overlays & 2D HUDs
│   │   ├── letter/          # LetterOverlay & parchment styling
│   │   ├── ui/              # Countdown, StarChallenge, Garden, Cake overlays
│   │   └── Experience.tsx   # Core 3D canvas and lighting coordinator
│   ├── hooks/               # Custom React hooks (audio, responsive, parallax)
│   ├── store/               # Zustand global stage & story state
│   ├── styles/              # Global CSS & typography rules
│   ├── three/               # Three.js 3D Components
│   │   ├── Cake.tsx         # 3D Birthday Cake & Candles
│   │   ├── Flowers.tsx      # Realistic blooming bouquet & glass vase
│   │   ├── Balloons.tsx     # 3D floating interactive balloons
│   │   ├── Fireworks.tsx    # Realistic cascading fireworks particles
│   │   ├── GiftBox.tsx      # Interactive 3D Gift Box
│   │   └── Envelope.tsx     # 3D Royal Letter Envelope
│   ├── utils/               # Audio synthesizers, constants, sound triggers
│   ├── App.tsx              # Root app component
│   └── main.tsx             # React DOM entry point
├── index.html               # Web entrance & Google Fonts
├── vercel.json              # Vercel SPA configuration
├── package.json             # Project dependencies & scripts
└── tsconfig.json            # TypeScript configuration
```

---

## 📄 License & Acknowledgements

Created with ❤️ by **Timon**.  
Feel free to fork, adapt, and use this template to celebrate birthdays with friends and loved ones!
