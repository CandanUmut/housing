import { useLanguage } from '../../context/LanguageContext';
import { ScrollReveal } from '../ui/ScrollReveal';
import { ShareCard } from '../cards/ShareCard';

const shareCards = {
  en: [
    {
      stat: '116 hours/week',
      context: 'A minimum wage worker must work 116 hours per week to afford a 2-bedroom apartment. There are 168 hours in a week.',
      source: 'National Low Income Housing Coalition, 2024',
    },
    {
      stat: '5× annual income',
      context: 'The median home now costs 5× the median household income. Before 1990, the benchmark was 3×. The American Dream has a new price tag.',
      source: 'Demographia International Housing Affordability',
    },
    {
      stat: 'Vienna: 60% subsidized',
      context: '60% of Vienna residents live in subsidized housing. They spend 21% of income on housing. Americans spend 30-50%.',
      source: 'City of Vienna Housing Report',
    },
    {
      stat: '$418,527 in interest',
      context: 'On a $300,000 home at 7% over 30 years, you pay $418,527 in interest alone — more than the home itself.',
      source: 'Standard mortgage amortization calculation',
    },
    {
      stat: 'Minneapolis: 17-34% lower rents',
      context: 'After eliminating single-family zoning, Minneapolis saw rents fall 17-34% below comparable cities. More housing = lower rents.',
      source: 'Urban Institute, 2023',
    },
    {
      stat: '771,480 homeless',
      context: '771,480 people experienced homelessness in the US on a single night in 2024. An 18.1% increase in one year — the largest ever recorded.',
      source: 'HUD Annual Homeless Assessment Report, 2024',
    },
    {
      stat: 'Mortgage = death pledge',
      context: 'The word "mortgage" comes from Old French: "mort" (death) + "gage" (pledge). You pay until the debt dies — or you do.',
      source: 'Etymology / Oxford English Dictionary',
    },
    {
      stat: 'Gen Z: 62% fear never owning',
      context: '62% of Gen Z worry they will never be able to own a home. At age 30, their projected homeownership rate is 28% — down from 55% for the Silent Generation.',
      source: 'Redfin Survey / Census Bureau',
    },
  ],
  tr: [
    {
      stat: 'Haftada 116 saat',
      context: 'Asgari ücretli bir işçi, 2 odalı bir daireyi karşılamak için haftada 116 saat çalışmalıdır. Bir haftada 168 saat vardır.',
      source: 'National Low Income Housing Coalition, 2024',
    },
    {
      stat: 'Yıllık gelirin 5 katı',
      context: "Medyan ev şimdi medyan hane gelirinin 5 katına mal oluyor. 1990'dan önce ölçüt 3 kattı. Amerikan Rüyası'nın yeni bir fiyat etiketi var.",
      source: 'Demographia International Housing Affordability',
    },
    {
      stat: "Viyana: %60 sübvansiyonlu",
      context: "Viyana sakinlerinin %60'ı sübvansiyonlu konutlarda yaşıyor. Gelirlerinin %21'ini konuta harcıyorlar. Amerikalılar %30-50 harcıyor.",
      source: 'City of Vienna Housing Report',
    },
    {
      stat: '418.527$ faiz',
      context: "300.000$'lık bir ev için 30 yılda %7 faizle sadece faiz olarak 418.527$ ödüyorsunuz — evin kendisinden fazla.",
      source: 'Standart ipotek amortisman hesaplaması',
    },
    {
      stat: 'Minneapolis: %17-34 daha düşük kira',
      context: 'Minneapolis tek aile imar planını kaldırdıktan sonra kiralar karşılaştırılabilir şehirlerin %17-34 altına düştü. Daha fazla konut = daha düşük kira.',
      source: 'Urban Institute, 2023',
    },
    {
      stat: '771.480 evsiz',
      context: "2024'te ABD'de tek bir gecede 771.480 kişi evsizlik yaşadı. Bir yılda %18,1 artış — kaydedilen en büyük artış.",
      source: 'HUD Annual Homeless Assessment Report, 2024',
    },
    {
      stat: 'Mortgage = ölüm sözü',
      context: '"Mortgage" kelimesi Eski Fransızcadan gelir: "mort" (ölüm) + "gage" (söz). Borç ölene kadar — ya da siz ölene kadar ödersiniz.',
      source: 'Etimoloji / Oxford English Dictionary',
    },
    {
      stat: "Z Nesli: %62'si asla ev sahibi olamayacağından korkuyor",
      context: "Z Nesli'nin %62'si hiç ev sahibi olamayacağından endişe ediyor. 30 yaşında öngörülen ev sahipliği oranları %28 — Sessiz Nesil için %55'ten düşüş.",
      source: 'Redfin Survey / Census Bureau',
    },
  ],
};

export default function ShareSection() {
  const { language, t } = useLanguage();
  const cards = shareCards[language];

  return (
    <section id="share" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <ScrollReveal>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4">
          {t.share.title}
        </h2>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mb-12">
          {t.share.subtitle}
        </p>
      </ScrollReveal>

      {/* Mobile: horizontal scroll / Desktop: grid */}
      <div className="sm:hidden -mx-4 px-4 overflow-x-auto pb-4 scrollbar-thin">
        <div className="flex gap-4 min-w-max">
          {cards.map((card, index) => (
            <div key={index} className="w-72 shrink-0">
              <ShareCard
                stat={card.stat}
                context={card.context}
                source={card.source}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <ShareCard
            key={index}
            stat={card.stat}
            context={card.context}
            source={card.source}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
