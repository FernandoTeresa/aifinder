import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import CookieNotice from '@/components/CookieNotice';
import { ThemeProvider } from '@/components/ThemeProvider';
import I18nProvider from '@/components/I18nProvider';

export const metadata = {
  title: 'AI Finder — Pesquisa, comparação e escolha de IAs',
  description: 'Encontra a melhor IA para o teu objetivo: ranking por match, qualidade e relação qualidade/preço.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900 dark:from-slate-900 dark:to-slate-950 dark:text-slate-100">
        <ThemeProvider>
          <I18nProvider>
            <SiteHeader />
            <CookieNotice />
            {children}
            <SiteFooter />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
