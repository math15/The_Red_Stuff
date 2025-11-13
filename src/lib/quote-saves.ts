import logger from '@/lib/logger';
import { getServiceSupabase } from '@/lib/supabase/server';

import { Quote, TablesInsert } from '@/types';

export interface SaveQuoteParams {
  userId: string;
  quoteId: string;
  notes?: string;
}

export interface SavedQuote {
  id: string;
  quoteId: string;
  notes?: string;
  createdAt: string;
}

/**
 * Save/favorite a quote for a user
 */
export async function saveQuote(params: SaveQuoteParams) {
  try {
    const supabase = getServiceSupabase();

    const payload: TablesInsert<'quote_saves'> = {
      user_id: params.userId,
      quote_id: params.quoteId,
      notes: params.notes ?? null,
    };

    const { data, error } = await supabase
      .from('quote_saves')
      .insert(payload as never)
      .select()
      .single();

    if (error) {
      // Check if it's a duplicate (already saved)
      if (error.code === '23505') {
        return { success: true, alreadySaved: true };
      }
      logger(error, 'save-quote-error');
      return { success: false, error: error.message };
    }

    return { success: true, data, alreadySaved: false };
  } catch (error) {
    logger(error, 'save-quote-error');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save quote',
    };
  }
}

/**
 * Remove a saved quote
 */
export async function unsaveQuote(userId: string, quoteId: string) {
  try {
    const supabase = getServiceSupabase();

    const { error } = await supabase
      .from('quote_saves')
      .delete()
      .eq('user_id', userId)
      .eq('quote_id', quoteId);

    if (error) {
      logger(error, 'unsave-quote-error');
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    logger(error, 'unsave-quote-error');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to unsave quote',
    };
  }
}

/**
 * Get all saved quotes for a user
 */
export async function getSavedQuotes(userId: string): Promise<SavedQuote[]> {
  try {
    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from('quote_saves')
      .select('id, quote_id, notes, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) {
      logger(error, 'get-saved-quotes-error');
      return [];
    }

    return data.map(
      (row: {
        id: string;
        quote_id: string;
        notes: string | null;
        created_at: string;
      }) => ({
        id: row.id,
        quoteId: row.quote_id,
        notes: row.notes ?? undefined,
        createdAt: row.created_at,
      })
    );
  } catch (error) {
    logger(error, 'get-saved-quotes-error');
    return [];
  }
}

/**
 * Get saved quotes with full quote details
 */
export async function getSavedQuotesWithDetails(
  userId: string
): Promise<Array<SavedQuote & { quote: Quote }>> {
  try {
    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from('quote_saves')
      .select(
        `
        id,
        quote_id,
        notes,
        created_at,
        quotes (
          id,
          text,
          reference,
          theme,
          tags,
          context
        )
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) {
      logger(error, 'get-saved-quotes-with-details-error');
      return [];
    }

    type JoinedRow = {
      id: string;
      quote_id: string;
      notes: string | null;
      created_at: string;
      quotes: {
        id: string;
        text: string;
        reference: string;
        theme: string;
        tags: string[];
        context?: string;
      } | null;
    };

    return (data as JoinedRow[])
      .filter((row) => row.quotes !== null)
      .map((row) => {
        const quote = row.quotes as NonNullable<typeof row.quotes>;
        return {
          id: row.id,
          quoteId: row.quote_id,
          notes: row.notes ?? undefined,
          createdAt: row.created_at,
          quote: {
            id: quote.id,
            text: quote.text,
            reference: quote.reference,
            theme: quote.theme as Quote['theme'],
            tags: quote.tags ?? [],
            context: quote.context,
          },
        };
      });
  } catch (error) {
    logger(error, 'get-saved-quotes-with-details-error');
    return [];
  }
}

/**
 * Check if a quote is saved by the user
 */
export async function isQuoteSaved(
  userId: string,
  quoteId: string
): Promise<boolean> {
  try {
    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from('quote_saves')
      .select('id')
      .eq('user_id', userId)
      .eq('quote_id', quoteId)
      .limit(1)
      .single();

    return !error && Boolean(data);
  } catch {
    return false;
  }
}

/**
 * Update notes for a saved quote
 */
export async function updateQuoteNotes(
  userId: string,
  quoteId: string,
  notes: string
) {
  try {
    const supabase = getServiceSupabase();

    const { error } = await supabase
      .from('quote_saves')
      .update({ notes } as never)
      .eq('user_id', userId)
      .eq('quote_id', quoteId);

    if (error) {
      logger(error, 'update-quote-notes-error');
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    logger(error, 'update-quote-notes-error');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update notes',
    };
  }
}
