import { useLanguage } from '../../context/LanguageContext';
import PriceIncomeChart from '../charts/PriceIncomeChart';
import { QuoteCard } from '../cards/QuoteCard';
import { ScrollReveal } from '../ui/ScrollReveal';

export default function PriceIncomeSection() {
  const { t } = useLanguage();

  return (
    <section id="price-income" className="max-w-6xl mx-auto px-4 py-20">
      <ScrollReveal>
        <h2 className="font-display text-3xl md:text-4xl text-text-primary text-center mb-2">
          {t.priceIncome.title}
        </h2>
        <p className="text-text-muted text-center font-body mb-10">
          {t.priceIncome.subtitle}
        </p>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="bg-bg-card border border-border rounded-lg p-4 md:p-6 mb-8">
          <PriceIncomeChart />
        </div>
      </ScrollReveal>

      <ScrollReveal delay={300}>
        <QuoteCard
          quote={t.priceIncome.quote}
          source={t.priceIncome.source}
          accentColor="var(--accent-amber)"
        />
      </ScrollReveal>
    </section>
  );
}
