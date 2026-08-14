import type { Metadata } from 'next';
import PrintableBPLog from '@/components/tools/PrintableBPLog';

/**
 * 可打印血压记录表
 *
 * ── 为什么做这个，而不是再写一篇文章 ──
 * 1. 站点 77% 页面卡在 "Discovered - currently not indexed"，
 *    再加文章只会加重站点级的"内容同质、不值得抓"判断。
 * 2. 工具型页面按「有没有用」被评判，不依赖署名与医学审核 ——
 *    这恰好绕开本站最大的结构性障碍（无 credentialed author 的 YMYL 内容）。
 * 3. 这是敲开本地老龄机构（Area Agency on Aging、老年活动中心、图书馆）
 *    大门最好的敲门砖：它们的法定职能包含「信息与转介服务」，
 *    会链接真正有用的免费资源，但不会链接又一篇健康文章。
 *
 * ── 🔴 合规红线 ──
 * 本页**只记录，不解读、不建议**。
 * 任何"根据你的读数判断该怎么做"的功能都可能被视为临床决策支持，
 * 对一个无医学审核的站点是不可接受的风险。
 * 因此：血压分类表仅作为**参考信息**呈现并注明出处（AHA 公开阈值），
 * 不对用户输入做任何自动判断。
 */

export const metadata: Metadata = {
  title: 'Free Printable Blood Pressure Log (PDF) — Large Print for Seniors',
  description:
    'Download a free printable blood pressure log. Large-print, high-contrast layout designed for seniors. Track morning and evening readings to bring to your doctor. No signup.',
  alternates: { canonical: 'https://bpcareai.com/blood-pressure-log' },
  openGraph: {
    title: 'Free Printable Blood Pressure Log — Large Print for Seniors',
    description:
      'A free, large-print blood pressure tracking sheet you can print at home and take to your next appointment.',
    url: 'https://bpcareai.com/blood-pressure-log',
    type: 'website',
  },
};

export default function BloodPressureLogPage() {
  return (
    <>
      {/* HowTo 结构化数据 —— 工具页比文章页更容易拿到富结果 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to use a printable blood pressure log',
            description:
              'Print a blood pressure log and record readings twice daily to bring to your doctor.',
            totalTime: 'PT2M',
            step: [
              { '@type': 'HowToStep', name: 'Print the sheet', text: 'Print the log on standard letter or A4 paper.' },
              { '@type': 'HowToStep', name: 'Record twice daily', text: 'Take readings in the morning before medication and in the evening.' },
              { '@type': 'HowToStep', name: 'Rest first', text: 'Sit quietly for five minutes with feet flat before measuring.' },
              { '@type': 'HowToStep', name: 'Bring it to your appointment', text: 'Give the completed sheet to your doctor or nurse.' },
            ],
          }),
        }}
      />
      <PrintableBPLog />
    </>
  );
}
