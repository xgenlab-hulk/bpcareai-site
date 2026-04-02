/**
 * SEO Insights 总览页
 * 展示最新 AI 洞察、选题库状态、最近文章、执行记录
 */

import Link from 'next/link';
import { StatsCard } from '@/components/admin/StatsCard';
import { Database, FileText, AlertTriangle, Brain, TrendingUp, ArrowRight, Calendar, Zap } from 'lucide-react';
import { getPipelineOverview } from '@/lib/admin/pipeline';

export const dynamic = 'force-dynamic';

export default function SEOInsightsPage() {
  const overview = getPipelineOverview();

  const latestWeekly = overview.latestWeeklyReport;
  const latestDaily = overview.latestDailyAnalysis;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">SEO Insights</h1>
        <p className="mt-1 text-sm text-gray-500">AI-driven market intelligence, GSC trends, and content pipeline status</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="GSC Data"
          value={`${overview.gscDataDays} days`}
          icon={Database}
          description={overview.latestGSCDate ? `Latest: ${overview.latestGSCDate}` : 'No data'}
        />
        <StatsCard
          label="Topic Library"
          value={overview.topicTotal}
          icon={FileText}
          description={overview.topicInventory.map(i => `${i.category}: ${i.count}`).join(' | ')}
        />
        <StatsCard
          label="Recent Articles"
          value={overview.recentArticles.length}
          icon={TrendingUp}
          description={`Generated in last 7 days`}
        />
        <StatsCard
          label="Urgent Topics"
          value={overview.urgentTopics.length}
          icon={AlertTriangle}
          description={overview.urgentTopics.length > 0 ? overview.urgentTopics[0].title.substring(0, 40) : 'No active urgent topics'}
        />
      </div>

      {/* 最新 AI 洞察（周报精华） */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Latest AI Insights</h2>
          </div>
          {overview.availableWeeks.length > 0 && (
            <Link href={`/admin/seo-insights/weekly?week=${overview.availableWeeks[0]}`} className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
              View full report <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {latestWeekly?.llmAnalysis ? (
          <div className="space-y-6">
            {latestWeekly.llmAnalysis.searchIntentAnalysis && (
              <InsightBlock
                title="Search Intent Analysis"
                content={latestWeekly.llmAnalysis.searchIntentAnalysis}
                color="blue"
              />
            )}
            {latestWeekly.llmAnalysis.hiddenOpportunities && (
              <InsightBlock
                title="Hidden Opportunities"
                content={latestWeekly.llmAnalysis.hiddenOpportunities}
                color="green"
              />
            )}
            {latestWeekly.llmAnalysis.ctrAnomalies && (
              <InsightBlock
                title="CTR Anomalies"
                content={latestWeekly.llmAnalysis.ctrAnomalies}
                color="amber"
              />
            )}
            {latestWeekly.llmAnalysis.topicPriorities && (
              <InsightBlock
                title="Recommended Topic Priorities"
                content={typeof latestWeekly.llmAnalysis.topicPriorities === 'string'
                  ? latestWeekly.llmAnalysis.topicPriorities
                  : JSON.stringify(latestWeekly.llmAnalysis.topicPriorities, null, 2)}
                color="purple"
              />
            )}
          </div>
        ) : latestWeekly?.gscData ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Week {latestWeekly.week} — GSC data analyzed, {latestWeekly.gscData.totalSearchTerms} search terms, {latestWeekly.gscData.totalImpressions || 0} impressions</p>
            {latestWeekly.gscData.topOpportunities && latestWeekly.gscData.topOpportunities.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Top Search Opportunities</h3>
                <div className="space-y-1">
                  {latestWeekly.gscData.topOpportunities.slice(0, 8).map((opp, i) => (
                    <div key={i} className="flex items-center justify-between text-sm py-1 px-2 rounded bg-gray-50">
                      <span className="text-gray-700 truncate flex-1">{opp.query}</span>
                      <div className="flex items-center gap-3 text-gray-500 ml-4 flex-shrink-0">
                        <span>{opp.impressions} impr</span>
                        <span>pos {opp.position.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No weekly analysis available yet. Run the weekly pipeline to generate insights.</p>
        )}
      </div>

      {/* Perplexity 情报预览 */}
      {latestWeekly?.perplexityInsights && Object.keys(latestWeekly.perplexityInsights).length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-600" />
              <h2 className="text-lg font-semibold text-gray-900">Perplexity Search Intelligence</h2>
            </div>
            <Link href={`/admin/seo-insights/weekly?week=${overview.availableWeeks[0]}`} className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(latestWeekly.perplexityInsights).map(([keyword, insight]) => (
              <div key={keyword} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 capitalize mb-2">{keyword}</h3>
                {insight.whyItMatters && (
                  <p className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1 mb-2">{insight.whyItMatters.substring(0, 150)}...</p>
                )}
                <p className="text-xs text-gray-500">{insight.questionsFound} real user questions discovered</p>
                {insight.topQuestions.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {insight.topQuestions.slice(0, 3).map((q, i) => (
                      <li key={i} className="text-xs text-gray-600 pl-3 border-l-2 border-blue-200">{q}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 最新趋势警报 */}
      {latestDaily && (
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Latest Trend Analysis — {latestDaily.date}</h2>
            </div>
            <Link href={`/admin/seo-insights/daily?date=${latestDaily.date}`} className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
              View details <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-lg font-semibold text-gray-900">{latestDaily.impressionsChange >= 0 ? '+' : ''}{latestDaily.impressionsChange.toFixed(1)}%</div>
              <div className="text-xs text-gray-500">Impressions Change</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-lg font-semibold text-gray-900">{latestDaily.clicksChange >= 0 ? '+' : ''}{latestDaily.clicksChange.toFixed(1)}%</div>
              <div className="text-xs text-gray-500">Clicks Change</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-lg font-semibold text-gray-900">{latestDaily.alerts.length}</div>
              <div className="text-xs text-gray-500">Alerts</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-lg font-semibold text-gray-900">{latestDaily.risingQueries.length}</div>
              <div className="text-xs text-gray-500">Rising Queries</div>
            </div>
          </div>
          {latestDaily.alerts.length > 0 && (
            <div className="space-y-2">
              {latestDaily.alerts.slice(0, 5).map((alert, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded text-sm ${alert.score >= 50 ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      alert.type === 'SURGE' ? 'bg-red-100 text-red-700' :
                      alert.type === 'RANK_JUMP' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>{alert.type}</span>
                    <span className="text-gray-700 truncate">{alert.query}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-xs font-medium ${alert.score >= 50 ? 'text-red-600' : 'text-gray-500'}`}>score {alert.score}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 最近生成的文章 */}
      {overview.recentArticles.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Recently Generated Articles</h2>
            </div>
          </div>
          <div className="space-y-3">
            {overview.recentArticles.slice(0, 10).map((article, i) => (
              <Link key={i} href={`/articles/${article.slug}`} className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{article.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 truncate">{article.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-400">{article.date}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{article.topicCluster}</span>
                      <span className="text-xs text-blue-600">PK: {article.primaryKeyword}</span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0 mt-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 快速导航 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/admin/seo-insights/daily" className="block p-6 rounded-lg bg-white shadow hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="font-medium text-gray-900">Daily Analysis</h3>
              <p className="text-sm text-gray-500">GSC trends, alerts, urgent topics, article details</p>
              <p className="text-xs text-gray-400 mt-1">{overview.availableDailyDates.length} days of analysis available</p>
            </div>
          </div>
        </Link>
        <Link href="/admin/seo-insights/weekly" className="block p-6 rounded-lg bg-white shadow hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-purple-600" />
            <div>
              <h3 className="font-medium text-gray-900">Weekly Intelligence</h3>
              <p className="text-sm text-gray-500">Perplexity insights, LLM analysis, topic scoring</p>
              <p className="text-xs text-gray-400 mt-1">{overview.availableWeeks.length} weekly reports available</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

function InsightBlock({ title, content, color }: { title: string; content: string; color: 'blue' | 'green' | 'amber' | 'purple' }) {
  const colors = {
    blue: 'border-blue-200 bg-blue-50/50',
    green: 'border-green-200 bg-green-50/50',
    amber: 'border-amber-200 bg-amber-50/50',
    purple: 'border-purple-200 bg-purple-50/50',
  };
  const titleColors = {
    blue: 'text-blue-800',
    green: 'text-green-800',
    amber: 'text-amber-800',
    purple: 'text-purple-800',
  };

  return (
    <div className={`border rounded-lg p-4 ${colors[color]}`}>
      <h3 className={`text-sm font-semibold mb-2 ${titleColors[color]}`}>{title}</h3>
      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{content}</p>
    </div>
  );
}
