import { useLanguage } from '../../context/LanguageContext';
import { ScrollReveal } from '../ui/ScrollReveal';

const landlords = [
  { name: 'Progress Residential', units: 100000 },
  { name: 'Invitation Homes', units: 97036 },
  { name: 'Blackstone', units: 62000 },
  { name: 'American Homes 4 Rent', units: 60337 },
  { name: 'Amherst Group', units: 59400 },
  { name: 'FirstKey Homes', units: 52000 },
];

const maxUnits = 100000;

const metroConcentration = [
  { city: 'Atlanta', share: 25 },
  { city: 'Jacksonville', share: 21 },
  { city: 'Charlotte', share: 18 },
];

export default function WallStreetSection() {
  const { t } = useLanguage();

  return (
    <section id="wall-street" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <ScrollReveal>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4">
          {t.wallStreet.title}
        </h2>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mb-12">
          {t.wallStreet.subtitle}
        </p>
      </ScrollReveal>

      {/* Institutional Landlords - Horizontal Bar Chart */}
      <ScrollReveal delay={200}>
        <div className="bg-bg-card border border-border rounded-lg p-6 mb-8">
          <h3 className="font-display text-lg font-bold text-text-primary mb-6">
            {t.wallStreet.title}
          </h3>
          <div className="space-y-4">
            {landlords.map((landlord, index) => (
              <div key={landlord.name} className="group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-text-secondary font-medium">
                    {landlord.name}
                  </span>
                  <span className="text-sm font-mono text-text-muted">
                    {landlord.units.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-bg-elevated rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${(landlord.units / maxUnits) * 100}%`,
                      backgroundColor: index === 0 ? 'var(--accent-red)' : index < 3 ? 'var(--accent-amber)' : 'var(--accent-gold)',
                      transitionDelay: `${index * 100}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-text-muted mt-4 font-mono">
            Units owned (single-family rental homes)
          </p>
        </div>
      </ScrollReveal>

      {/* Metro Concentration */}
      <ScrollReveal delay={400}>
        <div className="bg-bg-card border border-border rounded-lg p-6 mb-8">
          <h3 className="font-display text-lg font-bold text-text-primary mb-6">
            Metro Concentration
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {metroConcentration.map((metro) => (
              <div key={metro.city} className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-bg-elevated"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke="var(--accent-red)"
                      strokeWidth="2"
                      strokeDasharray={`${metro.share} ${100 - metro.share}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center font-mono text-lg font-bold text-text-primary">
                    {metro.share}%
                  </span>
                </div>
                <p className="text-sm text-text-secondary font-medium">{metro.city}</p>
                <p className="text-xs text-text-muted">of rental market</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Caveat */}
      <ScrollReveal delay={600}>
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-6">
          <div className="flex gap-3">
            <div className="shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              {t.wallStreet.caveat}
            </p>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
