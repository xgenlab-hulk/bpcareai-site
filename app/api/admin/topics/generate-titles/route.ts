/**
 * API Route: /api/admin/topics/generate-titles
 * POST - Generate titles for a topic from topics.json
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { updateConfigFile } from '@/lib/admin/github-api';
import fs from 'fs';
import path from 'path';
import { generateTopicCandidatesForKeyword } from '@/lib/llm/qwen-topics';
import { checkTopicDuplicate } from '@/lib/embeddings/similarity';
import { slugify } from '@/lib/utils/slugify';
import type { ArticleMeta } from '@/lib/articles/types';

/**
 * 计划中的选题
 */
interface PlannedTopic {
  title: string;
  description: string;
  primaryKeyword: string;
  topicCluster: string;
  coreKeyword: string;
  createdAt: string;
}

/**
 * topics.json 中的 topic
 */
interface TopicEntry {
  name: string;
  description?: string;
  addedAt: string;
}

/**
 * 常量配置
 */
const MAX_ATTEMPTS = 3;
const BATCH_SIZE = 30;
const DUPLICATE_THRESHOLD = 0.85;
const DELAY_BETWEEN_CHECKS = 300;

/**
 * 为单个 topic 生成标题
 */
async function generateTitlesForTopic(
  keyword: string,
  targetCount: number,
  existingTitles: string[]
): Promise<{ titles: PlannedTopic[]; stats: { total: number; accepted: number; duplicates: number; attempts: number } }> {
  const plannedTopics: PlannedTopic[] = [];
  let attempts = 0;
  let totalDuplicates = 0;

  while (plannedTopics.length < targetCount && attempts < MAX_ATTEMPTS) {
    attempts++;

    try {
      // 生成候选标题
      const alreadyPlannedTitles = plannedTopics.map((t) => t.title);
      const candidates = await generateTopicCandidatesForKeyword({
        coreKeyword: keyword,
        existingTitles,
        alreadyPlannedTitles,
        batchSize: BATCH_SIZE,
      });

      let acceptedInThisRound = 0;
      let duplicatesInThisRound = 0;

      // 检查每个候选
      for (const candidate of candidates) {
        // 如果已达到目标数量，停止检查
        if (plannedTopics.length >= targetCount) {
          break;
        }

        try {
          // 调用语义查重
          const result = await checkTopicDuplicate({
            title: candidate.title,
            description: candidate.description,
            primaryKeyword: candidate.primaryKeyword || keyword,
            duplicateThreshold: DUPLICATE_THRESHOLD,
          });

          if (result.isDuplicate) {
            duplicatesInThisRound++;
          } else {
            acceptedInThisRound++;
            plannedTopics.push({
              ...candidate,
              coreKeyword: keyword,
              createdAt: new Date().toISOString(),
            });
          }

          // 速率限制
          await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_CHECKS));
        } catch (error) {
          console.error(`Error checking duplicate for "${candidate.title}":`, error);
        }
      }

      totalDuplicates += duplicatesInThisRound;
    } catch (error) {
      console.error(`Error in attempt ${attempts} for topic "${keyword}":`, error);
    }
  }

  return {
    titles: plannedTopics,
    stats: {
      total: plannedTopics.length,
      accepted: plannedTopics.length,
      duplicates: totalDuplicates,
      attempts,
    },
  };
}

/**
 * 保存 topics 到文件（合并模式）
 */
