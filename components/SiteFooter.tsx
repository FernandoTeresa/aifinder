'use client';

import Link from 'next/link';
import { Mail, Github, Twitter } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="mt-16">
      <div className="pointer-events-none absolute inset-x-0 -z-10 h-[280px] bg-[radial-gradient(90%_60%_at_50%_120%,rgba(56,189,248,0.18),transparent_60%)]" />

      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 font-bold text-white">
                  AF
                </div>
                <div className="leading-tight">
                  <div className="font-semibold text-white">AI Finder</div>
                  <div className="text-[11px] uppercase tracking-[0.26em] text-white/50">
                    Pesquisa · Comparação · Decisão
                  </div>
                </div>
              </div>
              <p className="mt-3 max-w-xl text-sm text-white/60">
                Encontra a melhor IA para o teu objetivo: ranking por match, qualidade e relação qualidade/preço.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/precos"
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Ver planos
              </Link>
              {/* 👇 evita o scroll automático */}
              <Link
                href="/contacto#formulario-contacto"
                scroll={false}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:border-white/20 hover:bg-white/10"
              >
                Contactar
              </Link>
            </div>
          </div>

          <hr className="my-6 border-white/10" />

          <div className="grid gap-4 text-sm text-white/70 md:grid-cols-[1fr_auto] md:items-center">
            <nav className="flex flex-wrap gap-x-5 gap-y-2">
              <FooterLink href="/precos">Preços</FooterLink>
              <FooterLink href="/contacto#formulario-contacto" scroll={false}>Contacto</FooterLink>
              <FooterLink href="/privacidade">Privacidade</FooterLink>
              <FooterLink href="/termos">Termos</FooterLink>
            </nav>

            <div className="flex items-center gap-2">
              <Social href="mailto:apoio@aifinder.com" label="Email">
                <Mail className="h-4 w-4" />
              </Social>
              <Social href="https://github.com/meuaifinder" label="GitHub">
                <Github className="h-4 w-4" />
              </Social>
              <Social href="https://twitter.com/meuaifinder" label="Twitter / X">
                <Twitter className="h-4 w-4" />
              </Social>
            </div>
          </div>
        </div>

        <div className="mb-8 mt-3 flex items-center justify-between text-xs text-white/50">
          <span>© {new Date().getFullYear()} AI Finder · Todos os direitos reservados</span>
          <span className="hidden md:inline">
            Feito com  + ☕ em PT · <Link href="/privacidade" className="underline underline-offset-2">GDPR-ready</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
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
      className="rounded-lg px-1 py-0.5 text-white/70 hover:text-white hover:underline underline-offset-4"
    >
      {children}
    </Link>
  );
}

function Social({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-white/80 hover:border-white/20 hover:bg-white/10"
    >
      {children}
    </Link>
  );
}
