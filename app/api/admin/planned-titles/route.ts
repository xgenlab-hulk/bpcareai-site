/**
 * API Route: /api/admin/planned-titles
 * DELETE - Delete planned titles by topic and indices
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { deletePlannedTitles } from '@/lib/admin/planned-topics';

export async function DELETE(request: NextRequest) {
  // Check authentication
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { topic, indices } = body;

    if (!topic || !Array.isArray(indices)) {
      return NextResponse.json(
        { error: 'Invalid request body. Expected { topic: string, indices: number[] }' },
        { status: 400 }
      );
    }

    await deletePlannedTitles(topic, indices);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete planned titles error:', error);
    return NextResponse.json(
      { error: 'Failed to delete titles' },
      { status: 500 }
    );
  }
}
