/**
 * Trusted Medical Sources Section
 * Two-column layout: Editorial Standards + Logo Grid
 */
'use client';

import { CheckCircle, Award, BookCheck, RefreshCw, Shield, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

export function MedicalSources() {
  const [expandedIndex, setExpandedIndex] = useState<number>(-1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Add CSS for 3D flip effect
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .group:hover .flip-card-inner {
        transform: rotateX(180deg);
      }
      .flip-card-inner {
        transform-style: preserve-3d;
        transition: transform 0.6s;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // 检测屏幕尺寸，移动端默认展开第一个
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setExpandedIndex((prev) => (prev === -1 ? 0 : prev));
      } else {
        setExpandedIndex(-1);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const standards = [
    {
      icon: BookCheck,
      title: 'Guideline-Based Development',
      description: 'App features, AI algorithms, and educational content align with AHA, NIH, and other authoritative medical guidelines.',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-blue-600',
      borderColor: 'border-blue-200',
      bgColor: 'bg-blue-50/50',
    },
    {
      icon: CheckCircle,
      title: 'Evidence-Based AI & Algorithms',
      description: 'Predictive models and analysis algorithms are built on peer-reviewed medical research and clinical studies.',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      gradientFrom: 'from-green-500',
      gradientTo: 'to-green-600',
      borderColor: 'border-green-200',
      bgColor: 'bg-green-50/50',
    },
    {
      icon: RefreshCw,
      title: 'Continuous Medical Review',
      description: 'All systems, content, and features are continuously reviewed and updated to reflect the latest medical knowledge.',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      gradientFrom: 'from-purple-500',
      gradientTo: 'to-purple-600',
      borderColor: 'border-purple-200',
      bgColor: 'bg-purple-50/50',
    },
    {
      icon: Award,
      title: 'Independent & Unbiased',
      description: 'No commercial interests, paid placements, or advertising influence our development, algorithms, or content.',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-orange-600',
      borderColor: 'border-orange-200',
      bgColor: 'bg-orange-50/50',
    },
  ];

  // 16 个医疗机构数据（4x4 网格）
  const sources = [
    { name: 'American Heart Association', abbr: 'AHA', logo: '/logos/aha.png' },
    { name: 'National Institutes of Health', abbr: 'NIH', logo: '/logos/nih.png' },
    { name: 'Mayo Clinic', abbr: 'Mayo', logo: '/logos/mayo.png' },
    { name: 'CDC', abbr: 'CDC', logo: '/logos/cdc.png' },
    { name: 'Robert Koch Institute', abbr: 'RKI', logo: '/logos/rki.png' },
    { name: 'Charité Berlin', abbr: 'Charité', logo: '/logos/charite.png' },
    { name: 'Institut Pasteur', abbr: 'Pasteur', logo: '/logos/pasteur.png' },
    { name: 'Inserm', abbr: 'Inserm', logo: '/logos/inserm.png' },
    { name: 'Saudi Ministry of Health', abbr: 'MOH', logo: '/logos/moh.png' },
    { name: 'Dubai Health Authority', abbr: 'DHA', logo: '/logos/dha.png' },
    { name: 'National Institute of Health Japan', abbr: 'NIID', logo: '/logos/niid.png' },
    { name: 'KCDC', abbr: 'KCDC', logo: '/logos/kcdc.png' },
    { name: 'Seoul National University Hospital', abbr: 'SNUH', logo: '/logos/snuh.png' },
    { name: 'World Health Organization', abbr: 'WHO', logo: '/logos/who.png' },
    { name: 'PubMed', abbr: 'PubMed', logo: '/logos/pubmed.png' },
    { name: 'Johns Hopkins Medicine', abbr: 'JHM', logo: '/logos/jhm.png' },
  ];

  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 py-16 md:py-20 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-slate-200/15 rounded-full blur-3xl" />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle, #1e293b 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div className="relative mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Built on{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Trusted Medical Knowledge
            </span>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            From educational content to app features, predictive algorithms, and medical-grade AI models—every aspect of BPCare AI is grounded in evidence-based medical research.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Left: Medical Standards & Principles */}
          <div className="relative bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/60 flex flex-col h-[600px] overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-100/30 to-blue-100/30 rounded-full blur-3xl -z-10" />
            <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-br from-purple-100/20 to-blue-100/20 rounded-full blur-2xl -z-10" />

            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] -z-10" style={{
              backgroundImage: 'linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }} />

            {/* Dot Pattern Texture */}
            <div className="absolute inset-0 opacity-[0.04] -z-10" style={{
              backgroundImage: 'radial-gradient(circle, #6366f1 0.5px, transparent 0.5px)',
              backgroundSize: '20px 20px'
            }} />

            {/* Diagonal Lines Texture */}
            <div className="absolute inset-0 opacity-[0.02] -z-10" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #3b82f6 10px, #3b82f6 11px)',
            }} />

            {/* Hexagon Pattern (Medical Feel) */}
            <div className="absolute inset-0 opacity-[0.025] -z-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%233b82f6' stroke-width='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }} />

            {/* Noise Texture */}
            <div className="absolute inset-0 opacity-[0.015] -z-10 mix-blend-overlay" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }} />

            {/* Wave Pattern */}
            <div className="absolute inset-0 opacity-[0.03] -z-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q 25 0, 50 10 T 100 10' stroke='%236366f1' fill='none' stroke-width='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: '100px 20px'
            }} />

            {/* Concentric Circles */}
            <div className="absolute top-1/2 right-0 w-80 h-80 -z-10 opacity-[0.04]" style={{
              backgroundImage: 'radial-gradient(circle, transparent 20%, #3b82f6 20%, #3b82f6 20.5%, transparent 20.5%, transparent 40%, #3b82f6 40%, #3b82f6 40.5%, transparent 40.5%, transparent 60%, #3b82f6 60%, #3b82f6 60.5%, transparent 60.5%)',
            }} />

            {/* Cross Hatch Pattern */}
            <div className="absolute inset-0 opacity-[0.02] -z-10" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 15px, #6366f1 15px, #6366f1 16px), repeating-linear-gradient(90deg, transparent, transparent 15px, #6366f1 15px, #6366f1 16px)',
            }} />

            {/* Star/Plus Pattern */}
            <div className="absolute inset-0 opacity-[0.025] -z-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0v40M0 20h40' stroke='%233b82f6' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px'
            }} />

            {/* Triangle Pattern */}
            <div className="absolute inset-0 opacity-[0.02] -z-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10 L50 50 L10 50 Z' stroke='%236366f1' fill='none' stroke-width='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }} />

            {/* Radial Lines */}
            <div className="absolute top-0 left-0 w-96 h-96 -z-10 opacity-[0.03]" style={{
              backgroundImage: 'conic-gradient(from 0deg, transparent 0deg, #3b82f6 1deg, transparent 2deg, transparent 30deg, #3b82f6 31deg, transparent 32deg, transparent 60deg, #3b82f6 61deg, transparent 62deg, transparent 90deg)',
              transform: 'translate(-50%, -50%)'
            }} />

            {/* Dashed Circle Pattern */}
            <div className="absolute inset-0 opacity-[0.025] -z-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='30' stroke='%236366f1' stroke-width='0.5' fill='none' stroke-dasharray='5,5'/%3E%3C/svg%3E")`,
              backgroundSize: '80px 80px'
            }} />

            {/* Curved Lines Texture */}
            <div className="absolute inset-0 opacity-[0.02] -z-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 60 Q 30 30, 60 60 T 120 60' stroke='%233b82f6' fill='none' stroke-width='0.5'/%3E%3Cpath d='M0 80 Q 30 50, 60 80 T 120 80' stroke='%236366f1' fill='none' stroke-width='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: '120px 120px'
            }} />

            {/* DNA Helix Pattern (Medical) */}
            <div className="absolute inset-0 opacity-[0.015] -z-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0 Q 50 25, 80 50 Q 50 75, 20 100' stroke='%233b82f6' fill='none' stroke-width='1'/%3E%3Cpath d='M80 0 Q 50 25, 20 50 Q 50 75, 80 100' stroke='%236366f1' fill='none' stroke-width='1'/%3E%3C/svg%3E")`,
              backgroundSize: '100px 100px'
            }} />

            {/* Gradient Border Accent */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent -z-10" />

            {/* Multi-layer Gradient Overlays */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500/5 via-transparent to-purple-500/5 -z-10" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-bl from-blue-400/5 via-transparent to-transparent -z-10" />

            {/* Top Edge Glow */}
            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent -z-10" />

            {/* Bottom Edge Glow */}
            <div className="absolute bottom-0 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent -z-10" />

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-transparent rounded-tl-2xl -z-10" />
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-br-2xl -z-10" />

            <h3 className="relative text-xl font-bold text-gray-900 mb-6 text-center">
              Our Medical Standards
            </h3>

            <div className="relative space-y-8 flex-1 flex flex-col justify-center overflow-hidden">
              {standards.map((standard, index) => {
                const Icon = standard.icon;
                const isExpanded = expandedIndex === index;
                const isHovered = hoveredIndex === index;
                const isActive = isExpanded || isHovered;
                const isRightAlign = index === 1 || index === 3; // 第2、4个右对齐

                return (
                  <div
                    key={index}
                    className={`group relative rounded-xl overflow-hidden transition-all duration-300 border ${
                      isActive
                        ? 'bg-gradient-to-r ' + standard.gradientFrom + ' ' + standard.gradientTo + ' shadow-lg border-transparent'
                        : standard.bgColor + ' ' + standard.borderColor + ' hover:shadow-md'
                    } ${isRightAlign ? 'self-end' : 'self-start'} w-[85%]`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => setExpandedIndex(index)}
                  >
                    {/* Header - Always Visible */}
                    <button
                      className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left transition-all duration-300"
                      aria-expanded={isExpanded}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {/* Icon */}
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                            isActive ? 'bg-white/20 backdrop-blur-sm shadow-sm' : standard.iconBg
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 transition-all duration-300 ${
                              isActive ? 'text-white' : standard.iconColor
                            }`}
                          />
                        </div>

                        {/* Title */}
                        <span
                          className={`font-semibold text-sm leading-[1] transition-all duration-300 ${
                            isActive ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {standard.title}
                        </span>
                      </div>

                      {/* Chevron Indicator - Mobile Only */}
                      <ChevronDown
                        className={`flex-shrink-0 w-4 h-4 transition-all duration-300 md:hidden ${
                          isActive ? 'text-white' : 'text-gray-400'
                        } ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Description - Expandable */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded || isHovered ? 'max-h-32 md:max-h-24 opacity-100' : 'max-h-0 opacity-0 md:max-h-0'
                      }`}
                    >
                      <div className="px-4 pb-4 pl-[52px]">
                        <p
                          className={`text-sm leading-relaxed transition-all duration-300 ${
                            isActive ? 'text-white/95' : 'text-gray-600'
                          }`}
                        >
                          {standard.description}
                        </p>
                      </div>
                    </div>

                    {/* Subtle shine effect on hover */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Trusted Medical Sources - 4x4 Grid with Flip Effect */}
          <div className="h-[600px] pt-8 relative">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Trusted Medical Sources</h3>

            {/* 4x4 Grid Container */}
            <div className="flex flex-col gap-2 items-center justify-center">
              <div className="grid grid-cols-4 gap-2">
              {sources.map((source, index) => (
                <div
                  key={index}
                  className="group w-24 h-24"
                  style={{ perspective: '1000px' }}
                >
                  {/* Flip Card Container */}
                  <div className="relative w-24 h-24 flip-card-inner">
                    {/* Front: Logo */}
                    <div
                      className="absolute inset-0 rounded-xl bg-white shadow-md border border-gray-200 flex items-center justify-center overflow-hidden"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                      }}
                    >
                      <div className="relative w-full h-full p-3 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
                        {/* Placeholder for Logo - 将被替换为真实的 logo 图片 */}
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium">
                          {source.abbr}
                        </div>
                        {/* 未来将使用: <img src={source.logo} alt={source.name} className="w-full h-full object-contain" /> */}
                      </div>
                    </div>

                    {/* Back: Institution Name */}
                    <div
                      className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg flex items-center justify-center p-3"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateX(180deg)',
                      }}
                    >
                      <p className="text-white text-xs font-semibold text-center leading-tight">
                        {source.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>

        {/* Medical Disclaimer */}
        <div className="relative rounded-2xl border-l-4 border-yellow-500 bg-yellow-50/90 backdrop-blur-sm p-6">
          <p className="font-semibold text-gray-900 mb-2">Important Medical Disclaimer:</p>
          <p className="text-gray-700 leading-relaxed">
            BPCare AI provides <span className="font-semibold">educational information, not medical advice</span>.
            Always consult your healthcare provider for personalized diagnosis and treatment
            recommendations. The information in our app is not intended to replace professional
            medical care.
          </p>
        </div>
      </div>
    </section>
  );
}
