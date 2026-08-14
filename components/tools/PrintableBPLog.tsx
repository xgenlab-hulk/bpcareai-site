'use client';

import { useState } from 'react';
import DownloadButton from '@/components/DownloadButton';
import { track, GAEvent, GAParam } from '@/lib/analytics/ga4';

/**
 * 可打印血压记录表 —— 工具页
 *
 * ── 设计目标 ──
 * 访客（60+ 老人或其子女，从搜索进来）要在 3 秒内看到「纸打出来长什么样」，
 * 所以首屏右侧放一张**真实比例的纸张预览**（两层纸叠影 + 示例笔迹），
 * 而不是靠文字描述。移动端预览用紧凑字号完整放下，不横向滚动。
 *
 * ── 🔴 打印修复 ──
 * 站点 Header / Footer / MobileCTABar 来自 (public)/layout.tsx，
 * 会跟着打进纸里（用户实测打出了 Quick Links / Legal / 品牌区）。
 * 本组件的 @media print 里显式隐藏 header / footer / .fixed，
 * 并清掉 main 的底部 padding —— 打印输出只含记录表本身。
 *
 * ── 合规红线（不变）──
 * 只记录，不解读。AHA 分类阈值仅作参考信息陈述并注明出处，
 * 不对用户输入做任何判断。
 */

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** 预览表里的示例笔迹（前两行）—— 让访客一眼明白怎么用 */
const SAMPLE_ROWS: Record<string, string[]> = {
  Mon: ['6/2', '118', '76', '64', '122', '79', '66'],
  Tue: ['6/3', '121', '78', '62', '119', '75', '63'],
};

const RANGES = [
  { label: 'Normal', value: 'under 120 / under 80', dot: 'bg-emerald-500' },
  { label: 'Elevated', value: '120–129 / under 80', dot: 'bg-yellow-500' },
  { label: 'High (Stage 1)', value: '130–139 / 80–89', dot: 'bg-orange-500' },
  { label: 'High (Stage 2)', value: '140+ / 90+', dot: 'bg-red-500' },
];

const STEPS = [
  { n: '1', title: 'Print it', text: 'One click. Standard letter or A4 paper — one week per page.' },
  { n: '2', title: 'Rest 5 minutes', text: 'Sit quietly, feet flat, back supported, arm resting at heart level.' },
  { n: '3', title: 'Write both readings', text: 'Take two readings a minute apart, morning and evening. Write them all down.' },
  { n: '4', title: 'Bring it to your doctor', text: 'Home readings over a week tell your doctor far more than one office visit.' },
];

