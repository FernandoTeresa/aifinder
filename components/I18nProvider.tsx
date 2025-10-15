'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Locale = 'pt'|'en'|'es'|'fr'|'de';
const DEFAULT: Locale = 'pt';
const SUPPORTED: Locale[] = ['pt','en','es','fr','de'];

type Dict = Record<string, string>;
const base = {
  header_search: 'Procurar IA…',
  nav_prices: 'Preços',
  nav_favorites: 'Favoritos',
  nav_contact: 'Contacto',
  nav_privacy: 'Privacidade',
  nav_terms: 'Termos',
  nav_login: 'Entrar',
  rank_filters_search: 'Procurar modelo ou fornecedor…',
  rank_filters_only_favs: 'Só favoritos',
  compare: 'Comparar',
  open: 'Abrir',
};
const dictionaries: Record<Locale, Dict> = {
  pt: { ...base },
  en: { ...base, header_search: 'Search AI…', nav_prices: 'Pricing', nav_favorites: 'Favorites', nav_contact: 'Contact', nav_privacy: 'Privacy', nav_terms: 'Terms', nav_login: 'Sign in', rank_filters_search: 'Search model or vendor…', rank_filters_only_favs: 'Only favorites', compare: 'Compare', open: 'Open' },
  es: { ...base, header_search: 'Buscar IA…', nav_prices: 'Precios', nav_favorites: 'Favoritos', nav_contact: 'Contacto', nav_privacy: 'Privacidad', nav_terms: 'Términos', nav_login: 'Entrar', rank_filters_search: 'Buscar modelo o proveedor…', rank_filters_only_favs: 'Solo favoritos', compare: 'Comparar', open: 'Abrir' },
  fr: { ...base, header_search: 'Rechercher une IA…', nav_prices: 'Tarifs', nav_favorites: 'Favoris', nav_contact: 'Contact', nav_privacy: 'Confidentialité', nav_terms: 'Conditions', nav_login: 'Se connecter', rank_filters_search: 'Rechercher un modèle ou un fournisseur…', rank_filters_only_favs: 'Favoris seulement', compare: 'Comparer', open: 'Ouvrir' },
  de: { ...base, header_search: 'KI suchen…', nav_prices: 'Preise', nav_favorites: 'Favoriten', nav_contact: 'Kontakt', nav_privacy: 'Datenschutz', nav_terms: 'AGB', nav_login: 'Anmelden', rank_filters_search: 'Modell oder Anbieter suchen…', rank_filters_only_favs: 'Nur Favoriten', compare: 'Vergleichen', open: 'Öffnen' },
};

type Ctx = { locale: Locale; t: (k:string)=>string; setLocale: (l:Locale)=>void; };
const Ctx = createContext<Ctx>({ locale: DEFAULT, t: (k)=>k, setLocale: ()=>{} });

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(DEFAULT);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const ql = sp.get('lang') as Locale | null;
    const ck = document.cookie.split('; ').find(s => s.startsWith('lang='))?.split('=')[1] as Locale | undefined;
    const chosen = (ql && SUPPORTED.includes(ql) && ql) || (ck && SUPPORTED.includes(ck) && ck) || DEFAULT;
    setLocale(chosen);
    document.cookie = `lang=${chosen}; path=/; max-age=${60*60*24*30}`;
  }, []);

  const dict = dictionaries[locale] || dictionaries[DEFAULT];
  const t = (k:string) => dict[k] ?? k;
  const value = useMemo(()=>({ locale, t, setLocale }), [locale]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(){ return useContext(Ctx); }