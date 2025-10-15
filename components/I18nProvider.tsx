'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, dictionaries, type Locale, type Dict } from '@/lib/i18n/dictionaries';

type Ctx = { locale: Locale; t: (k:string)=>string; setLocale: (l:Locale)=>void; };
const I18nCtx = createContext<Ctx>({ locale: DEFAULT_LOCALE, t: (k)=>k, setLocale: ()=>{} });

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const ql = sp.get('lang') as Locale | null;
    const ck = document.cookie.split('; ').find(s => s.startsWith('lang='))?.split('=')[1] as Locale | undefined;
    const chosen = (ql && SUPPORTED_LOCALES.includes(ql) && ql) || (ck && SUPPORTED_LOCALES.includes(ck) && ck) || DEFAULT_LOCALE;
    setLocale(chosen);
    document.cookie = `lang=${chosen}; path=/; max-age=${60*60*24*30}`;
  }, []);

  const dict: Dict = dictionaries[locale] || dictionaries[DEFAULT_LOCALE];
  const t = (k:string) => dict[k] ?? k;
  const value = useMemo(()=>({ locale, t, setLocale }), [locale]);

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n(){ return useContext(I18nCtx); }
