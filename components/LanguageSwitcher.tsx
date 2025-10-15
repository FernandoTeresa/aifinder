'use client';
import { useI18n } from '@/components/I18nProvider';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n() as any;
  function change(l: 'pt'|'en'|'es'|'fr'|'de'){
    setLocale(l);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', l);
    history.replaceState(null, '', url.toString());
  }
  return (
    <select aria-label="Idioma" value={locale} onChange={e=>change(e.target.value as any)} className="rounded border px-2 py-1 text-sm">
      <option value="pt">PT</option><option value="en">EN</option><option value="es">ES</option><option value="fr">FR</option><option value="de">DE</option>
    </select>
  );
}
