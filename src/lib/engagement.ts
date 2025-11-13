import logger from '@/lib/logger';
import { getServiceSupabase } from '@/lib/supabase/server';

import { TablesInsert } from '@/types';

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

export interface TrackEngagementParams {
  userId?: string;
  sessionId?: string;
  eventType: EngagementEventType;
  eventData?: Record<string, unknown>;
  pageUrl?: string;
  referrer?: string;
}

/**
 * Track user engagement event
 */
export async function trackEngagement(params: TrackEngagementParams) {
  try {
    const supabase = getServiceSupabase();

    const payload: TablesInsert<'user_engagement'> = {
      user_id: params.userId ?? null,
      session_id: params.sessionId ?? null,
      event_type: params.eventType,
      event_data: (params.eventData as never) ?? null,
      page_url: params.pageUrl ?? null,
      referrer: params.referrer ?? null,
    };

    const { error } = await supabase
      .from('user_engagement')
      .insert(payload as never);

    if (error) {
      logger(error, 'engagement-tracking-error');
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    logger(error, 'engagement-tracking-error');
    return { success: false };
  }
}

/**
 * Get user's recent engagement history
 */
export async function getUserEngagement(
  userId: string,
  limit = 50
): Promise<
  Array<{ eventType: string; eventData: unknown; createdAt: string }>
> {
  try {
    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from('user_engagement')
      .select('event_type, event_data, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data) {
      return [];
    }

    return data.map(
      (row: {
        event_type: string;
        event_data: unknown;
        created_at: string;
      }) => ({
        eventType: row.event_type,
        eventData: row.event_data,
        createdAt: row.created_at,
      })
    );
  } catch (error) {
    logger(error, 'get-engagement-error');
    return [];
  }
}

/**
 * Get popular quotes based on engagement
 */
export async function getPopularQuotes(
  days = 7,
  limit = 10
): Promise<string[]> {
  try {
    const supabase = getServiceSupabase();

    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data, error } = await supabase
      .from('user_engagement')
      .select('event_data')
      .eq('event_type', 'quote_view')
      .gte('created_at', since.toISOString())
      .limit(1000);

    if (error || !data) {
      return [];
    }

    // Count quote views
    const quoteCounts = new Map<string, number>();
    data.forEach((row: { event_data: unknown }) => {
      const quoteId = (row.event_data as { quote_id?: string })?.quote_id;
      if (quoteId) {
        quoteCounts.set(quoteId, (quoteCounts.get(quoteId) || 0) + 1);
      }
    });

    // Sort by count and return top N
    return Array.from(quoteCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([quoteId]) => quoteId);
  } catch (error) {
    logger(error, 'get-popular-quotes-error');
    return [];
  }
}
