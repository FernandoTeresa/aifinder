// lib/ingest/merge.ts

export type AITool = {
  id?: string;
  slug: string;
  name: string;
  provider?: string;
  tier?: string;
  description?: string;
  category?: string;
  language?: string;
  tags?: string[];        // ex.: ["copywriting","pt-pt"]
  quality?: number;       // 0..100
  match?: number;         // 0..100
  value?: number;         // 0..100
  url?: string;
  vendor?: string;
  priceTier?: string;
};

function normSlug(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Junta a lista atual com os items novos, por slug.
 * - Se existir, atualiza campos não vazios
 * - Se não existir, insere
 */
export function mergeTools(current: AITool[], incoming: AITool[]): AITool[] {
  const map = new Map<string, AITool>();
  for (const t of current) {
    map.set(normSlug(t.slug || t.name), { ...t, slug: normSlug(t.slug || t.name) });
  }
  for (const t of incoming) {
    const slug = normSlug(t.slug || t.name);
    const prev = map.get(slug);
    if (prev) {
      map.set(slug, {
        ...prev,
        ...t,
        slug,
        // preferir arrays válidas
        tags: t.tags?.length ? t.tags : prev.tags,
      });
    } else {
      map.set(slug, { ...t, slug });
    }
  }
  return Array.from(map.values());
}