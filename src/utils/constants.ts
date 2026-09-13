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

// ─── Exact Birthday Letter Content (Stage 04) ────────────────────
export const SIGNATURE_NAME = 'Timon ✦';

export const LETTER_PAGES = [
  // Page 1
  [
    { type: 'greeting', text: 'Dear Tithi (a.k.a. Doraemon ✦),' },
    { type: 'title_tag', text: 'Happy Birthday! ✦' },
    {
      type: 'para',
      lines: [
        'Today is entirely your day, so first things first — Happy Birthday!',
        'Another year unlocked, another level achieved, and without a doubt, equipped with even more chaotic energy and brilliant ideas.',
      ],
    },
    {
      type: 'highlight',
      lines: ['A true real-life Doraemon. ✦'],
    },
    {
      type: 'para',
      lines: [
        'I still find it hilarious how well the nickname "Doraemon" fits you. Maybe you don’t pull bamboo-copters or anywhere doors out of a 4D pocket, but you certainly have an uncanny magic of bringing spontaneous smiles, wild enthusiasm, and warmth wherever you go.',
      ],
    },
    {
      type: 'checklist',
      items: [
        'Master of unexpected solutions.',
        'Spreader of endless contagious laughter.',
        'Guardian of chaotic yet brilliant plans.',
        'And officially another year more awesome.',
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
        "Birthdays are basically life’s favorite checkpoint.",
        'A moment to pause the endless to-do lists, silence all the deadlines, put away the overthinking, and just soak in being celebrated.',
      ],
    },
    {
      type: 'checklist',
      items: [
        'Eat something truly delicious (zero guilt today).',
        'Laugh until your stomach hurts.',
        'Take way too many aesthetic pictures.',
        'Make a secret, audacious birthday wish.',
        'And enjoy every second of being the star today.',
      ],
    },
    {
      type: 'highlight',
      lines: ['Happy Birthday once again, Doraemon! ✦'],
    },
    {
      type: 'divider',
    },
    {
      type: 'closing_para',
      lines: [
        'As you step into this exciting new chapter, I hope this year brings you:',
        'unshakeable peace of mind, boundless joy, radiant health, exciting adventures, and fewer "I should have started earlier" moments.',
        'May life gift you countless little moments where you pause, smile, and think:',
        '"Yep, this is going to be a legendary year."',
      ],
    },
    {
      type: 'closing',
      text: 'Have the brightest & happiest birthday!',
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
