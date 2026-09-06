'use client';

import { useState } from 'react';
import Tag from '@/components/shared/tag';
import type { Project } from '@/lib/types';

type Tab = 'overview' | 'architecture' | 'testimonials';

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: '📋' },
  { id: 'architecture', label: 'Architecture', icon: '🏗️' },
  { id: 'testimonials', label: 'Testimonials', icon: '💬' },
];

export default function ProjectShowcase({ project }: { project: Project }) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [currentScreenshot, setCurrentScreenshot] = useState(0);

  const screenshots = project.screenshots ?? [];
  const architecture = project.architecture ?? [];
  const testimonials = project.testimonials ?? [];

  return (
    <div className="space-y-6">
      <div className="stitch-card p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Tag label={project.category} color={project.brandColor} />
            {project.techStack.map((tech) => (
              <Tag key={tech} label={tech} />
            ))}
          </div>

          <nav className="flex gap-1 border-b border-hem">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-[family-name:var(--font-script)] transition-colors ${
                  activeTab === tab.id
                    ? 'text-terracotta border-b-2 border-terracotta'
                    : 'text-stone hover:text-teal'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>

          {activeTab === 'overview' && (
            <div className="space-y-4">
              <p className="text-ink leading-relaxed">{project.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-paper rounded-lg p-4 border border-border">
                  <h4 className="text-sm font-semibold text-terracotta font-[family-name:var(--font-script)] mb-2">
                    Problem
                  </h4>
                  <p className="text-sm text-muted leading-relaxed">{project.problem}</p>
                </div>
                <div className="bg-paper rounded-lg p-4 border border-border">
                  <h4 className="text-sm font-semibold text-terracotta font-[family-name:var(--font-script)] mb-2">
                    Result
                  </h4>
                  <p className="text-sm text-muted leading-relaxed">{project.result}</p>
                </div>
              </div>

              {project.features.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-terracotta font-[family-name:var(--font-script)] mb-2">
                    Key Features
                  </h4>
                  <ul className="space-y-1">
                    {project.features.map((feature) => (
                      <li key={feature} className="text-sm text-muted flex items-start gap-2">
                        <span className="text-accent mt-0.5">▸</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {screenshots.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-terracotta font-[family-name:var(--font-script)] mb-2">
                    Screenshots
                  </h4>
                  <div className="relative bg-paper rounded-lg border border-border overflow-hidden">
                    <div className="aspect-video flex items-center justify-center text-muted text-sm">
                      <img
                        src={screenshots[currentScreenshot]}
                        alt={`${project.title} screenshot ${currentScreenshot + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    {screenshots.length > 1 && (
                      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-2 bg-paper/80 backdrop-blur-sm">
                        <button
                          onClick={() =>
                            setCurrentScreenshot((prev) =>
                              prev === 0 ? screenshots.length - 1 : prev - 1
                            )
                          }
                          className="px-3 py-1 text-xs font-[family-name:var(--font-script)] text-stone hover:text-teal bg-linen rounded border border-hem transition-colors"
                        >
                          ← Prev
                        </button>
                        <span className="text-xs text-stone font-[family-name:var(--font-script)]">
                          {currentScreenshot + 1} / {screenshots.length}
                        </span>
                        <button
                          onClick={() =>
                            setCurrentScreenshot((prev) =>
                              prev === screenshots.length - 1 ? 0 : prev + 1
                            )
                          }
                          className="px-3 py-1 text-xs font-[family-name:var(--font-script)] text-stone hover:text-teal bg-linen rounded border border-hem transition-colors"
                        >
                          Next →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4">
              {architecture.length === 0 ? (
                <p className="text-sm text-muted text-center py-8">
                  No architecture data available.
                </p>
              ) : (
                <div className="bg-paper rounded-lg border border-border p-6">
                  <div className="flex flex-wrap gap-4 justify-center">
                    {architecture.map((node) => (
                      <div
                        key={node.id}
                        className="bg-linen border border-hem rounded-lg p-4 min-w-[160px] text-center hover:border-accent transition-colors cursor-pointer group"
                      >
                        <div className="text-xs font-[family-name:var(--font-script)] text-stone mb-1 uppercase tracking-wide">
                          {node.type}
                        </div>
                        <div className="text-sm font-semibold text-ink font-[family-name:var(--font-display)] group-hover:text-terracotta transition-colors">
                          {node.label}
                        </div>
                        {node.description && (
                          <p className="text-xs text-stone mt-1 leading-relaxed">
                            {node.description}
                          </p>
                        )}
                        {node.connections.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1 justify-center">
                            {node.connections.map((conn) => (
                              <span
                                key={conn}
                                className="text-[10px] font-[family-name:var(--font-script)] text-teal bg-blush px-1.5 py-0.5 rounded"
                              >
                                → {conn}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div className="space-y-4">
              {testimonials.length === 0 ? (
                <p className="text-sm text-muted text-center py-8">
                  No testimonials available.
                </p>
              ) : (
                <div className="grid gap-4">
                  {testimonials.map((testimonial, i) => (
                    <div
                      key={i}
                      className="bg-paper rounded-lg border border-border p-4"
                    >
                      <p className="text-sm text-ink leading-relaxed mb-3">
                        &ldquo;{testimonial.content}&rdquo;
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-ink font-[family-name:var(--font-display)]">
                            {testimonial.author}
                          </div>
                          <div className="text-xs text-stone font-[family-name:var(--font-script)]">
                            {testimonial.role}
                          </div>
                        </div>
                        {testimonial.rating != null && (
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <span
                                key={j}
                                className={`text-sm ${
                                  j < testimonial.rating! ? 'text-gold' : 'text-stone/30'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
