import fs from 'fs';
import path from 'path';
import { slugify } from '../utils/slugify';

/**
 * 计划中的选题
 */
export interface PlannedTopic {
  title: string;
  description: string;
  primaryKeyword: string;
  topicCluster: string;
  coreKeyword: string;
  createdAt: string;
}

/**
 * Topic 库存信息
 */
export interface TopicInventory {
  topic: string;
  filePath: string;
  count: number;
  topics: PlannedTopic[];
}

/**
 * 获取所有 topics 的库存信息
 */
export function getTopicsInventory(topics: string[]): TopicInventory[] {
  const dataDir = path.join(process.cwd(), 'data');
  const inventory: TopicInventory[] = [];

  for (const topic of topics) {
    const slug = slugify(topic);
    const filePath = path.join(dataDir, `planned-topics-${slug}.json`);

    let count = 0;
    let topicsData: PlannedTopic[] = [];

    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        topicsData = JSON.parse(content);
        count = topicsData.length;
      } catch (error) {
        console.warn(`⚠️  Failed to read ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    inventory.push({
      topic,
      filePath,
      count,
      topics: topicsData,
    });
  }

  return inventory;
}

/**
 * 获取所有 topics 的总标题数
 */
export function getTotalTopicsCount(topics: string[]): number {
  const inventory = getTopicsInventory(topics);
  return inventory.reduce((sum, item) => sum + item.count, 0);
}

/**
 * 从 topics 列表中随机选择指定数量的 topics
 */
export function selectRandomTopics(allTopics: string[], count: number): string[] {
  if (allTopics.length === 0) {
    return [];
  }

  // 打乱数组
  const shuffled = [...allTopics].sort(() => Math.random() - 0.5);

  // 返回前 count 个（如果不足则返回全部）
  return shuffled.slice(0, Math.min(count, allTopics.length));
}

/**
 * 将目标数量分配到多个 topics
 * 策略：尽量平均分配
 */
export function distributeTargetAcrossTopics(
  totalTarget: number,
  selectedTopics: string[]
): Map<string, number> {
  const distribution = new Map<string, number>();

  if (selectedTopics.length === 0) {
    return distribution;
  }

  // 计算每个 topic 应该分配的数量
  const perTopic = Math.floor(totalTarget / selectedTopics.length);
  const remainder = totalTarget % selectedTopics.length;

  let remaining = totalTarget;

  for (let i = 0; i < selectedTopics.length; i++) {
    // 前 remainder 个 topics 多分配 1 个
    const extraOne = i < remainder ? 1 : 0;
    const amount = perTopic + extraOne;

    distribution.set(selectedTopics[i], amount);
    remaining -= amount;
  }

  return distribution;
}

/**
 * 收集所有 topics 的可用标题（带来源信息）
 */
export interface TopicWithSource extends PlannedTopic {
  source: string;
}

export function collectAllAvailableTopics(topics: string[]): TopicWithSource[] {
  const inventory = getTopicsInventory(topics);
  const allTopics: TopicWithSource[] = [];

  inventory.forEach((item) => {
    item.topics.forEach((topic) => {
      allTopics.push({
        ...topic,
        source: item.topic,
      });
    });
  });

  return allTopics;
}

/**
 * 从所有可用标题中随机选择指定数量
 */
export function selectRandomTopicsForGeneration(
  topics: string[],
  count: number
): TopicWithSource[] {
  const allTopics = collectAllAvailableTopics(topics);

  if (allTopics.length === 0) {
    return [];
  }

  // 随机打乱
  const shuffled = allTopics.sort(() => Math.random() - 0.5);

  // 返回前 count 个
  return shuffled.slice(0, Math.min(count, allTopics.length));
}
