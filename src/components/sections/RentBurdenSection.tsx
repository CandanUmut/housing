import { useLanguage } from '../../context/LanguageContext';
import RentBurdenChart from '../charts/RentBurdenChart';
import { QuoteCard } from '../cards/QuoteCard';
import { ScrollReveal } from '../ui/ScrollReveal';

export default function RentBurdenSection() {
  const { t } = useLanguage();

  const maxHours = 120;
  const bar1970Width = (17 / maxHours) * 100;
  const bar2025Width = (116 / maxHours) * 100;

  return (
    <section id="rent-burden" className="max-w-6xl mx-auto px-4 py-20">
      <ScrollReveal>
        <h2 className="font-display text-3xl md:text-4xl text-text-primary text-center mb-2">
          {t.rentBurden.title}
        </h2>
        <p className="text-text-muted text-center font-body mb-10">
          {t.rentBurden.subtitle}
        </p>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="bg-bg-card border border-border rounded-lg p-4 md:p-6 mb-10">
          <RentBurdenChart />
        </div>
      </ScrollReveal>

      {/* 1970 vs 2025 minimum wage hours comparison */}
      <ScrollReveal delay={200}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* 1970 */}
          <div className="bg-bg-card border border-border rounded-lg p-6">
            <p className="text-text-muted text-sm font-body mb-1">{t.rentBurden.year1970}</p>
            <p className="font-mono text-2xl md:text-3xl text-green-400 font-bold mb-3">
              {t.rentBurden.minWage1970}
            </p>
            <div className="w-full bg-bg-elevated rounded-full h-4 overflow-hidden">
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-1000"
                style={{ width: `${bar1970Width}%` }}
              />
            </div>
          </div>

          {/* 2025 */}
          <div className="bg-bg-card border border-border rounded-lg p-6">
            <p className="text-text-muted text-sm font-body mb-1">{t.rentBurden.year2025}</p>
            <p className="font-mono text-2xl md:text-3xl text-red-400 font-bold mb-3">
              {t.rentBurden.minWage2025}
            </p>
            <div className="w-full bg-bg-elevated rounded-full h-4 overflow-hidden">
              <div
                className="h-full rounded-full bg-red-500 transition-all duration-1000"
                style={{ width: `${bar2025Width}%` }}
              />
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={300}>
        <QuoteCard
          quote={t.rentBurden.quote}
          accentColor="var(--accent-red)"
        />
      </ScrollReveal>
    </section>
  );
}
