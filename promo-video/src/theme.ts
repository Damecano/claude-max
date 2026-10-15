// Design tokens. The look: warm paper background, near-black ink, one family of
// soft greens/aquas for atmosphere, and multicolour "orbs" as the only saturated element.

export const W = 1920;
export const H = 1080;
export const FPS = 30;

export const color = {
  paper: '#F3F2EF',
  ink: '#0E0F0E',
  inkSoft: '#3A3D3B',
  muted: '#8A8D8A',
  line: 'rgba(14, 15, 14, 0.16)',
  lineDark: 'rgba(255, 255, 255, 0.24)',
  card: '#FFFFFF',
  night: '#000000',
  // atmosphere
  deepGreen: '#2C5A3C',
  green: '#4F8C66',
  sage: '#9CC3AA',
  aqua: '#86D3CB',
  mist: '#E4EFEA',
  // caret / fresh characters
  teal: '#3E8F8A',
};

// Orb palettes: each is a list of blob colours over a base.
export const orbPalettes = {
  earth: {base: '#2C8FD6', blobs: ['#7CD3F2', '#3FA046', '#E3DA4B', '#1F5FB8', '#A6E07A']},
  sunrise: {base: '#2F7FD0', blobs: ['#F0A640', '#78C7EE', '#3C9B4C', '#F4D85C', '#1D56A8']},
  meadow: {base: '#3F9A52', blobs: ['#E9E15B', '#2A6ED0', '#9ED86F', '#6CC7E8', '#1E6B3A']},
  sea: {base: '#2B6FA8', blobs: ['#79C6E6', '#4A9A84', '#B9E3F0', '#1E4E80', '#8FCB9A']},
  lime: {base: '#9BBF4A', blobs: ['#E7E46A', '#5E9B48', '#CDE58C', '#3C7F40', '#F2F0A0']},
  ice: {base: '#9FD3E6', blobs: ['#E8F6FA', '#6CB7D8', '#C7E8D9', '#4E9CC4', '#FFFFFF']},
} as const;

export type OrbPalette = keyof typeof orbPalettes;

export const font = {
  sans: "'Inter', 'Inter Display', system-ui, sans-serif",
};

// Everything the viewer reads lives here so the copy can be swapped in one place.
export const script = {
  brand: 'Your Brand',
  product: 'Assist',
  open: 'Every store hears the same questions.',
  questions: [
    'Where is my order?',
    'Do you have it in blue?',
    'Can I return this?',
    'When will it arrive?',
    'Is there a discount?',
    'What size should I pick?',
    'Do you deliver on weekends?',
    'How do I pay?',
  ],
  headline: 'Answers in seconds.',
  prompt: 'Answer shoppers about stock, sizes and delivery',
  chat: {
    q1: 'Do you have the green one in size M?',
    a1: 'Yes — size M is in stock. Want me to reserve one for you?',
    product: 'Sport jacket · M',
    stock: 'In stock',
    q2: 'Yes please',
    a2: 'Reserved. It’s yours until 18:00.',
  },
  sources: ['Product catalog', 'Orders & delivery', 'Store policies'],
  grounded: 'Grounded in your store',
  languagesLabel: 'Replies in the shopper’s language',
  greetings: [
    'Hello! How can I help?',
    'Assalomu alaykum! Qanday yordam beray?',
    'Здравствуйте! Чем могу помочь?',
    'Merhaba! Nasıl yardımcı olabilirim?',
  ],
  channelsLabel: 'One assistant. Every channel.',
  rulesLabel: 'Rules you control',
  rules: [
    {title: 'Hand off to a person', body: 'When a shopper asks for a manager or sounds upset'},
    {title: 'Stay on brand', body: 'Friendly tone, short answers, no slang'},
    {title: 'Discount limit', body: 'Never promise more than you allow'},
  ],
  insights: [
    {label: 'Top question', value: 'Delivery time'},
    {label: 'Most asked about', value: 'Sport jacket'},
  ],
  tagline: 'Your store, always answering.',
  cta: 'Get started',
};
