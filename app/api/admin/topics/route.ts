/**
 * API Route: /api/admin/topics
 * GET - Get all topics (from both planned-topics files and topics.json)
 * POST - Add new topics
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getAllTopicsWithStatus } from '@/lib/admin/topics';
import fs from 'fs';
import path from 'path';

const TOPICS_FILE = path.join(process.cwd(), 'data', 'topics.json');

interface Topic {
  name: string;
  description?: string;
  addedAt: string;
}

/**
 * Get all topics (unified from multiple sources)
 */
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const topics = await getAllTopicsWithStatus();
    return NextResponse.json({ topics });
  } catch (error) {
    console.error('Get topics error:', error);
    return NextResponse.json(
      { error: 'Failed to read topics' },
      { status: 500 }
    );
  }
}

/**
 * Add new topics
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { topics: newTopics } = body;

    if (!Array.isArray(newTopics) || newTopics.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request body. Expected { topics: string[] }' },
        { status: 400 }
      );
    }

    // Read existing topics
    let existingTopics: Topic[] = [];
    if (fs.existsSync(TOPICS_FILE)) {
      const data = fs.readFileSync(TOPICS_FILE, 'utf8');
      existingTopics = JSON.parse(data);
    }

    // Create topic objects with metadata
    const topicsToAdd: Topic[] = newTopics.map(name => ({
      name: name.trim(),
      addedAt: new Date().toISOString(),
    }));

    // Filter out duplicates (case-insensitive)
    const existingNames = new Set(existingTopics.map(t => t.name.toLowerCase()));
    const uniqueNewTopics = topicsToAdd.filter(
      t => !existingNames.has(t.name.toLowerCase())
    );

    if (uniqueNewTopics.length === 0) {
      return NextResponse.json(
        { error: 'All topics already exist', added: 0 },
        { status: 400 }
      );
    }

    // Combine and save
    const allTopics = [...existingTopics, ...uniqueNewTopics];

    // Ensure data directory exists
    const dataDir = path.dirname(TOPICS_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(TOPICS_FILE, JSON.stringify(allTopics, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      added: uniqueNewTopics.length,
      topics: uniqueNewTopics.map(t => t.name),
    });
  } catch (error) {
    console.error('Add topics error:', error);
    return NextResponse.json(
      { error: 'Failed to add topics' },
      { status: 500 }
    );
  }
}
