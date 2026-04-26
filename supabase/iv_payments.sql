create table if not exists iv_payments (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  wallet_address text,
  tx_signature text unique,
  tier text,
  amount integer,
  modules_unlocked text[] default '{}',
  paid boolean default true,
  created_at timestamptz default now()
);

create index if not exists iv_payments_user_id_idx on iv_payments(user_id);

alter table iv_payments add column if not exists modules_unlocked text[] default '{}';
