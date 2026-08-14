'use client';

import { useEffect, useRef } from 'react';
import { track, GAEvent, GAParam } from '@/lib/analytics/ga4';

/**
 * 文章阅读深度追踪（25 / 50 / 75 / 100）
 *
 * 为什么值得埋：本站 CTA 在文章底部，只有读到底的人才会看到它。
 * 「读到 100% 的比例」直接决定了下载入口的真实曝光量 ——
 * 如果绝大多数人读到 25% 就走，那优化 CTA 文案毫无意义，
 * 该改的是文章开头的信息结构。
 *
 * 每个分桶每次页面加载只上报一次，避免滚动抖动刷量。
 */
const MARKS = [25, 50, 75, 100] as const;

export default function ReadDepthTracker({
  articleSlug,
  topicCluster,
}: {
  articleSlug: string;
  topicCluster?: string;
}) {
  const fired = useRef<Set<number>>(new Set());

  useEffect(() => {
    fired.current = new Set();

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = (window.scrollY / scrollable) * 100;

      for (const m of MARKS) {
        if (pct >= m && !fired.current.has(m)) {
          fired.current.add(m);
          track(GAEvent.readDepth, {
            [GAParam.depth]: m,
            [GAParam.articleSlug]: articleSlug,
            [GAParam.topicCluster]: topicCluster,
          });
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // 短文章可能首屏即到底
    return () => window.removeEventListener('scroll', onScroll);
  }, [articleSlug, topicCluster]);

  return null;
}
