/**
 * GA4 Web 埋点 —— 事件与参数的唯一真源
 *
 * 媒体资源: BPCareSite (properties/531061636)
 * 数据流:   bpcareai.com · G-09YW8L1RLS
 *
 * ── 设计原则 ──
 * 1. 事件名/参数名集中在此定义，禁止在组件里写裸字符串
 *    （散落的字符串会导致同义异名，GA4 里再也拆不开）
 * 2. 参数名复用优先。GA4 单个媒体资源的**事件级自定义维度上限 50 个**，
 *    每新增一个参数名就永久占一格，删除要等 48 小时且历史数据不可再拆分。
 * 3. 只埋能驱动决策的事件。本站当前唯一的商业目标是「把搜索流量转成 App 下载」，
 *    所以埋点围绕这条链路：曝光 → 阅读 → 下载意图 → 跳转 App Store。
 *
 * ── 🔴 归因说明 ──
 * 网站到 App 的转化**无法在 GA4 里闭环**（跨端且经过 App Store）。
 * 真实安装/订阅要在 App Store Connect 按 campaign token 看，
 * 本文件的 APP_STORE_URL 已带 `ct` 参数，两边靠它对齐。
 */

/** GA4 衡量 ID —— 与 BPCareSite 数据流对应 */
export const GA4_MEASUREMENT_ID = 'G-09YW8L1RLS';

/**
 * App Store 链接生成器
 *
 * `ct`(campaign token) 会出现在 App Store Connect 的来源报告里，
 * 是**唯一**能把「网站某个位置的点击」和「真实安装」对上的字段。
 * `pt`/`mt` 为 Apple 标准参数，保持不变。
 */
const APP_ID = '6748299186';
export function appStoreUrl(campaign: string): string {
  return `https://apps.apple.com/us/app/bpcare-ai-heart-rate-monitor/id${APP_ID}?ct=${campaign}&mt=8`;
}

/** 事件名 —— 与 GA4 后台一一对应 */
export const GAEvent = {
  /** 下载按钮点击（所有位置共用，靠 position 区分） */
  downloadClick: 'download_click',
  /** 桌面端弹出二维码 */
  qrShown: 'qr_shown',
  /** 二维码弹窗被关闭（未扫码即离开的信号） */
  qrDismissed: 'qr_dismissed',
  /** 安卓用户点击下载 —— 衡量安卓需求量，决定要不要做安卓版 */
  androidUnsupported: 'android_unsupported',
  /** 文章阅读深度 */
  readDepth: 'read_depth',
  /** 工具页点击「打印」—— 这是工具页的核心转化，不是 download_click 的变体 */
  toolPrint: 'tool_print',
  /** 站外链接点击 */
  outboundClick: 'outbound_click',
} as const;

/** 参数名 —— 每个都占一格自定义维度配额，新增前先确认无法复用 */
export const GAParam = {
  /** 真实设备类型：ios / android / desktop（UA 判定，非屏幕宽度） */
  deviceType: 'device_type',
  /** 触发位置：header / article_cta / mobile_bar / homepage_hero / footer */
  position: 'position',
  /** 文章 slug —— 用于定位「哪篇文章带来了下载意图」 */
  articleSlug: 'article_slug',
  /** 文章主题簇 —— 用于回答「哪个内容方向最能转化」 */
  topicCluster: 'topic_cluster',
  /** 阅读进度分桶：25 / 50 / 75 / 100 */
  depth: 'depth',
  /** 站外链接域名 */
  outboundDomain: 'outbound_domain',
} as const;

/** 设备类型值域 */
export const DeviceType = {
  ios: 'ios',
  android: 'android',
  desktop: 'desktop',
} as const;
export type DeviceTypeValue = (typeof DeviceType)[keyof typeof DeviceType];

/**
 * 真实设备判定 —— 必须用 UA，不能用 CSS 断点。
 *
 * ⚠️ 全站现有的 `md:hidden` 是**屏幕宽度**判定：
 *    窄窗口的桌面浏览器会被当成移动端（点 App Store 链接打不开 app），
 *    iPad 横屏会被当成桌面端。做下载引导必须按真实设备分流。
 *
 * iPadOS 13+ 的 Safari 默认上报 Macintosh UA，靠 maxTouchPoints 补判。
 */
export function detectDevice(): DeviceTypeValue {
  if (typeof navigator === 'undefined') return DeviceType.desktop;
  const ua = navigator.userAgent;
  if (/iPhone|iPod/.test(ua)) return DeviceType.ios;
  if (/iPad/.test(ua)) return DeviceType.ios;
  // iPadOS 13+ 伪装成 Mac，用触点数区分真 Mac 与 iPad
  if (/Macintosh/.test(ua) && typeof document !== 'undefined' && navigator.maxTouchPoints > 1) {
    return DeviceType.ios;
  }
  if (/Android/.test(ua)) return DeviceType.android;
  return DeviceType.desktop;
}

type GAParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * 上报事件。
 * gtag 未就绪时静默丢弃 —— 埋点绝不能影响页面功能。
 */
export function track(event: string, params: GAParams = {}): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    if (process.env.NODE_ENV === 'development') {
      // 开发环境打印，便于本地核对参数是否符合预期
      console.log('[GA4]', event, params);
    }
    return;
  }
  const clean: GAParams = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') clean[k] = v;
  }
  window.gtag('event', event, clean);
}
