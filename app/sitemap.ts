import { MetadataRoute } from 'next';
import { getAllArticlesMeta } from '@/lib/articles';

/**
 * Sitemap
 *
 * ── 🔴 修复 1：lastModified 不再用 new Date() ──
 * 原实现给每条 URL 都写构建时刻，导致 2,344 条 URL 的 lastmod 完全相同、
 * 且每次部署（每天自动生成文章时）全部刷新成"今天"。
 * 对 Google 而言这是明确的噪音信号：站点声称每天有 2,000+ 页面被更新，
 * 但抓取后发现内容没变 —— 会降低对本站 lastmod 的信任度，
 * 进而**不再据此安排抓取**。对一个抓取预算本就紧张的站点，这是净损失。
 * 现改为读取文章 frontmatter 的真实 updated/date。
 *
 * ── 🔴 修复 2：priority 分层 ──
 * 原实现所有文章一律 0.7，等于没有优先级信息。
 * priority 的作用是告诉 Google「同一站点内哪些页面更重要」，
 * 全站同值 = 放弃了这个表达机会。
 *
 * ── 关于"是否该把零曝光文章移出 sitemap" ──
 * 结论：不移除。理由见 docs/SEO-DECISIONS.md ——
 * 这些页面的状态是 "Discovered - currently not indexed"，
 * 即 Google **已经发现但选择不抓**。从 sitemap 移除它们，
 * 只会让 Google 更难重新发现，无法提升其余页面的抓取配额
 * （抓取预算由站点权威度决定，不由 sitemap 条目数决定）。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bpcareai.com';
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/articles`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/blood-pressure-log`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/data-deletion`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const articles = getAllArticlesMeta();

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => {
    // 真实修改时间：优先 updated，回退 date，都没有才用当前时间
    const raw = a.updated || a.date;
    const parsed = raw ? new Date(raw) : now;
    const lastModified = Number.isNaN(parsed.getTime()) ? now : parsed;

    return {
      url: `${baseUrl}/articles/${a.slug}`,
      lastModified,
      // 内容页更新频率低，且谎报高频会重蹈 lastmod 失信的覆辙
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    };
  });

  return [...staticPages, ...articlePages];
}
