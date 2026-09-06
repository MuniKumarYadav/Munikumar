create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (position('@' in email) > 1),
  phone text,
  company text,
  service_interest text,
  message text,
  source text default 'website',
  status text not null default 'new' check (status in ('new','contacted','qualified','proposal','won','lost')),
  utm_source text, utm_medium text, utm_campaign text, utm_term text, utm_content text,
  landing_page text, referrer text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  event_name text not null,
  event_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  form_name text not null,
  payload jsonb not null default '{}'::jsonb,
  landing_page text,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;
alter table public.lead_events enable row level security;
alter table public.form_submissions enable row level security;

create policy "service role manages leads" on public.leads for all to service_role using (true) with check (true);
create policy "service role manages lead events" on public.lead_events for all to service_role using (true) with check (true);
create policy "service role manages forms" on public.form_submissions for all to service_role using (true) with check (true);

create index if not exists leads_created_at_idx on public.leads(created_at desc);
create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_email_idx on public.leads(email);
