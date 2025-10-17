export type RawTool = {
  source: string;       // ex: 'sample_csv'
  source_id: string;    // id único na fonte
  name: string;
  slug: string;
  provider?: string;
  tier?: string;
  description?: string;
  category?: string;
  language?: string;
  tags?: string[];
  url?: string;
  quality?: number | null;
  match?: number | null;
  value?: number | null;
  source_hash?: string; // hash do registo bruto
};