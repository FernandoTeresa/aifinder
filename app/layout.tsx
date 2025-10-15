import type { Metadata } from 'next';
import './globals.css';

import { ThemeProvider } from '@/components/ThemeProvider';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import CookieNotice from '@/components/CookieNotice';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://meuaifinder.app'),
  title: {
    default: 'AI Finder — Pesquisa, comparação e escolha de IAs',
    template: '%s · AI Finder',
  },
  description:
    'Encontra a melhor IA para o teu objetivo: ranking por match, qualidade e relação qualidade/preço.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'AI Finder',
    description: 'Comparador inteligente de IAs',
    url: '/',
    siteName: 'AI Finder',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Finder',
    description: 'Comparador inteligente de IAs',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900 dark:from-slate-900 dark:to-slate-950 dark:text-slate-100">
        {/* Acessibilidade */}
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only absolute left-2 top-2 rounded bg-slate-900 px-3 py-1 text-white"
        >
          Saltar para conteúdo
        </a>

        <ThemeProvider>
          <SiteHeader />

          {/* Aviso de cookies (Client Component) */}
          <CookieNotice />

          <main id="conteudo">{children}</main>

          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
