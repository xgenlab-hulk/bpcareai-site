/**
 * Admin - Planned Topics Management Utilities
 * Functions to read and process planned-topics-*.json files
 */
import fs from 'fs';
import path from 'path';

export interface PlannedTitle {
  title: string;
  topicCluster: string;
  primaryKeyword: string;
}

export interface TopicGroup {
  topic: string;
  titles: PlannedTitle[];
  count: number;
}

/**
 * Get all planned topics files
 */
function getPlannedTopicsFiles(): string[] {
  const dataDir = path.join(process.cwd(), 'data');

  if (!fs.existsSync(dataDir)) {
    return [];
  }

  const files = fs.readdirSync(dataDir);
  return files
    .filter(file => file.startsWith('planned-topics-') && file.endsWith('.json'))
    .map(file => path.join(dataDir, file));
}

/**
 * Get all planned titles from all planned-topics files
 */
export async function getAllPlannedTitles(): Promise<PlannedTitle[]> {
  const files = getPlannedTopicsFiles();
  const allTitles: PlannedTitle[] = [];

  for (const filePath of files) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const titles: PlannedTitle[] = JSON.parse(data);
      allTitles.push(...titles);
    } catch (error) {
      console.error(`Error reading ${filePath}:`, error);
    }
  }

  return allTitles;
}

/**
 * Group planned titles by topic cluster
 */
export async function getPlannedTitlesByTopic(): Promise<TopicGroup[]> {
  const allTitles = await getAllPlannedTitles();

  // Group by topic
  const grouped = new Map<string, PlannedTitle[]>();

  allTitles.forEach(title => {
    const topic = title.topicCluster || 'uncategorized';
    if (!grouped.has(topic)) {
      grouped.set(topic, []);
    }
    grouped.get(topic)!.push(title);
  });

  // Convert to array and sort by count
  const result: TopicGroup[] = Array.from(grouped.entries()).map(([topic, titles]) => ({
    topic,
    titles,
    count: titles.length,
  }));

  return result.sort((a, b) => b.count - a.count);
}

/**
 * Get total count of planned titles
 */
export async function getPlannedTitlesCount(): Promise<number> {
  const titles = await getAllPlannedTitles();
  return titles.length;
}

/**
 * Delete planned titles by indices
 * Returns updated files
 */
export async function deletePlannedTitles(
  topic: string,
  indices: number[]
): Promise<void> {
  const files = getPlannedTopicsFiles();
  const indicesToDelete = new Set(indices);
  let globalIndex = 0;

  for (const filePath of files) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      let titles: PlannedTitle[] = JSON.parse(data);

      // Filter titles for this topic
      const topicTitles = titles.filter(t => (t.topicCluster || 'uncategorized') === topic);
      const otherTitles = titles.filter(t => (t.topicCluster || 'uncategorized') !== topic);

      // Build new topic titles array, skipping deleted indices
      const newTopicTitles: PlannedTitle[] = [];
      for (let i = 0; i < topicTitles.length; i++) {
        if (!indicesToDelete.has(globalIndex)) {
          newTopicTitles.push(topicTitles[i]);
        }
        globalIndex++;
      }

      // Combine and save
      const newTitles = [...otherTitles, ...newTopicTitles];

      if (newTitles.length === 0) {
        // Delete file if empty
        fs.unlinkSync(filePath);
      } else {
        // Update file
        fs.writeFileSync(filePath, JSON.stringify(newTitles, null, 2), 'utf8');
      }
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
      throw error;
    }
  }
}

/**
 * Search planned titles by query
 */
export async function searchPlannedTitles(query: string): Promise<PlannedTitle[]> {
  const allTitles = await getAllPlannedTitles();

  if (!query) {
    return allTitles;
  }

  const lowerQuery = query.toLowerCase();

  return allTitles.filter(title =>
    title.title.toLowerCase().includes(lowerQuery) ||
    title.primaryKeyword?.toLowerCase().includes(lowerQuery) ||
    title.topicCluster?.toLowerCase().includes(lowerQuery)
  );
}
