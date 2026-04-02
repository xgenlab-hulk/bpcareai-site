/**
 * SEO Insights - 每周分析详情
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

/**
 * 解析可能为 JSON 的结构化内容，按条目渲染
 */
function renderStructuredContent(content: string): React.ReactNode {
  const trimmed = content.trim();
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return (
          <ul className="space-y-1.5">
            {parsed.map((item: any, i: number) => (
              <li key={i} className="text-sm text-gray-700 leading-relaxed">
                {typeof item === 'string' ? (
                  <span>{item}</span>
                ) : typeof item === 'object' && item !== null ? (
                  <div>
                    {item.title || item.name || item.topic || item.keyword ? (
                      <span className="font-medium">{item.title || item.name || item.topic || item.keyword}</span>
                    ) : null}
                    {item.reason || item.description || item.detail || item.why ? (
                      <span className="text-gray-500"> — {item.reason || item.description || item.detail || item.why}</span>
                    ) : null}
                    {!item.title && !item.name && !item.topic && !item.keyword && !item.reason && !item.description && !item.detail && !item.why ? (
                      <span>{JSON.stringify(item)}</span>
                    ) : null}
                  </div>
                ) : (
                  <span>{String(item)}</span>
                )}
              </li>
            ))}
          </ul>
        );
      }
      if (typeof parsed === 'object' && parsed !== null) {
        const entries = Object.entries(parsed);
        return (
          <ul className="space-y-1.5">
            {entries.map(([key, val], i) => (
              <li key={i} className="text-sm text-gray-700 leading-relaxed">
                <span className="font-medium">{key}</span>
                <span className="text-gray-500"> — {typeof val === 'string' ? val : JSON.stringify(val)}</span>
              </li>
            ))}
          </ul>
        );
      }
    } catch {
      // not valid JSON, fall through
    }
  }
  return <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{content}</div>;
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
            <ArrowLeft className="h-3 w-3" /> 返回总览
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">每周分析</h1>
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
          暂无周报数据。运行 weekly pipeline 后会自动生成。
        </div>
      )}

      {report && (
        <>
          {/* 周报概览卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-2xl font-bold text-blue-700">{report.gscData?.totalSearchTerms || 0}</div>
              <div className="text-xs text-gray-500">分析搜索词数</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-2xl font-bold text-green-700">{report.gscData?.totalImpressions || report.gscData?.daysAnalyzed || 0}</div>
              <div className="text-xs text-gray-500">{report.gscData?.totalImpressions ? '总展示量' : '分析天数'}</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-2xl font-bold text-purple-700">{report.newGenerated || report.topicsAdded || 0}</div>
              <div className="text-xs text-gray-500">生成选题数</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-2xl font-bold text-amber-700">{report.totalWritten || 0}</div>
              <div className="text-xs text-gray-500">选题库总量</div>
            </div>
          </div>

          {/* Perplexity 搜索情报 */}
          {report.perplexityInsights && Object.keys(report.perplexityInsights).length > 0 && (
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="h-5 w-5 text-amber-600" />
                <h2 className="text-lg font-semibold text-gray-900">Perplexity 搜索情报</h2>
                <span className="text-xs text-gray-400 ml-2">每个优先方向的实时网络搜索数据</span>
              </div>

              <div className="space-y-6">
                {Object.entries(report.perplexityInsights).map(([keyword, insight]) => (
                  <div key={keyword} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900 capitalize text-base">{keyword}</h3>
                      <span className="text-xs text-gray-500">发现 {insight.questionsFound} 个真实用户问题</span>
                    </div>

                    <div className="p-5 space-y-4">
                      {insight.whyItMatters && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-amber-600" />
                            <h4 className="text-sm font-semibold text-amber-800">为什么现在重要</h4>
                          </div>
                          <p className="text-sm text-amber-900 leading-relaxed">{insight.whyItMatters}</p>
                        </div>
                      )}

                      {insight.competitorCoverage && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="h-4 w-4 text-blue-600" />
                            <h4 className="text-sm font-semibold text-blue-800">竞品覆盖分析</h4>
                          </div>
                          <p className="text-sm text-blue-900 leading-relaxed">{insight.competitorCoverage}</p>
                        </div>
                      )}

                      {insight.topQuestions.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="h-4 w-4 text-green-600" />
                            <h4 className="text-sm font-semibold text-gray-700">真实用户问题（来自 Google、Reddit、健康论坛）</h4>
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
              <p className="text-xs text-gray-400 mt-4">搜索情报数据来自 Perplexity，已自动纳入选题评分</p>
            </div>
          )}

          {/* LLM 深度分析洞察 */}
          {report.llmAnalysis && (
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center gap-2 mb-6">
                <Brain className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">LLM 深度分析</h2>
                <span className="text-xs text-gray-400 ml-2">基于 GSC 数据的 AI 洞察</span>
              </div>

              <div className="space-y-5">
                {report.llmAnalysis.searchIntentAnalysis && (
                  <AnalysisSection
                    icon={<BarChart3 className="h-4 w-4 text-blue-600" />}
                    title="搜索意图分析"
                    content={report.llmAnalysis.searchIntentAnalysis}
                    borderColor="border-blue-200"
                    bgColor="bg-blue-50/50"
                  />
                )}
                {report.llmAnalysis.ctrAnomalies && (
                  <AnalysisSection
                    icon={<AlertCircle className="h-4 w-4 text-amber-600" />}
                    title="CTR 异常诊断"
                    content={report.llmAnalysis.ctrAnomalies}
                    borderColor="border-amber-200"
                    bgColor="bg-amber-50/50"
                  />
                )}
                {report.llmAnalysis.hiddenOpportunities && (
                  <AnalysisSection
                    icon={<Lightbulb className="h-4 w-4 text-green-600" />}
                    title="潜在机会"
                    content={report.llmAnalysis.hiddenOpportunities}
                    borderColor="border-green-200"
                    bgColor="bg-green-50/50"
                  />
                )}
                {report.llmAnalysis.topicPriorities && (
                  <AnalysisSection
                    icon={<Target className="h-4 w-4 text-purple-600" />}
                    title="推荐选题优先级"
                    content={typeof report.llmAnalysis.topicPriorities === 'string'
                      ? report.llmAnalysis.topicPriorities
                      : JSON.stringify(report.llmAnalysis.topicPriorities, null, 2)}
                    borderColor="border-purple-200"
                    bgColor="bg-purple-50/50"
                  />
                )}
              </div>
              <p className="text-xs text-gray-400 mt-4">这些洞察已自动影响选题生成方向</p>
            </div>
          )}

          {/* GSC 搜索机会（旧格式兼容） */}
          {report.gscData?.topOpportunities && report.gscData.topOpportunities.length > 0 && !report.llmAnalysis && (
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">GSC 搜索机会</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">搜索词</th>
                      <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">展示量</th>
                      <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">排名</th>
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
                <h2 className="text-lg font-semibold text-gray-900">本周高分选题</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">#</th>
                      <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">标题</th>
                      <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">主关键词</th>
                      <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">总分</th>
                      <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">集群</th>
                      <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">搜索</th>
                      <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">差异</th>
                      <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">时效</th>
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
                  <span className="font-medium">首选选题理由: </span>{report.topTopics[0].reasoning}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* 选题库存状态 */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">当前选题库</h2>
          <span className="text-xs text-gray-400 ml-2">共 {inventory.reduce((s, i) => s + i.count, 0)} 个选题</span>
        </div>
        <div className="space-y-3">
          {inventory.map((item, i) => {
            const maxCount = Math.max(...inventory.map(x => x.count), 1);
            const pct = (item.count / maxCount) * 100;
            return (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700 capitalize">{item.category}</span>
                  <span className="text-gray-500 font-medium">{item.count} 个选题</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-indigo-500 h-2.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                {item.topics.length > 0 && (
                  <div className="mt-1 ml-2 space-y-0.5">
                    {item.topics.slice(0, 3).map((t, j) => (
                      <div key={j} className="text-xs text-gray-400 truncate">
                        {t.score ? `[${t.score.toFixed(0)}] ` : ''}{t.title}
                      </div>
                    ))}
                    {item.topics.length > 3 && (
                      <div className="text-xs text-gray-300">+{item.topics.length - 3} 更多</div>
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
      {renderStructuredContent(content)}
    </div>
  );
}
