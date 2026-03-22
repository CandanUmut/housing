import { useLanguage } from '../../context/LanguageContext';
import WealthGapChart from '../charts/WealthGapChart';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { ScrollReveal } from '../ui/ScrollReveal';

export default function HumanCostSection() {
  const { t } = useLanguage();

  return (
    <section id="human-cost" className="max-w-6xl mx-auto px-4 py-20">
      <ScrollReveal>
        <h2 className="font-display text-3xl md:text-4xl text-text-primary text-center mb-2">
          {t.stats.cards[4].label}
        </h2>
        <p className="text-text-muted text-center font-body mb-10">
          The wealth gap between homeowners and renters has never been wider.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="bg-bg-card border border-border rounded-lg p-4 md:p-6 mb-10">
          <WealthGapChart />
        </div>
      </ScrollReveal>

      {/* Key wealth gap stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        <ScrollReveal delay={200}>
          <div className="bg-bg-card border border-border rounded-lg p-5 text-center">
            <span className="block font-mono text-2xl md:text-3xl font-bold text-accent-amber mb-2">
              38:1
            </span>
            <p className="text-xs md:text-sm text-text-muted font-body">
              Homeowner vs renter net worth ratio
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <div className="bg-bg-card border border-border rounded-lg p-5 text-center">
            <AnimatedNumber
              value={70}
              suffix="%"
              format="none"
              className="block text-2xl md:text-3xl font-bold text-accent-red mb-2"
            />
            <p className="text-xs md:text-sm text-text-muted font-body">
              Wider gap over 33 years
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <div className="bg-bg-card border border-border rounded-lg p-5 text-center">
            <AnimatedNumber
              value={45.9}
              suffix="%"
              format="none"
              decimals={1}
              className="block text-2xl md:text-3xl font-bold text-accent-red mb-2"
            />
            <p className="text-xs md:text-sm text-text-muted font-body">
              Black homeownership rate
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={500}>
          <div className="bg-bg-card border border-border rounded-lg p-5 text-center">
            <AnimatedNumber
              value={73.8}
              suffix="%"
              format="none"
              decimals={1}
              className="block text-2xl md:text-3xl font-bold text-accent-amber mb-2"
            />
            <p className="text-xs md:text-sm text-text-muted font-body">
              White homeownership rate
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Racial gap callout */}
      <ScrollReveal delay={600}>
        <div className="bg-bg-elevated border border-border rounded-lg p-6 md:p-8 text-center">
          <p className="font-body text-text-secondary text-base md:text-lg leading-relaxed">
            The racial homeownership gap stands at{' '}
            <span className="text-accent-red font-semibold">27.9 percentage points</span>
            {' '}&mdash; nearly unchanged since the Fair Housing Act of 1968.
            Black families hold{' '}
            <span className="text-accent-red font-semibold">$24 cents</span>
            {' '}for every dollar of white family wealth.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
