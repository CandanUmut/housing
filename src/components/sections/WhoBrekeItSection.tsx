import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ScrollReveal } from '../ui/ScrollReveal';

type EventColor = 'green' | 'red' | 'amber';

interface TimelineEvent {
  year: number;
  color: EventColor;
  label: { en: string; tr: string };
  detail: { en: string; tr: string };
}

const timelineEvents: TimelineEvent[] = [
  {
    year: 1938,
    color: 'red',
    label: { en: 'FHA Redlining begins', tr: 'FHA Kırmızı Çizgi uygulaması başladı' },
    detail: {
      en: 'The Federal Housing Administration institutionalized racial segregation in housing by refusing to insure mortgages in Black neighborhoods, creating wealth gaps that persist today.',
      tr: 'Federal Konut İdaresi, Siyah mahallelerdeki ipotekleri sigortalamayı reddederek konutta ırk ayrımcılığını kurumsallaştırdı ve bugüne kadar süren servet uçurumları yarattı.',
    },
  },
  {
    year: 1968,
    color: 'amber',
    label: { en: 'Fannie Mae privatized', tr: 'Fannie Mae özelleştirildi' },
    detail: {
      en: 'Fannie Mae was converted from a government agency to a private, shareholder-owned corporation, beginning the shift of housing finance toward profit-driven markets.',
      tr: 'Fannie Mae, bir devlet kurumundan özel, hissedar sahipli bir şirkete dönüştürüldü ve konut finansmanının kâr odaklı piyasalara kaymasını başlattı.',
    },
  },
  {
    year: 1970,
    color: 'amber',
    label: { en: 'Freddie Mac created', tr: 'Freddie Mac kuruldu' },
    detail: {
      en: 'Created to expand the secondary mortgage market, Freddie Mac further commodified home loans, enabling Wall Street to trade in mortgage-backed securities.',
      tr: 'İkincil ipotek piyasasını genişletmek için kurulan Freddie Mac, konut kredilerini daha da ticarileştirdi ve Wall Street\'in ipoteğe dayalı menkul kıymetlerle işlem yapmasını sağladı.',
    },
  },
  {
    year: 1983,
    color: 'red',
    label: { en: 'First CMO issued', tr: 'İlk CMO ihraç edildi' },
    detail: {
      en: 'The first Collateralized Mortgage Obligation was issued, slicing mortgage pools into tranches and opening the door to increasingly complex and opaque financial instruments.',
      tr: 'İlk Teminatlı İpotek Yükümlülüğü ihraç edildi, ipotek havuzları dilimlere ayrıldı ve giderek daha karmaşık ve opak finansal araçlara kapı açıldı.',
    },
  },
  {
    year: 1999,
    color: 'red',
    label: { en: 'Glass-Steagall repealed', tr: 'Glass-Steagall yürürlükten kaldırıldı' },
    detail: {
      en: 'The repeal of the Glass-Steagall Act removed the wall between commercial and investment banking, allowing banks to gamble with depositor money on mortgage-backed securities.',
      tr: 'Glass-Steagall Yasası\'nın yürürlükten kaldırılması ticari ve yatırım bankacılığı arasındaki duvarı kaldırdı ve bankaların mudi parasıyla ipoteğe dayalı menkul kıymetlerde kumar oynamasına izin verdi.',
    },
  },
  {
    year: 2008,
    color: 'red',
    label: { en: 'Financial crisis', tr: 'Mali kriz' },
    detail: {
      en: 'The housing bubble burst, triggering a global financial crisis. 10 million Americans lost their homes to foreclosure while banks received $700 billion in taxpayer bailouts.',
      tr: 'Konut balonu patladı ve küresel bir mali krizi tetikledi. 10 milyon Amerikalı haciz yoluyla evlerini kaybederken bankalar 700 milyar dolar vergi mükellefi kurtarma paketi aldı.',
    },
  },
  {
    year: 2009,
    color: 'red',
    label: { en: 'Investors buy 430K homes', tr: 'Yatırımcılar 430.000 ev aldı' },
    detail: {
      en: 'Wall Street firms bought hundreds of thousands of foreclosed homes at deep discounts, converting them into rental properties and extracting wealth from the crisis they helped create.',
      tr: 'Wall Street firmaları yüz binlerce hacizli evi büyük indirimlerle satın aldı, onları kiralık mülklere dönüştürdü ve yaratılmasına yardım ettikleri krizden servet elde etti.',
    },
  },
  {
    year: 2020,
    color: 'amber',
    label: { en: 'Fed buys 90% of mortgages', tr: 'Fed ipoteklerin %90\'ını aldı' },
    detail: {
      en: 'The Federal Reserve purchased over 90% of new mortgage-backed securities to keep rates low during COVID, effectively nationalizing the mortgage market while fueling a housing price surge.',
      tr: 'Federal Rezerv, COVID sırasında faizleri düşük tutmak için yeni ipoteğe dayalı menkul kıymetlerin %90\'ından fazlasını satın aldı, ipotek piyasasını fiilen millileştirirken konut fiyat artışını körükledi.',
    },
  },
  {
    year: 2022,
    color: 'red',
    label: { en: 'Rates spike to 7%', tr: 'Faizler %7\'ye sıçradı' },
    detail: {
      en: 'Mortgage rates more than doubled in under a year, locking millions out of homeownership while existing owners became trapped — unable to sell without giving up their low rate.',
      tr: 'İpotek faizleri bir yıldan kısa sürede iki katından fazla arttı, milyonlarca kişiyi ev sahipliğinden dışlarken mevcut sahipler tuzağa düştü — düşük faizlerinden vazgeçmeden satamaz hale geldi.',
    },
  },
  {
    year: 2024,
    color: 'red',
    label: { en: 'Homelessness record', tr: 'Evsizlik rekoru' },
    detail: {
      en: '771,480 people experienced homelessness on a single night — an 18.1% increase in one year, the largest ever recorded. The crisis is no longer confined to high-cost cities.',
      tr: 'Tek bir gecede 771.480 kişi evsizlik yaşadı — bir yılda %18,1 artış, kaydedilen en büyük artış. Kriz artık yüksek maliyetli şehirlerle sınırlı değil.',
    },
  },
];

