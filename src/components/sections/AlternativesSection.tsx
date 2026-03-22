import { useLanguage } from '../../context/LanguageContext';
import { ScrollReveal } from '../ui/ScrollReveal';
import IslamicFinanceExplainer from '../interactive/IslamicFinanceExplainer';

export default function AlternativesSection() {
  const { t } = useLanguage();

  return (
    <section id="alternatives" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <ScrollReveal>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4">
          {t.islamicFinance.title}
        </h2>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mb-12">
          {t.islamicFinance.subtitle}
        </p>
      </ScrollReveal>

      <ScrollReveal delay={200}>
        <IslamicFinanceExplainer />
      </ScrollReveal>
    </section>
  );
}
