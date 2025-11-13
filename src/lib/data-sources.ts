import { cache } from 'react';

import { fetchNewsEvents } from '@/lib/news';
import { getServiceSupabase } from '@/lib/supabase/server';

import { currentEvents as staticEvents } from '@/data/current-events';
import { opportunities as staticOpportunities } from '@/data/opportunities';
import { quotes as staticQuotes } from '@/data/quotes';

import {
  CauseCategory,
  CurrentEvent,
  Opportunity,
  OpportunityLocationMode,
  Quote,
  Tables,
  TablesInsert,
} from '@/types';

const isSupabaseConfigured =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

const parseJsonField = <T>(value: unknown, fallback: T): T => {
  if (!value) return fallback;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  if (typeof value === 'object') {
    return value as T;
  }
  return fallback;
};

const CAUSE_CATEGORY_VALUES: CauseCategory[] = [
  'hunger',
  'homelessness',
  'education',
  'children',
  'elderly',
  'healthcare',
  'prison',
  'environment',
  'justice',
  'peace',
  'community',
  'family',
  'youth',
];

const LOCATION_MODES: OpportunityLocationMode[] = ['remote', 'local', 'hybrid'];

const parseLocationField = (value: unknown): Opportunity['location'] => {
  const parsed = parseJsonField<Partial<Opportunity['location']>>(value, {
    mode: 'remote',
  });

  const mode = LOCATION_MODES.includes(parsed.mode as OpportunityLocationMode)
    ? (parsed.mode as OpportunityLocationMode)
    : 'remote';

  return {
    city: typeof parsed.city === 'string' ? parsed.city : undefined,
    state: typeof parsed.state === 'string' ? parsed.state : undefined,
    country: typeof parsed.country === 'string' ? parsed.country : undefined,
    mode,
  };
};

const parseContactField = (value: unknown): Opportunity['contact_info'] => {
  const parsed = parseJsonField<Record<string, unknown>>(value, {});
  return {
    name: typeof parsed.name === 'string' ? parsed.name : undefined,
    email: typeof parsed.email === 'string' ? parsed.email : undefined,
    phone: typeof parsed.phone === 'string' ? parsed.phone : undefined,
    instructions:
      typeof parsed.instructions === 'string' ? parsed.instructions : undefined,
  };
};

const mapOpportunityRow = (row: Tables<'opportunities'>): Opportunity => {
  const location = parseLocationField(row.location);
  const contactInfo = parseContactField(row.contact_info);
  const causeCategories = (row.cause_categories ?? []).filter(
    (category): category is CauseCategory =>
      CAUSE_CATEGORY_VALUES.includes(category as CauseCategory)
  );

  return {
    id: row.id,
    organization_name: row.organization_name,
    organization_type:
      (row.organization_type as Opportunity['organization_type']) ?? 'other',
    opportunity_title: row.opportunity_title,
    description: row.description,
    time_commitment:
      (row.time_commitment as Opportunity['time_commitment']) ?? 'one-time',
    location,
    skills_needed: row.skills_needed ?? [],
    cause_categories: causeCategories,
    related_quotes: row.related_quotes ?? [],
    urgency_level:
      (row.urgency_level as Opportunity['urgency_level']) ?? 'ongoing',
    contact_info: contactInfo,
    website_url: row.website_url ?? undefined,
    application_url: row.application_url ?? undefined,
    verified_status: row.verified_status ?? false,
    date_added: row.date_added ?? new Date().toISOString(),
    active_status: row.active_status ?? true,
    image_url: row.image_url ?? undefined,
    highlight_reason: row.highlight_reason ?? undefined,
  };
};

const mapQuoteRow = (row: Tables<'quotes'>): Quote => ({
  id: row.id,
  text: row.text,
  reference: row.reference,
  theme: row.theme as Quote['theme'],
  context: row.context ?? undefined,
  tags: row.tags ?? [],
});

export const loadOpportunities = cache(async (): Promise<Opportunity[]> => {
  if (!isSupabaseConfigured) {
    return staticOpportunities;
  }

  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase.from('opportunities').select('*');

    if (error || !data?.length) {
      return staticOpportunities;
    }

    return data.map(mapOpportunityRow);
  } catch {
    return staticOpportunities;
  }
});

export const loadQuotes = cache(async (): Promise<Quote[]> => {
  if (!isSupabaseConfigured) {
    return staticQuotes;
  }

  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase.from('quotes').select('*');

    if (error || !data?.length) {
      return staticQuotes;
    }

    return data.map(mapQuoteRow);
  } catch {
    return staticQuotes;
  }
});

const mapNewsEventRow = (row: Tables<'news_events'>): CurrentEvent => ({
  id: row.external_id ?? row.id,
  headline: row.headline,
  summary: row.summary ?? '',
  category: (row.category as CauseCategory) ?? 'community',
  region: row.region ?? row.source ?? 'Global',
  published_at: row.published_at ?? row.created_at ?? new Date().toISOString(),
  related_quote_ids: row.related_quote_ids ?? [],
  related_opportunity_ids: row.related_opportunity_ids ?? [],
});

const getSupabaseNewsEvents = async (): Promise<CurrentEvent[]> => {
  if (!isSupabaseConfigured) {
    return [];
  }

  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from('news_events')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(5);

    if (error || !data?.length) {
      return [];
    }

    return data.map(mapNewsEventRow);
  } catch {
    return [];
  }
};

const persistNewsEvents = async (events: CurrentEvent[]) => {
  if (!isSupabaseConfigured || events.length === 0) return;

  const supabase = getServiceSupabase();
  const newsInserts: TablesInsert<'news_events'>[] = events.map((event) => ({
    external_id: event.id,
    headline: event.headline,
    summary: event.summary,
    source: event.region,
    url: event.id?.startsWith('http') ? event.id : null,
    region: event.region,
    category: event.category,
    published_at: event.published_at,
    related_quote_ids: event.related_quote_ids ?? [],
    related_opportunity_ids: event.related_opportunity_ids ?? [],
  }));

  // @ts-expect-error - Supabase type inference issue with upsert
  await supabase.from('news_events').upsert(newsInserts);
};

export const loadCurrentEvents = cache(async () => {
  const supabaseEvents = await getSupabaseNewsEvents();
  if (supabaseEvents.length > 0) {
    return supabaseEvents;
  }

  const newsEvents = await fetchNewsEvents();

  if (newsEvents.length > 0) {
    await persistNewsEvents(newsEvents);
    return newsEvents;
  }

  return staticEvents;
});
