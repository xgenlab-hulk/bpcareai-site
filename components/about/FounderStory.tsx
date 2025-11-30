/**
 * Founder's Story Section
 * Vertical timeline design with emotional depth
 */
'use client';

import { Heart, Flower2, HeartPulse, Stethoscope, Lightbulb } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function FounderStory() {
  const [visibleNodes, setVisibleNodes] = useState<Set<number>>(new Set());
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = nodeRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) {
              setVisibleNodes((prev) => new Set(prev).add(index));
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    nodeRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  const timelineNodes = [
    {
      icon: HeartPulse,
      title: 'At 17: AFib Diagnosis',
      content: `My name is Hudson Syl. At 17, I was diagnosed with atrial fibrillation and sinus arrhythmia—an age when most teenagers worry about exams, not irregular heartbeats. But my real education in heart health came from watching the people I love struggle with it for years.`,
      iconBg: 'from-red-400 to-red-600',
      iconColor: 'text-white',
    },
    {
      icon: Flower2,
      title: "My Grandfather's Story",
      content: `My grandfather lived with severe diabetes. I watched the careful ritual of his medication schedule, the quiet worry when his numbers were "off," and the gradual loss of activities he loved—gardening, long walks, evenings playing cards with friends. Not because he couldn't do them, but because fear and uncertainty slowly took those joys away.`,
      iconBg: 'from-green-400 to-green-600',
      iconColor: 'text-white',
    },
    {
      icon: Heart,
      title: "My Mother's Battle",
      content: `My mother has battled heart disease and high blood pressure for over a decade. I've sat with her in doctor's offices, watched her try to remember everything the doctor said (and forget half by the time we got to the car). I've heard the tremor in her voice: "My blood pressure was 150 this morning—should I be worried?"`,
      iconBg: 'from-pink-400 to-pink-600',
      iconColor: 'text-white',
    },
    {
      icon: Stethoscope,
      title: 'My Own Journey',
      content: `At 17, my AFib diagnosis suddenly made me understand their world from the inside. The hypervigilance. The constant mental calculation—Did I take my medication? Was that chest tightness real? The isolation of managing something you can't see, can't predict, and can't always explain.`,
      iconBg: 'from-blue-400 to-blue-600',
      iconColor: 'text-white',
    },
  ];

  return (
    <section id="our-story" className="bg-white px-4 py-16 md:py-20 scroll-mt-4">
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            The Story{' '}
            <span className="bg-gradient-to-r from-brand-blue-dark to-brand-purple bg-clip-text text-transparent">
              Behind BPCare AI
            </span>
          </h2>
        </div>

        {/* Opening Quote */}
        <blockquote className="mb-16 border-l-4 border-gray-300 pl-6 italic">
          <p className="text-lg text-gray-700 leading-relaxed">
            "I built BPCare AI because I know what it's like to wake up at 3 a.m., heart racing,
            wondering if this is just anxiety or something more serious."
          </p>
        </blockquote>

        {/* Timeline */}
        <div className="relative">
          {/* Center Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-blue via-brand-purple to-brand-pink -translate-x-1/2 hidden md:block" />

          {/* Timeline Nodes */}
          <div className="space-y-12 md:space-y-16">
            {timelineNodes.map((node, index) => {
              const isLeft = index % 2 === 0;
              const isVisible = visibleNodes.has(index);
              const Icon = node.icon;

              return (
                <div
                  key={index}
                  ref={(el) => {
                    nodeRefs.current[index] = el;
                  }}
                  className={`relative flex flex-col md:flex-row items-center gap-6 ${
                    isLeft ? 'md:flex-row-reverse' : ''
                  } ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  } transition-all duration-700 ease-out`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Content Card */}
                  <div className={`flex-1 ${isLeft ? 'md:text-right' : ''}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{node.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{node.content}</p>
                    </div>
                  </div>

                  {/* Icon Container */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-20 h-20 rounded-full bg-gradient-to-br ${node.iconBg} flex items-center justify-center shadow-lg ring-4 ring-white`}
                    >
                      <Icon className={`w-10 h-10 ${node.iconColor}`} />
                    </div>
                  </div>

                  {/* Spacer for opposite side */}
                  <div className="hidden md:block flex-1" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Emotional Climax Quote */}
        <div className="my-16 border-l-4 border-blue-500 bg-blue-50 rounded-r-2xl p-8">
          <div className="flex items-start gap-4">
            <span className="text-4xl text-blue-500">💬</span>
            <div>
              <p className="font-semibold text-gray-900 text-lg mb-3">
                Here's what broke my heart the most:
              </p>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
                My mother is sharp and capable, but when it came to her blood pressure, she felt lost.
                Not because she wasn't smart enough, but because{' '}
                <span className="font-semibold text-gray-900">
                  no one was explaining it in a way that made sense to her life
                </span>
                —to her reality as a woman in her 60s managing multiple medications and trying to
                figure out if that glass of wine at dinner was a terrible idea.
              </p>
            </div>
          </div>
        </div>

        {/* Resolution */}
        <div
          className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100"
        >
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center shadow-lg">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">The Resolution</h3>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
                I wanted to build something I wish my mother had when she was first diagnosed. Not another
                gadget that makes you feel stupid. But a tool that treats you like the intelligent,
                experienced adult you are—someone who deserves{' '}
                <span className="font-semibold text-gray-900">clarity, respect, and honest answers</span>{' '}
                about your own health.
              </p>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                BPCare AI exists because{' '}
                <span className="font-semibold text-gray-900">
                  you shouldn't have to choose between staying informed and staying sane
                </span>
                . This app is built for people like my mother, my grandfather, and yes, for myself—for
                everyone who deserves better than fear and confusion when it comes to heart health.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