const colorMap: Record<EventColor, { bg: string; border: string; text: string; dot: string }> = {
  green: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-400',
    dot: 'bg-green-500',
  },
  red: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    dot: 'bg-red-500',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    dot: 'bg-amber-500',
  },
};

export default function WhoBrekeItSection() {
  const { language, t } = useLanguage();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleEvent = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="timeline" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <ScrollReveal>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4">
          {t.timeline.title}
        </h2>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mb-12">
          {t.timeline.subtitle}
        </p>
      </ScrollReveal>

      {/* Mobile: vertical timeline */}
      <div className="block lg:hidden">
        <div className="relative pl-8">
          {/* Vertical line */}
          <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />

          {timelineEvents.map((event, index) => {
            const colors = colorMap[event.color];
            const isExpanded = expandedIndex === index;

            return (
              <ScrollReveal key={event.year} delay={index * 80}>
                <div className="relative mb-6">
                  {/* Dot */}
                  <div
                    className={`absolute -left-5 top-1.5 w-3 h-3 rounded-full ${colors.dot} ring-2 ring-bg-primary`}
                  />

                  {/* Card */}
                  <button
                    onClick={() => toggleEvent(index)}
                    className={`w-full text-left ${colors.bg} border ${colors.border} rounded-lg p-4 transition-all duration-300 hover:scale-[1.01]`}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`font-mono text-sm font-bold ${colors.text}`}>
                        {event.year}
                      </span>
                      <span className="text-text-primary text-sm font-medium">
                        {event.label[language]}
                      </span>
                    </div>

                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isExpanded ? 'max-h-60 opacity-100 mt-3' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {event.detail[language]}
                      </p>
                    </div>

                    <div className="flex justify-end mt-1">
                      <svg
                        className={`w-4 h-4 text-text-muted transition-transform duration-300 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      {/* Desktop: horizontal scrolling timeline */}
      <div className="hidden lg:block">
        <ScrollReveal delay={200}>
          <div className="relative">
            {/* Horizontal line */}
            <div className="absolute top-6 left-0 right-0 h-px bg-border" />

            <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin">
              <div className="flex gap-4 min-w-max">
                {timelineEvents.map((event, index) => {
                  const colors = colorMap[event.color];
                  const isExpanded = expandedIndex === index;

                  return (
                    <div key={event.year} className="relative flex flex-col items-center w-44">
                      {/* Dot */}
                      <div
                        className={`w-3 h-3 rounded-full ${colors.dot} ring-2 ring-bg-primary z-10 mb-4`}
                      />

                      {/* Card */}
                      <button
                        onClick={() => toggleEvent(index)}
                        className={`w-full text-left ${colors.bg} border ${colors.border} rounded-lg p-3 transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                      >
                        <span className={`font-mono text-xs font-bold ${colors.text}`}>
                          {event.year}
                        </span>
                        <p className="text-text-primary text-xs font-medium mt-1 leading-snug">
                          {event.label[language]}
                        </p>
                      </button>

                      {/* Expanded detail */}
                      <div
                        className={`absolute top-full mt-2 w-72 z-20 transition-all duration-300 ${
                          isExpanded
                            ? 'opacity-100 translate-y-0 pointer-events-auto'
                            : 'opacity-0 -translate-y-2 pointer-events-none'
                        }`}
                      >
                        <div
                          className={`${colors.bg} border ${colors.border} rounded-lg p-4 shadow-xl`}
                        >
                          <p className={`font-mono text-xs font-bold ${colors.text} mb-2`}>
                            {event.year} — {event.label[language]}
                          </p>
                          <p className="text-sm text-text-secondary leading-relaxed">
                            {event.detail[language]}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
