
export type Model = {
  id: string;
  name: string;
  vendor: string;
  useCases: string[];
  langs: string[];
  priceTier: 'free' | 'standard' | 'premium';
  quality: number;
  match: number;
  value: number;
  url: string;
};

export const models: Model[] = [
  { id:'gpt-4o-mini', name:'GPT‑4o mini', vendor:'OpenAI', useCases:['copywriting','general','code'], langs:['pt','en','es','fr','de'], priceTier:'standard', quality:88, match:86, value:90, url:'https://openai.com' },
  { id:'claude-haiku', name:'Claude Haiku', vendor:'Anthropic', useCases:['general','assistants','analysis'], langs:['pt','en','es','fr','de'], priceTier:'standard', quality:85, match:84, value:88, url:'https://anthropic.com' },
  { id:'gemini-flash', name:'Gemini Flash', vendor:'Google', useCases:['vision','general','copywriting'], langs:['pt','en','es','fr','de'], priceTier:'free', quality:82, match:80, value:93, url:'https://ai.google' },
  { id:'llama-405b', name:'Llama 3.1 405B', vendor:'Meta', useCases:['general','code','research'], langs:['en','es','fr','de'], priceTier:'premium', quality:91, match:78, value:81, url:'https://meta.ai' },
  { id:'mistral-large', name:'Mistral Large', vendor:'Mistral', useCases:['code','general'], langs:['en','fr','de'], priceTier:'standard', quality:83, match:77, value:85, url:'https://mistral.ai' },
  { id:'perplexity', name:'Perplexity', vendor:'Perplexity', useCases:['search','analysis','research'], langs:['pt','en','es','fr','de'], priceTier:'premium', quality:87, match:90, value:79, url:'https://www.perplexity.ai' },
  { id:'midjourney', name:'Midjourney', vendor:'Midjourney', useCases:['image','design'], langs:['en'], priceTier:'premium', quality:92, match:72, value:70, url:'https://www.midjourney.com' }
];

export function overallScore(m: Model, weights = { quality: 0.5, match: 0.35, value: 0.15 }){
  const { quality, match, value } = m;
  return Math.round(quality*weights.quality + match*weights.match + value*weights.value);
}
