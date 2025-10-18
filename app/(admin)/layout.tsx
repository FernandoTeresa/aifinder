// app/(admin)/layout.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin · AI Finder',
  description: 'Área de administração do AI Finder',
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    // ⚠️ Nada de <html> ou <body> aqui. Só wrappers normais.
    <div className="relative min-h-screen bg-[#0b1220] text-slate-100">
      {/* Gradientes iguais ao site */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_10%_-60%,rgba(56,189,248,0.18),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(120%_120%_at_95%_-40%,rgba(59,130,246,0.14),transparent_55%)]" />

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link href="/" className="rounded-lg px-2 py-1 text-sm text-white/80 hover:text-white">
            ← Voltar ao site
          </Link>
          <div className="ml-2 text-sm text-white/50">Área de Administração</div>
          <nav className="ml-auto hidden gap-2 md:flex">
            <AdminLink href="/conta-admin">Dashboard</AdminLink>
            <AdminLink href="/conta-admin/ia">Gestão de IAs</AdminLink>
          </nav>
        </div>
      </header>

      {/* Mobile nav */}
      <nav className="mx-auto block max-w-6xl px-4 pt-3 md:hidden">
        <div className="flex gap-2">
          <AdminLink href="/conta-admin">Dashboard</AdminLink>
          <AdminLink href="/conta-admin/ia">Gestão de IAs</AdminLink>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} AI Finder — Admin
      </footer>
    </div>
  );
}

function AdminLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 transition hover:border-white/20 hover:text-white"
    >
      {children}
    </Link>
  );
}
