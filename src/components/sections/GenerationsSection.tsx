import { useLanguage } from '../../context/LanguageContext';
import { ScrollReveal } from '../ui/ScrollReveal';
import HomeownershipChart from '../charts/HomeownershipChart';
import GenerationComparison from '../interactive/GenerationComparison';

export default function GenerationsSection() {
  const { t } = useLanguage();

  return (
    <section id="generations" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <ScrollReveal>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4">
          {t.generations.title}
        </h2>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mb-12">
          {t.generations.subtitle}
        </p>
      </ScrollReveal>

      <ScrollReveal delay={200}>
        <div className="bg-bg-card border border-border rounded-lg p-6 mb-8">
          <HomeownershipChart />
        </div>
      </ScrollReveal>

      <ScrollReveal delay={400}>
        <GenerationComparison />
      </ScrollReveal>
    </section>
  );
}
