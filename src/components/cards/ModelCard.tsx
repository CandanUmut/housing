import { useState } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useLanguage } from '../../context/LanguageContext';

interface ModelCardProps {
  city: string;
  country: string;
  flag: string;
  heroStat: string;
  heroLabel: string;
  color: string;
  howItWorks: string[];
  keyOutcome: string;
  usLesson: string;
  fullStory?: string;
  delay?: number;
}

export function ModelCard({
  city,
  country,
  flag,
  heroStat,
  heroLabel,
  color,
  howItWorks,
  keyOutcome,
  usLesson,
  fullStory,
  delay = 0,
}: ModelCardProps) {
  const ref = useScrollReveal(delay);
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      ref={ref}
      className="bg-bg-card border border-border rounded-lg overflow-hidden transition-all duration-300 hover:border-border-accent hover:shadow-lg"
    >
      {/* Header */}
      <div
        className="px-6 pt-6 pb-4 border-b border-border"
        style={{ borderBottomColor: color }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl" role="img" aria-label={country}>
            {flag}
          </span>
          <div>
            <h3 className="text-lg font-display font-bold text-text-primary">{city}</h3>
            <p className="text-sm text-text-muted">{country}</p>
          </div>
        </div>

        <div className="mt-2">
          <span
            className="font-mono text-3xl md:text-4xl font-bold"
            style={{ color }}
          >
            {heroStat}
          </span>
          <p className="text-sm text-text-secondary mt-1">{heroLabel}</p>
        </div>
      </div>

      {/* How It Works */}
      <div className="px-6 py-4">
        <ul className="space-y-2">
          {howItWorks.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
              <span
                className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Key Outcome */}
      <div className="px-6 py-3 border-t border-border">
        <p className="text-sm font-mono" style={{ color }}>
          {keyOutcome}
        </p>
      </div>

      {/* US Lesson */}
      <div className="px-6 py-4 bg-bg-elevated border-t border-border">
        <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
          {t.globalModels.whatUSCouldLearn}
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">{usLesson}</p>
      </div>

      {/* Expandable Full Story */}
      {fullStory && (
        <div className="border-t border-border">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-6 py-3 flex items-center justify-between text-sm text-text-muted hover:text-text-secondary transition-colors duration-200"
          >
            <span>{expanded ? 'Hide full story' : 'Read full story'}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-6 pb-4 text-sm text-text-muted leading-relaxed">
              {fullStory}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
