import {
  loadCurrentEvents,
  loadOpportunities,
  loadQuotes,
} from '@/lib/data-sources';
import { getServiceSupabase } from '@/lib/supabase/server';

import { quoteToActionMap } from '@/data/quote-map';

import {
  Database,
  Opportunity,
  OpportunityFilters,
  Quote,
  RecommendationSignal,
} from '@/types';

const normalize = (value?: string) => value?.toLowerCase().trim() ?? '';

const matchesFilter = (
  opportunity: Opportunity,
  filters?: OpportunityFilters
) => {
  if (!filters) return true;
  const { location, cause, timeCommitment, skills, mode, urgency } = filters;

  if (location) {
    const locationNeedle = normalize(location);
    const haystack = `${opportunity.location.city ?? ''} ${
      opportunity.location.state ?? ''
    } ${opportunity.location.country ?? ''} ${
      opportunity.location.mode
    }`.toLowerCase();
    if (!haystack.includes(locationNeedle)) {
      return false;
    }
  }

  if (cause && cause !== 'all') {
    const causeList = Array.isArray(cause) ? cause : [cause];
    const matchesCause = causeList.some((category) =>
      opportunity.cause_categories.includes(category)
    );
    if (!matchesCause) {
      return false;
    }
  }

  if (timeCommitment && timeCommitment !== 'any') {
    if (opportunity.time_commitment !== timeCommitment) {
      return false;
    }
  }

  if (mode && mode !== 'any') {
    if (opportunity.location.mode !== mode) {
      return false;
    }
  }

  if (urgency && urgency !== 'any') {
    if (opportunity.urgency_level !== urgency) {
      return false;
    }
  }

  if (skills && skills.length > 0) {
    const normalizedSkills = skills.map((skill) => normalize(skill));
    const available = opportunity.skills_needed.map((skill) =>
      normalize(skill)
    );
    const hasRequiredSkill = normalizedSkills.every((skill) =>
      available.some((opSkill) => opSkill.includes(skill))
    );
    if (!hasRequiredSkill) return false;
  }

  return true;
};

export const getAllOpportunities = async () =>
  (await loadOpportunities()).filter((item) => item.active_status);

export interface FilteredOpportunityOptions extends OpportunityFilters {
  search?: string;
  featuredOnly?: boolean;
  limit?: number;
  offset?: number;
}

export const filterOpportunities = async (
  options?: FilteredOpportunityOptions
) => {
  const {
    search,
    featuredOnly,
    limit = 50,
    offset = 0,
    ...filters
  } = options ?? {};

  const dataset = await getAllOpportunities();
  let data = dataset.filter((opportunity) =>
    matchesFilter(opportunity, filters)
  );

  if (featuredOnly) {
    data = data.filter(
      (item) =>
        item.urgency_level === 'immediate' || Boolean(item.highlight_reason)
    );
  }

  if (search) {
    const query = normalize(search);
    data = data.filter((item) => {
      const haystack = `${item.opportunity_title} ${item.description} ${
        item.organization_name
      } ${item.highlight_reason ?? ''}`.toLowerCase();
      return haystack.includes(query);
    });
  }

  return data.slice(offset, offset + limit);
};

export const getOpportunityById = async (id: string) =>
  (await getAllOpportunities()).find((item) => item.id === id);

export const getQuotesForOpportunity = async (
  opportunity: Opportunity
): Promise<Quote[]> => {
  const quoteData = await loadQuotes();
  return opportunity.related_quotes
    .map((quoteId) => quoteData.find((quote) => quote.id === quoteId))
    .filter((quote): quote is Quote => Boolean(quote));
};

export const getFeaturedOpportunities = (limit = 6) =>
  filterOpportunities({ featuredOnly: true, limit });

export const getOpportunitiesMatchingEvent = async (eventId: string) => {
  const events = await loadCurrentEvents();
  const event = events.find((item) => item.id === eventId);
  if (!event) return [];

  if (event.related_opportunity_ids.length > 0) {
    const matches = await Promise.all(
      event.related_opportunity_ids.map((id) => getOpportunityById(id))
    );
    return matches.filter((item): item is Opportunity => Boolean(item));
  }

  // fallback: use quote themes to find opportunities
  const quoteData = await loadQuotes();
  const relatedCategories = event.related_quote_ids
    .flatMap((quoteId) => {
      const quote = quoteData.find((item) => item.id === quoteId);
      if (!quote) return [];
      const mapping =
        quoteToActionMap[quote.theme as keyof typeof quoteToActionMap];
      return mapping ?? [];
    })
    .filter(Boolean);

  const dedupedCategories = Array.from(new Set(relatedCategories));

  return filterOpportunities({
    cause: dedupedCategories[0] ?? 'all',
    limit: 6,
  });
};

export const getRecommendations = async (
  signals: RecommendationSignal = {}
) => {
  const {
    recentQuoteIds = [],
    interests = [],
    skills = [],
    location,
  } = signals;
  const dataset = await getAllOpportunities();

  const scored = dataset.map((opportunity) => {
    let score = 0;

    if (recentQuoteIds.length > 0) {
      const quoteMatches = opportunity.related_quotes.filter((quoteId) =>
        recentQuoteIds.includes(quoteId)
      ).length;
      score += quoteMatches * 3;
    }

    if (interests.length > 0) {
      const interestOverlap = opportunity.cause_categories.filter((category) =>
        interests.includes(category)
      ).length;
      score += interestOverlap * 2;
    }

    if (skills.length > 0) {
      const skillOverlap = opportunity.skills_needed.filter((skill) =>
        skills.some((userSkill) =>
          normalize(skill).includes(normalize(userSkill))
        )
      ).length;
      score += skillOverlap * 1.5;
    }

    if (location?.city || location?.region) {
      const locationHaystack = `${opportunity.location.city ?? ''} ${
        opportunity.location.state ?? ''
      }`.toLowerCase();
      const cityMatch = location?.city
        ? locationHaystack.includes(normalize(location.city))
        : false;
      const regionMatch = location?.region
        ? locationHaystack.includes(normalize(location.region))
        : false;
      if (cityMatch || regionMatch) {
        score += 2;
      }
    }

    if (opportunity.urgency_level === 'immediate') {
      score += 1;
    }

    return { opportunity, score };
  });

  return scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.opportunity)
    .slice(0, 6);
};

export interface InterestPayload {
  opportunityId: string;
  userId?: string;
  userEmail?: string;
  context?: Record<string, unknown>;
}

export const recordOpportunityInterest = async ({
  opportunityId,
  userId,
  userEmail,
  context,
}: InterestPayload) => {
  const supabase = getServiceSupabase();
  const payload: Database['public']['Tables']['opportunity_interest']['Insert'] =
    {
      opportunity_id: opportunityId,
      user_id: userId ?? null,
      metadata: {
        ...context,
        userEmail: userEmail ?? null,
      },
    };

  const { error } = await supabase.from('opportunity_interest').insert(payload);

  if (error) {
    throw new Error(`Unable to record interest: ${error.message}`);
  }

  return { success: true };
};
