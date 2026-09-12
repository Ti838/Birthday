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
  { color: '#9AA58F', accent: '#7A886F', wish: 'MORE GOOD FOOD. 🍰' },
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
    { type: 'greeting', text: 'Dear Tithi,' },
    { type: 'title_tag', text: 'Happy Birthday! 🎂' },
    {
      type: 'para',
      lines: [
        'Today is your day, so first things first...',
        'I hope your day is filled with good food, good laughs, good people, and absolutely no unnecessary stress.',
      ],
    },
    {
      type: 'highlight',
      lines: ['Another year unlocked. ✨'],
    },
    {
      type: 'checklist',
      items: [
        'More adventures.',
        'More random moments.',
        'More things to learn.',
        'More reasons to laugh.',
      ],
    },
    {
      type: 'para',
      lines: [
        'And hopefully... fewer "I should have started earlier" moments. 😄',
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
        "Birthdays are basically life's way of giving you a little checkpoint.",
        'So forget everything for a moment.',
        'No deadlines. No overthinking.',
        'Just enjoy your day.',
      ],
    },
    {
      type: 'checklist',
      items: [
        'Eat something nice.',
        'Laugh a little louder.',
        'Take too many pictures.',
        'Make a ridiculous wish.',
        'And enjoy being the birthday girl.',
      ],
    },
    {
      type: 'highlight',
      lines: ['Happy Birthday once again, Tithi. ✦'],
    },
    {
      type: 'divider',
    },
    {
      type: 'closing_para',
      lines: [
        'I hope this year brings you:',
        'more happiness, more adventures, more peaceful days, more reasons to laugh, and plenty of good memories.',
        'Whatever this new year brings, I hope there are lots of little moments that make you think:',
        '"Yep, that was a good day."',
      ],
    },
    {
      type: 'closing',
      text: 'Have an amazing birthday!',
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
