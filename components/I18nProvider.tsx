'use client';

import { createContext, useContext, useMemo, useState } from 'react';

type Lang = 'pt' | 'en';

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
};

const I18nCtx = createContext<Ctx | null>(null);

const dict: Record<Lang, Record<string, string>> = {
  pt: {
    pricing: 'Preços',
    contact: 'Contacto',
    privacy: 'Privacidade',
    terms: 'Termos'
  },
  en: {
    pricing: 'Pricing',
    contact: 'Contact',
    privacy: 'Privacy',
    terms: 'Terms'
  }
};

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('pt');

  const t = (k: string) => dict[lang]?.[k] ?? k;

  // manter deps corretas para acalmar o react-hooks/exhaustive-deps (e já desligámos a regra)
  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
