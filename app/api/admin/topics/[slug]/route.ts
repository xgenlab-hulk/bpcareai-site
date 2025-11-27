/**
 * API Route: /api/admin/topics/[slug]
 * DELETE - Delete a topic (smart delete: file or topics.json)
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { deleteTopic } from '@/lib/admin/topics';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const slug = decodeURIComponent(params.slug);

    await deleteTopic(slug);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete topic error:', error);
    return NextResponse.json(
      { error: 'Failed to delete topic' },
      { status: 500 }
    );
  }
}