async function saveTopicsToFile(keyword: string, newTopics: PlannedTopic[]): Promise<number> {
  const slug = slugify(keyword);
  const filePath = `data/planned-topics-${slug}.json`;

  let finalTopics: PlannedTopic[] = newTopics;
  let newCount = newTopics.length;

  // Production/GitHub mode
  if (process.env.VERCEL_ENV === 'production' || process.env.GITHUB_TOKEN) {
    // Try to get existing file from repo
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/xgenlab-hulk/bpcareai-site/main/${filePath}`
      );

      if (response.ok) {
        const existingData = await response.text();
        const existingTopics: PlannedTopic[] = JSON.parse(existingData);

        // Merge topics
        const titleSet = new Set<string>();
        const merged: PlannedTopic[] = [];

        for (const topic of existingTopics) {
          merged.push(topic);
          titleSet.add(topic.title.toLowerCase().trim());
        }

        for (const topic of newTopics) {
          const normalizedTitle = topic.title.toLowerCase().trim();
          if (!titleSet.has(normalizedTitle)) {
            merged.push(topic);
            titleSet.add(normalizedTitle);
          }
        }

        newCount = merged.length - existingTopics.length;
        finalTopics = merged;
      }
    } catch (error) {
      console.warn('File does not exist in repo, creating new:', error);
    }

    // Save to GitHub
    await updateConfigFile(
      filePath,
      finalTopics,
      `admin: generate ${newCount} titles for topic "${keyword}"`
    );
  } else {
    // Development: Use local file system
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const outputPath = path.join(dataDir, `planned-topics-${slug}.json`);

    // Check if file exists locally
    if (fs.existsSync(outputPath)) {
      try {
        const existingData = fs.readFileSync(outputPath, 'utf8');
        const existingTopics: PlannedTopic[] = JSON.parse(existingData);

        const titleSet = new Set<string>();
        const merged: PlannedTopic[] = [];

        for (const topic of existingTopics) {
          merged.push(topic);
          titleSet.add(topic.title.toLowerCase().trim());
        }

        for (const topic of newTopics) {
          const normalizedTitle = topic.title.toLowerCase().trim();
          if (!titleSet.has(normalizedTitle)) {
            merged.push(topic);
            titleSet.add(normalizedTitle);
          }
        }

        newCount = merged.length - existingTopics.length;
        finalTopics = merged;
      } catch (error) {
        console.warn('Failed to read existing file:', error);
      }
    }

    fs.writeFileSync(outputPath, JSON.stringify(finalTopics, null, 2), 'utf8');
  }

  return newCount;
}

/**
 * 从 topics.json 中移除指定的 topic
 */
async function removeTopicFromFile(topicName: string): Promise<boolean> {
  const filePath = 'data/topics.json';

  // Production/GitHub mode
  if (process.env.VERCEL_ENV === 'production' || process.env.GITHUB_TOKEN) {
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/xgenlab-hulk/bpcareai-site/main/${filePath}`
      );

      if (!response.ok) {
        return false;
      }

      const data = await response.text();
      const topics: TopicEntry[] = JSON.parse(data);

      const filtered = topics.filter(
        (t) => t.name.toLowerCase().trim() !== topicName.toLowerCase().trim()
      );

      if (filtered.length === topics.length) {
        return false;
      }

      await updateConfigFile(
        filePath,
        filtered,
        `admin: remove topic "${topicName}" after generating titles`
      );
      return true;
    } catch (error) {
      console.error('Error removing topic from topics.json:', error);
      return false;
    }
  } else {
    // Development: Use local file system
    const topicsFilePath = path.join(process.cwd(), 'data', 'topics.json');

    if (!fs.existsSync(topicsFilePath)) {
      return false;
    }

    try {
      const data = fs.readFileSync(topicsFilePath, 'utf8');
      const topics: TopicEntry[] = JSON.parse(data);

      const filtered = topics.filter(
        (t) => t.name.toLowerCase().trim() !== topicName.toLowerCase().trim()
      );

      if (filtered.length === topics.length) {
        return false;
      }

      fs.writeFileSync(topicsFilePath, JSON.stringify(filtered, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error('Error removing topic from topics.json:', error);
      return false;
    }
  }
}

/**
 * POST - 为 topic 生成标题
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { topicName, targetCount = 20 } = body;

    if (!topicName || typeof topicName !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request. topicName is required.' },
        { status: 400 }
      );
    }

    // 1. 加载已有文章数据（根据环境使用不同读取方式）
    let articles: ArticleMeta[];

    if (process.env.VERCEL_ENV === 'production') {
      // 生产环境：从GitHub Raw URL读取
      const indexUrl = 'https://raw.githubusercontent.com/xgenlab-hulk/bpcareai-site/main/data/articles-index.json';

      const indexRes = await fetch(indexUrl);
      if (!indexRes.ok) {
        return NextResponse.json(
          { error: 'articles-index.json not found in repository' },
          { status: 500 }
        );
      }

      articles = await indexRes.json();
    } else {
      // 开发环境：从本地文件系统读取
      const indexPath = path.join(process.cwd(), 'data', 'articles-index.json');

      if (!fs.existsSync(indexPath)) {
        return NextResponse.json(
          { error: 'articles-index.json not found. Please run: npm run build:articles-index' },
          { status: 500 }
        );
      }

      const articlesData = fs.readFileSync(indexPath, 'utf8');
      articles = JSON.parse(articlesData);
    }

    // 2. 提取已有文章标题列表
    const existingTitles = articles.map((a) => a.title);

    // 3. 生成标题
    const result = await generateTitlesForTopic(topicName, targetCount, existingTitles);

    if (result.titles.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate any valid titles', stats: result.stats },
        { status: 500 }
      );
    }

    // 4. 保存到 planned-topics-*.json
    const savedCount = await saveTopicsToFile(topicName, result.titles);

    // 5. 从 topics.json 中移除
    const removed = await removeTopicFromFile(topicName);

    return NextResponse.json({
      success: true,
      topicName,
      generated: result.titles.length,
      saved: savedCount,
      removedFromQueue: removed,
      stats: result.stats,
    });
  } catch (error) {
    console.error('Generate titles error:', error);
    return NextResponse.json(
      { error: 'Failed to generate titles', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
