// Vertical Curiothek reel: frame size, image paths and every word on screen.

export const RW = 1080;
export const RH = 1920;
export const RCX = RW / 2;

// Instagram covers ~140px at the top and ~380px at the bottom: keep text in between.
export const SAFE = {top: 160, bottom: 1540};

export const img = {
  before: (n: string) => `curiothek/before/${n}.jpg`,
  after: (n: string) => `curiothek/after/${n}.jpg`,
};

export const slides = [
  '01_oblozhka',
  '02_komplekt',
  '03_nagruzka',
  '04_dver',
  '05_myshtsy',
  '06_detali',
  '07_podarok',
  '08_razmery',
];

export const copy = {
  hook: ['Your product', 'is great.'],
  problem: ['But your card', 'looks like', 'everyone else’s.'],
  scroll: ['So shoppers', 'scroll right past.'],
  turn: 'Let’s fix that.',
  brand: ['CURI', 'THEK'], // the O between them is the orb
  brandSub: 'Design studio · Marketplace cards',
  canvasLabel: 'Card 01 — Cover',
  canvasSize: '1080 × 1440',
  before: 'Before',
  after: 'After',
  reveal: ['Same product.', 'New card.'],
  callouts: ['Readable at thumbnail size', 'Facts, not fluff', 'Every number checked'],
  set: ['8 slides.', 'One system.'],
  payoff: ['Now they stop.', 'And tap.'],
  added: 'Added to cart',
  tagline: 'Cards that make shoppers stop.',
  cta: 'Order your card set',
  ctaSub: 'Link in bio',
};
