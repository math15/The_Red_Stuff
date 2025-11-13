/**
 * Client-side service for user actions (saves, engagement, feedback)
 */

export interface SavedQuote {
  id: string;
  quoteId: string;
  notes?: string;
  createdAt: string;
  quote: {
    id: string;
    text: string;
    reference: string;
    theme: string;
    tags: string[];
    context?: string;
  };
}

export type EngagementEventType =
  | 'page_view'
  | 'quote_view'
  | 'opportunity_view'
  | 'opportunity_click'
  | 'quote_share'
  | 'opportunity_share'
  | 'question_asked'
  | 'search_performed'
  | 'interest_expressed';

export type MatchType =
  | 'event_quote'
  | 'event_opportunity'
  | 'question_quote'
  | 'question_opportunity';

export interface TrackEngagementParams {
  userId?: string;
  sessionId?: string;
  eventType: EngagementEventType;
  eventData?: Record<string, unknown>;
  pageUrl?: string;
  referrer?: string;
}

export interface SubmitFeedbackParams {
  userId?: string;
  matchType: MatchType;
  eventId?: string;
  questionId?: string;
  quoteId?: string;
  opportunityId?: string;
  rating?: number;
  helpful?: boolean;
  feedbackText?: string;
}

/**
 * User actions service
 */
export class UserActionsService {
  /**
   * Save/favorite a quote
   */
  static async saveQuote(
    userId: string,
    quoteId: string,
    notes?: string
  ): Promise<{ success: boolean; alreadySaved?: boolean; error?: string }> {
    const response = await fetch('/api/quotes/saves', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, quoteId, notes }),
    });

    return response.json();
  }

  /**
   * Unsave/unfavorite a quote
   */
  static async unsaveQuote(
    userId: string,
    quoteId: string
  ): Promise<{ success: boolean; error?: string }> {
    const response = await fetch(
      `/api/quotes/saves?userId=${encodeURIComponent(
        userId
      )}&quoteId=${encodeURIComponent(quoteId)}`,
      {
        method: 'DELETE',
      }
    );

    return response.json();
  }

  /**
   * Get all saved quotes for a user
   */
  static async getSavedQuotes(
    userId: string
  ): Promise<{ success: boolean; data?: SavedQuote[]; error?: string }> {
    const response = await fetch(
      `/api/quotes/saves?userId=${encodeURIComponent(userId)}`
    );

    return response.json();
  }

  /**
   * Track user engagement event
   */
  static async trackEngagement(
    params: TrackEngagementParams
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/engagement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      return response.json();
    } catch {
      // Silently fail engagement tracking to not disrupt user experience
      return { success: false };
    }
  }

  /**
   * Submit feedback for a match
   */
  static async submitFeedback(
    params: SubmitFeedbackParams
  ): Promise<{ success: boolean; error?: string }> {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    return response.json();
  }

  /**
   * Track page view (convenience method)
   */
  static async trackPageView(
    pageUrl: string,
    userId?: string,
    sessionId?: string
  ) {
    return this.trackEngagement({
      userId,
      sessionId,
      eventType: 'page_view',
      pageUrl,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    });
  }

  /**
   * Track quote view (convenience method)
   */
  static async trackQuoteView(
    quoteId: string,
    userId?: string,
    sessionId?: string
  ) {
    return this.trackEngagement({
      userId,
      sessionId,
      eventType: 'quote_view',
      eventData: { quote_id: quoteId },
    });
  }

  /**
   * Track opportunity view (convenience method)
   */
  static async trackOpportunityView(
    opportunityId: string,
    userId?: string,
    sessionId?: string
  ) {
    return this.trackEngagement({
      userId,
      sessionId,
      eventType: 'opportunity_view',
      eventData: { opportunity_id: opportunityId },
    });
  }

  /**
   * Track opportunity click (convenience method)
   */
  static async trackOpportunityClick(
    opportunityId: string,
    userId?: string,
    sessionId?: string
  ) {
    return this.trackEngagement({
      userId,
      sessionId,
      eventType: 'opportunity_click',
      eventData: { opportunity_id: opportunityId },
    });
  }

  /**
   * Track share action (convenience method)
   */
  static async trackShare(
    type: 'quote' | 'opportunity',
    id: string,
    platform?: string,
    userId?: string,
    sessionId?: string
  ) {
    return this.trackEngagement({
      userId,
      sessionId,
      eventType: type === 'quote' ? 'quote_share' : 'opportunity_share',
      eventData: {
        [type === 'quote' ? 'quote_id' : 'opportunity_id']: id,
        platform,
      },
    });
  }
}
