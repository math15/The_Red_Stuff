-- Enable UUID generator and pgvector for embeddings
create extension if not exists "uuid-ossp";
create extension if not exists "vector";

-- Quotes table
create table if not exists public.quotes (
  id text primary key,
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
  id text primary key,
  organization_name text not null,
  organization_type text not null check (organization_type in ('charity', 'church', 'community', 'environmental', 'healthcare', 'education', 'other')),
  opportunity_title text not null,
  description text not null,
  time_commitment text not null check (time_commitment in ('one-time', 'weekly', 'monthly', 'ongoing', 'on-call')),
  location jsonb not null default '{}'::jsonb,
  skills_needed text[] not null default '{}',
  cause_categories text[] not null default '{}',
  related_quotes text[] not null default '{}',
  urgency_level text not null default 'ongoing' check (urgency_level in ('immediate', 'high', 'ongoing', 'seasonal')),
  contact_info jsonb not null default '{}'::jsonb,
  website_url text,
  application_url text,
  verified_status boolean not null default false,
  date_added timestamptz not null default now(),
  active_status boolean not null default true,
  image_url text,
  highlight_reason text,
  virtual_opportunity boolean not null default false,
  minimum_age integer,
  maximum_participants integer,
  embedding vector(1536),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists opportunities_active_idx on public.opportunities (active_status);
create index if not exists opportunities_cause_idx on public.opportunities using gin (cause_categories);
create index if not exists opportunities_urgency_idx on public.opportunities (urgency_level);
create index if not exists opportunities_virtual_idx on public.opportunities (virtual_opportunity);
create index if not exists opportunities_embedding_idx on public.opportunities using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Opportunity interest table
create table if not exists public.opportunity_interest (
  id uuid primary key default uuid_generate_v4(),
  opportunity_id text not null references public.opportunities (id) on delete cascade,
  user_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists opportunity_interest_opportunity_idx
  on public.opportunity_interest (opportunity_id);

-- Table to store raw news events retrieved from NewsAPI + AI pipeline
create table if not exists public.news_events (
  id text primary key,
  external_id text unique,
  headline text not null,
  summary text,
  source text,
  url text,
  region text,
  category text,
  published_at timestamptz,
  related_quote_ids text[] not null default '{}',
  related_opportunity_ids text[] not null default '{}',
  embedding vector(1536),
  created_at timestamptz not null default now()
);

create index if not exists news_events_category_idx on public.news_events (category);
create index if not exists news_events_embedding_idx on public.news_events using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Table to store AI-matched quotes per news event
create table if not exists public.news_quote_matches (
  id uuid primary key default uuid_generate_v4(),
  news_event_id text not null references public.news_events (id) on delete cascade,
  quote_id text not null references public.quotes (id) on delete cascade,
  similarity double precision not null,
  selected boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists news_quote_matches_event_idx on public.news_quote_matches (news_event_id);
create index if not exists news_quote_matches_quote_idx on public.news_quote_matches (quote_id);

-- Quote to action mapping table for intelligent matching
create table if not exists public.quote_action_mappings (
  id uuid primary key default uuid_generate_v4(),
  quote_id text not null references public.quotes (id) on delete cascade,
  cause_category text not null,
  action_types text[] not null default '{}',
  keywords text[] not null default '{}',
  confidence_score double precision not null default 0.5,
  created_at timestamptz not null default now(),
  unique(quote_id, cause_category)
);

create index if not exists quote_action_mappings_quote_idx on public.quote_action_mappings (quote_id);
create index if not exists quote_action_mappings_category_idx on public.quote_action_mappings (cause_category);

-- User preferences for personalized recommendations
create table if not exists public.user_preferences (
  id uuid primary key default uuid_generate_v4(),
  user_id text unique,
  location jsonb,
  cause_categories text[] default '{}',
  skills text[] default '{}',
  time_commitment text,
  virtual_opportunity boolean default false,
  minimum_age integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_preferences_user_idx on public.user_preferences (user_id);

-- News to opportunity matches for direct action connections
create table if not exists public.news_opportunity_matches (
  id uuid primary key default uuid_generate_v4(),
  news_event_id text not null references public.news_events (id) on delete cascade,
  opportunity_id text not null references public.opportunities (id) on delete cascade,
  similarity double precision not null,
  relevance_score double precision not null default 0.5,
  created_at timestamptz not null default now(),
  unique(news_event_id, opportunity_id)
);

create index if not exists news_opportunity_matches_event_idx on public.news_opportunity_matches (news_event_id);
create index if not exists news_opportunity_matches_opportunity_idx on public.news_opportunity_matches (opportunity_id);

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

drop trigger if exists set_updated_at_user_preferences on public.user_preferences;
create trigger set_updated_at_user_preferences
before update on public.user_preferences
for each row execute procedure public.set_updated_at();

-- User questions asked (for AI matching and tracking)
create table if not exists public.user_questions (
  id uuid primary key default uuid_generate_v4(),
  user_id text,
  question text not null,
  matched_quote_ids text[] default '{}',
  matched_opportunity_ids text[] default '{}',
  reflection text,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists user_questions_user_idx on public.user_questions (user_id);
create index if not exists user_questions_created_idx on public.user_questions (created_at desc);

-- Quote saves/favorites
create table if not exists public.quote_saves (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,
  quote_id text not null references public.quotes (id) on delete cascade,
  notes text,
  created_at timestamptz not null default now(),
  unique(user_id, quote_id)
);

create index if not exists quote_saves_user_idx on public.quote_saves (user_id);
create index if not exists quote_saves_quote_idx on public.quote_saves (quote_id);

-- Quote search history
create table if not exists public.quote_searches (
  id uuid primary key default uuid_generate_v4(),
  user_id text,
  search_query text not null,
  result_count integer default 0,
  created_at timestamptz not null default now()
);

create index if not exists quote_searches_user_idx on public.quote_searches (user_id);
create index if not exists quote_searches_created_idx on public.quote_searches (created_at desc);

-- AI match cache to avoid recomputing
create table if not exists public.ai_match_cache (
  id uuid primary key default uuid_generate_v4(),
  cache_key text unique not null,
  match_type text not null check (match_type in ('news_event', 'user_question', 'quote_to_action')),
  input_hash text not null,
  result jsonb not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists ai_match_cache_key_idx on public.ai_match_cache (cache_key);
create index if not exists ai_match_cache_expires_idx on public.ai_match_cache (expires_at);

-- Match quality feedback
create table if not exists public.match_feedback (
  id uuid primary key default uuid_generate_v4(),
  user_id text,
  match_type text not null check (match_type in ('event_quote', 'event_opportunity', 'question_quote', 'question_opportunity')),
  event_id text,
  question_id uuid,
  quote_id text references public.quotes (id) on delete cascade,
  opportunity_id text references public.opportunities (id) on delete cascade,
  rating integer check (rating between 1 and 5),
  helpful boolean,
  feedback_text text,
  created_at timestamptz not null default now()
);

create index if not exists match_feedback_user_idx on public.match_feedback (user_id);
create index if not exists match_feedback_type_idx on public.match_feedback (match_type);
create index if not exists match_feedback_rating_idx on public.match_feedback (rating);

-- User engagement tracking
create table if not exists public.user_engagement (
  id uuid primary key default uuid_generate_v4(),
  user_id text,
  session_id text,
  event_type text not null check (event_type in (
    'page_view',
    'quote_view',
    'opportunity_view',
    'opportunity_click',
    'quote_share',
    'opportunity_share',
    'question_asked',
    'search_performed',
    'interest_expressed'
  )),
  event_data jsonb,
  page_url text,
  referrer text,
  created_at timestamptz not null default now()
);

create index if not exists user_engagement_user_idx on public.user_engagement (user_id);
create index if not exists user_engagement_type_idx on public.user_engagement (event_type);
create index if not exists user_engagement_created_idx on public.user_engagement (created_at desc);

-- Table for storing daily featured content
create table if not exists public.daily_features (
  id uuid primary key default uuid_generate_v4(),
  feature_date date unique not null default current_date,
  featured_event_id text references public.news_events (id) on delete set null,
  featured_quote_id text references public.quotes (id) on delete set null,
  featured_opportunity_id text references public.opportunities (id) on delete set null,
  reflection text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists daily_features_date_idx on public.daily_features (feature_date desc);
create index if not exists daily_features_active_idx on public.daily_features (active);

drop trigger if exists set_updated_at_daily_features on public.daily_features;
create trigger set_updated_at_daily_features
before update on public.daily_features
for each row execute procedure public.set_updated_at();

-- Analytics view for opportunity performance
create or replace view public.opportunity_performance as
select 
  o.id,
  o.opportunity_title,
  o.organization_name,
  o.urgency_level,
  count(distinct oi.id) as interest_count,
  count(distinct ue.id) as view_count,
  count(distinct mf.id) as feedback_count,
  avg(mf.rating) as avg_rating,
  o.created_at,
  max(oi.created_at) as last_interest_at
from public.opportunities o
left join public.opportunity_interest oi on o.id = oi.opportunity_id
left join public.user_engagement ue on 
  ue.event_type = 'opportunity_view' and 
  (ue.event_data->>'opportunity_id') = o.id
left join public.match_feedback mf on 
  mf.opportunity_id = o.id
where o.active_status = true
group by o.id, o.opportunity_title, o.organization_name, o.urgency_level, o.created_at;

-- Function to get recommended opportunities for a user
create or replace function public.get_user_recommendations(
  p_user_id text,
  p_limit integer default 10
)
returns table (
  opportunity_id text,
  opportunity_title text,
  organization_name text,
  description text,
  relevance_score numeric
) as $$
begin
  return query
  with user_data as (
    -- Get user's saved quotes and asked questions
    select 
      coalesce(array_agg(distinct qs.quote_id), '{}') as saved_quote_ids,
      coalesce(array_agg(distinct unnest(uq.matched_quote_ids)), '{}') as question_quote_ids,
      coalesce(up.cause_categories, '{}') as preferred_causes,
      up.location as preferred_location
    from public.user_preferences up
    left join public.quote_saves qs on qs.user_id = p_user_id
    left join public.user_questions uq on uq.user_id = p_user_id
    where up.user_id = p_user_id
    group by up.cause_categories, up.location
  ),
  scored_opportunities as (
    select 
      o.id,
      o.opportunity_title,
      o.organization_name,
      o.description,
      -- Calculate relevance score
      (
        -- Matching saved/question quotes: +3 points per match
        (cardinality(o.related_quotes & (ud.saved_quote_ids || ud.question_quote_ids)) * 3) +
        -- Matching cause categories: +2 points per match
        (cardinality(o.cause_categories & ud.preferred_causes) * 2) +
        -- Urgent opportunities: +1 point
        case when o.urgency_level = 'immediate' then 1 else 0 end +
        -- Recently added: +0.5 points
        case when o.date_added > now() - interval '7 days' then 0.5 else 0 end
      )::numeric as score
    from public.opportunities o
    cross join user_data ud
    where o.active_status = true
  )
  select 
    so.id,
    so.opportunity_title,
    so.organization_name,
    so.description,
    so.score
  from scored_opportunities so
  where so.score > 0
  order by so.score desc, random()
  limit p_limit;
end;
$$ language plpgsql;

-- Function to clean up expired cache entries
create or replace function public.cleanup_expired_cache()
returns integer as $$
declare
  deleted_count integer;
begin
  delete from public.ai_match_cache
  where expires_at < now();
  
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$ language plpgsql;

-- Function to get trending opportunities
create or replace function public.get_trending_opportunities(
  p_days integer default 7,
  p_limit integer default 10
)
returns table (
  opportunity_id text,
  opportunity_title text,
  organization_name text,
  interest_count bigint,
  view_count bigint,
  trend_score numeric
) as $$
begin
  return query
  select 
    o.id,
    o.opportunity_title,
    o.organization_name,
    count(distinct oi.id) as interest_count,
    count(distinct ue.id) as view_count,
    (
      count(distinct oi.id) * 2 + 
      count(distinct ue.id) * 1 +
      case when o.urgency_level = 'immediate' then 5 else 0 end
    )::numeric as trend_score
  from public.opportunities o
  left join public.opportunity_interest oi on 
    o.id = oi.opportunity_id and 
    oi.created_at > now() - make_interval(days => p_days)
  left join public.user_engagement ue on 
    ue.event_type = 'opportunity_view' and 
    (ue.event_data->>'opportunity_id') = o.id and
    ue.created_at > now() - make_interval(days => p_days)
  where o.active_status = true
  group by o.id, o.opportunity_title, o.organization_name, o.urgency_level
  having count(distinct oi.id) > 0 or count(distinct ue.id) > 0
  order by trend_score desc
  limit p_limit;
end;
$$ language plpgsql;

-- Row Level Security Policies
alter table public.opportunities enable row level security;
alter table public.quotes enable row level security;
alter table public.opportunity_interest enable row level security;
alter table public.news_events enable row level security;
alter table public.user_questions enable row level security;
alter table public.quote_saves enable row level security;
alter table public.match_feedback enable row level security;
alter table public.user_engagement enable row level security;

-- Public read access for opportunities and quotes
create policy "Opportunities are viewable by everyone" on public.opportunities
  for select using (true);

create policy "Quotes are viewable by everyone" on public.quotes
  for select using (true);

create policy "News events are viewable by everyone" on public.news_events
  for select using (true);

-- Users can insert their own interest
create policy "Users can express interest" on public.opportunity_interest
  for insert with check (true);

create policy "Interest records are viewable by everyone" on public.opportunity_interest
  for select using (true);

-- Users can insert their own questions
create policy "Users can ask questions" on public.user_questions
  for insert with check (true);

create policy "Users can view their own questions" on public.user_questions
  for select using (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users can manage their own quote saves
create policy "Users can save quotes" on public.quote_saves
  for insert with check (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "Users can view their own saves" on public.quote_saves
  for select using (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "Users can delete their own saves" on public.quote_saves
  for delete using (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users can provide feedback
create policy "Users can provide feedback" on public.match_feedback
  for insert with check (true);

-- Engagement tracking is insertable by anyone
create policy "Anyone can log engagement" on public.user_engagement
  for insert with check (true);
