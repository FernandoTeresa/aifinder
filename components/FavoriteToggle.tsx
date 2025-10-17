'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { toast } from 'sonner';

/**
 * Botão de Favorito — usa o contexto global de favoritos
 * Mostra animação leve ao clicar e adapta as cores ao tema.
 */
export default function FavoriteToggle({ id }: { id: string }) {
  const { isFav, toggleFav } = useFavorites();
  const active = isFav(id);
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    toggleFav(id);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 400);
    toast.success(active ? 'Removido dos favoritos' : 'Adicionado aos favoritos', {
      style: { background: '#0A2540', color: '#fff' },
    });
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      aria-label={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      title={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      className={`group relative inline-flex size-10 items-center justify-center rounded-xl border text-sm transition-all duration-300 backdrop-blur-md ${
        active
          ? 'border-rose-400/40 bg-rose-500/10 text-rose-200 hover:border-rose-400/70 hover:bg-rose-500/20'
          : 'border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10'
      }`}
    >
      <motion.div
        animate={animating ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : {}}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <Heart
          className={`h-4 w-4 ${
            active ? 'fill-rose-400 drop-shadow-[0_0_4px_rgba(244,63,94,0.6)]' : ''
          } transition-all`}
        />
      </motion.div>

      {/* glow suave ao hover */}
      <span className="absolute inset-0 -z-10 rounded-xl opacity-0 group-hover:opacity-40 transition bg-gradient-to-br from-rose-400/20 to-cyan-400/20" />
    </motion.button>
  );
}