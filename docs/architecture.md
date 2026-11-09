# System Architecture & Technical Specifications

> **Project:** Celestial Diorama — 3D WebGL Interactive Showcase  
> **Author:** Timon  
> **Stack:** React 19, Three.js (r185), `@react-three/fiber` (v9), `@react-three/drei` (v10), Zustand (v5), GSAP (v3), Framer Motion (v13), TypeScript 6, Vite 8

---

## 1. High-Level Architectural Topology

The application is structured as a reactive, bidirectional bridge between a **Three.js WebGL Render Pipeline** and a **Framer Motion Glassmorphism DOM UI Layer**, unified under a centralized **Zustand State Engine**.

```mermaid
flowchart TD
  subgraph Client ["Client Browser Viewport"]
    subgraph DOM_UI ["Framer Motion Glassmorphism Layer (Z-Index: 100-999)"]
      Welcome["Welcome / Entrance Portal"]
      LetterUI["Creator Journal & Notes Modal"]
      ConstellationUI["Interactive Constellation Overlay"]
      StarGameUI["Star Catch Challenge HUD"]
      GardenUI["Secret Garden Bloom Dock"]
      WishUI["Candle Wish & Mic Detection"]
      ShowcaseHUD["Free Showcase Control Deck"]
      StatusDock["Top Controls & Atmosphere Monitor"]
    end

    subgraph StateBridge ["State Orchestration & Side-Effect Bus"]
      Store["Zustand State Store (Stage, Audio, Weather, Inventory)"]
      ThemeSync["ThemeSync Bridge (Injects CSS Custom Properties)"]
      WeatherAPI["Open-Meteo REST Client (10-min TTL Cache)"]
    end

    subgraph WebGL_Canvas ["R3F WebGL Canvas (Z-Index: 0)"]
      Renderer["Three.js ACESFilmic ToneMapped PCF Shadow Canvas"]
      CamEngine["GSAP Camera Choreography Controller"]
      Lighting["Dynamic 3-Point & Celestial Skylight Rig"]
      Atmosphere["WeatherSystem (Procedural Rain, Volumetric Clouds, Fog)"]
      ParticleEngine["Physics Particle Fireworks Emitter"]

      subgraph DioramaEntities ["Spatial Diorama Entities (Zero Clipping)"]
        CelestialBox["Celestial Mystery Box (Lid Tween & Silk Ribbon)"]
        Desk["Antique Writing Desk & 3D Envelope"]
        Balloons["Instanced Tactile Balloons (Buoyancy Oscillation)"]
        BotanicalGarden["Procedural Botanical Garden & Guide Firefly"]
        CakeMesh["Handcrafted Celebration Cake & Particle Candles"]
      end
    end

    subgraph AudioEngine ["Web Audio API Polyphonic Synthesizer"]
      AudioCtx["Web AudioContext (44.1 kHz / 48 kHz)"]
      MasterGain["Master Gain Node (0.95 Soft Knee)"]
      PolySynth["Polyphonic Music Box / Harpsichord Voice Bank"]
      SFXEngine["Procedural Synthesized SFX (Balloons, Booms, Chimes)"]
    end
  end

  Welcome --> Store
  ShowcaseHUD --> Store
  WeatherAPI --> Store
  Store --> ThemeSync
  ThemeSync --> DOM_UI
  Store --> CamEngine
  CamEngine --> Renderer
  Store --> AudioEngine
  DOM_UI -.->|Event Dispatch| DioramaEntities
```

---

## 2. Spatial Coordinate System & Zone Mapping

To avoid mesh collision, draw-order clipping, and camera occlusion, all 3D diorama entities are arranged along distinct polar and cartesian vectors on an elliptical diorama plinth:

| Zone | Entity | Position Vector $(x, y, z)$ | Camera Target $(lx, ly, lz)$ | Framing FOV |
| :--- | :--- | :--- | :--- | :--- |
| **Zone 0 (Origin)** | Diorama Base & Ambient Ground | `[0.0, 0.0, 0.0]` | `[0.0, 0.85, 0.0]` | 45° (Desktop) / 70° (Mobile) |
| **Zone 1 (Center-Front)** | Mystery Gift Box | `[-2.4, 0.2, 1.2]` | `[-2.4, 0.2, 1.2]` | 45° |
| **Zone 2 (Center)** | Antique Writing Desk & Letter | `[0.0, 0.42, 1.4]` | `[0.0, 0.42, 1.4]` | 42° |
| **Zone 3 (Right Wing)** | Five Tactile Floating Balloons | `[2.5, 0.8, -0.5]` | `[2.2, 1.55, 0.8]` | 48° |
| **Zone 4 (Left Wing)** | Secret Botanical Garden Mound | `[-2.2, 0.4, -1.4]` | `[-1.2, 0.4, -1.0]` | 45° |
| **Zone 5 (Center-Rear)**| Celebration Cake & Candles | `[0.0, 0.95, -0.4]` | `[0.0, 0.95, -0.4]` | 40° |
| **Zone 6 (Celestial)** | Fireworks & Sky Constellations | `[0.0, 2.8, -2.5]` | `[0.0, 2.8, -2.5]` | 55° |

