export type OrganizationType =
  | 'charity'
  | 'church'
  | 'community'
  | 'environmental'
  | 'education'
  | 'healthcare'
  | 'advocacy'
  | 'other';

export type TimeCommitment =
  | 'one-time'
  | 'weekly'
  | 'monthly'
  | 'seasonal'
  | 'ongoing';

export type OpportunityLocationMode = 'remote' | 'local' | 'hybrid';

export type UrgencyLevel = 'immediate' | 'ongoing' | 'seasonal';

export type CauseCategory =
  | 'hunger'
  | 'homelessness'
  | 'education'
  | 'children'
  | 'elderly'
  | 'healthcare'
  | 'prison'
  | 'environment'
  | 'justice'
  | 'peace'
  | 'community'
  | 'family'
  | 'youth';

export interface ContactInfo {
  name?: string;
  email?: string;
  phone?: string;
  instructions?: string;
}

export interface Opportunity {
  id: string;
  organization_name: string;
  organization_type: OrganizationType;
  opportunity_title: string;
  description: string;
  time_commitment: TimeCommitment;
  location: {
    city?: string;
    state?: string;
    country?: string;
    mode: OpportunityLocationMode;
  };
  skills_needed: string[];
  cause_categories: CauseCategory[];
  related_quotes: string[];
  urgency_level: UrgencyLevel;
  contact_info: ContactInfo;
  website_url?: string;
  application_url?: string;
  verified_status: boolean;
  date_added: string;
  active_status: boolean;
  image_url?: string;
  highlight_reason?: string;
}

export interface Quote {
  id: string;
  text: string;
  reference: string;
  theme: CauseCategory | 'mercy' | 'faith' | 'hope';
  context?: string;
  tags: string[];
}

export interface CurrentEvent {
  id: string;
  headline: string;
  summary: string;
  category: CauseCategory;
  region: string;
  published_at: string;
  related_quote_ids: string[];
  related_opportunity_ids: string[];
}

export interface OpportunityFilters {
  location?: string;
  cause?: CauseCategory | CauseCategory[] | 'all';
  timeCommitment?: TimeCommitment | 'any';
  skills?: string[];
  mode?: OpportunityLocationMode | 'any';
  urgency?: UrgencyLevel | 'any';
}

export interface RecommendationSignal {
  recentQuoteIds?: string[];
  favoritedOpportunityIds?: string[];
  location?: {
    city?: string;
    region?: string;
    lat?: number;
    lng?: number;
  };
  interests?: CauseCategory[];
  skills?: string[];
}

export type QuoteThemeKey =
  | 'hunger'
  | 'peace'
  | 'children'
  | 'education'
  | 'healthcare'
  | 'homelessness'
  | 'community'
  | 'family'
  | 'healing'
  | 'mercy'
  | 'environment'
  | 'justice'
  | 'hope'
  | 'faith';

export type QuoteToActionMap = Record<QuoteThemeKey, CauseCategory[]>;
