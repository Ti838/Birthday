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
    { type: 'greeting', text: 'Dear Doraemon (Tithi ✦),' },
    { type: 'title_tag', text: 'Wishing You the Happiest Birthday! 🎂✨' },
    {
      type: 'para',
      lines: [
        'Today is all about celebrating you, your existence, and the special light you bring into the world.',
        'Happy Birthday, Doraemon! Another chapter begins today, and with every passing year, you bring even more warmth, uncontrollable laughter, and your own brand of brilliant magic.',
      ],
    },
    {
      type: 'highlight',
      lines: ['The real-life Doraemon with an endless pocket of smiles. ✦'],
    },
    {
      type: 'para',
      lines: [
        'I don’t think any nickname fits you more perfectly than "Doraemon". Even without gadgets like an anywhere door or a bamboo-copter, you have this natural superpower to turn ordinary moments into unforgettable memories and make everyone around you laugh with pure joy.',
      ],
    },
    {
      type: 'checklist',
      items: [
        'Mastermind of spontaneous, fun adventures.',
        'The person who always brings positive energy and laughter.',
        'The keeper of big dreams, great resilience, and pure kindness.',
        'And officially, another year more wonderful and legendary.',
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
        "Birthdays are life's gentle way of reminding you to pause, breathe, and celebrate everything you are.",
        'So today, leave all the deadlines, stress, and overthinking behind. Today belongs only to you.',
      ],
    },
    {
      type: 'checklist',
      items: [
        'Treat yourself to something delicious with zero guilt.',
        'Laugh a little louder with the people who cherish you.',
        'Capture plenty of beautiful memories and candid photos.',
        'Make an audacious, secret wish when blowing out your candles.',
        'And enjoy every single heartbeat of being the birthday star.',
      ],
    },
    {
      type: 'highlight',
      lines: ['May all your secret wishes find their way to reality. ✦'],
    },
    {
      type: 'divider',
    },
    {
      type: 'closing_para',
      lines: [
        'As you step into this brand new year of your life, I truly wish you:',
        'unshakeable peace of mind, vibrant health, exciting milestones, endless laughter, and days filled with quiet happiness.',
        'May life surprise you with moments so special that you stop and whisper:',
        '"Yep, this is truly a blessed chapter."',
      ],
    },
    {
      type: 'closing',
      text: 'Have an extraordinary and magical birthday, Doraemon!',
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
