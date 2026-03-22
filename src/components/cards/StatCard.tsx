import { useState } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface StatCardProps {
  value: string;
  label: string;
  context: string;
  color: 'red' | 'amber' | 'gold';
  delay?: number;
  source?: string;
}

const colorMap = {
  red: {
    border: 'border-l-accent-red',
    dot: 'bg-accent-red',
    hoverBorder: 'hover:border-l-accent-red',
    shadow: 'hover:shadow-[0_8px_30px_-12px_var(--accent-red)]',
  },
  amber: {
    border: 'border-l-accent-amber',
    dot: 'bg-accent-amber',
    hoverBorder: 'hover:border-l-accent-amber',
    shadow: 'hover:shadow-[0_8px_30px_-12px_var(--accent-amber)]',
  },
  gold: {
    border: 'border-l-accent-gold',
    dot: 'bg-accent-gold',
    hoverBorder: 'hover:border-l-accent-gold',
    shadow: 'hover:shadow-[0_8px_30px_-12px_var(--accent-gold)]',
  },
};

export function StatCard({ value, label, context, color, delay = 0, source }: StatCardProps) {
  const ref = useScrollReveal(delay);
  const [showSource, setShowSource] = useState(false);
  const colors = colorMap[color];

  return (
    <div
      ref={ref}
      className={`
        relative bg-bg-card border border-border ${colors.border} border-l-4
        rounded-lg p-6 transition-all duration-300 ease-out
        hover:scale-[1.02] ${colors.shadow}
        hover:border-border-accent
      `}
      onMouseEnter={() => setShowSource(true)}
      onMouseLeave={() => setShowSource(false)}
    >
      <div className="flex items-start gap-3 mb-3">
        <span className={`mt-2 h-2 w-2 rounded-full ${colors.dot} shrink-0`} />
        <span className="font-mono font-display text-3xl md:text-4xl tracking-tight text-text-primary">
          {value}
        </span>
      </div>

      <p className="text-sm md:text-base text-text-secondary font-body leading-snug mb-1">
        {label}
      </p>

      <p className="text-xs md:text-sm text-text-muted font-body">
        {context}
      </p>

      {source && showSource && (
        <div className="absolute bottom-full left-4 mb-2 px-3 py-1.5 bg-bg-elevated border border-border-accent rounded text-xs text-text-muted whitespace-nowrap z-10 shadow-lg transition-opacity duration-200">
          {source}
        </div>
      )}
    </div>
  );
}
