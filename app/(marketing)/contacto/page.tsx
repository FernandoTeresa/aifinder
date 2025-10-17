'use client';

import { useEffect, useState } from 'react';

export default function ContactoPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  // 👇 centra o formulário quando a rota vem com hash
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash !== '#formulario-contacto') return;

    const el = document.getElementById('formulario-contacto');
    if (!el) return;

    // espera o layout estabilizar e centra o alvo na viewport
    const scrollCenter = () => el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    requestAnimationFrame(() => {
      // mais um frame p/ garantir que fontes/medidas aplicaram
      requestAnimationFrame(scrollCenter);
    });
  }, []);

  async function sendForm(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !email || !message) return alert('Preenche nome, email e mensagem.');

    try {
      setSending(true);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        alert(data?.error || 'Não foi possível enviar a mensagem.');
        return;
      }
      alert('Mensagem enviada com sucesso. Vamos responder em breve.');
      setName(''); setEmail(''); setSubject(''); setMessage('');
    } catch {
      alert('Erro inesperado. Tenta novamente mais tarde.');
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="relative z-10 mx-auto max-w-5xl px-4 pb-20 pt-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_10%_-20%,rgba(56,189,248,0.15),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(120%_120%_at_90%_0%,rgba(129,140,248,0.12),transparent_50%)]" />

      <header className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-white/60">
          Contacto
        </span>
        <h1 className="mt-6 text-3xl font-semibold text-white sm:text-4xl">Fala connosco</h1>
        <p className="mt-3 text-sm text-white/60 sm:text-base">
          Tens dúvidas sobre planos, integração ou enterprise? Responderemos a partir de <b>apoio@aifinder.com</b>.
        </p>
      </header>

      {/* 🔽 scroll-mt compensa header sticky; id é o alvo do hash */}
      <section
        id="formulario-contacto"
        className="mx-auto mt-10 max-w-3xl scroll-mt-36 md:scroll-mt-40"
      >
        <form onSubmit={sendForm} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-xl">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-white/80">
              Nome
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <label className="text-sm text-white/80">
              Email
              <input
                type="email"
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
          </div>

          <label className="mt-4 block text-sm text-white/80">
            Assunto (opcional)
            <input
              type="text"
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex.: Plano Enterprise, integração, parceria…"
            />
          </label>

          <label className="mt-4 block text-sm text-white/80">
            Mensagem
            <textarea
              className="mt-1 w-full resize-y rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </label>

          <div className="mt-6 flex items-center justify-between gap-3">
            <p className="text-xs text-white/50">
              Também podes escrever diretamente para{' '}
              <a className="underline underline-offset-2" href="mailto:apoio@aifinder.com">
                apoio@aifinder.com
              </a>.
            </p>

            <button
              type="submit"
              disabled={sending}
              className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              {sending ? 'A enviar…' : 'Enviar mensagem'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
