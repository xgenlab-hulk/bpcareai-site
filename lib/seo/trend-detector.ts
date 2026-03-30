/**
 * GSC趋势检测引擎
 * - 基于规则的异常检测
 * - 3天 vs 28天基线对比
 * - 新词检测、排名跃升检测
 */

import type { DailyRawData, QueryRecord } from './data-store';

/**
 * 趋势警报
 */
export interface TrendAlert {
  type: 'SURGE' | 'NEW_QUERY' | 'RANK_JUMP';
  query: string;
  reason: string;
  score: number;           // 0-100，表示趋势强度
  recentImpressions: number;
  baselineImpressions: number;
  recentPosition?: number;
  baselinePosition?: number;
}

/**
 * 每日趋势分析结果
 */
export interface DailyTrendAnalysis {
  date: string;
  period: '3-day';
  impressionsChange: number;     // 展示量变化百分比
  clicksChange: number;
  newQueries: string[];           // 新出现的搜索词
  risingQueries: RisingQuery[];   // 上升中的搜索词
  alerts: TrendAlert[];           // 触发的警报
}

export interface RisingQuery {
  query: string;
  recentImpressions: number;
  baselineImpressions: number;
  changeRatio: number;
}

/**
 * 配置参数
 */
const CONFIG = {
  SURGE_THRESHOLD: 3.0,         // 展示量达到基线的3倍算突增
  RANK_JUMP_THRESHOLD: 10,      // 排名提升10位以上算跃升
  MIN_IMPRESSIONS_FOR_SURGE: 3, // 至少3次展示才考虑突增
  NEW_QUERY_MIN_DAYS: 2,        // 新词至少出现2天
};

/**
 * 从多天的原始数据中汇总搜索词指标
 */
function aggregateQueries(dailyData: DailyRawData[]): Map<string, {
  totalImpressions: number;
  totalClicks: number;
  avgPosition: number;
  daysSeen: number;
}> {
  const queryMap = new Map<string, {
    totalImpressions: number;
    totalClicks: number;
    positionSum: number;
    positionCount: number;
    daysSeen: number;
  }>();

  for (const day of dailyData) {
    for (const q of day.queries) {
      const existing = queryMap.get(q.query);
      if (existing) {
        existing.totalImpressions += q.impressions;
        existing.totalClicks += q.clicks;
        existing.positionSum += q.position * q.impressions; // 加权平均
        existing.positionCount += q.impressions;
        existing.daysSeen++;
      } else {
        queryMap.set(q.query, {
          totalImpressions: q.impressions,
          totalClicks: q.clicks,
          positionSum: q.position * q.impressions,
          positionCount: q.impressions,
          daysSeen: 1,
        });
      }
    }
  }

  const result = new Map<string, {
    totalImpressions: number;
    totalClicks: number;
    avgPosition: number;
    daysSeen: number;
  }>();

  for (const [query, data] of queryMap) {
    result.set(query, {
      totalImpressions: data.totalImpressions,
      totalClicks: data.totalClicks,
      avgPosition: data.positionCount > 0 ? data.positionSum / data.positionCount : 0,
      daysSeen: data.daysSeen,
    });
  }

  return result;
}

/**
 * 分析最近3天的趋势（对比28天基线）
 */
