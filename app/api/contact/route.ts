// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { resend } from '@/lib/resend';
import ContactNotification from '@/emails/ContactNotification';

function isEmail(v?: string) {
  return !!v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !isEmail(email) || !message) {
      return NextResponse.json(
        { error: 'Por favor preenche nome, email válido e mensagem.' },
        { status: 400 }
      );
    }

    // 1) Guardar na Supabase
    const { error } = await supabaseAdmin.from('contact_messages').insert({
      name, email, subject: subject || null, message,
    });
    if (error) {
      console.error('[contact] supabase insert error:', error);
      return NextResponse.json({ error: 'Não foi possível enviar a mensagem.' }, { status: 500 });
    }

    // 2) Enviar email com Resend (se estiver configurado)
    const FROM = process.env.RESEND_FROM || 'AI Finder <no-reply@meuaifinder.app>';
    const TO = process.env.RESEND_TO || 'apoio@aifinder.com';

    if (resend) {
      try {
        await resend.emails.send({
          from: FROM,
          to: [TO],
          subject: subject?.trim() ? `[Contacto] ${subject}` : 'Novo contacto no AI Finder',
          react: ContactNotification({ name, email, subject, message }),
          text: [
            'Nova mensagem de contacto — AI Finder',
            `Nome: ${name}`,
            `Email: ${email}`,
            subject ? `Assunto: ${subject}` : null,
            '',
            message,
            '',
            '—',
            'AI Finder · meuaifinder.app',
          ]
            .filter(Boolean)
            .join('\n'),
          reply_to: email, // responder diretamente ao remetente
        });
      } catch (err: any) {
        // não falhar o request do utilizador por causa do email — apenas loga
        console.error('[contact] resend error:', err?.message || err);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('[contact] error:', e?.message || e);
    return NextResponse.json({ error: 'Erro inesperado.' }, { status: 500 });
  }
}
