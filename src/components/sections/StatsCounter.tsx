import { useLanguage } from '../../context/LanguageContext';
import { StatCard } from '../cards/StatCard';
import { ScrollReveal } from '../ui/ScrollReveal';

export default function StatsCounter() {
  const { t } = useLanguage();

  return (
    <section id="stats" className="max-w-6xl mx-auto px-4 py-20">
      <ScrollReveal>
        <h2 className="font-display text-3xl md:text-4xl text-text-primary text-center mb-12">
          {t.stats.title}
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {t.stats.cards.map((card, i) => (
          <StatCard
            key={card.label}
            value={card.value}
            label={card.label}
            context={card.context}
            color={card.color as 'red' | 'amber'}
            delay={i * 100}
          />
        ))}
      </div>
    </section>
  );
}