export default function PrintableBPLog() {
  const [weeks, setWeeks] = useState(1);

  const handlePrint = () => {
    track(GAEvent.toolPrint, { [GAParam.position]: 'bp_log_tool' });
    window.print();
  };

  return (
    <>
      {/* ═══════════════ 屏幕区（打印时整体隐藏）═══════════════ */}
      <div className="print:hidden">
        {/* ── Hero：左文案 + 右纸张预览 ── */}
        <section className="bg-gradient-to-br from-brand-blue-light via-white to-brand-purple-light/40">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-14 pt-10 sm:pt-14 lg:grid-cols-2 lg:gap-14 lg:pb-20 lg:pt-16">
            {/* 文案列 */}
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-1.5 text-sm font-medium text-brand-blue-dark ring-1 ring-brand-blue/40">
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z" clipRule="evenodd" />
                </svg>
                Free · No signup · Prints in one click
              </span>

              <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl">
                A blood pressure log your{' '}
                <span className="text-brand-blue-dark">doctor will actually use</span>
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-700">
                Large print, high contrast, and boxes big enough to write in.
                Track morning and evening readings for a week, then hand the
                sheet to your doctor — home numbers tell them more than any
                single office visit.
              </p>

              {/* 操作区 */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gray-900 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-gray-800 hover:shadow-xl"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                  </svg>
                  Print this log
                </button>

                {/* 周数分段选择 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Pages:</span>
                  <div className="inline-flex rounded-full bg-white p-1 ring-1 ring-gray-300" role="group" aria-label="Weeks per print">
                    {[1, 2, 4].map((n) => (
                      <button
                        key={n}
                        onClick={() => setWeeks(n)}
                        aria-pressed={weeks === n}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                          weeks === n
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {n} wk{n > 1 ? 's' : ''}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                No email required · No account · Nothing to download — it prints straight from this page
              </p>
            </div>

            {/* 纸张预览列 */}
            <div className="mx-auto w-full max-w-lg" aria-hidden>
              {/* 叠纸容器：背景纸影只覆盖纸张本身，不盖到下方文字说明 */}
              <div className="relative">
              {/* 背面纸影 */}
              <div className="absolute inset-0 translate-x-3 translate-y-3 rotate-1 rounded-xl bg-brand-purple-light/70" />
              <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rotate-[0.5deg] rounded-xl bg-white/70 ring-1 ring-gray-200" />

              {/* 正面纸张 */}
              <div className="relative rounded-xl bg-white p-4 shadow-2xl ring-1 ring-gray-900/10 sm:p-6">
                <div className="flex items-baseline justify-between border-b-2 border-gray-900 pb-2">
                  <h2 className="text-base font-bold text-gray-900 sm:text-lg">Blood Pressure Log</h2>
                  <span className="text-[9px] text-gray-500 sm:text-[11px]">
                    Week of <span className="font-serif italic text-blue-800">June 2</span>
                  </span>
                </div>

                <table className="mt-2 w-full table-fixed border-collapse">
                  <thead>
                    <tr className="text-[8px] sm:text-[10px]">
                      <th rowSpan={2} className="w-[11%] border border-gray-800 p-1 font-bold text-gray-900">Day</th>
                      <th rowSpan={2} className="w-[12%] border border-gray-800 p-1 font-bold text-gray-900">Date</th>
                      <th colSpan={3} className="border border-gray-800 bg-brand-blue-light/50 p-1 font-bold text-gray-900">Morning</th>
                      <th colSpan={3} className="border border-gray-800 bg-brand-purple-light/50 p-1 font-bold text-gray-900">Evening</th>
                    </tr>
                    <tr className="text-[7px] sm:text-[9px]">
                      <th className="border border-gray-800 p-0.5 font-semibold text-gray-700">Sys</th>
                      <th className="border border-gray-800 p-0.5 font-semibold text-gray-700">Dia</th>
                      <th className="border border-gray-800 p-0.5 font-semibold text-gray-700">Pulse</th>
                      <th className="border border-gray-800 p-0.5 font-semibold text-gray-700">Sys</th>
                      <th className="border border-gray-800 p-0.5 font-semibold text-gray-700">Dia</th>
                      <th className="border border-gray-800 p-0.5 font-semibold text-gray-700">Pulse</th>
                    </tr>
                  </thead>
                  <tbody>
                    {WEEKDAYS.map((d) => {
                      const sample = SAMPLE_ROWS[d];
                      return (
                        <tr key={d} className="h-7 sm:h-9">
                          <td className="border border-gray-800 text-center text-[8px] font-bold text-gray-900 sm:text-[10px]">{d}</td>
                          {Array.from({ length: 7 }).map((_, i) => (
                            <td key={i} className="border border-gray-800 text-center">
                              {sample ? (
                                <span className="font-serif text-[9px] italic text-blue-800/90 sm:text-[12px]">
                                  {sample[i]}
                                </span>
                              ) : null}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[7px] text-gray-500 sm:text-[9px]">
                  <span className="font-semibold text-gray-600">AHA reference:</span>
                  <span>Normal &lt;120/&lt;80</span>
                  <span>Elevated 120–129</span>
                  <span>Stage 1 130–139</span>
                  <span>Stage 2 140+</span>
                </div>
              </div>
              </div>

              <p className="mt-6 text-center text-sm text-gray-500">
                ↑ Exactly what comes out of your printer
              </p>
            </div>
          </div>
        </section>

        {/* ── 使用步骤 ── */}
        <section className="mx-auto max-w-6xl px-5 py-14 lg:py-20">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            How to get readings your doctor can trust
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
            Technique follows the American Heart Association&apos;s published guidance for home monitoring.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-2xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue-light text-lg font-bold text-brand-blue-dark">
                  {s.n}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-gray-600">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 参考范围 + 免责 ── */}
        <section className="bg-gray-50">
          <div className="mx-auto max-w-6xl px-5 py-14">
            <h2 className="text-2xl font-bold text-gray-900">
              Blood pressure categories <span className="text-base font-normal text-gray-500">(American Heart Association)</span>
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {RANGES.map((r) => (
                <div key={r.label} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
                  <span className={`h-3 w-3 shrink-0 rounded-full ${r.dot}`} aria-hidden />
                  <div>
                    <p className="font-semibold text-gray-900">{r.label}</p>
                    <p className="text-sm text-gray-600">{r.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <p className="leading-relaxed text-amber-900">
                <strong>This sheet records — it doesn&apos;t interpret.</strong>{' '}
                Blood pressure varies for many reasons, and a single high or low
                number usually isn&apos;t meaningful on its own. Share the
                completed log with your doctor or nurse — they&apos;re the ones
                who should read it. If you feel unwell, contact a healthcare
                professional rather than relying on any chart.
              </p>
            </div>
          </div>
        </section>

        {/* ── App 交叉引导 ── */}
        <section className="mx-auto max-w-6xl px-5 py-14 lg:py-20">
          <div className="rounded-3xl bg-gradient-brand p-8 text-center sm:p-12">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Prefer your phone to do the writing?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-lg text-gray-700">
              BPCare AI saves every reading automatically and charts the trend
              over time — the same story this paper tells, without the pen.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <DownloadButton
                position="bp_log_tool"
                className="inline-flex items-center justify-center rounded-full bg-gray-900 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-gray-800"
              >
                Get the free app
              </DownloadButton>
              <button
                onClick={handlePrint}
                className="inline-flex items-center justify-center rounded-full bg-white/80 px-8 py-4 text-lg font-semibold text-gray-900 ring-1 ring-gray-300 transition-colors hover:bg-white"
              >
                Or just print the log
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* ═══════════════ 打印区（屏幕上隐藏）═══════════════ */}
      <div className="hidden print:block">
        {Array.from({ length: weeks }).map((_, w) => (
          <div key={w} className="log-page">
            <div className="log-head">
              <h2>Blood Pressure Log</h2>
              <div className="log-meta">
                <span>Name: ______________________</span>
                <span>Week of: ______________</span>
              </div>
            </div>

            <table className="log-table">
              <thead>
                <tr>
                  <th rowSpan={2} className="col-day">Day</th>
                  <th rowSpan={2} className="col-date">Date</th>
                  <th colSpan={3}>Morning</th>
                  <th colSpan={3}>Evening</th>
                  <th rowSpan={2} className="col-notes">Notes</th>
                </tr>
                <tr>
                  <th>Systolic</th>
                  <th>Diastolic</th>
                  <th>Pulse</th>
                  <th>Systolic</th>
                  <th>Diastolic</th>
                  <th>Pulse</th>
                </tr>
              </thead>
              <tbody>
                {WEEKDAYS.map((d) => (
                  <tr key={d}>
                    <td className="col-day">{d}</td>
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 参考信息：仅陈述公开阈值，不对用户读数做任何判断 */}
            <div className="log-ref">
              <strong>Reference ranges (American Heart Association):</strong>
              <span>Normal: under 120 / under 80</span>
              <span>Elevated: 120–129 / under 80</span>
              <span>High (Stage 1): 130–139 / 80–89</span>
              <span>High (Stage 2): 140+ / 90+</span>
            </div>

            <p className="log-foot">
              For recording only — this sheet does not interpret readings.
              Bring it to your doctor. · bpcareai.com/blood-pressure-log
            </p>
          </div>
        ))}
      </div>

      <style>{`
        @media print {
          @page { size: auto; margin: 12mm; }
          body { background: #fff; }

          /* 🔴 隐藏站点框架 —— Header/Footer/MobileCTABar 来自 layout，
             不隐藏会整页整页地打出来（用户实测打出了 Quick Links / Legal 区）。 */
          header, footer, .fixed { display: none !important; }
          main { padding: 0 !important; }

          .log-page { page-break-after: always; }
          .log-page:last-child { page-break-after: auto; }
          .log-head h2 {
            font-size: 22pt; font-weight: 700; margin: 0 0 6pt;
            color: #000; letter-spacing: -0.01em;
          }
          .log-meta {
            display: flex; gap: 28pt; font-size: 11pt;
            color: #000; margin-bottom: 10pt;
          }
          .log-table {
            width: 100%; border-collapse: collapse; table-layout: fixed;
          }
          .log-table th, .log-table td {
            border: 1.2pt solid #000; text-align: center;
            font-size: 11pt; color: #000;
          }
          .log-table th { padding: 5pt 2pt; font-weight: 700; }
          /* 行高足够手写，这是纸质表最容易做砸的地方 */
          .log-table td { height: 34pt; }
          .col-day { width: 8%; font-weight: 700; }
          .col-date { width: 11%; }
          .col-notes { width: 17%; }
          .log-ref {
            margin-top: 10pt; display: flex; flex-wrap: wrap; gap: 4pt 18pt;
            font-size: 9.5pt; color: #000;
          }
          .log-ref strong { width: 100%; }
          .log-foot {
            margin-top: 8pt; font-size: 8.5pt; color: #333;
          }
        }
      `}</style>
    </>
  );
}
