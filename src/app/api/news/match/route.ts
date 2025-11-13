import { NextResponse } from 'next/server';

import { matchNewsEventsToQuotes } from '@/lib/news-matcher';

export async function POST() {
  try {
    const result = await matchNewsEventsToQuotes();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unable to match news to quotes',
      },
      { status: 500 }
    );
  }
}
