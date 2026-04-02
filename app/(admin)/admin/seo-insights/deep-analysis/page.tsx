/**
 * SEO Insights - LLM Deep Analysis (Full Version)
 * 展示 llm-deep-analysis.md 的完整分析报告
 */

import Link from 'next/link';
import { ArrowLeft, Brain, FileText } from 'lucide-react';
import { getLLMDeepAnalysis } from '@/lib/admin/pipeline';

export const dynamic = 'force-dynamic';

export default function DeepAnalysisPage() {
  const analysis = getLLMDeepAnalysis();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/seo-insights" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-2">
          <ArrowLeft className="h-3 w-3" /> Back to Overview
        </Link>
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">LLM Deep Analysis</h1>
            <p className="text-sm text-gray-500">Comprehensive AI analysis based on 90-day GSC data</p>
          </div>
        </div>
      </div>

      {analysis ? (
        <div className="rounded-xl bg-white shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
            <div className="flex items-center gap-2 text-white">
              <FileText className="h-5 w-5" />
              <span className="font-medium">Full Analysis Report</span>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <div
              className="prose prose-sm max-w-none
                prose-headings:text-gray-900 prose-headings:font-bold
                prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-200
                prose-h3:text-base prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-gray-700 prose-p:leading-relaxed
                prose-li:text-gray-700
                prose-strong:text-gray-900
                prose-table:text-sm
                prose-th:bg-gray-50 prose-th:px-3 prose-th:py-2
                prose-td:px-3 prose-td:py-2 prose-td:border-b prose-td:border-gray-100
                prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-purple-700 prose-code:text-xs
                prose-blockquote:border-l-4 prose-blockquote:border-purple-300 prose-blockquote:bg-purple-50/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
              "
              dangerouslySetInnerHTML={{ __html: markdownToHtml(analysis) }}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-gray-50 p-12 text-center">
          <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No deep analysis report available.</p>
          <p className="text-xs text-gray-400 mt-2">This report is generated from 90-day GSC baseline data analysis.</p>
        </div>
      )}
    </div>
  );
}

/**
 * Simple markdown to HTML converter (no external dependencies)
 */
function markdownToHtml(md: string): string {
  let html = md
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr/>')
    // Blockquotes
    .replace(/^&gt; (.*$)/gm, '<blockquote><p>$1</p></blockquote>')
    // Unordered lists
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/^• (.*$)/gm, '<li>$1</li>')
    // Table rows (basic)
    .replace(/^\|(.*)\|$/gm, (match) => {
      const cells = match.split('|').filter(Boolean).map(c => c.trim());
      if (cells.every(c => /^[-:]+$/.test(c))) return ''; // separator row
      const tag = cells.some(c => c.startsWith('**')) ? 'th' : 'td';
      return '<tr>' + cells.map(c => `<${tag}>${c.replace(/\*\*/g, '')}</${tag}>`).join('') + '</tr>';
    });

  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

  // Wrap consecutive <tr> in <table>
  html = html.replace(/((?:<tr>.*<\/tr>\n?)+)/g, '<table class="w-full border-collapse">$1</table>');

  // Paragraphs (lines that aren't already HTML)
  html = html.split('\n').map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<')) return line;
    return `<p>${line}</p>`;
  }).join('\n');

  // Merge consecutive blockquotes
  html = html.replace(/<\/blockquote>\s*<blockquote>/g, '');

  return html;
}
