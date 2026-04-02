/**
 * SEO Insights - Weekly Intelligence Detail
 * Perplexity 搜索情报、LLM 深度分析、选题评分、选题库状态
 */

import Link from 'next/link';
import { ArrowLeft, Brain, Zap, BarChart3, FileText, Target, Lightbulb, AlertCircle, TrendingUp } from 'lucide-react';
import {
  getAvailableWeeks,
  getWeeklyReport,
  getTopicInventory,
} from '@/lib/admin/pipeline';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: { week?: string };
}

export default function WeeklyInsightsPage({ searchParams }: Props) {
  const availableWeeks = getAvailableWeeks();
  const selectedWeek = searchParams.week || availableWeeks[0] || '';
  const report = selectedWeek ? getWeeklyReport(selectedWeek) : null;
  const inventory = getTopicInventory();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/seo-insights" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-2">
            <ArrowLeft className="h-3 w-3" /> Back to Overview
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Weekly Intelligence</h1>
        </div>
        {availableWeeks.length > 0 && (
          <div className="flex gap-2">
            {availableWeeks.map(w => (
              <Link
                key={w}
                href={`/admin/seo-insights/weekly?week=${w}`}
                className={`px-3 py-1.5 rounded text-sm ${w === selectedWeek ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {w}
              </Link>
            ))}
          </div>
        )}
      </div>

      {!report && (
        <div className="rounded-lg bg-gray-50 p-8 text-center text-gray-500">
          No weekly report available. Run the weekly pipeline to generate intelligence.
        </div>
      )}

      {report && (
        <>
          {/* 周报概览卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-2xl font-bold text-blue-700">{report.gscData?.totalSearchTerms || 0}</div>
              <div className="text-xs text-gray-500">Search Terms Analyzed</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-2xl font-bold text-green-700">{report.gscData?.totalImpressions || report.gscData?.daysAnalyzed || 0}</div>
              <div className="text-xs text-gray-500">{report.gscData?.totalImpressions ? 'Total Impressions' : 'Days Analyzed'}</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-2xl font-bold text-purple-700">{report.newGenerated || report.topicsAdded || 0}</div>
              <div className="text-xs text-gray-500">Topics Generated</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-2xl font-bold text-amber-700">{report.totalWritten || 0}</div>
              <div className="text-xs text-gray-500">Topics in Library</div>
            </div>
          </div>

          {/* Perplexity 搜索情报（核心展示） */}
          {report.perplexityInsights && Object.keys(report.perplexityInsights).length > 0 && (
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="h-5 w-5 text-amber-600" />
                <h2 className="text-lg font-semibold text-gray-900">Perplexity Search Intelligence</h2>
                <span className="text-xs text-gray-400 ml-2">Real-time web search data for each priority direction</span>
              </div>

              <div className="space-y-6">
                {Object.entries(report.perplexityInsights).map(([keyword, insight]) => (
                  <div key={keyword} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* 方向标题 */}
                    <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900 capitalize text-base">{keyword}</h3>
                      <span className="text-xs text-gray-500">{insight.questionsFound} real user questions discovered</span>
                    </div>

                    <div className="p-5 space-y-4">
                      {/* 为什么重要 */}
                      {insight.whyItMatters && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-amber-600" />
                            <h4 className="text-sm font-semibold text-amber-800">Why It Matters Now</h4>
                          </div>
                          <p className="text-sm text-amber-900 leading-relaxed">{insight.whyItMatters}</p>
                        </div>
                      )}

                      {/* 竞品覆盖 */}
                      {insight.competitorCoverage && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="h-4 w-4 text-blue-600" />
                            <h4 className="text-sm font-semibold text-blue-800">Competitor Coverage</h4>
                          </div>
                          <p className="text-sm text-blue-900 leading-relaxed">{insight.competitorCoverage}</p>
                        </div>
                      )}

                      {/* 真实用户问题 */}
                      {insight.topQuestions.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="h-4 w-4 text-green-600" />
                            <h4 className="text-sm font-semibold text-gray-700">Real User Questions (from Google, Reddit, Health Forums)</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {insight.topQuestions.map((q, i) => (
                              <div key={i} className="flex items-start gap-2 p-2 rounded bg-green-50/50 border border-green-100">
                                <span className="text-xs text-green-600 font-bold mt-0.5">{i + 1}</span>
                                <span className="text-sm text-gray-700">{q}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LLM 深度分析洞察 */}
          {report.llmAnalysis && (
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center gap-2 mb-6">
                <Brain className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">LLM Deep Analysis</h2>
                <span className="text-xs text-gray-400 ml-2">AI-generated insights from GSC data</span>
              </div>

              <div className="space-y-5">
                {report.llmAnalysis.searchIntentAnalysis && (
                  <AnalysisSection
                    icon={<BarChart3 className="h-4 w-4 text-blue-600" />}
                    title="Search Intent Analysis"
                    content={report.llmAnalysis.searchIntentAnalysis}
                    borderColor="border-blue-200"
                    bgColor="bg-blue-50/50"
                  />
                )}
                {report.llmAnalysis.ctrAnomalies && (
                  <AnalysisSection
                    icon={<AlertCircle className="h-4 w-4 text-amber-600" />}
                    title="CTR Anomaly Diagnosis"
                    content={report.llmAnalysis.ctrAnomalies}
                    borderColor="border-amber-200"
                    bgColor="bg-amber-50/50"
                  />
                )}
                {report.llmAnalysis.hiddenOpportunities && (
                  <AnalysisSection
                    icon={<Lightbulb className="h-4 w-4 text-green-600" />}
                    title="Hidden Opportunities"
                    content={report.llmAnalysis.hiddenOpportunities}
                    borderColor="border-green-200"
                    bgColor="bg-green-50/50"
                  />
                )}
                {report.llmAnalysis.topicPriorities && (
                  <AnalysisSection
                    icon={<Target className="h-4 w-4 text-purple-600" />}
                    title="Recommended Topic Priorities"
                    content={typeof report.llmAnalysis.topicPriorities === 'string'
                      ? report.llmAnalysis.topicPriorities
                      : JSON.stringify(report.llmAnalysis.topicPriorities, null, 2)}
                    borderColor="border-purple-200"
                    bgColor="bg-purple-50/50"
                  />
                )}
              </div>
            </div>
          )}

          {/* GSC Top Opportunities (旧格式兼容) */}
          {report.gscData?.topOpportunities && report.gscData.topOpportunities.length > 0 && !report.llmAnalysis && (
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">GSC Top Search Opportunities</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Query</th>
                      <th className="text-right py-2 px-3 text-xs font-medium text-gray-500 uppercase">Impressions</th>
                      <th className="text-right py-2 px-3 text-xs font-medium text-gray-500 uppercase">Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.gscData.topOpportunities.map((opp, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-3 text-gray-700">{opp.query}</td>
                        <td className="py-2 px-3 text-right font-medium">{opp.impressions}</td>
                        <td className="py-2 px-3 text-right">{opp.position.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 本周评分选题 */}
          {report.topTopics && report.topTopics.length > 0 && (
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Top Scored Topics</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">#</th>
                      <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Title</th>
                      <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Primary Keyword</th>
                      <th className="text-right py-2 px-3 text-xs font-medium text-gray-500 uppercase">Score</th>
                      <th className="text-right py-2 px-3 text-xs font-medium text-gray-500 uppercase">Cluster</th>
                      <th className="text-right py-2 px-3 text-xs font-medium text-gray-500 uppercase">Search</th>
                      <th className="text-right py-2 px-3 text-xs font-medium text-gray-500 uppercase">Diff</th>
                      <th className="text-right py-2 px-3 text-xs font-medium text-gray-500 uppercase">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.topTopics.map((topic, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-3 text-gray-400">{i + 1}</td>
                        <td className="py-2 px-3 text-gray-900 font-medium max-w-xs truncate">{topic.title}</td>
                        <td className="py-2 px-3 text-blue-600 text-xs max-w-[200px] truncate">{topic.pk}</td>
                        <td className="py-2 px-3 text-right">
                          <span className={`font-bold ${topic.score >= 70 ? 'text-green-700' : topic.score >= 50 ? 'text-amber-700' : 'text-gray-600'}`}>
                            {topic.score.toFixed(0)}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right text-xs text-gray-500">{topic.breakdown?.clusterNeed?.toFixed(0) || '-'}</td>
                        <td className="py-2 px-3 text-right text-xs text-gray-500">{topic.breakdown?.searchDemand?.toFixed(0) || '-'}</td>
                        <td className="py-2 px-3 text-right text-xs text-gray-500">{topic.breakdown?.differentiation?.toFixed(0) || '-'}</td>
                        <td className="py-2 px-3 text-right text-xs text-gray-500">{topic.breakdown?.timeliness?.toFixed(0) || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {report.topTopics[0]?.reasoning && (
                <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
                  <span className="font-medium">Top topic reasoning: </span>{report.topTopics[0].reasoning}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* 深度分析完整版入口 */}
      <Link href="/admin/seo-insights/deep-analysis" className="block rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 p-6 shadow-lg hover:shadow-xl transition-shadow text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8" />
            <div>
              <h3 className="font-semibold text-lg">Full LLM Deep Analysis</h3>
              <p className="text-sm text-purple-200">5000+ word comprehensive analysis — search intent, CTR diagnosis, content gap mapping, actionable recommendations</p>
            </div>
          </div>
          <div className="text-purple-200">→</div>
        </div>
      </Link>

      {/* 选题库存状态（始终显示，不依赖周报） */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Current Topic Library</h2>
          <span className="text-xs text-gray-400 ml-2">{inventory.reduce((s, i) => s + i.count, 0)} total topics</span>
        </div>
        <div className="space-y-3">
          {inventory.map((item, i) => {
            const maxCount = Math.max(...inventory.map(x => x.count), 1);
            const pct = (item.count / maxCount) * 100;
            return (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700 capitalize">{item.category}</span>
                  <span className="text-gray-500 font-medium">{item.count} topics</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-indigo-500 h-2.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                {/* 展示该分类的前3个选题标题 */}
                {item.topics.length > 0 && (
                  <div className="mt-1 ml-2 space-y-0.5">
                    {item.topics.slice(0, 3).map((t, j) => (
                      <div key={j} className="text-xs text-gray-400 truncate">
                        {t.score ? `[${t.score.toFixed(0)}] ` : ''}{t.title}
                      </div>
                    ))}
                    {item.topics.length > 3 && (
                      <div className="text-xs text-gray-300">+{item.topics.length - 3} more</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AnalysisSection({ icon, title, content, borderColor, bgColor }: {
  icon: React.ReactNode;
  title: string;
  content: string;
  borderColor: string;
  bgColor: string;
}) {
  return (
    <div className={`border ${borderColor} rounded-lg ${bgColor} p-5`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{content}</div>
    </div>
  );
}
