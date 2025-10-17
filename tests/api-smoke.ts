import assert from 'node:assert/strict';

// Provide required secrets for imported modules and allow stubbing.
process.env.STRIPE_SECRET_KEY ??= 'sk_test_dummy';
process.env.STRIPE_PRICE_ID_STANDARD ??= 'price_standard';
process.env.STRIPE_PRICE_ID_PREMIUM ??= 'price_premium';
process.env.SUPABASE_URL ??= 'http://localhost:54321';
process.env.SUPABASE_SERVICE_ROLE ??= 'service_role_dummy';

type Json = Record<string, unknown>;
type Handler = (req: Request) => Promise<Response>;

const recorded = {
  checkoutSessions: [] as Json[],
  billingPortalSessions: [] as Json[],
  customerLookups: [] as Json[],
  supabaseFilters: [] as Json[],
};

function createSupabaseQuery(table: string) {
  let filter: { field: string; value: string } | null = null;
  const api = {
    select() {
      return api;
    },
    limit() {
      return api;
    },
    eq(field: string, value: string) {
      filter = { field, value };
      return api;
    },
    async maybeSingle() {
      recorded.supabaseFilters.push({ table, filter });
      if (!filter) return { data: null, error: null };

      if (filter.field === 'email' && filter.value === 'user@example.com') {
        return {
          data: {
            stripe_customer_id: 'cus_888',
            email: 'user@example.com',
            plan: 'standard',
          },
          error: null,
        };
      }

      if (filter.field === 'stripe_customer_id' && filter.value === 'cus_888') {
        return {
          data: {
            stripe_customer_id: 'cus_888',
            email: 'user@example.com',
            plan: 'standard',
          },
          error: null,
        };
      }

      return { data: null, error: null };
    },
  };

  return api;
}

async function parseJson(res: Response) {
  const status = res.status;
  const json = await res.json();
  return { status, json };
}

async function postJson(handler: Handler, url: string, body: unknown) {
  const req = new Request(url, {
    method: 'POST',
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: body === undefined ? undefined : { 'content-type': 'application/json' },
  });
  return parseJson(await handler(req));
}

async function postRaw(handler: Handler, url: string, body: string) {
  const req = new Request(url, { method: 'POST', body });
  return parseJson(await handler(req));
}

async function get(handler: Handler, url: string) {
  const req = new Request(url);
  return parseJson(await handler(req));
}

