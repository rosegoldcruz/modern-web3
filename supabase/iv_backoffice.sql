create table if not exists iv_user_profiles (
  id uuid primary key default gen_random_uuid(),
  privy_user_id text unique not null,
  email text,
  role text not null default 'MEMBER',
  current_tier text,
  referral_code text unique not null,
  referred_by_privy_user_id text,
  vault_xp integer not null default 0,
  wallet_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint iv_user_profiles_role_check check (role in ('MEMBER', 'VIP', 'ADMIN'))
);

create table if not exists iv_referral_leads (
  id uuid primary key default gen_random_uuid(),
  privy_user_id text not null,
  name text not null,
  phone text not null,
  relationship text,
  best_time_to_call text,
  profession text,
  link_sent boolean not null default false,
  status text not null default 'NEW',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists iv_user_positions (
  id uuid primary key default gen_random_uuid(),
  privy_user_id text unique not null,
  investment_total numeric not null default 0,
  advance_amount numeric not null default 0,
  royalty_spent numeric not null default 0,
  token_balance numeric not null default 0,
  dividends_total numeric not null default 0,
  royalty_2_percent_status text not null default 'NO',
  royalty_1_percent_status text not null default 'NO',
  ownership_position_status text not null default 'NO',
  equity_status text not null default 'NO',
  winning_portfolio_status text not null default 'NO',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint iv_user_positions_royalty_2_status_check check (royalty_2_percent_status in ('YES', 'NO', 'DISCONTINUED')),
  constraint iv_user_positions_royalty_1_status_check check (royalty_1_percent_status in ('YES', 'NO', 'DISCONTINUED')),
  constraint iv_user_positions_ownership_status_check check (ownership_position_status in ('YES', 'NO', 'DISCONTINUED')),
  constraint iv_user_positions_equity_status_check check (equity_status in ('YES', 'NO', 'DISCONTINUED')),
  constraint iv_user_positions_winning_portfolio_status_check check (winning_portfolio_status in ('YES', 'NO', 'DISCONTINUED'))
);

create table if not exists iv_status_tickets (
  id uuid primary key default gen_random_uuid(),
  privy_user_id text not null,
  name text,
  email text,
  subject text not null,
  message text not null,
  admin_response text,
  status text not null default 'PENDING',
  last_update timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint iv_status_tickets_status_check check (status in ('PENDING', 'RESPONDED', 'CLOSED'))
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_iv_user_profiles_updated_at on iv_user_profiles;
create trigger set_iv_user_profiles_updated_at
before update on iv_user_profiles
for each row execute procedure set_updated_at();

drop trigger if exists set_iv_referral_leads_updated_at on iv_referral_leads;
create trigger set_iv_referral_leads_updated_at
before update on iv_referral_leads
for each row execute procedure set_updated_at();

drop trigger if exists set_iv_user_positions_updated_at on iv_user_positions;
create trigger set_iv_user_positions_updated_at
before update on iv_user_positions
for each row execute procedure set_updated_at();

drop trigger if exists set_iv_status_tickets_updated_at on iv_status_tickets;
create trigger set_iv_status_tickets_updated_at
before update on iv_status_tickets
for each row execute procedure set_updated_at();

create index if not exists iv_user_profiles_privy_user_id_idx on iv_user_profiles(privy_user_id);
create index if not exists iv_user_profiles_referral_code_idx on iv_user_profiles(referral_code);
create index if not exists iv_user_profiles_created_at_idx on iv_user_profiles(created_at);

create index if not exists iv_referral_leads_privy_user_id_idx on iv_referral_leads(privy_user_id);
create index if not exists iv_referral_leads_status_idx on iv_referral_leads(status);
create index if not exists iv_referral_leads_created_at_idx on iv_referral_leads(created_at);

create index if not exists iv_user_positions_privy_user_id_idx on iv_user_positions(privy_user_id);
create index if not exists iv_user_positions_created_at_idx on iv_user_positions(created_at);

create index if not exists iv_status_tickets_privy_user_id_idx on iv_status_tickets(privy_user_id);
create index if not exists iv_status_tickets_status_idx on iv_status_tickets(status);
create index if not exists iv_status_tickets_created_at_idx on iv_status_tickets(created_at);
