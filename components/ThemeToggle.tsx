'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = resolvedTheme === 'dark';
  const title = mounted ? (isDark ? 'Usar claro' : 'Usar escuro') : 'Mudar tema';

  return (
    <button
      aria-label="Mudar tema"
      onClick={() => mounted && setTheme(isDark ? 'light' : 'dark')}
      className="rounded-xl border p-2 hover:bg-white/60 dark:hover:bg-slate-800/60"
      title={title}
    >
      {mounted ? (isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />) : <span className="inline-block h-4 w-4" />}
    </button>
  );
}
