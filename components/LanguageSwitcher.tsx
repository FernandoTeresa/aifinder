'use client';

import { ChangeEvent } from 'react';
import { useI18n } from './I18nProvider';

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLang(e.target.value as 'pt' | 'en');
  };

  return (
    <select
      value={lang}
      onChange={onChange}
      className="rounded-xl border bg-white/70 px-2 py-1 text-sm dark:bg-slate-800/70"
      aria-label="Escolher idioma"
    >
      <option value="pt">PT</option>
      <option value="en">EN</option>
    </select>
  );
}
