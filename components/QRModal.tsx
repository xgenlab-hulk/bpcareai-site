'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { appStoreUrl } from '@/lib/analytics/ga4';

/**
 * 桌面端扫码下载弹窗
 *
 * 二维码在**客户端本地生成**，不依赖任何第三方图片服务
 * （用外部 QR API 会把用户行为泄露给第三方，且服务挂了就白屏）。
 *
 * 二维码指向的 URL 带独立 campaign token `web_qr_<position>`，
 * 因此在 App Store Connect 里能直接看到「桌面扫码」带来的真实安装量，
 * 与页面上其他入口分开计。
 */
export default function QRModal({
  position,
  onClose,
}: {
  position: string;
  onClose: () => void;
}) {
  const [dataUrl, setDataUrl] = useState<string>('');
  const target = appStoreUrl(`web_qr_${position}`);

  useEffect(() => {
    QRCode.toDataURL(target, {
      width: 320,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#111827', light: '#FFFFFF' },
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(''));
  }, [target]);

  // Esc 关闭 + 打开期间锁滚动
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Scan to download BPCare AI"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-7 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold text-gray-900">
          Scan to download
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Point your iPhone camera at the code to get BPCare AI on the App Store.
        </p>

        <div className="mt-5 flex justify-center">
          {dataUrl ? (
            <img
              src={dataUrl}
              alt="QR code linking to BPCare AI on the App Store"
              className="h-56 w-56 rounded-lg border border-gray-200"
            />
          ) : (
            <div className="h-56 w-56 animate-pulse rounded-lg bg-gray-100" />
          )}
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Available on iPhone and iPad · Free to download
        </p>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  );
}
