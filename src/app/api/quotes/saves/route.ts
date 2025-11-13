import { NextRequest, NextResponse } from 'next/server';

import {
  getSavedQuotesWithDetails,
  saveQuote,
  unsaveQuote,
} from '@/lib/quote-saves';

// GET /api/quotes/saves?userId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    const savedQuotes = await getSavedQuotesWithDetails(userId);

    return NextResponse.json({
      success: true,
      data: savedQuotes,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to get saved quotes',
      },
      { status: 500 }
    );
  }
}

// POST /api/quotes/saves
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, quoteId, notes } = body as {
      userId?: string;
      quoteId?: string;
      notes?: string;
    };

    if (!userId || !quoteId) {
      return NextResponse.json(
        { success: false, error: 'userId and quoteId are required' },
        { status: 400 }
      );
    }

    const result = await saveQuote({ userId, quoteId, notes });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save quote',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/quotes/saves
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const quoteId = searchParams.get('quoteId');

    if (!userId || !quoteId) {
      return NextResponse.json(
        { success: false, error: 'userId and quoteId are required' },
        { status: 400 }
      );
    }

    const result = await unsaveQuote(userId, quoteId);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to unsave quote',
      },
      { status: 500 }
    );
  }
}