export function detectTrends(
  recentData: DailyRawData[],   // 最近3天
  baselineData: DailyRawData[], // 最近28天（含最近3天）
): DailyTrendAnalysis {
  const date = recentData.length > 0
    ? recentData[recentData.length - 1].date
    : new Date().toISOString().split('T')[0];

  // 汇总
  const recentAgg = aggregateQueries(recentData);
  const baselineAgg = aggregateQueries(baselineData);

  // 基线的每天平均（用于对比）
  const baselineDays = Math.max(baselineData.length, 1);

  const alerts: TrendAlert[] = [];
  const newQueries: string[] = [];
  const risingQueries: RisingQuery[] = [];

  // 总体展示量变化
  const recentTotalImpr = recentData.reduce((s, d) => s + d.summary.totalImpressions, 0);
  const baselineTotalImpr = baselineData.reduce((s, d) => s + d.summary.totalImpressions, 0);
  const baselineDailyAvgImpr = baselineTotalImpr / baselineDays;
  const recentDailyAvgImpr = recentTotalImpr / Math.max(recentData.length, 1);
  const impressionsChange = baselineDailyAvgImpr > 0
    ? ((recentDailyAvgImpr - baselineDailyAvgImpr) / baselineDailyAvgImpr) * 100
    : 0;

  const recentTotalClicks = recentData.reduce((s, d) => s + d.summary.totalClicks, 0);
  const baselineTotalClicks = baselineData.reduce((s, d) => s + d.summary.totalClicks, 0);
  const baselineDailyAvgClicks = baselineTotalClicks / baselineDays;
  const recentDailyAvgClicks = recentTotalClicks / Math.max(recentData.length, 1);
  const clicksChange = baselineDailyAvgClicks > 0
    ? ((recentDailyAvgClicks - baselineDailyAvgClicks) / baselineDailyAvgClicks) * 100
    : 0;

  // 逐词分析
  for (const [query, recent] of recentAgg) {
    const baseline = baselineAgg.get(query);

    if (!baseline) {
      // 全新的词（28天基线中完全没出现过）— 理论上不会发生因为recent包含在baseline中
      // 但如果recent是更新的数据可能会
      if (recent.daysSeen >= CONFIG.NEW_QUERY_MIN_DAYS) {
        newQueries.push(query);
        alerts.push({
          type: 'NEW_QUERY',
          query,
          reason: `全新搜索词，连续${recent.daysSeen}天出现`,
          score: Math.min(recent.totalImpressions * 10, 60),
          recentImpressions: recent.totalImpressions,
          baselineImpressions: 0,
          recentPosition: recent.avgPosition,
        });
      }
      continue;
    }

    // 展示量突增检测
    const baselineDailyAvg = baseline.totalImpressions / baselineDays;
    const recentDailyAvg = recent.totalImpressions / Math.max(recentData.length, 1);

    if (recentDailyAvg >= CONFIG.MIN_IMPRESSIONS_FOR_SURGE &&
        baselineDailyAvg > 0 &&
        recentDailyAvg / baselineDailyAvg >= CONFIG.SURGE_THRESHOLD) {
      const changeRatio = recentDailyAvg / baselineDailyAvg;

      risingQueries.push({
        query,
        recentImpressions: recent.totalImpressions,
        baselineImpressions: baseline.totalImpressions,
        changeRatio,
      });

      alerts.push({
        type: 'SURGE',
        query,
        reason: `展示量激增 ${changeRatio.toFixed(1)}x（近3天日均${recentDailyAvg.toFixed(1)} vs 基线${baselineDailyAvg.toFixed(1)}）`,
        score: Math.min(changeRatio * 15, 100),
        recentImpressions: recent.totalImpressions,
        baselineImpressions: baseline.totalImpressions,
        recentPosition: recent.avgPosition,
        baselinePosition: baseline.avgPosition,
      });
    }

    // 排名跃升检测
    if (baseline.avgPosition > 0 && recent.avgPosition > 0) {
      const rankImprovement = baseline.avgPosition - recent.avgPosition;
      if (rankImprovement >= CONFIG.RANK_JUMP_THRESHOLD) {
        alerts.push({
          type: 'RANK_JUMP',
          query,
          reason: `排名跃升 ${rankImprovement.toFixed(1)} 位（${baseline.avgPosition.toFixed(1)} → ${recent.avgPosition.toFixed(1)}）`,
          score: Math.min(rankImprovement * 3, 80),
          recentImpressions: recent.totalImpressions,
          baselineImpressions: baseline.totalImpressions,
          recentPosition: recent.avgPosition,
          baselinePosition: baseline.avgPosition,
        });
      }
    }
  }

  // 检测基线中有但最近3天消失的词（暂不做警报，但记录）

  // 按score排序
  alerts.sort((a, b) => b.score - a.score);
  risingQueries.sort((a, b) => b.changeRatio - a.changeRatio);

  return {
    date,
    period: '3-day',
    impressionsChange,
    clicksChange,
    newQueries,
    risingQueries,
    alerts,
  };
}
