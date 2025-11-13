import { NextRequest, NextResponse } from 'next/server';

import { trackEngagement } from '@/lib/engagement';

// POST /api/engagement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, sessionId, eventType, eventData, pageUrl, referrer } =
      body as {
        userId?: string;
        sessionId?: string;
        eventType?: string;
        eventData?: Record<string, unknown>;
        pageUrl?: string;
        referrer?: string;
      };

    if (!eventType) {
      return NextResponse.json(
        { success: false, error: 'eventType is required' },
        { status: 400 }
      );
    }

    // Validate event type
    const validEventTypes = [
      'page_view',
      'quote_view',
      'opportunity_view',
      'opportunity_click',
      'quote_share',
      'opportunity_share',
      'question_asked',
      'search_performed',
      'interest_expressed',
    ];

    if (!validEventTypes.includes(eventType)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid event type. Must be one of: ${validEventTypes.join(
            ', '
          )}`,
        },
        { status: 400 }
      );
    }

    const result = await trackEngagement({
      userId,
      sessionId,
      eventType: eventType as never,
      eventData,
      pageUrl,
      referrer,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to track engagement',
      },
      { status: 500 }
    );
  }
}
