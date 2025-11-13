import { NextRequest, NextResponse } from 'next/server';

import { matchQuestionToAction } from '@/lib/news-matcher';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question } = body as { question?: string };

    if (
      !question ||
      typeof question !== 'string' ||
      question.trim().length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide a valid question',
        },
        { status: 400 }
      );
    }

    const result = await matchQuestionToAction(question);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unable to match question to wisdom and action',
      },
      { status: 500 }
    );
  }
}