async function run(
  checkoutPost: Handler,
  emailPortalPost: Handler,
  stripePortalPost: Handler,
  accountGet: Handler,
) {
  // Checkout endpoint validations.
  {
    const res = await postRaw(checkoutPost, 'http://localhost/api/checkout', 'not json');
    assert.equal(res.status, 400);
    assert.match(String(res.json.error), /JSON inválido/);
  }

  {
    const res = await postJson(checkoutPost, 'http://localhost/api/checkout', {
      plan: 'enterprise',
    });
    assert.equal(res.status, 400);
  }

  {
    const res = await postJson(checkoutPost, 'http://localhost/api/checkout', {
      plan: 'standard',
      userId: 'bad user',
    });
    assert.equal(res.status, 400);
  }

  {
    const res = await postJson(checkoutPost, 'http://localhost/api/checkout', {
      plan: 'free',
    });
    assert.equal(res.status, 200);
    assert.equal(res.json.url, 'http://localhost:3000/conta?status=success');
    assert.equal(recorded.checkoutSessions.length, 0);
  }

  {
    const res = await postJson(checkoutPost, 'http://localhost/api/checkout', {
      plan: 'standard',
      userId: 'User_123',
    });
    assert.equal(res.status, 200);
    assert.equal(res.json.url, 'https://checkout.test/session');
    assert.equal(recorded.checkoutSessions.length, 1);
    const payload = recorded.checkoutSessions[0];
    assert.equal(payload.metadata?.plan, 'standard');
    assert.equal(payload.metadata?.app, 'aifinder');
    assert.equal(payload.client_reference_id, 'User_123');
  }

  // Email portal endpoint validations.
  {
    const res = await postRaw(emailPortalPost, 'http://localhost/api/portal', 'broken');
    assert.equal(res.status, 400);
  }

  {
    const res = await postJson(emailPortalPost, 'http://localhost/api/portal', {
      email: 'bad-email',
    });
    assert.equal(res.status, 400);
  }

  {
    const res = await postJson(emailPortalPost, 'http://localhost/api/portal', {
      email: 'missing@example.com',
    });
    assert.equal(res.status, 404);
    assert.equal(recorded.billingPortalSessions.length, 0);
  }

  {
    const res = await postJson(emailPortalPost, 'http://localhost/api/portal', {
      email: 'user@example.com',
    });
    assert.equal(res.status, 200);
    assert.equal(res.json.url, 'https://portal.test/session');
    assert.equal(recorded.billingPortalSessions.length, 1);
    const payload = recorded.billingPortalSessions[0];
    assert.equal(payload.customer, 'cus_888');
  }

  // Stripe portal endpoint.
  {
    const res = await postRaw(stripePortalPost, 'http://localhost/api/stripe/portal', 'oops');
    assert.equal(res.status, 400);
  }

  {
    const res = await postJson(stripePortalPost, 'http://localhost/api/stripe/portal', {
      customerId: 'cus-123',
    });
    assert.equal(res.status, 400);
  }

  {
    const res = await postJson(stripePortalPost, 'http://localhost/api/stripe/portal', {
      customerId: 'cus_888',
    });
    assert.equal(res.status, 200);
    assert.equal(res.json.url, 'https://portal.test/session');
    assert.equal(recorded.billingPortalSessions.length, 2);
  }

  // Account lookup endpoint.
  {
    const res = await get(accountGet, 'http://localhost/api/account');
    assert.equal(res.status, 400);
  }

  {
    const res = await get(
      accountGet,
      'http://localhost/api/account?email=not-an-email',
    );
    assert.equal(res.status, 400);
  }

  {
    const res = await get(
      accountGet,
      'http://localhost/api/account?email=missing@example.com',
    );
    assert.equal(res.status, 200);
    assert.equal(res.json.ok, true);
    assert.equal(res.json.found, false);
  }

  {
    const res = await get(
      accountGet,
      'http://localhost/api/account?email=user@example.com',
    );
    assert.equal(res.status, 200);
    assert.equal(res.json.found, true);
    assert.equal(res.json.account.email, 'user@example.com');
  }

  {
    const res = await get(
      accountGet,
      'http://localhost/api/account?customer_id=cus_888',
    );
    assert.equal(res.status, 200);
    assert.equal(res.json.found, true);
    assert.equal(res.json.account.stripe_customer_id, 'cus_888');
  }
}

async function main() {
  recorded.checkoutSessions.length = 0;
  recorded.billingPortalSessions.length = 0;
  recorded.customerLookups.length = 0;
  recorded.supabaseFilters.length = 0;

  const { stripe } = await import('@/lib/stripe');
  const { supabaseAdmin } = await import('@/lib/supabaseAdmin');

  stripe.checkout.sessions.create = (async (payload: Json) => {
    recorded.checkoutSessions.push(payload);
    return {
      id: 'cs_test_123',
      url: 'https://checkout.test/session',
    } as Json;
  }) as any;

  stripe.billingPortal.sessions.create = (async (payload: Json) => {
    recorded.billingPortalSessions.push(payload);
    return {
      id: 'bps_test_123',
      url: 'https://portal.test/session',
    } as Json;
  }) as any;

  stripe.customers.list = (async (params: Json) => {
    recorded.customerLookups.push(params);
    const email = typeof params.email === 'string' ? params.email : '';
    if (email === 'user@example.com') {
      return { data: [{ id: 'cus_888' }] } as Json;
    }
    return { data: [] } as Json;
  }) as any;

  (supabaseAdmin as any).from = (table: string) => createSupabaseQuery(table);

  const { POST: checkoutPost } = await import('@/app/api/checkout/route');
  const { POST: emailPortalPost } = await import('@/app/api/portal/route');
  const { POST: stripePortalPost } = await import('@/app/api/stripe/portal/route');
  const { GET: accountGet } = await import('@/app/api/contact/route');

  await run(checkoutPost, emailPortalPost, stripePortalPost, accountGet);

  console.log('✅ API smoke tests passed');
}

main().catch((error) => {
  console.error('❌ API smoke tests failed');
  console.error(error);
  process.exitCode = 1;
});
