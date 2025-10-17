'use client';
import { useState } from 'react';

export default function FiltersBar() {
  const [query, setQuery] = useState('');
  const [categoria, setCategoria] = useState('Todos');
  const [idioma, setIdioma] = useState('PT');
  const [ordem, setOrdem] = useState('Qualquer');
  const [favoritos, setFavoritos] = useState(false);

  return (
    <section className="relative z-10 mx-auto max-w-6xl px-4 pb-6 pt-8">
      <div className="grid items-center gap-3 md:grid-cols-[1fr_auto_auto_auto_auto]">
        <input
          type="text"
          placeholder="Procurar modelo ou fornecedor..."
          className="input-glass w-full px-4 py-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          className="input-glass px-3 py-2"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option>Todos</option>
          <option>Chatbots</option>
          <option>Imagem</option>
          <option>Áudio</option>
          <option>Programação</option>
        </select>

        <select
          className="input-glass px-3 py-2"
          value={idioma}
          onChange={(e) => setIdioma(e.target.value)}
        >
          <option>PT</option>
          <option>EN</option>
          <option>ES</option>
        </select>

        <select
          className="input-glass px-3 py-2"
          value={ordem}
          onChange={(e) => setOrdem(e.target.value)}
        >
          <option>Qualquer</option>
          <option>Melhor match</option>
          <option>Mais baratos</option>
          <option>Mais populares</option>
        </select>

        <label className="chip cursor-pointer select-none">
          <input
            type="checkbox"
            className="mr-1.5 accent-cyan-500"
            checked={favoritos}
            onChange={() => setFavoritos(!favoritos)}
          />
          Só favoritos
        </label>
      </div>
    </section>
  );
}
