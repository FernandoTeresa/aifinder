
'use client';
import { useState } from 'react';

export default function ContactoPage() {
  const [state, setState] = useState<'idle'|'ok'|'err'>('idle');
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const mailto = `mailto:apoio@aifinder.com?subject=${encodeURIComponent('Contacto AI Finder')}&body=${encodeURIComponent(`Nome: ${data.nome}\nEmail: ${data.email}\nMensagem: ${data.mensagem}`)}`;
    window.location.href = mailto;
    setState('ok');
  }
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-1">Contacto</h1>
      <p className="text-sm opacity-70 mb-6">Diz-nos como podemos ajudar. Responderemos em breve.</p>
      <form onSubmit={onSubmit} className="rounded-2xl border p-6 bg-white/70 backdrop-blur space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome</label>
          <input name="nome" required className="w-full rounded-xl border px-3 py-2"/>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input name="email" type="email" required className="w-full rounded-xl border px-3 py-2"/>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mensagem</label>
          <textarea name="mensagem" required rows={5} className="w-full rounded-xl border px-3 py-2"/>
        </div>
        <button className="rounded-xl border px-4 py-2 text-sm font-medium">Enviar</button>
        {state==='ok' && <p className="text-xs opacity-70">Obrigado! Abriu o teu cliente de email com a mensagem.</p>}
      </form>
      <p className="text-xs opacity-70 mt-3">Emails de suporte: <strong>apoio@aifinder.com</strong> · Privacidade: <strong>privacidade@aifinder.pt</strong></p>
    </main>
  );
}
