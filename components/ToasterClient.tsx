'use client';

import { Toaster } from 'sonner';

export default function ToasterClient() {
  return (
    <Toaster
      position="top-right"
      richColors
      theme="dark"
      expand={false}
      toastOptions={{
        className:
          'rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl text-white shadow-[0_0_25px_rgba(56,189,248,0.08)]',
      }}
    />
  );
}