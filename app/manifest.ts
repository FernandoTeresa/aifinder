// app/manifest.ts
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    name: 'AI Finder',
    short_name: 'AI Finder',
    description:
      'Comparador inteligente de IAs — encontra a melhor opção por match, qualidade e relação qualidade/preço.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b1220',
    theme_color: '#0ea5e9',
    icons: [
      { src: `${base}/favicon.jpeg`, sizes: '192x192', type: 'image/jpeg' },
      { src: `${base}/favicon.jpeg`, sizes: '512x512', type: 'image/jpeg' },
    ],
  };
}
