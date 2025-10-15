
export default function TermosPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-3">Termos de Utilização</h1>
      <p className="opacity-80 text-sm mb-4">Última atualização: {new Date().toLocaleDateString('pt-PT')}</p>
      <div className="prose prose-slate max-w-none">
        <p>Bem-vindo ao AI Finder. Ao utilizar o nosso site, concordas com estes Termos. Caso não concordes, por favor não utilizes o serviço.</p>
        <h2>1. Serviço</h2>
        <p>Somos um comparador de ferramentas de IA. Os preços e características apresentados podem ser indicativos; recomendamos verificar no site oficial de cada fornecedor.</p>
        <h2>2. Conta e subscrições</h2>
        <p>Planos: Free, Standard (9,90€/mês) e Premium (19,90€/mês). O pagamento é processado pelo Stripe. Podes cancelar a qualquer momento através do portal do cliente.</p>
        <h2>3. Uso aceitável</h2>
        <p>É proibido o uso para atividades ilícitas, scraping abusivo, ou tentativa de contornar limites/fair‑use.</p>
        <h2>4. Responsabilidade</h2>
        <p>Fornecemos o serviço “tal como está”. Não garantimos resultados específicos. Não somos responsáveis por danos indiretos.</p>
        <h2>5. Alterações</h2>
        <p>Podemos atualizar estes Termos. Avisaremos no site quando mudanças relevantes ocorrerem.</p>
        <h2>6. Contacto</h2>
        <p>Email: apoio@aifinder.com</p>
      </div>
    </main>
  );
}
