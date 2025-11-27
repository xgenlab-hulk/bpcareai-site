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
 * 获取所有 planned-topics-*.json 文件路径
 * 通过扫描 data 目录，不再依赖配置文件
 */
export function getAllPlannedTopicsFiles(): string[] {
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
 * 从 planned-topics-*.json 文件名中提取 topic 名称
 * 例如: planned-topics-blood-pressure.json -> blood pressure
 */
export function extractTopicNameFromFile(filePath: string): string {
  const fileName = path.basename(filePath, '.json');
  // 移除 'planned-topics-' 前缀
  const slug = fileName.replace('planned-topics-', '');
  // 将 kebab-case 转换回原始格式
  return slug.replace(/-/g, ' ');
}

/**
 * 获取所有 topics 的库存信息
 * 不再需要 topics 参数，直接扫描 data 目录
 */
export function getTopicsInventory(): TopicInventory[] {
  const files = getAllPlannedTopicsFiles();
  const inventory: TopicInventory[] = [];

  for (const filePath of files) {
    const topic = extractTopicNameFromFile(filePath);
    let count = 0;
    let topicsData: PlannedTopic[] = [];

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      topicsData = JSON.parse(content);
      count = topicsData.length;
    } catch (error) {
      console.warn(`⚠️  Failed to read ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
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
 * 不再需要 topics 参数，直接扫描所有文件
 */
export function getTotalTopicsCount(): number {
  const inventory = getTopicsInventory();
  return inventory.reduce((sum, item) => sum + item.count, 0);
}

/**
 * 从所有可用的 topics 中随机选择指定数量
 * 不再需要 topics 参数，直接从扫描的文件中获取
 */
export function selectRandomTopics(count: number): string[] {
  const inventory = getTopicsInventory();
  const allTopics = inventory.map(item => item.topic);

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
 * @deprecated 使用 selectTopicsForReplenishment() 替代，提供更智能的分配策略
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
 * 智能选择需要补充的 topics 并分配数量
 * 策略：按库存量优先补充，避免随机选择导致的库存不均
 *
 * @param targetCount - 总共需要补充的标题数量
 * @returns Map<话题名称, 分配数量>
 *
 * 补充规则：
 * 1. 按当前库存量从低到高排序
 * 2. 优先为库存少的话题分配补充数量
 * 3. 单个话题库存上限：50个
 * 4. 单次补充上限：20个/话题
 * 5. 分配完 targetCount 或所有话题达标为止
 */
export function selectTopicsForReplenishment(targetCount: number): Map<string, number> {
  const MAX_TITLES_PER_TOPIC = 50;  // 单话题库存上限
  const MAX_REPLENISH_PER_TOPIC = 20;  // 单次最大补充量

  const distribution = new Map<string, number>();

  if (targetCount <= 0) {
    return distribution;
  }

  // 1. 获取所有话题的当前库存
  const inventory = getTopicsInventory();

  if (inventory.length === 0) {
    console.warn('⚠️  No topics found for replenishment');
    return distribution;
  }

  // 2. 按库存量从低到高排序
  const sortedByCount = inventory.sort((a, b) => a.count - b.count);

  // 3. 依次为低库存话题分配补充数量
  let remaining = targetCount;

  for (const item of sortedByCount) {
    if (remaining <= 0) {
      break;  // 已分配完毕
    }

    const currentCount = item.count;

    // 如果已达到库存上限，跳过
    if (currentCount >= MAX_TITLES_PER_TOPIC) {
      continue;
    }

    // 计算该话题需要多少个才能达到上限
    const needToReachMax = MAX_TITLES_PER_TOPIC - currentCount;

    // 本次分配数量 = min(剩余数量, 需要数量, 单次上限)
    const allocate = Math.min(remaining, needToReachMax, MAX_REPLENISH_PER_TOPIC);

    if (allocate > 0) {
      distribution.set(item.topic, allocate);
      remaining -= allocate;
    }
  }

  return distribution;
}

/**
 * 收集所有 topics 的可用标题（带来源信息）
 */
export interface TopicWithSource extends PlannedTopic {
  source: string;
}

export function collectAllAvailableTopics(): TopicWithSource[] {
  const inventory = getTopicsInventory();
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
 * 不再需要 topics 参数，直接从扫描的文件中获取
 */
export function selectRandomTopicsForGeneration(
  count: number
): TopicWithSource[] {
  const allTopics = collectAllAvailableTopics();

  if (allTopics.length === 0) {
    return [];
  }

  // 随机打乱
  const shuffled = allTopics.sort(() => Math.random() - 0.5);

  // 返回前 count 个
  return shuffled.slice(0, Math.min(count, allTopics.length));
}
