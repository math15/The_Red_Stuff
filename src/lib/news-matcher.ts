import { getOpenAIClient } from '@/lib/ai/openai';
import {
  loadCurrentEvents,
  loadOpportunities,
  loadQuotes,
} from '@/lib/data-sources';
import logger from '@/lib/logger';

import { quoteToActionMap } from '@/data/quote-map';

import { CauseCategory, CurrentEvent, Opportunity, Quote } from '@/types';

interface MatchResult {
  event: CurrentEvent;
  matchedQuotes: Array<{
    quote: Quote;
    relevanceScore: number;
    reasoning: string;
  }>;
  matchedOpportunities: Array<{
    opportunity: Opportunity;
    relevanceScore: number;
    reasoning: string;
  }>;
}

interface NewsMatchResponse {
  matches: MatchResult[];
  summary: string;
}

/**
 * Uses AI to intelligently match news events to relevant quotes and opportunities
 */
export async function matchNewsEventsToQuotes(): Promise<NewsMatchResponse> {
  try {
    const [events, quotes, opportunities] = await Promise.all([
      loadCurrentEvents(),
      loadQuotes(),
      loadOpportunities(),
    ]);

    const openai = getOpenAIClient();
    const matches: MatchResult[] = [];

    // Process each event
    for (const event of events.slice(0, 5)) {
      // Prioritize recent events
      const match = await matchSingleEvent(
        event,
        quotes,
        opportunities,
        openai
      );
      if (match) {
        matches.push(match);
      }
    }

    const summary = generateSummary(matches);

    return {
      matches,
      summary,
    };
  } catch (error) {
    logger(error, 'news-matcher-error');
    throw new Error('Failed to match news events');
  }
}

/**
 * Match a single event to quotes and opportunities using AI
 */
async function matchSingleEvent(
  event: CurrentEvent,
  quotes: Quote[],
  opportunities: Opportunity[],
  openai: ReturnType<typeof getOpenAIClient>
): Promise<MatchResult | null> {
  try {
    // Step 1: Use AI to find the most relevant quotes
    const quoteMatches = await matchEventToQuotes(event, quotes, openai);

    // Step 2: Find opportunities based on matched quotes and event category
    const opportunityMatches = await matchEventToOpportunities(
      event,
      quoteMatches.map((m) => m.quote),
      opportunities,
      openai
    );

    return {
      event,
      matchedQuotes: quoteMatches,
      matchedOpportunities: opportunityMatches,
    };
  } catch (error) {
    logger(error, `match-event-${event.id}`);
    return null;
  }
}

/**
 * Use OpenAI to match an event to relevant quotes
 */
async function matchEventToQuotes(
  event: CurrentEvent,
  quotes: Quote[],
  openai: ReturnType<typeof getOpenAIClient>
): Promise<Array<{ quote: Quote; relevanceScore: number; reasoning: string }>> {
  const prompt = `You are a biblical wisdom matcher. Given a current event, find the most relevant quotes from Jesus's teachings.

Current Event:
Headline: ${event.headline}
Summary: ${event.summary}
Category: ${event.category}

Available Quotes:
${quotes
  .map(
    (q, i) =>
      `${i + 1}. "${q.text}" (${q.reference}) - Theme: ${
        q.theme
      }, Tags: ${q.tags.join(', ')}`
  )
  .join('\n')}

Task: Select the top 3 most relevant quotes that directly address this situation. For each quote, provide:
1. The quote number (1-${quotes.length})
2. A relevance score (0-100)
3. A brief explanation of why it's relevant

Respond ONLY with a JSON array like this:
[
  {
    "quoteNumber": 1,
    "relevanceScore": 95,
    "reasoning": "This quote directly addresses the need for compassion toward those experiencing homelessness."
  }
]`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert at matching current events with relevant biblical wisdom from Jesus. You understand context, themes, and practical application.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(content) as Array<{
      quoteNumber: number;
      relevanceScore: number;
      reasoning: string;
    }>;

    return parsed
      .map((match) => {
        const quote = quotes[match.quoteNumber - 1];
        if (!quote) return null;
        return {
          quote,
          relevanceScore: match.relevanceScore,
          reasoning: match.reasoning,
        };
      })
      .filter((m): m is NonNullable<typeof m> => m !== null)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3);
  } catch (error) {
    logger(error, 'ai-quote-matching');
    // Fallback to existing related_quote_ids if AI fails
    return event.related_quote_ids
      .map((id) => quotes.find((q) => q.id === id))
      .filter((q): q is Quote => Boolean(q))
      .map((quote) => ({
        quote,
        relevanceScore: 75,
        reasoning: 'Pre-configured match based on event category',
      }));
  }
}

