export interface ClipartStyle {
  id: string;
  label: string;
  prompt: string;
  gradient: string[];
  sample: any;
}

export const CLIPART_STYLES: ClipartStyle[] = [
  {
    id: 'cartoon',
    label: 'Cartoon',
    prompt: 'bold outlines, vibrant colors, Disney-like illustration, smooth shading, high quality 2d vector',
    gradient: ['#FF9A8B', '#FF6A88', '#FF99AC'],
    sample: require('../../assets/samples/cartoon.png'),
  },
  {
    id: 'flat',
    label: 'Flat Vector',
    prompt: 'flat design, minimalist, geometric, modern aesthetic, clean lines, solid colors, vector art',
    gradient: ['#8EC5FC', '#E0C3FC'],
    sample: require('../../assets/samples/flat.png'),
  },
  {
    id: 'anime',
    label: 'Anime',
    prompt: 'Studio Ghibli aesthetic, cel shaded, Japanese animation style, soft lighting, detailed scenery',
    gradient: ['#BDF3E4', '#BDD7EE'],
    sample: require('../../assets/samples/anime.png'),
  },
  {
    id: 'pixel',
    label: 'Pixel Art',
    prompt: '16-bit pixel art, retro game style, low resolution charm, vibrant limited palette, crisp square pixels',
    gradient: ['#FAD0C4', '#FFD1FF'],
    sample: require('../../assets/samples/pixel.png'),
  },
  {
    id: 'sketch',
    label: 'Sketch Art',
    prompt: 'pencil sketch, hand drawn, black and white outline, expressive graphite strokes, artistic paper texture',
    gradient: ['#616161', '#9bc5c3'],
    sample: require('../../assets/samples/sketch.png'),
  },
  {
    id: '3d',
    label: '3D Render',
    prompt: 'Octane render, 3D claymation style, soft studio lighting, high detail, volumetric shadows',
    gradient: ['#FFECD2', '#FCB69F'],
    sample: require('../../assets/samples/3d.png'),
  },
  {
    id: 'minimalist',
    label: 'Minimalist',
    prompt: 'continuous line art, minimalist aesthetic, simple shapes, elegant flow, monochromatic with subtle accents',
    gradient: ['#D4FC79', '#96E6A1'],
    sample: require('../../assets/samples/minimalist.png'),
  },
  {
    id: 'retro',
    label: 'Retro',
    prompt: 'mid-century modern illustration, 1950s advertising art, vintage colors, grain texture, classic travel poster vibe',
    gradient: ['#FFC3A0', '#FFAFBD'],
    sample: require('../../assets/samples/retro.png'),
  },
  {
    id: 'graffiti',
    label: 'Graffiti',
    prompt: 'street art style, bold spray paint strokes, urban aesthetic, vibrant neon colors, edgy modern look',
    gradient: ['#84FAB0', '#8FD3F4'],
    sample: require('../../assets/samples/graffiti.png'),
  },
];
