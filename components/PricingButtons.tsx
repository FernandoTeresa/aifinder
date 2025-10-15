'use client';

import React, { useState, forwardRef } from 'react';

/**
 * Componente genérico de botão de subscrição
 * ------------------------------------------
 * - Mantém o design e classes passadas por ti.
 * - Só trata da lógica de comunicação com /api/checkout.
 * - Suporta Apple Pay e Google Pay (via Stripe Checkout).
 */

type Plan = 'free' | 'standard' | 'premium';

type Props = {
  plan: Plan;                     // nome do plano
  className?: string;             // classes do teu design (cores, tamanho, etc.)
  label?: string;                 // texto personalizado opcional
  loadingLabel?: string;          // texto enquanto carrega (default: "A carregar…")
  disabled?: boolean;             // opcional: desativar manualmente
  'aria-label'?: string;          // acessibilidade
};

const PricingButtons = forwardRef<HTMLButtonElement, Props>(function PricingButtons(
  {
    plan,
    className,
    label,
    loadingLabel = 'A carregar…',
    disabled,
    'aria-label': ariaLabel,
  },
  ref
) {
  const [loading, setLoading] = useState(false);

  // Texto padrão caso não passes "label"
  const defaultLabel =
    plan === 'free'
      ? 'Experimentar grátis'
      : plan === 'standard'
      ? 'Subscrever Standard'
      : 'Subscrever Premium';

  async function go() {
    try {
      setLoading(true);
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();
      if (data?.url) {
        // Redireciona o utilizador para o Stripe Checkout
        window.location.href = data.url;
      } else {
        alert(data?.error || 'Erro ao iniciar checkout');
      }
    } catch (e) {
      console.error(e);
      alert('Erro inesperado.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      ref={ref}
      onClick={go}
      disabled={disabled || loading}
      // ⚠️ Nenhuma classe é forçada — o estilo é 100% o que passares no className
      className={className}
      aria-label={ariaLabel || (label ?? defaultLabel)}
      data-plan={plan}
      data-loading={loading ? 'true' : 'false'}
    >
      {loading ? loadingLabel : (label ?? defaultLabel)}
    </button>
  );
});

export default PricingButtons;