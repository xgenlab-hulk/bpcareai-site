/**
 * SEO Insights - 每日分析详情
 * 每日 GSC 数据、趋势警报、紧急选题、生成文章详情
 */

import Link from 'next/link';
import { ArrowLeft, ArrowRight, AlertTriangle, TrendingUp, FileText, Zap, Search } from 'lucide-react';
import {
  getAvailableDailyAnalysisDates,
  getDailyAnalysis,
  getDailyGSCData,
  getUrgentTopics,
  getArticlesByDate,
  getAvailableDates,
} from '@/lib/admin/pipeline';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: { date?: string };
}

export default function DailyInsightsPage({ searchParams }: Props) {
  const availableDates = getAvailableDailyAnalysisDates();
  const allGSCDates = getAvailableDates();
  const selectedDate = searchParams.date || availableDates[0] || allGSCDates[allGSCDates.length - 1] || '';

  const analysis = selectedDate ? getDailyAnalysis(selectedDate) : null;
  const gscData = selectedDate ? getDailyGSCData(selectedDate) : null;
  const urgentTopics = getUrgentTopics();
  const articles = selectedDate ? getArticlesByDate(selectedDate) : [];

  // 前后日期导航
  const allDates = Array.from(new Set([...allGSCDates, ...availableDates])).sort();
  const currentIdx = allDates.indexOf(selectedDate);
  const prevDate = currentIdx > 0 ? allDates[currentIdx - 1] : null;
  const nextDate = currentIdx < allDates.length - 1 ? allDates[currentIdx + 1] : null;

  return (
    <div className="space-y-6">
      {/* Header + 日期导航 */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/seo-insights" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-2">
            <ArrowLeft className="h-3 w-3" /> 返回总览
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">每日分析</h1>
        </div>
        <div className="flex items-center gap-2">
          {prevDate && (
            <Link href={`/admin/seo-insights/daily?date=${prevDate}`} className="p-2 rounded hover:bg-gray-100">
              <ArrowLeft className="h-4 w-4 text-gray-600" />
            </Link>
          )}
          <div className="flex flex-wrap gap-1">
            {allDates.reverse().slice(0, 14).map(d => (
              <Link
                key={d}
                href={`/admin/seo-insights/daily?date=${d}`}
                className={`px-2 py-1 rounded text-xs ${d === selectedDate ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {d.substring(5)}
              </Link>
            ))}
          </div>
          {nextDate && (
            <Link href={`/admin/seo-insights/daily?date=${nextDate}`} className="p-2 rounded hover:bg-gray-100">
              <ArrowRight className="h-4 w-4 text-gray-600" />
            </Link>
          )}
        </div>
      </div>

      {!selectedDate && (
        <div className="rounded-lg bg-gray-50 p-8 text-center text-gray-500">暂无数据。</div>
      )}

      {/* GSC 数据概览 */}
      {gscData && (
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">GSC 数据 — {gscData.date}</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{gscData.totalQueries}</div>
              <div className="text-xs text-blue-600">搜索词数</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{gscData.totalImpressions}</div>
              <div className="text-xs text-green-600">展示量</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">{gscData.totalClicks}</div>
              <div className="text-xs text-purple-600">点击量</div>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-700">{gscData.avgPosition.toFixed(1)}</div>
              <div className="text-xs text-amber-600">平均排名</div>
            </div>
          </div>

          {/* 热门搜索词 */}
          {gscData.topQueries.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">热门搜索词</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">搜索词</th>
                      <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">展示量</th>
                      <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">点击量</th>
                      <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">CTR</th>
                      <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">排名</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gscData.topQueries.map((q, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-3 text-gray-700">{q.query}</td>
                        <td className="py-2 px-3 text-right font-medium">{q.impressions}</td>
                        <td className="py-2 px-3 text-right">{q.clicks}</td>
                        <td className="py-2 px-3 text-right">{q.ctr}%</td>
                        <td className="py-2 px-3 text-right">{q.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 热门页面 */}
          {gscData.topPages.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">热门页面</h3>
              <div className="space-y-2">
                {gscData.topPages.slice(0, 8).map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-sm py-2 px-3 rounded bg-gray-50">
                    <span className="text-gray-700 truncate flex-1">{p.page.split('/articles/')[1] || p.page.split('/').pop()}</span>
                    <div className="flex items-center gap-4 text-gray-500 ml-4 flex-shrink-0 text-xs">
                      <span>{p.impressions} 展示</span>
                      <span>{p.clicks} 点击</span>
                      <span>{p.ctr}% CTR</span>
                      <span>排名 {p.position}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 趋势分析 */}
      {analysis && (
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">趋势分析</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className={`text-lg font-semibold ${analysis.impressionsChange >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {analysis.impressionsChange >= 0 ? '+' : ''}{analysis.impressionsChange.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500">展示量 vs 基线</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className={`text-lg font-semibold ${analysis.clicksChange >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {analysis.clicksChange >= 0 ? '+' : ''}{analysis.clicksChange.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500">点击量 vs 基线</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-lg font-semibold text-gray-900">{analysis.newQueries.length}</div>
              <div className="text-xs text-gray-500">新搜索词</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-lg font-semibold text-gray-900">{analysis.alerts.length}</div>
              <div className="text-xs text-gray-500">触发警报</div>
            </div>
          </div>

          {/* 警报列表 */}
          {analysis.alerts.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">警报（按分数排序）</h3>
              {analysis.alerts.map((alert, i) => (
                <div key={i} className={`p-4 rounded-lg border ${alert.score >= 50 ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          alert.type === 'SURGE' ? 'bg-red-200 text-red-800' :
                          alert.type === 'RANK_JUMP' ? 'bg-blue-200 text-blue-800' :
                          'bg-green-200 text-green-800'
                        }`}>{alert.type}</span>
                        <span className="text-sm font-medium text-gray-900">&quot;{alert.query}&quot;</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{alert.reason}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>近期: {alert.recentImpressions} 展示</span>
                        <span>基线: {alert.baselineImpressions} 展示</span>
                        {alert.recentPosition && <span>排名: {alert.recentPosition.toFixed(1)}</span>}
                      </div>
                    </div>
                    <div className={`text-lg font-bold px-3 py-1 rounded ${alert.score >= 50 ? 'text-red-700 bg-red-100' : 'text-gray-600 bg-gray-100'}`}>
                      {alert.score}
                    </div>
                  </div>
                  {alert.score >= 50 && (
                    <div className="mt-2 text-xs text-red-600 font-medium">
                      分数 &ge; 50 — 已触发 Perplexity + LLM 紧急选题生成
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">当天未触发任何警报。</p>
          )}

          {/* 上升搜索词 */}
          {analysis.risingQueries.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">上升搜索词</h3>
              <div className="space-y-2">
                {analysis.risingQueries.map((rq, i) => (
                  <div key={i} className="flex items-center justify-between text-sm py-2 px-3 rounded bg-blue-50">
                    <span className="text-gray-700">{rq.query}</span>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-blue-700 font-medium">{rq.changeRatio.toFixed(1)}x</span>
                      <span className="text-gray-500">{rq.recentImpressions} 近期展示</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 紧急选题 */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <h2 className="text-lg font-semibold text-gray-900">紧急选题</h2>
        </div>
        {urgentTopics.length > 0 ? (
          <div className="space-y-4">
            {urgentTopics.map((topic, i) => (
              <div key={i} className="p-4 rounded-lg border border-red-200 bg-red-50/50">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">{topic.title}</h3>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-medium">分数 {topic.score}</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{topic.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <span>主关键词: <span className="text-blue-600">{topic.primaryKeyword}</span></span>
                  <span>搜索词: {topic.query}</span>
                  <span>类型: {topic.type}</span>
                  <span>过期: {new Date(topic.expiresAt).toLocaleDateString()}</span>
                </div>
                {topic.perplexityQuestions.length > 0 && (
                  <div className="mt-3 border-t border-red-200 pt-3">
                    <div className="flex items-center gap-1 mb-2">
                      <Zap className="h-3 w-3 text-amber-600" />
                      <span className="text-xs font-medium text-amber-700">Perplexity 真实问题</span>
                    </div>
                    <ul className="space-y-1">
                      {topic.perplexityQuestions.map((q, j) => (
                        <li key={j} className="text-xs text-gray-600 pl-3 border-l-2 border-amber-200">{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">暂无紧急选题。当 GSC 警报分数 &ge; 50 时会自动生成。</p>
        )}
      </div>

      {/* 当日生成的文章 */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">{selectedDate} 生成的文章</h2>
        </div>
        {articles.length > 0 ? (
          <div className="space-y-3">
            {articles.map((article, i) => (
              <a key={i} href={`/articles/${article.slug}`} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50/30 transition-colors">
                <h3 className="text-sm font-medium text-gray-900">{article.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{article.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="text-blue-600">主关键词: {article.primaryKeyword}</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{article.topicCluster}</span>
                  <span className="text-gray-400">/{article.slug}</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">当天未生成文章。</p>
        )}
      </div>
    </div>
  );
}
