
create table if not exists profiles (
  id uuid primary key,
  email text unique,
  plan text default 'free',
  credits_used_month int default 0,
  current_period_end timestamptz
);

create table if not exists subscriptions (
  user_id uuid references profiles(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  price_id text,
  status text,
  primary key(user_id)
);
