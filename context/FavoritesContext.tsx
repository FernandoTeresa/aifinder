'use client';

import { createContext, useContext, useMemo, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type FavoritesCtx = {
  favs: string[];                 // ids de modelos
  isFav: (id: string) => boolean;
  toggleFav: (id: string) => void;
  clearFavs: () => void;
};

const Ctx = createContext<FavoritesCtx | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favs, setFavs] = useLocalStorage<string[]>('aifinder:favs', []);

  const isFav = useCallback((id: string) => favs.includes(id), [favs]);
  const toggleFav = useCallback(
    (id: string) => {
      setFavs((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    },
    [setFavs]
  );
  const clearFavs = useCallback(() => setFavs([]), [setFavs]);

  const value = useMemo(() => ({ favs, isFav, toggleFav, clearFavs }), [favs, isFav, toggleFav, clearFavs]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFavorites() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useFavorites must be used within <FavoritesProvider>');
  return v;
}
