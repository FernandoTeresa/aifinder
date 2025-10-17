// app/sitemap.ts
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const now = new Date().toISOString();

  const pages = ['/', '/precos', '/contacto', '/privacidade', '/termos', '/conta'];

  return pages.map((p) => ({
    url: new URL(p, base).toString(),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: p === '/' ? 1 : 0.7,
  }));
}