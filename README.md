
# AI Finder — meuaifinder.app

Comparador inteligente de IAs (Next.js + Stripe + Supabase).

## Stack
- Next.js (App Router) + Tailwind
- Stripe Checkout (subscrições)
- Supabase (Auth + DB)
- Apple Pay/Google Pay (automático com `['card']`), MB Way (futuro)

## Setup rápido
```bash
npm i
cp .env.example .env.local
# preenche STRIPE e SUPABASE
npm run dev
```

## Deploy (Vercel)
1. Criar Prices no Stripe (Standard 9,90€/m; Premium 19,90€/m).
2. Adicionar env vars na Vercel (Production/Preview).
3. Webhook Stripe: `/api/webhooks/stripe` com eventos `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated|deleted`.
4. (Apple Pay) Verificar domínio — colocar ficheiro em `public/.well-known/apple-developer-merchantid-domain-association` e verificar no Stripe.

## Pastas principais
- `app/` — páginas e API routes
- `components/` — UI
- `lib/` — clientes e helpers
- `public/` — assets e ficheiro Apple Pay

## Licença
© 2025 AI Finder · Todos os direitos reservados.
# aifinder
# aifinder
# aifinder
# aifinder
# aifinder
