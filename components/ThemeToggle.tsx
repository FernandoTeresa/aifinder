'use client';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle(){
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  return (
    <button
      aria-label="Mudar tema"
      onClick={()=> setTheme(isDark ? 'light' : 'dark')}
      className="rounded-xl border p-2 hover:bg-white/60 dark:hover:bg-slate-800/60"
      title={isDark ? 'Usar claro' : 'Usar escuro'}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