/**
 * Use OpenAI to match an event to relevant volunteer opportunities
 */
async function matchEventToOpportunities(
  event: CurrentEvent,
  matchedQuotes: Quote[],
  opportunities: Opportunity[],
  openai: ReturnType<typeof getOpenAIClient>
): Promise<
  Array<{ opportunity: Opportunity; relevanceScore: number; reasoning: string }>
> {
  // First, use quote themes to narrow down opportunities
  const relevantCategories = getRelevantCategoriesFromQuotes(matchedQuotes);
  const candidateOpportunities = opportunities.filter(
    (opp) =>
      opp.active_status &&
      (opp.cause_categories.some((cat) => relevantCategories.includes(cat)) ||
        opp.cause_categories.includes(event.category))
  );

  if (candidateOpportunities.length === 0) {
    // Fallback: use all active opportunities
    return opportunities
      .filter((opp) => opp.active_status)
      .slice(0, 3)
      .map((opportunity) => ({
        opportunity,
        relevanceScore: 50,
        reasoning: 'General volunteer opportunity',
      }));
  }

  // Use AI to rank and select the best opportunities
  const prompt = `You are matching current events with volunteer opportunities. Given an event and matched biblical quotes, find the most actionable volunteer opportunities.

Current Event:
Headline: ${event.headline}
Summary: ${event.summary}

Matched Wisdom:
${matchedQuotes.map((q) => `- "${q.text}" (${q.reference})`).join('\n')}

Available Opportunities:
${candidateOpportunities
  .slice(0, 20)
  .map(
    (opp, i) =>
      `${i + 1}. ${opp.opportunity_title} at ${opp.organization_name}
   Description: ${opp.description.substring(0, 150)}...
   Categories: ${opp.cause_categories.join(', ')}
   Location: ${opp.location.city || opp.location.state || 'Remote'} (${
        opp.location.mode
      })
   Urgency: ${opp.urgency_level}`
  )
  .join('\n\n')}

Task: Select the top 3-5 opportunities that best allow someone to respond to this event with action. Consider:
- Direct relevance to the problem
- Practical ability to make an impact
- Alignment with the biblical wisdom
- Urgency and accessibility

Respond ONLY with a JSON array:
[
  {
    "opportunityNumber": 1,
    "relevanceScore": 95,
    "reasoning": "This directly addresses the immediate need mentioned in the event."
  }
]`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert at connecting people to meaningful volunteer work based on current needs and their values.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(content) as Array<{
      opportunityNumber: number;
      relevanceScore: number;
      reasoning: string;
    }>;

    return parsed
      .map((match) => {
        const opportunity = candidateOpportunities[match.opportunityNumber - 1];
        if (!opportunity) return null;
        return {
          opportunity,
          relevanceScore: match.relevanceScore,
          reasoning: match.reasoning,
        };
      })
      .filter((m): m is NonNullable<typeof m> => m !== null)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5);
  } catch (error) {
    logger(error, 'ai-opportunity-matching');
    // Fallback to rule-based matching
    return candidateOpportunities.slice(0, 3).map((opportunity) => ({
      opportunity,
      relevanceScore: 70,
      reasoning: `Matches ${event.category} category`,
    }));
  }
}

/**
 * Get relevant cause categories from matched quotes
 */
function getRelevantCategoriesFromQuotes(quotes: Quote[]): CauseCategory[] {
  const categories = new Set<CauseCategory>();

  quotes.forEach((quote) => {
    const themeKey = quote.theme as keyof typeof quoteToActionMap;
    const mappedCategories = quoteToActionMap[themeKey];
    if (mappedCategories) {
      mappedCategories.forEach((cat) => categories.add(cat));
    }

    // Also add tags that match cause categories
    quote.tags.forEach((tag) => {
      if (isCauseCategory(tag)) {
        categories.add(tag);
      }
    });
  });

  return Array.from(categories);
}

/**
 * Type guard to check if a string is a valid CauseCategory
 */
