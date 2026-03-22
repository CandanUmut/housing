import { useLanguage } from '../../context/LanguageContext';
import HomelessnessTrendChart from '../charts/HomelessnessTrendChart';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { QuoteCard } from '../cards/QuoteCard';
import { ScrollReveal } from '../ui/ScrollReveal';

const keyStats = [
  { value: 771480, label: 'Total homeless (2024)', suffix: '', prefix: '' },
  { value: 3700000, label: 'Hidden homeless', suffix: '', prefix: '' },
  { value: 1400000, label: 'Children experiencing homelessness', suffix: '', prefix: '' },
  { value: 2300000, label: 'Annual eviction filings', suffix: '', prefix: '' },
];

export default function HomelessnessSection() {
  const { t } = useLanguage();

  return (
    <section id="homelessness" className="max-w-6xl mx-auto px-4 py-20">
      <ScrollReveal>
        <h2 className="font-display text-3xl md:text-4xl text-text-primary text-center mb-10">
          {t.stats.cards[0].label}
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="bg-bg-card border border-border rounded-lg p-4 md:p-6 mb-10">
          <HomelessnessTrendChart />
        </div>
      </ScrollReveal>

      {/* Key stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        {keyStats.map((stat, i) => (
          <ScrollReveal key={stat.label} delay={200 + i * 100}>
            <div className="bg-bg-card border border-border rounded-lg p-5 text-center">
              <AnimatedNumber
                value={stat.value}
                format="number"
                className="block text-2xl md:text-3xl font-bold text-accent-red mb-2"
              />
              <p className="text-xs md:text-sm text-text-muted font-body">
                {stat.label}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={600}>
        <QuoteCard
          quote="Finland reduced chronic homelessness by 35% using Housing First — giving homes unconditionally, then providing support. The US still requires sobriety and compliance first."
          source="Source: Y-Foundation, Finland"
          accentColor="var(--accent-gold)"
        />
      </ScrollReveal>
    </section>
  );
}
