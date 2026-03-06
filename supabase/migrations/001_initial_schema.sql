-- ============================================================
-- JTL-Desk: Initial Schema
-- Anwenden via: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- TENANTS (ein JTL-Händler = ein Tenant)
-- ============================================================
create table if not exists tenants (
  id                  uuid primary key default uuid_generate_v4(),
  name                text not null,
  slug                text unique not null,
  plan                text not null default 'starter' check (plan in ('starter', 'growth', 'pro')),
  jtl_api_key         text,
  jtl_api_url         text,
  openclaw_bridge_url text,
  created_at          timestamptz not null default now()
);

-- ============================================================
-- AGENTS (Mitarbeiter eines Tenants)
-- ============================================================
create table if not exists agents (
  id          uuid primary key default uuid_generate_v4(),
  tenant_id   uuid not null references tenants(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  role        text not null default 'agent' check (role in ('admin', 'agent')),
  avatar      text,
  is_online   boolean not null default false,
  created_at  timestamptz not null default now(),
  unique(tenant_id, user_id)
);

-- ============================================================
-- TICKETS
-- ============================================================
create table if not exists tickets (
  id              uuid primary key default uuid_generate_v4(),
  tenant_id       uuid not null references tenants(id) on delete cascade,
  subject         text not null,
  status          text not null default 'open'   check (status in ('open', 'in_progress', 'resolved', 'escalated')),
  priority        text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  channel         text not null default 'web'    check (channel in ('email', 'whatsapp', 'telegram', 'web')),
  assigned_to     uuid references agents(id) on delete set null,
  jtl_order_id    text,
  jtl_order_data  jsonb,
  sla_deadline    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger tickets_updated_at
  before update on tickets
  for each row execute function update_updated_at();

-- ============================================================
-- MESSAGES
-- ============================================================
create table if not exists messages (
  id           uuid primary key default uuid_generate_v4(),
  ticket_id    uuid not null references tickets(id) on delete cascade,
  tenant_id    uuid not null references tenants(id) on delete cascade,
  sender_type  text not null check (sender_type in ('customer', 'agent', 'bot')),
  sender_name  text not null,
  body         text not null,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- SLA POLICIES
-- ============================================================
create table if not exists sla_policies (
  id                   uuid primary key default uuid_generate_v4(),
  tenant_id            uuid not null references tenants(id) on delete cascade,
  priority             text not null check (priority in ('low', 'medium', 'high', 'urgent')),
  first_response_hours int not null default 24,
  resolve_hours        int not null default 72,
  unique(tenant_id, priority)
);

-- ============================================================
-- AUDIT LOGS (DSGVO)
-- ============================================================
create table if not exists audit_logs (
  id            uuid primary key default uuid_generate_v4(),
  tenant_id     uuid references tenants(id) on delete set null,
  action        text not null,
  actor_id      uuid,
  resource_type text,
  resource_id   uuid,
  metadata      jsonb,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Kein Tenant sieht Daten eines anderen Tenants.
-- ============================================================

-- Helper: get tenant_id of current user
create or replace function get_current_tenant_id()
returns uuid language sql stable as $$
  select tenant_id from agents where user_id = auth.uid() limit 1;
$$;

-- TENANTS
alter table tenants enable row level security;
create policy "Tenant: read own" on tenants
  for select using (id = get_current_tenant_id());
create policy "Tenant: update own" on tenants
  for update using (id = get_current_tenant_id());

-- AGENTS
alter table agents enable row level security;
create policy "Agents: read own tenant" on agents
  for select using (tenant_id = get_current_tenant_id());
create policy "Agents: insert own tenant" on agents
  for insert with check (tenant_id = get_current_tenant_id());
create policy "Agents: update own tenant" on agents
  for update using (tenant_id = get_current_tenant_id());

-- TICKETS
alter table tickets enable row level security;
create policy "Tickets: read own tenant" on tickets
  for select using (tenant_id = get_current_tenant_id());
create policy "Tickets: insert own tenant" on tickets
  for insert with check (tenant_id = get_current_tenant_id());
create policy "Tickets: update own tenant" on tickets
  for update using (tenant_id = get_current_tenant_id());

-- MESSAGES
alter table messages enable row level security;
create policy "Messages: read own tenant" on messages
  for select using (tenant_id = get_current_tenant_id());
create policy "Messages: insert own tenant" on messages
  for insert with check (tenant_id = get_current_tenant_id());

-- SLA POLICIES
alter table sla_policies enable row level security;
create policy "SLA: read own tenant" on sla_policies
  for select using (tenant_id = get_current_tenant_id());
create policy "SLA: all own tenant" on sla_policies
  for all using (tenant_id = get_current_tenant_id());

-- AUDIT LOGS
alter table audit_logs enable row level security;
create policy "Audit: read own tenant" on audit_logs
  for select using (tenant_id = get_current_tenant_id());
create policy "Audit: insert own tenant" on audit_logs
  for insert with check (tenant_id = get_current_tenant_id());

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_tickets_tenant_status   on tickets(tenant_id, status);
create index if not exists idx_tickets_tenant_created  on tickets(tenant_id, created_at desc);
create index if not exists idx_messages_ticket         on messages(ticket_id, created_at);
create index if not exists idx_agents_user             on agents(user_id);
create index if not exists idx_audit_tenant_created    on audit_logs(tenant_id, created_at desc);

-- ============================================================
-- DEFAULT SLA POLICIES (werden beim Onboarding eingefügt)
-- ============================================================
-- Hinweis: Diese Funktion wird nach Tenant-Erstellung aufgerufen
create or replace function create_default_sla_policies(p_tenant_id uuid)
returns void language sql as $$
  insert into sla_policies (tenant_id, priority, first_response_hours, resolve_hours) values
    (p_tenant_id, 'low',    48, 120),
    (p_tenant_id, 'medium', 24,  72),
    (p_tenant_id, 'high',    8,  24),
    (p_tenant_id, 'urgent',  2,   8)
  on conflict (tenant_id, priority) do nothing;
$$;
