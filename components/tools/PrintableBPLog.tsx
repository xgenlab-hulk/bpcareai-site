'use client';

import { useState } from 'react';
import DownloadButton from '@/components/DownloadButton';

/**
 * 可打印血压记录表
 *
 * 设计取舍（目标用户是 60+ 老年人）：
 * · 打印优先 —— 屏幕上的样子不重要，纸上的样子才重要
 * · 大字号、粗表格线、高对比 —— 老花眼 + 家用打印机墨水淡
 * · 每页 7 天 × 早晚两次，正好一周一张，符合医生要求的记录周期
 * · 不用任何彩色背景填充 —— 省墨，且淡彩在黑白打印机上会变成灰糊
 */

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function PrintableBPLog() {
  const [weeks, setWeeks] = useState(1);

  return (
    <>
      {/* ── 屏幕上的介绍区（打印时隐藏）── */}
      <div className="print:hidden mx-auto max-w-3xl px-5 py-12">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Free Printable Blood Pressure Log
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-700">
          A large-print tracking sheet designed for older adults. Print it,
          fill it in twice a day, and bring it to your next appointment —
          most doctors want to see readings taken at home, not just the one
          measured in the office.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            onClick={() => window.print()}
            className="rounded-full bg-gray-900 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-gray-800"
          >
            Print this log
          </button>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <span>Weeks per print:</span>
            <select
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              className="rounded-lg border border-gray-300 px-3 py-2 text-base"
            >
              {[1, 2, 4].map((n) => (
                <option key={n} value={n}>
                  {n} week{n > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="mt-3 text-sm text-gray-500">
          No signup, no email required. Prints on standard letter or A4 paper.
        </p>

        <section className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            How to take a reliable reading
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-gray-700">
            <li>Sit quietly for 5 minutes first, feet flat on the floor, back supported.</li>
            <li>Rest your arm on a table so the cuff is level with your heart.</li>
            <li>Don&apos;t talk during the measurement.</li>
            <li>Take two readings a minute apart, and write down both.</li>
            <li>Measure at the same times each day — typically morning before medication, and evening.</li>
          </ol>
          <p className="mt-4 text-sm text-gray-600">
            Source: measurement technique follows the American Heart
            Association&apos;s published guidance for home monitoring.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <p className="text-sm leading-relaxed text-amber-900">
            <strong>This sheet is for recording only.</strong> It does not
            interpret your readings or tell you what to do about them. Blood
            pressure varies for many reasons, and a single high or low number
            usually isn&apos;t meaningful on its own. Share the completed log
            with your doctor or nurse — they are the ones who should interpret
            it. If you feel unwell, contact a healthcare professional rather
            than relying on any chart.
          </p>
        </section>

        <div className="mt-10 rounded-2xl border border-gray-200 p-6 text-center">
          <p className="text-gray-700">
            Prefer to track on your phone? BPCare AI stores readings
            automatically and charts the trend over time.
          </p>
          <DownloadButton
            position="bp_log_tool"
            className="mt-4 inline-block rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Get the free app
          </DownloadButton>
        </div>
      </div>

      {/* ── 打印区 ── */}
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
