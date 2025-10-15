
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'AI Finder — Pesquisa, comparação e escolha de IAs',
  description: 'Encontra a melhor IA para o teu objetivo: ranking por match, qualidade e relação qualidade/preço.',
  icons: { icon: '/favicon.svg' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'AI Finder',
    description: 'Comparador inteligente de IAs',
    url: '/',
    siteName: 'AI Finder',
    type: 'website'
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT">
      <body className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
        <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
            <a href="/" className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-[#0A2540] text-white grid place-items-center font-bold">AF</div>
              <div>
                <div className="font-semibold leading-tight">AI Finder</div>
                <div className="text-xs opacity-60 -mt-0.5">Pesquisa · Comparação · Escolha inteligente</div>
              </div>
            </a>
            <nav className="ml-auto hidden md:flex items-center gap-6 text-sm">
              <a className="opacity-80 hover:opacity-100" href="/precos">Preços</a>
              <a className="opacity-80 hover:opacity-100" href="/contacto">Contacto</a>
              <a className="opacity-80 hover:opacity-100" href="/privacidade">Privacidade</a>
              <a className="opacity-80 hover:opacity-100" href="/termos">Termos</a>
            </nav>
            <a className="ml-4 rounded-xl border px-3 py-1.5 text-sm" href="/conta">Entrar</a>
          </div>
        </header>
        <CookieNotice />
        {children}
        <footer className="border-t">
          <div className="max-w-6xl mx-auto px-4 py-6 text-xs opacity-70">
            © 2025 AI Finder · Todos os direitos reservados
          </div>
        </footer>
      </body>
    </html>
  );
}

function CookieNotice() {
  return (
    <div className="sticky bottom-0 z-30 w-full">
      <div className="m-4 rounded-xl border bg-white/90 backdrop-blur p-3 text-xs flex items-center gap-3 shadow-sm">
        <span>Usamos cookies essenciais para o funcionamento do site. Sem tracking de terceiros nesta fase.</span>
        <button onClick={() => (document.getElementById('cookieBar')?.remove())} id="cookieBar"
          className="ml-auto rounded-lg border px-2 py-1">Ok</button>
      </div>
    </div>
  );
}
