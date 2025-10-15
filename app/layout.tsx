import Link from 'next/link';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import CookieNotice from '@/components/CookieNotice';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], display: 'swap' });
const gridOverlayImage = `url("data:image/svg+xml,%3Csvg width='320' height='320' viewBox='0 0 320 320' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 80H320' stroke='rgba(148,163,184,0.08)'/%3E%3Cpath d='M0 160H320' stroke='rgba(148,163,184,0.08)'/%3E%3Cpath d='M0 240H320' stroke='rgba(148,163,184,0.08)'/%3E%3Cpath d='M80 0V320' stroke='rgba(148,163,184,0.08)'/%3E%3Cpath d='M160 0V320' stroke='rgba(148,163,184,0.08)'/%3E%3Cpath d='M240 0V320' stroke='rgba(148,163,184,0.08)'/%3E%3C/svg%3E")`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'AI Finder — Pesquisa, comparação e escolha de IAs',
  description: 'Encontra a melhor IA para o teu objetivo: ranking por match, qualidade e relação qualidade/preço.',
  icons: { icon: '/favicon.svg' },
  robots: { index: true, follow: true },
  openGraph: { title: 'AI Finder', description: 'Comparador inteligente de IAs', url: '/', siteName: 'AI Finder', type: 'website' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT" suppressHydrationWarning>
      <body className={`${jakarta.className} relative min-h-screen overflow-x-hidden bg-[#050816] text-slate-100 antialiased`}>
        <a href="#conteudo" className="sr-only focus:not-sr-only absolute left-2 top-2 rounded bg-slate-100 px-3 py-1 text-[#050816]">Saltar para conteúdo</a>

        <div aria-hidden className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.22),transparent_55%)]" />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 opacity-40 mix-blend-soft-light"
          style={{ backgroundImage: gridOverlayImage }}
        />

        <div className="relative z-10 flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 border-b border-white/10 bg-[#060b1b]/70 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-4">
              <Link href="/" className="group flex items-center gap-3">
                <div className="relative flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-500 text-[15px] font-semibold uppercase tracking-tight text-white shadow-[0_20px_45px_-25px_rgba(59,130,246,0.95)] transition group-hover:shadow-[0_25px_55px_-30px_rgba(129,140,248,0.9)]">
                  AF
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-white">AI Finder</span>
                    <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">Beta</span>
                  </div>
                  <div className="text-xs text-white/50">Pesquisa · Comparação · Escolha inteligente</div>
                </div>
              </Link>

              <nav className="ml-auto hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 px-1.5 py-1 text-sm md:flex">
                <Link className="rounded-full px-3 py-1.5 text-white/70 transition hover:bg-white/10 hover:text-white" href="/precos">
                  Planos
                </Link>
                <Link className="rounded-full px-3 py-1.5 text-white/70 transition hover:bg-white/10 hover:text-white" href="/contacto">
                  Contacto
                </Link>
                <Link className="rounded-full px-3 py-1.5 text-white/70 transition hover:bg-white/10 hover:text-white" href="/privacidade">
                  Privacidade
                </Link>
                <Link className="rounded-full px-3 py-1.5 text-white/70 transition hover:bg-white/10 hover:text-white" href="/termos">
                  Termos
                </Link>
              </nav>

              <div className="ml-3 hidden items-center gap-2 md:flex">
                <Link
                  className="rounded-full border border-white/10 px-3 py-1.5 text-sm font-semibold text-white/70 transition hover:border-white/30 hover:text-white"
                  href="/conta"
                >
                  Entrar
                </Link>
                <Link
                  className="rounded-full border border-transparent bg-white/90 px-4 py-1.5 text-sm font-semibold text-[#050816] transition hover:bg-white"
                  href="/precos"
                >
                  Experimentar
                </Link>
              </div>
            </div>
          </header>

          <main id="conteudo" className="flex-1">
            {children}
          </main>

          <footer className="border-t border-white/10 bg-[#040713]/60">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold text-white/70">AI Finder</div>
                <p className="mt-1 text-xs text-white/40">Comparador inteligente para descobrir a próxima IA do teu stack.</p>
              </div>
              <div className="flex flex-wrap gap-4 text-xs">
                <Link className="transition hover:text-white/80" href="/sobre">
                  Sobre
                </Link>
                <Link className="transition hover:text-white/80" href="/blog">
                  Blog
                </Link>
                <Link className="transition hover:text-white/80" href="/privacidade">
                  Privacidade
                </Link>
                <Link className="transition hover:text-white/80" href="/termos">
                  Termos
                </Link>
              </div>
              <div className="text-xs text-white/40">© 2025 AI Finder · Todos os direitos reservados</div>
            </div>
          </footer>
        </div>

        <CookieNotice />
      </body>
    </html>
  );
}
