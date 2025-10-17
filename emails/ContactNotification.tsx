// emails/ContactNotification.tsx
import * as React from 'react';
import { Html, Head, Preview, Body, Container, Section, Heading, Text, Hr } from '@react-email/components';

type Props = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

export default function ContactNotification({ name, email, subject, message }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Nova mensagem de contacto — AI Finder</Preview>
      <Body style={{ backgroundColor: '#0b1220', color: '#e2e8f0', fontFamily: 'ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial' }}>
        <Container style={{ maxWidth: 640, padding: '24px' }}>
          <Section style={{ borderRadius: 16, border: '1px solid #1f2937', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(8px)', padding: 20 }}>
            <Heading as="h2" style={{ color: '#fff', fontSize: 20, margin: 0 }}>Nova mensagem de contacto</Heading>
            <Text style={{ color: '#9ca3af', marginTop: 8, marginBottom: 16 }}>Recebeste um novo pedido através do formulário do site.</Text>

            <Hr style={{ borderColor: '#1f2937' }} />

            <Text><b>Nome:</b> {name}</Text>
            <Text><b>Email:</b> {email}</Text>
            {subject ? <Text><b>Assunto:</b> {subject}</Text> : null}

            <Hr style={{ borderColor: '#1f2937', marginTop: 12, marginBottom: 12 }} />

            <Text style={{ whiteSpace: 'pre-wrap', color: '#cbd5e1' }}>{message}</Text>

            <Hr style={{ borderColor: '#1f2937', marginTop: 16, marginBottom: 12 }} />

            <Text style={{ color: '#94a3b8', fontSize: 12 }}>
              AI Finder · meuaifinder.app · Esta mensagem foi gerada pelo formulário de contacto.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
