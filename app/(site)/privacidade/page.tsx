
export default function PrivacidadePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-3">Política de Privacidade</h1>
      <p className="opacity-80 text-sm mb-4">Última atualização: {new Date().toLocaleDateString('pt-PT')}</p>
      <div className="prose prose-slate max-w-none">
        <p>Respeitamos a tua privacidade. Esta Política explica que dados recolhemos e como os utilizamos.</p>
        <h2>Dados que recolhemos</h2>
        <ul>
          <li>Dados de conta (email, palavra‑passe) para autenticação.</li>
          <li>Dados de subscrição (estado do plano, período, identificadores Stripe).</li>
          <li>Dados de utilização (número de execuções de prompts para controlo de limites).</li>
        </ul>
        <h2>Base legal e finalidade</h2>
        <p>Tratamos dados para executar o contrato (fornecer o serviço), cumprir obrigações legais (faturação) e interesse legítimo (melhorar o serviço). Não vendemos dados.</p>
        <h2>Partilha</h2>
        <p>Partilhamos com processadores como Stripe (pagamentos) e o nosso fornecedor de base de dados (Supabase). Estes atuam em nosso nome.</p>
        <h2>Conservação</h2>
        <p>Guardamos os dados enquanto a conta estiver ativa e por prazos legais de faturação. Podes pedir eliminação/contactar‑nos a qualquer momento.</p>
        <h2>Direitos do titular (GDPR)</h2>
        <p>Acesso, retificação, apagamento, oposição, limitação e portabilidade. Contacta‑nos: privacidade@aifinder.pt.</p>
        <h2>Cookies</h2>
        <p>Usamos apenas cookies essenciais nesta fase. Se adicionarmos analytics/marketing, pediremos consentimento prévio.</p>
      </div>
    </main>
  );
}
