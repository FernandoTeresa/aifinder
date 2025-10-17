// app/api/admin/ai/sample-csv/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const csv =
`name,slug,provider,tier,description,category,language,tags,quality,match,value,url
ChatGPT-4o mini,chatgpt-4o-mini,OpenAI,standard,"Modelo rápido e equilibrado",Copywriting,PT,Chat|Texto|OpenAI,92,88,80,https://chat.openai.com/
Claude 3 Haiku,claude-3-haiku,Anthropic,standard,"Ótimo em contexto e escrita",Assistente,PT,Chat|Docs|Anthropic,89,85,78,https://claude.ai
Gemini 1.5 Flash,gemini-1-5-flash,Google,free,"Rápido e gratuito",Pesquisa,PT,Google|Free,84,81,88,https://gemini.google.com
`;
  return new NextResponse(csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': 'attachment; filename="ai-tools-sample.csv"',
    },
  });
}