import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import CookieNotice from '@/components/CookieNotice';
import { ThemeProvider } from '@/components/ThemeProvider';
import I18nProvider from '@/components/I18nProvider';
import ToasterClient from '@/components/ToasterClient';
import Script from 'next/script';
import { FavoritesProvider } from '@/context/FavoritesContext';

export const metadata = {
  title: 'AI Finder — Pesquisa, comparação e escolha de IAs',
  description:
    'Encontra a melhor IA para o teu objetivo: ranking por match, qualidade e relação qualidade/preço.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT" suppressHydrationWarning>
      <Script
        id="org-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'AI Finder',
            url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
            email: 'apoio@aifinder.com',
            logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/logo-light.jpeg`,
            sameAs: [
              'https://twitter.com/meuaifinder',
              'https://github.com/meuaifinder',
            ],
          }),
        }}
      />
      <body className="min-h-screen bg-gradient-to-b from-slate-950 to-black text-slate-100">
        <ThemeProvider>
          <I18nProvider>
            <FavoritesProvider>
              <SiteHeader />
              <CookieNotice />
              {children}
              <SiteFooter />
            </FavoritesProvider>
          </I18nProvider>
        </ThemeProvider>
        {/* Toaster global */}
        <ToasterClient />
      </body>
    </html>
  );
}