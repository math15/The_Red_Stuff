import { CurrentEvent, Opportunity, Quote } from '@/types';

export interface NewsMatchResult {
  matches: Array<{
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
  }>;
  summary: string;
}

export interface QuestionMatchResult {
  quotes: Array<{
    quote: Quote;
    relevance: string;
  }>;
  opportunities: Array<{
    opportunity: Opportunity;
    reasoning: string;
  }>;
  reflection: string;
}

/**
 * Client-side service for AI matching functionality
 */
export class AIMatcherService {
  /**
   * Match current news events to quotes and opportunities
   */
  static async matchNewsEvents(): Promise<NewsMatchResult> {
    const response = await fetch('/api/news/match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to match news events');
    }

    const data = await response.json();
    return data;
  }

  /**
   * Match a user question to relevant quotes and opportunities
   */
  static async matchQuestion(question: string): Promise<QuestionMatchResult> {
    const response = await fetch('/api/ask/match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to match question');
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Get opportunities matching a specific event
   */
  static async getOpportunitiesForEvent(
    eventId: string
  ): Promise<Opportunity[]> {
    const response = await fetch(`/api/opportunities/match/${eventId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch opportunities for event');
    }

    return response.json();
  }
}
