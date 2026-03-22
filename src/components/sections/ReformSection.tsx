import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ScrollReveal } from '../ui/ScrollReveal';
import { reforms, type Verdict } from '../../data/reforms';

type Filter = 'all' | Verdict;

const verdictStyles: Record<Verdict, { bg: string; border: string; text: string; badge: string }> = {
  strong: {
    bg: 'bg-green-500/5',
    border: 'border-green-500/20',
    text: 'text-green-400',
    badge: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  mixed: {
    bg: 'bg-amber-500/5',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  weak: {
    bg: 'bg-red-500/5',
    border: 'border-red-500/20',
    text: 'text-red-400',
    badge: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
};

export default function ReformSection() {
  const { language, t } = useLanguage();
  const [filter, setFilter] = useState<Filter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredReforms = filter === 'all' ? reforms : reforms.filter((r) => r.verdict === filter);

  const filterButtons: { key: Filter; label: string }[] = [
    { key: 'all', label: t.reforms.filterAll },
    { key: 'strong', label: t.reforms.filterStrong },
    { key: 'mixed', label: t.reforms.filterMixed },
    { key: 'weak', label: t.reforms.filterWeak },
  ];

  const getVerdictLabel = (verdict: Verdict) => {
    switch (verdict) {
      case 'strong':
        return t.reforms.strongEvidence;
      case 'mixed':
        return t.reforms.mixed;
      case 'weak':
        return t.reforms.weak;
    }
  };

  return (
    <section id="reforms" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <ScrollReveal>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4">
          {t.reforms.title}
        </h2>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mb-8">
          {t.reforms.subtitle}
        </p>
      </ScrollReveal>

      {/* Filter Buttons */}
      <ScrollReveal delay={100}>
        <div className="flex flex-wrap gap-2 mb-8">
          {filterButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setFilter(btn.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                filter === btn.key
                  ? 'bg-text-primary text-bg-primary border-text-primary'
                  : 'bg-bg-elevated border-border text-text-secondary hover:border-border-accent hover:text-text-primary'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </ScrollReveal>

      {/* Reform Cards */}
      <div className="space-y-4">
        {filteredReforms.map((reform, index) => {
          const styles = verdictStyles[reform.verdict];
          const isExpanded = expandedId === reform.id;

          return (
            <ScrollReveal key={reform.id} delay={index * 80}>
              <button
                onClick={() => setExpandedId(isExpanded ? null : reform.id)}
                className={`w-full text-left ${styles.bg} border ${styles.border} rounded-lg p-5 transition-all duration-300 hover:scale-[1.005]`}
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-3 mb-2">
                      <h3 className="font-display text-base sm:text-lg font-bold text-text-primary">
                        {reform.name[language]}
                      </h3>
                      <span
                        className={`inline-flex px-2.5 py-0.5 text-xs font-mono font-bold rounded-full border ${styles.badge}`}
                      >
                        {getVerdictLabel(reform.verdict)}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary">
                      {reform.evidence[language]}
                    </p>
                    {reform.location && (
                      <p className="text-xs text-text-muted mt-1 font-mono">
                        {reform.location}
                      </p>
                    )}
                  </div>

                  <svg
                    className={`w-5 h-5 text-text-muted shrink-0 transition-transform duration-300 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Expandable Details */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isExpanded ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {reform.details[language]}
                    </p>
                  </div>
                </div>
              </button>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
