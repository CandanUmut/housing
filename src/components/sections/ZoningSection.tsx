import { useLanguage } from '../../context/LanguageContext';
import { ScrollReveal } from '../ui/ScrollReveal';

const zoningData = [
  { city: 'San Jose', percent: 94 },
  { city: 'Arlington', percent: 89 },
  { city: 'Charlotte', percent: 84 },
  { city: 'Seattle', percent: 81 },
  { city: 'Los Angeles', percent: 76 },
  { city: 'Minneapolis', percent: 70, note: 'pre-reform' },
  { city: 'San Francisco', percent: 38 },
  { city: 'New York City', percent: 15 },
];

const maxPercent = 100;

const sectionText = {
  en: {
    title: 'Zoned Out',
    subtitle: 'How exclusionary zoning blocks housing where people need it most.',
    statLabel: 'of residential land is zoned exclusively for single-family homes in the median US city',
    cityBreakdown: 'Single-Family Zoning by City',
    minneapolisTitle: 'Minneapolis: Proof It Works',
    minneapolisHousing: 'Housing stock',
    minneapolisRents: 'Rent increase',
    minneapolisStatewide: 'vs 14% statewide',
    tokyoTitle: 'Tokyo: The Opposite Approach',
    tokyoDesc: 'Japan sets zoning at the national level with 12 flexible categories. Tokyo builds 150,000 units per year — more than all of England. Result: rents have stayed broadly stable despite population growth.',
    preReform: 'pre-reform',
  },
  tr: {
    title: 'İmar Dışı Bırakılmış',
    subtitle: 'Dışlayıcı imar planlaması, insanların en çok ihtiyaç duyduğu yerlerde konut yapımını nasıl engelliyor.',
    statLabel: 'konut arazisi, tipik ABD şehrinde yalnızca tek ailelik evlere ayrılmış',
    cityBreakdown: 'Şehre Göre Tek Aile İmar Oranı',
    minneapolisTitle: 'Minneapolis: İşe Yaradığının Kanıtı',
    minneapolisHousing: 'Konut stoğu',
    minneapolisRents: 'Kira artışı',
    minneapolisStatewide: "eyalet genelinde %14'e karşı",
    tokyoTitle: 'Tokyo: Tam Tersi Yaklaşım',
    tokyoDesc: "Japonya imarı 12 esnek kategori ile ulusal düzeyde belirler. Tokyo yılda 150.000 konut inşa eder — tüm İngiltere'den fazla. Sonuç: nüfus artışına rağmen kiralar genel olarak istikrarlı kaldı.",
    preReform: 'reform öncesi',
  },
};

export default function ZoningSection() {
  const { language } = useLanguage();
  const text = sectionText[language];

  return (
    <section id="zoning" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <ScrollReveal>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4">
          {text.title}
        </h2>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mb-12">
          {text.subtitle}
        </p>
      </ScrollReveal>

      {/* Big Stat */}
      <ScrollReveal delay={100}>
        <div className="text-center mb-12">
          <span className="font-mono text-6xl sm:text-7xl md:text-8xl font-bold text-amber-400">
            75%
          </span>
          <p className="text-text-secondary text-lg mt-2 max-w-md mx-auto">
            {text.statLabel}
          </p>
        </div>
      </ScrollReveal>

      {/* City Breakdown */}
      <ScrollReveal delay={200}>
        <div className="bg-bg-card border border-border rounded-lg p-6 mb-8">
          <h3 className="font-display text-lg font-bold text-text-primary mb-6">
            {text.cityBreakdown}
          </h3>
          <div className="space-y-3">
            {zoningData.map((item, index) => (
              <div key={item.city} className="group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-text-secondary font-medium">
                    {item.city}
                    {item.note && (
                      <span className="text-xs text-text-muted ml-1">
                        ({language === 'en' ? item.note : text.preReform})
                      </span>
                    )}
                  </span>
                  <span className="text-sm font-mono text-text-muted">
                    {item.percent}%
                  </span>
                </div>
                <div className="w-full bg-bg-elevated rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${(item.percent / maxPercent) * 100}%`,
                      backgroundColor:
                        item.percent >= 80
                          ? 'var(--accent-red)'
                          : item.percent >= 50
                            ? 'var(--accent-amber)'
                            : 'var(--accent-green)',
                      transitionDelay: `${index * 80}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Minneapolis Proof */}
      <ScrollReveal delay={400}>
        <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-6 mb-8">
          <h3 className="font-display text-lg font-bold text-green-400 mb-4">
            {text.minneapolisTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="text-center p-4 bg-bg-elevated rounded-lg">
              <span className="font-mono text-3xl font-bold text-green-400">+12%</span>
              <p className="text-sm text-text-secondary mt-1">{text.minneapolisHousing}</p>
            </div>
            <div className="text-center p-4 bg-bg-elevated rounded-lg">
              <span className="font-mono text-3xl font-bold text-green-400">+1%</span>
              <p className="text-sm text-text-secondary mt-1">
                {text.minneapolisRents}
              </p>
              <p className="text-xs text-text-muted mt-0.5">{text.minneapolisStatewide}</p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Tokyo Comparison */}
      <ScrollReveal delay={600}>
        <div className="bg-bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl" role="img" aria-label="Japan">
              🇯🇵
            </span>
            <h3 className="font-display text-lg font-bold text-text-primary">
              {text.tokyoTitle}
            </h3>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            {text.tokyoDesc}
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