function isCauseCategory(value: string): value is CauseCategory {
  const validCategories: CauseCategory[] = [
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
  return validCategories.includes(value as CauseCategory);
}

/**
 * Generate a summary of all matches
 */
function generateSummary(matches: MatchResult[]): string {
  if (matches.length === 0) {
    return 'No current events matched to quotes and opportunities.';
  }

  const totalOpportunities = matches.reduce(
    (sum, m) => sum + m.matchedOpportunities.length,
    0
  );

  return `Successfully matched ${matches.length} current events to relevant biblical wisdom and ${totalOpportunities} volunteer opportunities. Each event is connected to actionable ways to respond with compassion and service.`;
}

/**
 * Match a user question to relevant quotes and opportunities
 */
export async function matchQuestionToAction(question: string): Promise<{
  quotes: Array<{ quote: Quote; relevance: string }>;
  opportunities: Array<{ opportunity: Opportunity; reasoning: string }>;
  reflection: string;
}> {
  try {
    const [quotes, opportunities] = await Promise.all([
      loadQuotes(),
      loadOpportunities(),
    ]);

    const openai = getOpenAIClient();

    // Step 1: Find relevant quotes for the question
    const quotePrompt = `A person is seeking wisdom with this question: "${question}"

Available quotes from Jesus:
${quotes
  .map(
    (q, i) =>
      `${i + 1}. "${q.text}" (${q.reference}) - Theme: ${q.theme}, Context: ${
        q.context
      }`
  )
  .join('\n')}

Select the top 3 quotes that best address this question. Respond with JSON:
[
  {
    "quoteNumber": 1,
    "relevance": "This quote speaks to..."
  }
]`;

    const quoteResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a compassionate spiritual advisor helping people find biblical wisdom for life questions.',
        },
        {
          role: 'user',
          content: quotePrompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 400,
    });

    const quoteContent = quoteResponse.choices[0]?.message?.content;
    const quoteParsed = quoteContent
      ? (JSON.parse(quoteContent) as Array<{
          quoteNumber: number;
          relevance: string;
        }>)
      : [];

    const matchedQuotes = quoteParsed
      .map((m) => {
        const quote = quotes[m.quoteNumber - 1];
        return quote ? { quote, relevance: m.relevance } : null;
      })
      .filter((m): m is NonNullable<typeof m> => m !== null);

    // Step 2: Find opportunities based on the question and quotes
    const relevantCategories = getRelevantCategoriesFromQuotes(
      matchedQuotes.map((m) => m.quote)
    );
    const candidateOpportunities = opportunities.filter(
      (opp) =>
        opp.active_status &&
        opp.cause_categories.some((cat) => relevantCategories.includes(cat))
    );

    const oppPrompt = `A person asked: "${question}"

They resonated with these teachings:
${matchedQuotes
  .map((m) => `- "${m.quote.text}" (${m.quote.reference})`)
  .join('\n')}

Available volunteer opportunities:
${candidateOpportunities
  .slice(0, 15)
  .map(
    (opp, i) =>
      `${i + 1}. ${opp.opportunity_title} - ${opp.description.substring(
        0,
        120
      )}...`
  )
  .join('\n')}

Suggest 2-3 opportunities where they could turn this wisdom into action. Respond with JSON:
[
  {
    "opportunityNumber": 1,
    "reasoning": "This opportunity allows you to..."
  }
]`;

    const oppResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You help people translate spiritual insights into concrete acts of service.',
        },
        {
          role: 'user',
          content: oppPrompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 400,
    });

    const oppContent = oppResponse.choices[0]?.message?.content;
    const oppParsed = oppContent
      ? (JSON.parse(oppContent) as Array<{
          opportunityNumber: number;
          reasoning: string;
        }>)
      : [];

    const matchedOpportunities = oppParsed
      .map((m) => {
        const opp = candidateOpportunities[m.opportunityNumber - 1];
        return opp ? { opportunity: opp, reasoning: m.reasoning } : null;
      })
      .filter((m): m is NonNullable<typeof m> => m !== null);

    // Step 3: Generate a brief reflection
    const reflectionPrompt = `A person asked: "${question}"

You showed them these teachings:
${matchedQuotes.map((m) => `- "${m.quote.text}"`).join('\n')}

And these opportunities to serve:
${matchedOpportunities
  .map((m) => `- ${m.opportunity.opportunity_title}`)
  .join('\n')}

Write a brief (2-3 sentences) reflection connecting their question to these teachings and actions.`;

    const reflectionResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You provide brief, meaningful spiritual reflections that bridge wisdom and action.',
        },
        {
          role: 'user',
          content: reflectionPrompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 200,
    });

    const reflection =
      reflectionResponse.choices[0]?.message?.content ||
      'May these words and works guide you forward.';

    return {
      quotes: matchedQuotes,
      opportunities: matchedOpportunities,
      reflection,
    };
  } catch (error) {
    logger(error, 'match-question-error');
    throw new Error('Failed to match question to wisdom and action');
  }
}
