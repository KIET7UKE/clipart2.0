export interface ClipartStyle {
  id: string;
  label: string;
  emoji: string;
  prompt: string;
  gradient: string[];
}

export const CLIPART_STYLES: ClipartStyle[] = [
  {
    id: 'cartoon',
    label: 'Cartoon',
    emoji: '🎨',
    prompt: 'bold outlines, vibrant colors, Disney-like illustration, smooth shading, high quality 2d vector',
    gradient: ['#FF9A8B', '#FF6A88', '#FF99AC'],
  },
  {
    id: 'flat',
    label: 'Flat',
    emoji: '📐',
    prompt: 'flat design, minimalist, geometric, modern aesthetic, clean lines, solid colors, vector art',
    gradient: ['#8EC5FC', '#E0C3FC'],
  },
  {
    id: 'anime',
    label: 'Anime',
    emoji: '🎌',
    prompt: 'Studio Ghibli aesthetic, cel shaded, Japanese animation style, soft lighting, detailed scenery',
    gradient: ['#BDF3E4', '#BDD7EE'],
  },
  {
    id: 'pixel',
    label: 'Pixel Art',
    emoji: '👾',
    prompt: '16-bit pixel art, retro game style, low resolution charm, vibrant limited palette, crisp square pixels',
    gradient: ['#FAD0C4', '#FFD1FF'],
  },
  {
    id: 'sketch',
    label: 'Sketch',
    emoji: '✏️',
    prompt: 'pencil sketch, hand drawn, black and white outline, expressive graphite strokes, artistic paper texture',
    gradient: ['#F5F7FA', '#B8C6DB'],
  },
];
