'use client';
import { useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import { Menu, X } from 'lucide-react';
import { useI18n } from '@/components/I18nProvider';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function SiteHeader() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b bg-white/60 backdrop-blur dark:bg-slate-900/60">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <a href="/" className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-xl bg-[#0A2540] font-bold text-white">
            AF
          </div>
          <div>
            <div className="leading-tight font-semibold">AI Finder</div>
            <div className="text-xs opacity-60 -mt-0.5">
              Pesquisa · Comparação
            </div>
          </div>
        </a>

        {/* campo de pesquisa */}
        <form action="/" method="GET" className="ml-6 hidden md:block">
          <input
            name="q"
            placeholder={t('header_search')}
            className="w-56 rounded-xl border px-3 py-1.5 text-sm"
          />
        </form>

        {/* navegação desktop */}
        <nav className="ml-auto hidden items-center gap-6 text-sm md:flex">
          <a className="opacity-80 hover:opacity-100" href="/precos">
            {t('nav_prices')}
          </a>
          <a className="opacity-80 hover:opacity-100" href="/favoritos">
            {t('nav_favorites')}
          </a>
          <a className="opacity-80 hover:opacity-100" href="/contacto">
            {t('nav_contact')}
          </a>
          <a className="opacity-80 hover:opacity-100" href="/privacidade">
            {t('nav_privacy')}
          </a>
          <a className="opacity-80 hover:opacity-100" href="/termos">
            {t('nav_terms')}
          </a>
          <LanguageSwitcher />
          <ThemeToggle />
          <a
            className="rounded-2xl border px-3 py-1.5 text-sm hover:bg-white/70 dark:hover:bg-slate-800/60"
            href="/conta"
          >
            {t('nav_login')}
          </a>
        </nav>

        {/* botão menu mobile */}
        <button
          className="ml-auto rounded-xl border p-2 md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* menu mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-72 bg-white p-4 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="font-semibold">Menu</div>
              <button
                className="rounded-xl border p-2"
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form action="/" method="GET" className="mb-3">
              <input
                name="q"
                placeholder={t('header_search')}
                className="w-full rounded-xl border px-3 py-2 text-sm"
              />
            </form>

            <nav className="grid gap-2 text-sm">
              <a
                className="opacity-80 hover:opacity-100"
                href="/precos"
                onClick={() => setOpen(false)}
              >
                {t('nav_prices')}
              </a>
              <a
                className="opacity-80 hover:opacity-100"
                href="/favoritos"
                onClick={() => setOpen(false)}
              >
                {t('nav_favorites')}
              </a>
              <a
                className="opacity-80 hover:opacity-100"
                href="/contacto"
                onClick={() => setOpen(false)}
              >
                {t('nav_contact')}
              </a>
              <a
                className="opacity-80 hover:opacity-100"
                href="/privacidade"
                onClick={() => setOpen(false)}
              >
                {t('nav_privacy')}
              </a>
              <a
                className="opacity-80 hover:opacity-100"
                href="/termos"
                onClick={() => setOpen(false)}
              >
                {t('nav_terms')}
              </a>
              <LanguageSwitcher />
              <ThemeToggle />
              <a
                className="rounded-2xl border px-3 py-1.5 text-sm hover:bg-white/70 dark:hover:bg-slate-800/60"
                href="/conta"
                onClick={() => setOpen(false)}
              >
                {t('nav_login')}
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}