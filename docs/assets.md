# Asset Documentation & Open-Source Licenses

This document tracks all 3D asset specifications, open-source references, and texture standards used in the **Tithi Birthday Secret Garden & Miniature World Experience**.

## Asset Index & Licenses

| Asset / Element | Source / Reference | Standard / License | Where Used | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Botanical Flora & Petal Textures** | 3DAssets.dev / Procedural PBR | CC0 Public Domain | `src/three/Flowers.tsx` | Velvet micro-vein petals for Camellia, Marigold, Aster, Sage Blossom, Starlight Daisy |
| **Miniature Garden Planter & Moss** | Poly Haven Reference | CC0 Public Domain | `src/three/Flowers.tsx` | Stone pedestal planter, rich earth soil, and velvet moss diorama mound |
| **Cobblestone Garden Pathway** | Poly Haven (Cobblestone/Stone Path) | CC0 Public Domain | `src/three/Flowers.tsx` | Curved stepping stones connecting main world to the Secret Garden |
| **Garden Lanterns & Arch Gate** | Procedural Architectural Diorama | CC0 Public Domain | `src/three/Flowers.tsx` | Miniature wrought-stone arch with warm starlight lantern glow |
| **Firefly Guidance System** | Procedural R3F Shader & Points | MIT / Project Built-in | `src/three/Flowers.tsx` | Autonomous starlight guide firefly with dynamic particle trail |
| **Doraemon Miniature Easter Egg** | Custom Handcrafted 3D Mesh | CC0 Public Domain | `src/three/Flowers.tsx` | Miniature decorative blue bell charm tucked in mossy rocks |
| **Wood Grain & Marble Textures** | Procedural Canvas PBR | CC0 Public Domain | `src/utils/textures.ts` | Ground disk, birthday table, and writing desk surfaces |
| **Sound Effects & Chimes** | Web Audio API Synthetic Chimes | MIT / Project Built-in | `src/utils/music.ts` | Flower bloom chime, lantern illumination, wind breeze |

## Design Consistency Standards
- **Scale:** Miniature diorama scale (1 unit = ~0.8m world scale).
- **Lighting Language:** Real scene lighting with ACESFilmic tone mapping, warm key lights, and night ambient skylight.
- **Color Palette:** Midnight Indigo (`#0d1124`), Champagne Gold (`#FFE5A4`), Dusty Rose (`#F2B5A5`), Muted Sage (`#7BB886`), Royal Lavender (`#9B80D9`), Ivory Cream (`#FFFDF8`).
