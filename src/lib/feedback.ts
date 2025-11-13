import logger from '@/lib/logger';
import { getServiceSupabase } from '@/lib/supabase/server';

import { TablesInsert } from '@/types';

export type MatchType =
  | 'event_quote'
  | 'event_opportunity'
  | 'question_quote'
  | 'question_opportunity';

export interface SubmitFeedbackParams {
  userId?: string;
  matchType: MatchType;
  eventId?: string;
  questionId?: string;
  quoteId?: string;
  opportunityId?: string;
  rating?: number; // 1-5
  helpful?: boolean;
  feedbackText?: string;
}

/**
 * Submit feedback for a match
 */
export async function submitFeedback(params: SubmitFeedbackParams) {
  try {
    const supabase = getServiceSupabase();

    const payload: TablesInsert<'match_feedback'> = {
      user_id: params.userId ?? null,
      match_type: params.matchType,
      event_id: params.eventId ?? null,
      question_id: params.questionId ?? null,
      quote_id: params.quoteId ?? null,
      opportunity_id: params.opportunityId ?? null,
      rating: params.rating ?? null,
      helpful: params.helpful ?? null,
      feedback_text: params.feedbackText ?? null,
    };

    const { error } = await supabase
      .from('match_feedback')
      .insert(payload as never);

    if (error) {
      logger(error, 'submit-feedback-error');
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    logger(error, 'submit-feedback-error');
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to submit feedback',
    };
  }
}

/**
 * Get average rating for a quote
 */
export async function getQuoteRating(quoteId: string): Promise<{
  averageRating: number;
  totalRatings: number;
}> {
  try {
    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from('match_feedback')
      .select('rating')
      .eq('quote_id', quoteId)
      .not('rating', 'is', null);

    if (error || !data || data.length === 0) {
      return { averageRating: 0, totalRatings: 0 };
    }

    const ratings = data
      .filter((row: { rating: number | null }) => row.rating !== null)
      .map((row: { rating: number | null }) => row.rating as number);

    if (ratings.length === 0) {
      return { averageRating: 0, totalRatings: 0 };
    }

    const sum = ratings.reduce((acc, val) => acc + val, 0);
    const average = sum / ratings.length;

    return {
      averageRating: Math.round(average * 10) / 10, // Round to 1 decimal
      totalRatings: ratings.length,
    };
  } catch (error) {
    logger(error, 'get-quote-rating-error');
    return { averageRating: 0, totalRatings: 0 };
  }
}

/**
 * Get average rating for an opportunity
 */
export async function getOpportunityRating(opportunityId: string): Promise<{
  averageRating: number;
  totalRatings: number;
  helpfulCount: number;
}> {
  try {
    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from('match_feedback')
      .select('rating, helpful')
      .eq('opportunity_id', opportunityId);

    if (error || !data || data.length === 0) {
      return { averageRating: 0, totalRatings: 0, helpfulCount: 0 };
    }

    const ratings = data
      .filter((row: { rating: number | null }) => row.rating !== null)
      .map((row: { rating: number | null }) => row.rating as number);
    const helpfulCount = data.filter(
      (row: { helpful: boolean | null }) => row.helpful === true
    ).length;

    if (ratings.length === 0) {
      return { averageRating: 0, totalRatings: 0, helpfulCount };
    }

    const sum = ratings.reduce((acc, val) => acc + val, 0);
    const average = sum / ratings.length;

    return {
      averageRating: Math.round(average * 10) / 10,
      totalRatings: ratings.length,
      helpfulCount,
    };
  } catch (error) {
    logger(error, 'get-opportunity-rating-error');
    return { averageRating: 0, totalRatings: 0, helpfulCount: 0 };
  }
}

/**
 * Get feedback statistics
 */
export async function getFeedbackStats(): Promise<{
  totalFeedback: number;
  averageRating: number;
  helpfulPercentage: number;
}> {
  try {
    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from('match_feedback')
      .select('rating, helpful');

    if (error || !data || data.length === 0) {
      return { totalFeedback: 0, averageRating: 0, helpfulPercentage: 0 };
    }

    const ratings = data
      .filter((row: { rating: number | null }) => row.rating !== null)
      .map((row: { rating: number | null }) => row.rating as number);
    const helpfulCount = data.filter(
      (row: { helpful: boolean | null }) => row.helpful === true
    ).length;
    const helpfulVotes = data.filter(
      (row: { helpful: boolean | null }) => row.helpful !== null
    ).length;

    const averageRating =
      ratings.length > 0
        ? Math.round(
            (ratings.reduce((acc, val) => acc + val, 0) / ratings.length) * 10
          ) / 10
        : 0;

    const helpfulPercentage =
      helpfulVotes > 0 ? Math.round((helpfulCount / helpfulVotes) * 100) : 0;

    return {
      totalFeedback: data.length,
      averageRating,
      helpfulPercentage,
    };
  } catch (error) {
    logger(error, 'get-feedback-stats-error');
    return { totalFeedback: 0, averageRating: 0, helpfulPercentage: 0 };
  }
}
