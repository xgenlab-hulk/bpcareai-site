/**
 * SEO Insights 总览页
 * 展示 AI 洞察、文章优化建议、增长趋势、Perplexity 情报、选题库、最近文章
 */

import Link from 'next/link';
import { StatsCard } from '@/components/admin/StatsCard';
import {
  Database, FileText, AlertTriangle, Brain, TrendingUp, ArrowRight,
  Calendar, Zap, Wrench, BarChart3, Lightbulb, Target, AlertCircle,
  ArrowUpRight, ExternalLink,
} from 'lucide-react';
import { getPipelineOverview, getArticleOptimizations, getBaselineReport } from '@/lib/admin/pipeline';

export const dynamic = 'force-dynamic';

export default function SEOInsightsPage() {
  const overview = getPipelineOverview();
  const optimizations = getArticleOptimizations();
  const baseline = getBaselineReport();

  const latestWeekly = overview.latestWeeklyReport;
  const latestDaily = overview.latestDailyAnalysis;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SEO Insights</h1>
          <p className="mt-1 text-sm text-gray-500">AI-driven market intelligence, optimization actions, and content pipeline status</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/seo-insights/daily" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">
            <Calendar className="h-4 w-4" /> Daily
          </Link>
          <Link href="/admin/seo-insights/weekly" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors">
            <Brain className="h-4 w-4" /> Weekly
          </Link>
        </div>
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
          description={overview.topicInventory.map(i => `${i.category}: ${i.count}`).join(' · ')}
        />
        <StatsCard
          label="Recent Articles"
          value={overview.recentArticles.length}
          icon={TrendingUp}
          description="Generated in last 7 days"
        />
        <StatsCard
          label="Urgent Topics"
          value={overview.urgentTopics.length}
          icon={AlertTriangle}
          description={overview.urgentTopics.length > 0 ? overview.urgentTopics[0].title.substring(0, 40) : 'No active urgent topics'}
        />
      </div>

      {/* 90天增长趋势 */}
      {baseline && (
        <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 shadow-lg text-white">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Growth Trajectory</h2>
            <span className="text-xs text-blue-200 ml-2">{baseline.dataRange}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(baseline.overallGrowth).map(([month, data]) => (
              <div key={month} className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-xs text-blue-200 uppercase mb-1">{month.replace('2025', "'25").replace('2026', "'26")}</div>
                <div className="text-2xl font-bold">{data.impressions}</div>
                <div className="text-xs text-blue-200">impressions</div>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span>{data.clicks} clicks</span>
                  <span>·</span>
                  <span>{data.queries} queries</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 文章优化建议（高价值可执行动作） */}
      {optimizations && optimizations.optimizations.length > 0 && (
        <div className="rounded-xl bg-white shadow-md border border-amber-200 overflow-hidden">
          <div className="bg-amber-50 px-6 py-4 border-b border-amber-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-amber-600" />
                <h2 className="text-lg font-semibold text-gray-900">Article Optimization Actions</h2>
                <span className="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-full">{optimizations.optimizations.length} articles</span>
              </div>
              <span className="text-xs text-gray-500">Generated: {new Date(optimizations.generatedAt).toLocaleDateString()}</span>
            </div>
            <p className="text-xs text-amber-700 mt-1">High-impression low-CTR articles that need title/description optimization to increase clicks</p>
          </div>
          <div className="divide-y divide-gray-100">
            {optimizations.optimizations.map((opt, i) => (
              <div key={i} className="p-5 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* Current vs Suggested */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="bg-red-50/50 border border-red-100 rounded-lg p-3">
                        <div className="text-xs font-medium text-red-500 uppercase mb-1">Current Title</div>
                        <p className="text-sm text-gray-700">{opt.currentTitle}</p>
                      </div>
                      <div className="bg-green-50/50 border border-green-100 rounded-lg p-3">
                        <div className="text-xs font-medium text-green-600 uppercase mb-1">Suggested Title</div>
                        <p className="text-sm text-gray-900 font-medium">{opt.suggestedTitle}</p>
                      </div>
                    </div>

                    <div className="mt-3 bg-blue-50/50 border border-blue-100 rounded-lg p-3">
                      <div className="text-xs font-medium text-blue-600 uppercase mb-1">Suggested Description</div>
                      <p className="text-sm text-gray-700">{opt.suggestedDescription}</p>
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <div className="text-xs">
                        <span className="text-gray-400">Suggested PK: </span>
                        <span className="text-blue-600 font-medium">{opt.suggestedPK}</span>
                      </div>
                      <Link href={`/articles/${opt.slug}`} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-0.5">
                        View article <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>

                    <div className="mt-2 bg-gray-50 rounded-lg p-3">
                      <div className="text-xs font-medium text-gray-500 uppercase mb-1">Why This Change</div>
                      <p className="text-xs text-gray-600 leading-relaxed">{opt.reason}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 最新 AI 洞察（周报精华） */}
      <div className="rounded-xl bg-white p-6 shadow-md">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Latest AI Insights</h2>
            {latestWeekly && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{latestWeekly.week}</span>}
          </div>
          {overview.availableWeeks.length > 0 && (
            <Link href={`/admin/seo-insights/weekly?week=${overview.availableWeeks[0]}`} className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1">
              Full report <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {latestWeekly?.llmAnalysis ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {latestWeekly.llmAnalysis.searchIntentAnalysis && (
              <InsightCard
                icon={<BarChart3 className="h-4 w-4" />}
                title="Search Intent"
                content={latestWeekly.llmAnalysis.searchIntentAnalysis}
                color="blue"
              />
            )}
            {latestWeekly.llmAnalysis.hiddenOpportunities && (
              <InsightCard
                icon={<Lightbulb className="h-4 w-4" />}
                title="Hidden Opportunities"
                content={latestWeekly.llmAnalysis.hiddenOpportunities}
                color="green"
              />
            )}
            {latestWeekly.llmAnalysis.ctrAnomalies && (
              <InsightCard
                icon={<AlertCircle className="h-4 w-4" />}
                title="CTR Anomalies"
                content={latestWeekly.llmAnalysis.ctrAnomalies}
                color="amber"
              />
            )}
            {latestWeekly.llmAnalysis.topicPriorities && (
              <InsightCard
                icon={<Target className="h-4 w-4" />}
                title="Topic Priorities"
                content={typeof latestWeekly.llmAnalysis.topicPriorities === 'string'
                  ? latestWeekly.llmAnalysis.topicPriorities
                  : JSON.stringify(latestWeekly.llmAnalysis.topicPriorities, null, 2)}
                color="purple"
              />
            )}
          </div>
        ) : latestWeekly?.gscData ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Week {latestWeekly.week} — {latestWeekly.gscData.totalSearchTerms} search terms analyzed</p>
            {latestWeekly.gscData.topOpportunities && latestWeekly.gscData.topOpportunities.length > 0 && (
              <div className="space-y-1">
                {latestWeekly.gscData.topOpportunities.slice(0, 6).map((opp, i) => (
                  <div key={i} className="flex items-center justify-between text-sm py-2 px-3 rounded-lg bg-gray-50">
                    <span className="text-gray-700 truncate flex-1">{opp.query}</span>
                    <div className="flex items-center gap-3 text-gray-500 ml-4 flex-shrink-0 text-xs">
                      <span className="font-medium">{opp.impressions} impr</span>
                      <span>pos {opp.position.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No weekly analysis available yet. Run the weekly pipeline to generate insights.</p>
        )}
      </div>

      {/* Perplexity 搜索情报 */}
      {latestWeekly?.perplexityInsights && Object.keys(latestWeekly.perplexityInsights).length > 0 && (
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-gray-900">Search Intelligence</h2>
              <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">Perplexity</span>
            </div>
            <Link href={`/admin/seo-insights/weekly?week=${overview.availableWeeks[0]}`} className="text-sm text-amber-600 hover:text-amber-800 flex items-center gap-1">
              View full <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(latestWeekly.perplexityInsights).map(([keyword, insight]) => (
              <div key={keyword} className="border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 capitalize">{keyword}</h3>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{insight.questionsFound} questions</span>
                </div>

                {insight.whyItMatters && (
                  <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-3">
                    <div className="flex items-center gap-1 mb-1">
                      <TrendingUp className="h-3 w-3 text-amber-600" />
                      <span className="text-xs font-semibold text-amber-700">Why Now</span>
                    </div>
                    <p className="text-xs text-amber-900 leading-relaxed">{insight.whyItMatters}</p>
                  </div>
                )}

                {insight.competitorCoverage && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-3">
                    <div className="flex items-center gap-1 mb-1">
                      <Target className="h-3 w-3 text-blue-600" />
                      <span className="text-xs font-semibold text-blue-700">Competitor Coverage</span>
                    </div>
                    <p className="text-xs text-blue-900 leading-relaxed">{insight.competitorCoverage}</p>
                  </div>
                )}

                {insight.topQuestions.length > 0 && (
                  <div className="space-y-1.5 mt-3">
                    <span className="text-xs font-medium text-gray-500">Top questions:</span>
                    {insight.topQuestions.slice(0, 4).map((q, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-green-500 font-bold mt-0.5">{i + 1}</span>
                        <span>{q}</span>
                      </div>
                    ))}
                    {insight.topQuestions.length > 4 && (
                      <p className="text-xs text-gray-400">+{insight.topQuestions.length - 4} more questions</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 趋势警报 */}
      {latestDaily && (
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Latest Trends</h2>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{latestDaily.date}</span>
            </div>
            <Link href={`/admin/seo-insights/daily?date=${latestDaily.date}`} className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
              Details <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <MetricBadge
              label="Impressions"
              value={`${latestDaily.impressionsChange >= 0 ? '+' : ''}${latestDaily.impressionsChange.toFixed(1)}%`}
              positive={latestDaily.impressionsChange >= 0}
            />
            <MetricBadge
              label="Clicks"
              value={`${latestDaily.clicksChange >= 0 ? '+' : ''}${latestDaily.clicksChange.toFixed(1)}%`}
              positive={latestDaily.clicksChange >= 0}
            />
            <MetricBadge label="Alerts" value={String(latestDaily.alerts.length)} />
            <MetricBadge label="Rising" value={String(latestDaily.risingQueries.length)} />
          </div>
          {latestDaily.alerts.length > 0 && (
            <div className="space-y-2">
              {latestDaily.alerts.slice(0, 5).map((alert, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-lg text-sm ${alert.score >= 50 ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      alert.type === 'SURGE' ? 'bg-red-100 text-red-700' :
                      alert.type === 'RANK_JUMP' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>{alert.type}</span>
                    <span className="text-gray-700">{alert.query}</span>
                  </div>
                  <span className={`text-xs font-bold ${alert.score >= 50 ? 'text-red-600' : 'text-gray-500'}`}>
                    {alert.score}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 最近文章 */}
      {overview.recentArticles.length > 0 && (
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Recently Generated</h2>
            <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{overview.recentArticles.length} articles</span>
          </div>
          <div className="space-y-2">
            {overview.recentArticles.slice(0, 8).map((article, i) => (
              <Link key={i} href={`/articles/${article.slug}`} className="group flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-green-700 truncate">{article.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{article.date}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{article.topicCluster}</span>
                    <span className="text-xs text-blue-500 truncate">{article.primaryKeyword}</span>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-green-500 flex-shrink-0 ml-2" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InsightCard({ icon, title, content, color }: {
  icon: React.ReactNode; title: string; content: string;
  color: 'blue' | 'green' | 'amber' | 'purple';
}) {
  const styles = {
    blue:   { border: 'border-blue-200', bg: 'bg-blue-50/60', title: 'text-blue-800', icon: 'text-blue-600' },
    green:  { border: 'border-green-200', bg: 'bg-green-50/60', title: 'text-green-800', icon: 'text-green-600' },
    amber:  { border: 'border-amber-200', bg: 'bg-amber-50/60', title: 'text-amber-800', icon: 'text-amber-600' },
    purple: { border: 'border-purple-200', bg: 'bg-purple-50/60', title: 'text-purple-800', icon: 'text-purple-600' },
  }[color];

  return (
    <div className={`border ${styles.border} rounded-xl ${styles.bg} p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={styles.icon}>{icon}</span>
        <h3 className={`text-sm font-semibold ${styles.title}`}>{title}</h3>
      </div>
      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed line-clamp-6">{content}</p>
    </div>
  );
}

function MetricBadge({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="text-center p-3 bg-gray-50 rounded-xl">
      <div className={`text-lg font-bold ${positive === true ? 'text-green-600' : positive === false ? 'text-red-600' : 'text-gray-900'}`}>
        {value}
      </div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}
