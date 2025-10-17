// lib/ingest/sources/provider_api.ts
// Stub para futuras integrações com APIs de fornecedores.

import type { AITool } from '../merge';

export async function load(_params: Record<string, string | undefined>): Promise<AITool[]> {
  // TODO: implementar chamadas reais (Anthropic, OpenAI, etc.)
  return [];
}