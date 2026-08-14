import Link from 'next/link';

/**
 * 首页 → 可打印血压表 的引导条
 *
 * 放在 HowItWorks 之后：讲完 app 怎么用，紧接着接住「我还是想用纸」的那批
 * 访客（本站受众 60+，偏好纸质的比例不低）。同时给工具页补上首页内链 ——
 * 该页 sitemap priority 0.9 却零内链，信号自相矛盾。
 */
export default function BPLogPromoStrip() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-4">
      <Link
        href="/blood-pressure-log"
        className="group flex flex-col items-start gap-4 rounded-2xl border border-brand-blue/40 bg-brand-blue-light/40 p-6 transition-all hover:border-brand-blue hover:bg-brand-blue-light/60 hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-7"
      >
        <div className="flex items-start gap-4 sm:items-center">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm ring-1 ring-brand-blue/30" aria-hidden>
            🖨️
          </span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Prefer paper? Print our free blood pressure log
            </h3>
            <p className="mt-1 text-gray-600">
              Large print, one week per page — fill it in and bring it to your doctor. No signup.
            </p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-brand-blue-dark transition-transform group-hover:translate-x-1">
          Get the printable
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h9.6L10.3 5.7a1 1 0 111.4-1.4l5 5a1 1 0 010 1.4l-5 5a1 1 0 11-1.4-1.4L13.6 11H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </span>
      </Link>
    </section>
  );
}
