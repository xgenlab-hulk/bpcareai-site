/**
 * API Route: /api/admin/topics/extract
 * POST - Extract topics from natural language using Qwen Plus AI
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { extractTopicsFromPrompt } from '@/lib/llm/qwen-topic-extraction';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { input } = body;

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request body. Expected { input: string }' },
        { status: 400 }
      );
    }

    // Check if QWEN_API_KEY is configured
    if (!process.env.QWEN_API_KEY) {
      return NextResponse.json(
        { error: 'QWEN_API_KEY not configured. Please add it to your .env.local file.' },
        { status: 500 }
      );
    }

    // Call Qwen Plus API using existing implementation
    const result = await extractTopicsFromPrompt(input);

    // Extract only keywords for frontend
    const topics = result.topics.map(t => t.keyword);

    return NextResponse.json({ topics });
  } catch (error) {
    console.error('AI extraction error:', error);

    // Check if it's an API key error
    if (error instanceof Error && error.message.includes('QWEN_API_KEY')) {
      return NextResponse.json(
        { error: 'QWEN_API_KEY not configured. Please add it to your .env.local file.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to extract topics. Please try again.' },
      { status: 500 }
    );
  }
}
