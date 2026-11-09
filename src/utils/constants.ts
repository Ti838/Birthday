// ─── Color Palettes ──────────────────────────────────────────────
export const PALETTE = {
  day: {
    sky:          '#0d1124',
    fog:          '#141a36',
    ambient:      '#ffe5a4',
    ambientI:     0.85,
    sun:          '#fff3dd',
    sunI:         1.1,
    ground:       '#1b1e32',
    giftBody:     '#fbf9f5',
    ribbon:       '#f2b5a5',
  },
  night: {
    sky:          '#070913',
    fog:          '#0e1225',
    ambient:      '#8fa5d8',
    ambientI:     0.75,
    sun:          '#ffe5a4',
    sunI:         0.85,
    ground:       '#161a2e',
    giftBody:     '#fbf9f5',
    ribbon:       '#f2b5a5',
  },
} as const;

export const CONSTELLATION_STARS = [
  { id: 'happiness', name: 'Joy & Light', subtitle: 'Warmth in every step', type: 'joy' },
  { id: 'adventure', name: 'Adventure', subtitle: 'Journeys full of wonder', type: 'compass' },
  { id: 'success',   name: 'Ambition', subtitle: 'Reaching new heights', type: 'zenith' },
  { id: 'laughter',  name: 'Laughter', subtitle: 'Moments of pure smile', type: 'bloom' },
  { id: 'memories',  name: 'Keepsakes', subtitle: 'Treasures of time', type: 'prism' },
] as const;

// ─── Five Tactile Birthday Balloons (Stage 06) ───────────────────
export const BALLOONS_DATA = [
  { color: '#FFF8EB', accent: '#E8C872', wish: 'MORE REASONS TO SMILE. ✦' },
  { color: '#F2B5A5', accent: '#DE7B90', wish: 'MORE ADVENTURES. ✦' },
  { color: '#9AA58F', accent: '#7A886F', wish: 'MORE DELICIOUS DAYS. ✦' },
  { color: '#C5B4E3', accent: '#9D86C7', wish: 'MORE MEMORIES WORTH KEEPING. ✦' },
  { color: '#FFE5A4', accent: '#D4AF37', wish: 'AND A REALLY GOOD YEAR. ✦' },
] as const;

export const BALLOON_WISHES = BALLOONS_DATA.map((b) => b.wish);

// ─── Secret Garden Flowers (Stage 08) ────────────────────────────
export const GARDEN_FLOWERS = [
  { id: 0, advice: 'Stay curious.', color: '#F2B5A5', name: 'Blush Camellia' },
  { id: 1, advice: 'Keep learning.', color: '#FFE5A4', name: 'Golden Marigold' },
  { id: 2, advice: 'Keep laughing.', color: '#C5B4E3', name: 'Lavender Aster' },
  { id: 3, advice: 'Try new things.', color: '#9AA58F', name: 'Sage Blossom' },
  { id: 4, advice: 'Enjoy the little things.', color: '#FFF8EB', name: 'Starlight Daisy' },
] as const;

// ─── Smoke to Stars Wishes (Stage 11) ─────────────────────────────
export const FLOATING_STAR_WISHES = [
  'HAPPINESS',
  'SUCCESS',
  'GOOD HEALTH',
  'ADVENTURE',
  'GOOD MEMORIES',
] as const;

// ─── Handcrafted Creator's Letter & Journal Note (Stage 04) ────────────────────
export const SIGNATURE_NAME = 'Timon ✦';

export const LETTER_PAGES = [
  // Page 1
  [
    { type: 'greeting', text: 'Dear Dreamer & Explorer,' },
    { type: 'title_tag', text: 'Welcome to the Celestial World ✨' },
    {
      type: 'para',
      lines: [
        'Welcome to this interactive space. This 3D world was crafted as an exploration of digital art, light, and atmosphere — a quiet corner of the web to pause, reflect, and experience wonder.',
        'In a world that often moves too fast, this project is an invitation to slow down, gaze at the starlight, and appreciate the craftsmanship in subtle details.',
      ],
    },
    {
      type: 'highlight',
      lines: ['A journey of curiosity, light, and boundless imagination. ✦'],
    },
    {
      type: 'para',
      lines: [
        'Every element you encounter here — from the procedural botanical flora and ambient weather system to the physics particle fireworks and interactive constellation — was built with deliberate care and passion for creative engineering.',
      ],
    },
    {
      type: 'checklist',
      items: [
        'Stay curious and embrace spontaneous adventures.',
        'Find wonder in code, design, and creative expression.',
        'Build things with genuine passion and attention to detail.',
        'And always celebrate the milestones along your journey.',
      ],
    },
  ],
  // Page 2
  [
    {
      type: 'divider',
    },
    {
      type: 'para',
      lines: [
        "Interactive experiences are a gentle reminder of the magic that happens when art and technology meet.",
        'So take your time, explore every corner, and let yourself enjoy the atmosphere.',
      ],
    },
    {
      type: 'checklist',
      items: [
        'Pause to appreciate the craft in everyday things.',
        'Dare to dream audaciously and build what inspires you.',
        'Capture memories that bring warmth to your heart.',
        'Never lose your sense of childlike curiosity and wonder.',
        'And enjoy every single heartbeat of this journey.',
      ],
    },
    {
      type: 'highlight',
      lines: ['May all your aspirations find their way into reality. ✦'],
    },
    {
      type: 'divider',
    },
    {
      type: 'closing_para',
      lines: [
        'As you explore the different scenes in this world — the blooming secret garden, the constellation sky, and the midnight celebration — I hope you feel a spark of inspiration and quiet joy.',
        'May your journey ahead be filled with vibrant health, exciting milestones, meaningful connections, and days of quiet happiness.',
        'May life surprise you with moments so special that you stop and smile:',
        '"Yep, this is truly a wonderful chapter."',
      ],
    },
    {
      type: 'closing',
      text: 'Thank you for exploring this world!',
    },
    {
      type: 'signature',
      author: 'Timon ✦',
    },
  ],
] as const;

// Single flat array of sections for desktop scroll / open-letter view
export const LETTER_SECTIONS = [
  ...LETTER_PAGES[0],
  ...LETTER_PAGES[1],
];
