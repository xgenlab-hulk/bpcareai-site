'use client';

import { useState, useCallback } from 'react';
import {
  track,
  detectDevice,
  appStoreUrl,
  GAEvent,
  GAParam,
  DeviceType,
  type DeviceTypeValue,
} from '@/lib/analytics/ga4';
import QRModal from './QRModal';

/**
 * 统一下载入口 —— 按**真实设备**分流
 *
 *   iOS      → 直接跳 App Store
 *   Android  → 提示暂不支持（并埋点，用来衡量安卓真实需求量）
 *   Desktop  → 弹二维码，引导用手机扫码
 *
 * 为什么桌面端要弹二维码而不是直接给链接：
 * 桌面点 App Store 链接只会打开网页版商店，用户还得手动在手机上再搜一次，
 * 中间流失极高。而数据显示本站 75% 展示来自桌面端、移动端 CTR 是桌面的 10 倍，
 * 二维码正是把这批「设备错配」的流量接住的手段。
 */
export default function DownloadButton({
  position,
  className,
  children,
  articleSlug,
  topicCluster,
}: {
  /** 触发位置，用于回答「哪个入口最有效」 */
  position: string;
  className?: string;
  children?: React.ReactNode;
  articleSlug?: string;
  topicCluster?: string;
}) {
  const [showQR, setShowQR] = useState(false);
  const [showAndroid, setShowAndroid] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const device: DeviceTypeValue = detectDevice();

      track(GAEvent.downloadClick, {
        [GAParam.deviceType]: device,
        [GAParam.position]: position,
        [GAParam.articleSlug]: articleSlug,
        [GAParam.topicCluster]: topicCluster,
      });

      if (device === DeviceType.ios) {
        // 放行默认跳转 —— href 已带 campaign token
        return;
      }

      e.preventDefault();

      if (device === DeviceType.android) {
        setShowAndroid(true);
        track(GAEvent.androidUnsupported, { [GAParam.position]: position });
        return;
      }

      setShowQR(true);
      track(GAEvent.qrShown, {
        [GAParam.position]: position,
        [GAParam.articleSlug]: articleSlug,
      });
    },
    [position, articleSlug, topicCluster]
  );

  return (
    <>
      <a
        href={appStoreUrl(`web_${position}`)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={className}
      >
        {children ?? 'Download App'}
      </a>

      {showQR && (
        <QRModal
          position={position}
          onClose={() => {
            setShowQR(false);
            track(GAEvent.qrDismissed, { [GAParam.position]: position });
          }}
        />
      )}

      {showAndroid && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowAndroid(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900">
              Android version coming soon
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              BPCare AI is currently available on iPhone and iPad only.
              We&apos;re working on an Android version.
            </p>
            <button
              onClick={() => setShowAndroid(false)}
              className="mt-5 w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
