'use client';

import { useState } from 'react';

export default function CookieNotice() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-6">
      <div className="pointer-events-auto flex w-full max-w-xl items-center gap-4 rounded-3xl border border-white/10 bg-[#040713]/85 px-5 py-4 text-xs text-white/70 shadow-[0_20px_60px_-40px_rgba(56,189,248,0.9)] backdrop-blur-2xl">
        <span className="leading-relaxed">
          Usamos apenas cookies essenciais para manter a tua sessão e melhorar a experiência. Continuamos sem tracking de terceiros.
        </span>
        <button
          onClick={() => setVisible(false)}
          className="ml-auto rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
          type="button"
        >
          Ok
        </button>
      </div>
    </div>
  );
}
