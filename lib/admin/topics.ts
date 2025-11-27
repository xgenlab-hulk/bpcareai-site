/**
 * Admin - Topics Management Utilities
 * Unified functions to manage topics from both planned-topics files and topics.json
 */
import fs from 'fs';
import path from 'path';

export interface TopicWithStatus {
  name: string;
  slug: string;
  status: 'with-titles' | 'new';
  titlesCount?: number;
  addedAt?: string;
}

export interface TopicsStats {
  total: number;
  withTitles: number;
  new: number;
}

/**
 * Get all planned-topics-*.json files
 */
function getPlannedTopicsFiles(): string[] {
  const dataDir = path.join(process.cwd(), 'data');

  if (!fs.existsSync(dataDir)) {
    return [];
  }

  return fs.readdirSync(dataDir)
    .filter(file => file.startsWith('planned-topics-') && file.endsWith('.json'))
    .map(file => path.join(dataDir, file));
}

/**
 * Extract topic name from planned-topics filename
 * e.g., "planned-topics-diabetes.json" -> "diabetes"
 */
function extractTopicNameFromFile(filepath: string): string {
  const filename = path.basename(filepath);
  return filename
    .replace('planned-topics-', '')
    .replace('.json', '');
}

/**
 * Get topics from topics.json
 */
function getNewTopics(): Array<{ name: string; addedAt: string }> {
  const topicsFile = path.join(process.cwd(), 'data', 'topics.json');

  if (!fs.existsSync(topicsFile)) {
    return [];
  }

  try {
    const data = fs.readFileSync(topicsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading topics.json:', error);
    return [];
  }
}

/**
 * Get all topics with their status and metadata
 */
export async function getAllTopicsWithStatus(): Promise<TopicWithStatus[]> {
  const topics: TopicWithStatus[] = [];

  // 1. Get topics from planned-topics-*.json files
  const plannedFiles = getPlannedTopicsFiles();

  for (const filepath of plannedFiles) {
    const topicName = extractTopicNameFromFile(filepath);

    try {
      const data = fs.readFileSync(filepath, 'utf8');
      const titles = JSON.parse(data);

      topics.push({
        name: topicName,
        slug: topicName,
        status: 'with-titles',
        titlesCount: Array.isArray(titles) ? titles.length : 0,
      });
    } catch (error) {
      console.error(`Error reading ${filepath}:`, error);
    }
  }

  // 2. Get topics from topics.json
  const newTopics = getNewTopics();

  for (const topic of newTopics) {
    topics.push({
      name: topic.name,
      slug: topic.name.toLowerCase().replace(/\s+/g, '-'),
      status: 'new',
      addedAt: topic.addedAt,
    });
  }

  // Sort by name
  return topics.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get topics statistics
 */
export async function getTopicsStats(): Promise<TopicsStats> {
  const topics = await getAllTopicsWithStatus();

  const withTitles = topics.filter(t => t.status === 'with-titles').length;
  const newTopics = topics.filter(t => t.status === 'new').length;

  return {
    total: topics.length,
    withTitles,
    new: newTopics,
  };
}

/**
 * Delete a topic
 * - If it has a planned-topics file, delete the file
 * - If it's only in topics.json, remove it from the array
 */
export async function deleteTopic(slug: string): Promise<void> {
  // Try to delete planned-topics file
  const plannedFile = path.join(process.cwd(), 'data', `planned-topics-${slug}.json`);

  if (fs.existsSync(plannedFile)) {
    fs.unlinkSync(plannedFile);
    return;
  }

  // Try to remove from topics.json
  const topicsFile = path.join(process.cwd(), 'data', 'topics.json');

  if (fs.existsSync(topicsFile)) {
    const data = fs.readFileSync(topicsFile, 'utf8');
    const topics = JSON.parse(data);

    // Filter out the topic (match by slug)
    const filteredTopics = topics.filter((t: any) => {
      const topicSlug = t.name.toLowerCase().replace(/\s+/g, '-');
      return topicSlug !== slug;
    });

    fs.writeFileSync(topicsFile, JSON.stringify(filteredTopics, null, 2), 'utf8');
  }
}
