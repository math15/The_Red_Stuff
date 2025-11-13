-- Enable UUID generator and pgvector for embeddings
create extension if not exists "uuid-ossp";
create extension if not exists "vector";

-- Quotes table
create table if not exists public.quotes (
  id uuid primary key default uuid_generate_v4(),
  text text not null,
  reference text not null,
  theme text not null,
  tags text[] default '{}',
  context text,
  embedding vector(1536),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists quotes_theme_idx on public.quotes (theme);

-- Opportunities table
create table if not exists public.opportunities (
  id uuid primary key default uuid_generate_v4(),
  organization_name text not null,
  organization_type text not null,
  opportunity_title text not null,
  description text not null,
  time_commitment text not null,
  location jsonb not null default '{}'::jsonb,
  skills_needed text[] not null default '{}',
  cause_categories text[] not null default '{}',
  related_quotes uuid[] not null default '{}',
  urgency_level text not null default 'ongoing',
  contact_info jsonb not null default '{}'::jsonb,
  website_url text,
  application_url text,
  verified_status boolean not null default false,
  date_added timestamptz not null default now(),
  active_status boolean not null default true,
  image_url text,
  highlight_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists opportunities_active_idx on public.opportunities (active_status);
create index if not exists opportunities_cause_idx on public.opportunities using gin (cause_categories);

-- Opportunity interest table
create table if not exists public.opportunity_interest (
  id uuid primary key default uuid_generate_v4(),
  opportunity_id uuid not null references public.opportunities (id) on delete cascade,
  user_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists opportunity_interest_opportunity_idx
  on public.opportunity_interest (opportunity_id);

-- Table to store raw news events retrieved from NewsAPI + AI pipeline
create table if not exists public.news_events (
  id uuid primary key default uuid_generate_v4(),
  external_id text unique,
  headline text not null,
  summary text,
  source text,
  url text,
  region text,
  category text,
  published_at timestamptz,
  embedding vector(1536),
  created_at timestamptz not null default now()
);

create index if not exists news_events_category_idx on public.news_events (category);
create index if not exists news_events_embedding_idx on public.news_events using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Table to store AI-matched quotes per news event
create table if not exists public.news_quote_matches (
  id uuid primary key default uuid_generate_v4(),
  news_event_id uuid not null references public.news_events (id) on delete cascade,
  quote_id uuid not null references public.quotes (id) on delete cascade,
  similarity double precision not null,
  selected boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists news_quote_matches_event_idx on public.news_quote_matches (news_event_id);
create index if not exists news_quote_matches_quote_idx on public.news_quote_matches (quote_id);

-- Trigger to keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at_quotes on public.quotes;
create trigger set_updated_at_quotes
before update on public.quotes
for each row execute procedure public.set_updated_at();

drop trigger if exists set_updated_at_opportunities on public.opportunities;
create trigger set_updated_at_opportunities
before update on public.opportunities
for each row execute procedure public.set_updated_at();
