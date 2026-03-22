import { useScrollReveal } from '../../hooks/useScrollReveal';

interface QuoteCardProps {
  quote: string;
  source?: string;
  accentColor?: string;
  delay?: number;
}

export function QuoteCard({
  quote,
  source,
  accentColor = 'var(--accent-gold)',
  delay = 0,
}: QuoteCardProps) {
  const ref = useScrollReveal(delay);

  return (
    <div
      ref={ref}
      className="relative bg-bg-elevated border border-border rounded-lg p-6 md:p-8 border-l-4 transition-all duration-300 hover:border-border-accent"
      style={{ borderLeftColor: accentColor }}
    >
      <svg
        className="absolute top-4 right-4 w-8 h-8 opacity-10"
        style={{ color: accentColor }}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
      </svg>

      <blockquote className="relative">
        <p className="font-display text-lg md:text-xl lg:text-2xl italic text-text-primary leading-relaxed">
          {quote}
        </p>

        {source && (
          <footer className="mt-4 pt-3 border-t border-border">
            <cite
              className="text-sm not-italic font-body"
              style={{ color: accentColor }}
            >
              {source}
            </cite>
          </footer>
        )}
      </blockquote>
    </div>
  );
}
