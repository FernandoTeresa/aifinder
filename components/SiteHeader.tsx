'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    // Mostra o link "Admin" apenas se já existe um token guardado
    try {
      const t = localStorage.getItem('admin_token');
      setShowAdmin(!!t);
    } catch {
      setShowAdmin(false);
    }
  }, []);

  return (
    <header className="sticky top-0 z-40">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_10%_-80%,rgba(56,189,248,0.18),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(120%_120%_at_95%_-40%,rgba(59,130,246,0.14),transparent_55%)]" />

      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-3 mb-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-xl">
          <Link href="/" className="group flex items-center gap-2 rounded-xl px-2 py-1">
            <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 text-white font-bold">
              AF
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-white">AI Finder</div>
              <div className="text-[11px] uppercase tracking-[0.26em] text-white/50">
                Pesquisa · Comparação · Decisão
              </div>
            </div>
          </Link>

          <nav className="ml-auto hidden items-center gap-6 md:flex">
            <HeaderLink href="/precos">Preços</HeaderLink>
            {/* evita o scroll automático do hash; o efeito suave é feito na página */}
            <HeaderLink href="/contacto#formulario-contacto" scroll={false}>Contacto</HeaderLink>
            <HeaderLink href="/privacidade">Privacidade</HeaderLink>
            <HeaderLink href="/termos">Termos</HeaderLink>

            {/* Link Admin visível só se o token existir no browser */}
            {showAdmin && <HeaderLink href="/conta-admin">Admin</HeaderLink>}
          </nav>

          <Link
            href="/conta"
            className="ml-2 hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:opacity-90 md:inline-block"
          >
            Entrar
          </Link>

          <button
            aria-label="Abrir menu"
            onClick={() => setOpen((v) => !v)}
            className="ml-auto inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-white md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-auto max-w-6xl px-4 pb-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl md:hidden">
            <MobileLink href="/precos" onClick={() => setOpen(false)}>Preços</MobileLink>
            <MobileLink href="/contacto#formulario-contacto" scroll={false} onClick={() => setOpen(false)}>
              Contacto
            </MobileLink>
            <MobileLink href="/privacidade" onClick={() => setOpen(false)}>Privacidade</MobileLink>
            <MobileLink href="/termos" onClick={() => setOpen(false)}>Termos</MobileLink>

            {/* Admin no menu mobile apenas se houver token */}
            {showAdmin && (
              <MobileLink href="/conta-admin" onClick={() => setOpen(false)}>
                Admin
              </MobileLink>
            )}

            <div className="mt-2 border-t border-white/10 pt-2">
              <Link
                href="/conta"
                onClick={() => setOpen(false)}
                className="block rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-2 text-center text-sm font-semibold text-white hover:opacity-90"
              >
                Entrar
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function HeaderLink({
  href,
  children,
  scroll,
}: {
  href: string;
  children: React.ReactNode;
  scroll?: boolean;
}) {
  return (
    <Link
      href={href}
      scroll={scroll}
      prefetch
      className="rounded-xl px-2 py-1 text-sm text-white/75 transition hover:text-white hover:underline underline-offset-4"
    >
      {children}
    </Link>
  );
}

function MobileLink({
  href,
  children,
  onClick,
  scroll,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  scroll?: boolean;
}) {
  return (
    <Link
      href={href}
      scroll={scroll}
      onClick={onClick}
      className="block rounded-xl px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
    >
      {children}
    </Link>
  );
}
