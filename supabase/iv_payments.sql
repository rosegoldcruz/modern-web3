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

alter table iv_payments add column if not exists user_id text;
alter table iv_payments add column if not exists tx_signature text;
alter table iv_payments add column if not exists amount integer;
alter table iv_payments add column if not exists modules_unlocked text[] default '{}';
alter table iv_payments add column if not exists paid boolean default false;
alter table iv_payments add column if not exists privy_user_id text;
alter table iv_payments add column if not exists amount_usd integer;
alter table iv_payments add column if not exists token_amount integer default 0;
alter table iv_payments add column if not exists status text default 'confirmed';
alter table iv_payments add column if not exists destination_wallet text;
alter table iv_payments add column if not exists provider text;
alter table iv_payments add column if not exists selected_module integer;
alter table iv_payments add column if not exists provider_session_id text;
alter table iv_payments add column if not exists partner_user_ref text;
alter table iv_payments add column if not exists confirmed_at timestamptz;
alter table iv_payments add column if not exists updated_at timestamptz default now();

create unique index if not exists iv_payments_tx_signature_uidx on iv_payments(tx_signature) where tx_signature is not null;
create index if not exists iv_payments_privy_user_id_idx on iv_payments(privy_user_id);
create index if not exists iv_payments_status_idx on iv_payments(status);
create index if not exists iv_payments_provider_session_id_idx on iv_payments(provider_session_id);
create index if not exists iv_payments_partner_user_ref_idx on iv_payments(partner_user_ref);
