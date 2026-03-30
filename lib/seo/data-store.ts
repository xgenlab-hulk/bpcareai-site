/**
 * GSC数据存储管理
 * - 每天拉取7天数据，按日期去重存储
 * - 自动清理12个月前的数据
 */

import fs from 'fs';
import path from 'path';

const SEO_DATA_DIR = path.join(process.cwd(), 'data', 'seo');
const RAW_DIR = path.join(SEO_DATA_DIR, 'raw');
const ANALYSIS_DIR = path.join(SEO_DATA_DIR, 'analysis');
const RETENTION_MONTHS = 12;

/**
 * 每天存储的原始GSC数据格式
 */
export interface DailyRawData {
  date: string;                   // 数据日期 YYYY-MM-DD
  fetchedAt: string;              // 拉取时间 ISO
  queries: QueryRecord[];         // 搜索词数据
  pages: PageRecord[];            // 页面数据
  summary: DailySummary;          // 当天汇总
}

export interface QueryRecord {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface PageRecord {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface DailySummary {
  totalQueries: number;
  totalImpressions: number;
  totalClicks: number;
  avgPosition: number;
  pagesWithImpressions: number;
}

/**
 * 确保目录存在
 */
function ensureDirs(): void {
  for (const dir of [SEO_DATA_DIR, RAW_DIR, ANALYSIS_DIR]) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

/**
 * 保存某天的原始数据（如果已存在则覆盖——因为同一天的数据可能多次拉取，取最新的）
 */
export function saveDailyRawData(data: DailyRawData): void {
  ensureDirs();
  const filePath = path.join(RAW_DIR, `${data.date}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * 读取某天的原始数据
 */
export function loadDailyRawData(date: string): DailyRawData | null {
  const filePath = path.join(RAW_DIR, `${date}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/**
 * 读取日期范围内的所有原始数据
 */
export function loadRawDataRange(startDate: string, endDate: string): DailyRawData[] {
  ensureDirs();
  const files = fs.readdirSync(RAW_DIR).filter(f => f.endsWith('.json')).sort();
  const results: DailyRawData[] = [];

  for (const file of files) {
    const date = file.replace('.json', '');
    if (date >= startDate && date <= endDate) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(RAW_DIR, file), 'utf8'));
        results.push(data);
      } catch {
        // skip corrupted files
      }
    }
  }

  return results;
}

/**
 * 获取所有已存储的日期列表
 */
export function getStoredDates(): string[] {
  ensureDirs();
  return fs.readdirSync(RAW_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''))
    .sort();
}

/**
 * 保存分析结果
 */
export function saveAnalysis(filename: string, data: any): void {
  ensureDirs();
  const filePath = path.join(ANALYSIS_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * 读取分析结果
 */
export function loadAnalysis(filename: string): any | null {
  const filePath = path.join(ANALYSIS_DIR, filename);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/**
 * 清理12个月前的数据
 */
export function cleanupOldData(): { rawDeleted: number; analysisDeleted: number } {
  ensureDirs();
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - RETENTION_MONTHS);
  const cutoffStr = cutoffDate.toISOString().split('T')[0];

  let rawDeleted = 0;
  let analysisDeleted = 0;

  // 清理raw数据
  for (const file of fs.readdirSync(RAW_DIR)) {
    const date = file.replace('.json', '');
    if (date < cutoffStr) {
      fs.unlinkSync(path.join(RAW_DIR, file));
      rawDeleted++;
    }
  }

  // 清理analysis数据
  for (const file of fs.readdirSync(ANALYSIS_DIR)) {
    // analysis文件名格式: daily-YYYY-MM-DD.json, weekly-YYYY-WXX.json, monthly-YYYY-MM.json
    const dateMatch = file.match(/(\d{4}-\d{2}-\d{2}|\d{4}-\d{2}|\d{4}-W\d{2})/);
    if (dateMatch) {
      const dateStr = dateMatch[1];
      // 简单比较：取前7个字符（YYYY-MM）
      if (dateStr.substring(0, 7) < cutoffStr.substring(0, 7)) {
        fs.unlinkSync(path.join(ANALYSIS_DIR, file));
        analysisDeleted++;
      }
    }
  }

  return { rawDeleted, analysisDeleted };
}
