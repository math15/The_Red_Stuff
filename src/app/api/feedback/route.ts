import { NextRequest, NextResponse } from 'next/server';

import { submitFeedback } from '@/lib/feedback';

// POST /api/feedback
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      matchType,
      eventId,
      questionId,
      quoteId,
      opportunityId,
      rating,
      helpful,
      feedbackText,
    } = body as {
      userId?: string;
      matchType?: string;
      eventId?: string;
      questionId?: string;
      quoteId?: string;
      opportunityId?: string;
      rating?: number;
      helpful?: boolean;
      feedbackText?: string;
    };

    if (!matchType) {
      return NextResponse.json(
        { success: false, error: 'matchType is required' },
        { status: 400 }
      );
    }

    // Validate match type
    const validMatchTypes = [
      'event_quote',
      'event_opportunity',
      'question_quote',
      'question_opportunity',
    ];

    if (!validMatchTypes.includes(matchType)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid match type. Must be one of: ${validMatchTypes.join(
            ', '
          )}`,
        },
        { status: 400 }
      );
    }

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const result = await submitFeedback({
      userId,
      matchType: matchType as never,
      eventId,
      questionId,
      quoteId,
      opportunityId,
      rating,
      helpful,
      feedbackText,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to submit feedback',
      },
      { status: 500 }
    );
  }
}