---

## 3. Cinematic Stage State Machine

The guided experience follows an 11-stage finite state machine managed by Zustand:

```mermaid
stateDiagram-v2
  [*] --> 01_night: App Init & Weather Fetch
  
  01_night --> 01_intro_cinematic: User selects "Begin Story Journey"
  01_night --> guest_showcase: User selects "Explore Free Showcase"

  state "Guided Story Mode" as StoryMode {
    01_intro_cinematic --> 02_gift: Camera Plunge from [0, 18, 10]
    02_gift --> 03_world: Click Glowing Mystery Box
    03_world --> 04_letter: Camera sweeps to Writing Desk
    04_letter --> 05_constellation: Close Creator Journal
    05_constellation --> 06_balloons: Connect 5 Celestial Stars
    06_balloons --> 07_stargame: Pop Floating Balloons
    07_stargame --> 08_garden: Catch 10 Falling Stars
    08_garden --> 09_cake: Bloom 5 Botanical Species
    09_cake --> 10_wish: Focus onto Cake & Candles
    10_wish --> 12_fireworks: Extinguish Candles (Mic / Click)
    12_fireworks --> 13_hidden_surprise: Night Sky Particle Climax
    13_hidden_surprise --> 14_quiet_night: Journey Complete & Keepsake
    14_quiet_night --> 01_night: Replay Journey
  }

  state "Free Showcase Mode" as ShowcaseMode {
    guest_showcase --> QuickCam: Switch Camera Tabs
    guest_showcase --> AudioTrigger: Play Melodies
    guest_showcase --> ParticleBurst: Trigger Fireworks
    guest_showcase --> 01_intro_cinematic: Upgrade to Guided Story
  }
```

---

## 4. Audio-Visual Interaction Pipeline

Here is the exact runtime sequence of an interactive event, demonstrating the coordination between DOM event listeners, the Web Audio synthesis engine, and Three.js shader materials:

```mermaid
sequenceDiagram
  autonumber
  actor Visitor as User
  participant UI as CakeWishOverlay (DOM)
  participant Mic as Web Audio Analyser
  participant Canvas as 3D Cake Mesh (WebGL)
  participant Audio as Synthesizer Engine
  participant Store as Zustand Store

  Visitor->>UI: Blows into mic or clicks "Blow Candles"
  alt Audio Stream Listening
    Mic->>UI: Sustained volume energy > 52 across 5 frames
  else Touch / Click Fallback
    Visitor->>UI: Manual click trigger
  end
  UI->>Canvas: Dispatches custom window event "blowCandles"
  Canvas->>Canvas: GSAP tweens flame opacity to 0 and position to scale 0
  Canvas->>Canvas: Spawns rising volumetric smoke puffs with alpha decay
  UI->>Audio: playBlowSound() [Noise burst + Bandpass 400Hz]
  UI->>Audio: playChime(1.4) [Harmonic pentatonic bell]
  UI->>Store: makeWish()
  UI->>UI: Animates floating star wishes into DOM overlay
  UI->>Store: setStage("12_fireworks")
  Store->>Canvas: Activates physics GPU particle fireworks emitter
  Store->>Audio: playFireworksBoom() & playCelestialMelody()
```

---

## 5. WebGL Performance & Memory Management Standards

To guarantee 60 FPS across mobile (iOS WebKit, Android Blink) and desktop machines:

1. **Explicit Memory Disposal:**
   All dynamically allocated `THREE.BufferGeometry`, `THREE.Material`, and canvas-generated `THREE.CanvasTexture` instances register cleanup handlers during React unmount cycles:
   ```ts
   useEffect(() => {
     return () => {
       geometry.dispose();
       if (Array.isArray(material)) {
         material.forEach((m) => m.dispose());
       } else {
         material.dispose();
       }
       texture.dispose();
     };
   }, [geometry, material, texture]);
   ```

2. **Zero Large External Assets:**
   Instead of downloading megabytes of static `.gltf` or `.bin` meshes, 100% of geometries (flowers, cake tiers, table surfaces, lanterns, balloons) are procedurally constructed using primitive compositions (`CylinderGeometry`, `SphereGeometry`, `ExtrudeGeometry`) and procedurally drawn HTML Canvas textures.

3. **DPR & Tone Mapping Configuration:**
   - **DPR Scaling:** Capped at `[1, 1.5]` for mobile viewports, `[1, 2]` for desktop screens to prevent thermal throttling on high-density Retina displays.
   - **Tone Mapping:** `THREE.ACESFilmicToneMapping` with exposure tuned dynamically between `0.85` (night) and `1.15` (day) based on ambient solar elevation.

