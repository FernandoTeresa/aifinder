'use client';
import { useI18n } from '@/components/I18nProvider';
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n/dictionaries';

export default function LanguageSwitcher(){
  const { locale, setLocale } = useI18n();
  function change(l: Locale){
    setLocale(l);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', l);
    history.replaceState(null, '', url.toString());
  }
  return (
    <select
      aria-label="Idioma"
      className="rounded-xl border px-2 py-1.5 text-sm"
      value={locale}
      onChange={e=>change(e.target.value as Locale)}
    >
      {SUPPORTED_LOCALES.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
    </select>
  );
}
