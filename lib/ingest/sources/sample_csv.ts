// lib/ingest/sources/sample_csv.ts
// Carrega um CSV remoto (headers na 1ª linha) e devolve AITool[].

import type { AITool } from '../merge';

export async function load(params: { url?: string }): Promise<AITool[]> {
  const url = params.url?.trim();
  if (!url) {
    // fallback de exemplo (sem CSV)
    return [
      {
        name: 'ChatGPT-4o mini',
        slug: 'chatgpt-4o-mini',
        provider: 'OpenAI',
        tier: 'standard',
        category: 'Copywriting',
        language: 'pt-pt',
        tags: ['copywriting', 'pt-pt'],
        quality: 88,
        match: 86,
        value: 90,
        url: 'https://openai.com',
        vendor: 'OpenAI',
        priceTier: 'standard'
      }
    ];
  }

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Falha ao obter CSV (${res.status})`);
  const text = await res.text();

  // parse CSV muito simples: separa por linhas, usa vírgula; remove aspas
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const out: AITool[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = (cols[idx] ?? '').trim().replace(/^"|"$/g, '');
    });

    // mapeia colunas comuns (ajusta conforme o teu CSV)
    const tags = row.tags ? row.tags.split('|').map(s => s.trim()).filter(Boolean) : undefined;

    out.push({
      name: row.name || row.modelo || 'Sem nome',
      slug: (row.slug || row.name || '').toLowerCase(),
      provider: row.provider || row.vendor,
      tier: row.tier || row.priceTier,
      description: row.description,
      category: row.category,
      language: row.language || row.lang,
      tags,
      quality: toNum(row.quality),
      match: toNum(row.match),
      value: toNum(row.value),
      url: row.url || row.link,
      vendor: row.vendor,
      priceTier: row.priceTier,
    });
  }

  return out;
}

function toNum(s?: string) {
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

// CSV robusto o suficiente para campos com vírgulas entre aspas
function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"'; // escape
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}