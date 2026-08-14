'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { GA4_MEASUREMENT_ID } from '@/lib/analytics/ga4';

/**
 * GA4 基础脚本 + SPA 路由变化时的 page_view 补发
 *
 * ⚠️ Next.js App Router 是客户端路由：只有首屏会自然触发 page_view，
 *    之后的站内跳转不会。若不手动补发，GA4 里会**只看到落地页**，
 *    文章页浏览量集体丢失 —— 这是 Next.js 接 GA4 最常见的坑。
 *    因此这里关掉 gtag 的自动 page_view，改为由 pathname 变化驱动。
 */
export default function GA4Script() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    if (typeof window.gtag !== 'function') return;
    // 首屏的 page_view 由 config 那次调用发出，避免重复计数
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    window.gtag('event', 'page_view', {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  if (!GA4_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA4_MEASUREMENT_ID}', {
            send_page_view: true
          });
        `}
      </Script>
    </>
  );
}
