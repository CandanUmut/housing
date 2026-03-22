import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency } from '../../utils/formatters';

type TabKey = 'conventional' | 'murabaha' | 'musharaka' | 'ijara';

interface FinanceModel {
  key: TabKey;
  explanation: { en: string; tr: string };
  flow: { en: string[]; tr: string[] };
  cost: {
    purchasePrice: number;
    totalCost: number;
    monthlyPayment: number;
    term: number;
  };
}

const HOME_PRICE = 400000;

const MODELS: FinanceModel[] = [
  {
    key: 'conventional',
    explanation: {
      en: 'You borrow money from a bank and pay it back with interest over 30 years. The bank profits from compound interest. You own the home, but the bank holds a lien until you pay off the mortgage.',
      tr: 'Bankadan borç alır ve 30 yıl boyunca faizle geri ödersiniz. Banka bileşik faizden kar eder. Evin sahibi sizsiniz, ancak ipoteği ödeyene kadar banka ipotek hakkına sahiptir.',
    },
    flow: {
      en: ['You (Buyer)', 'Bank (Lender)', 'Loan + Interest', 'Home (You own, bank has lien)'],
      tr: ['Siz (Alıcı)', 'Banka (Borç Veren)', 'Kredi + Faiz', 'Ev (Sizin, banka ipotek hakkı)'],
    },
    cost: {
      purchasePrice: HOME_PRICE,
      totalCost: 718527,
      monthlyPayment: 1996,
      term: 30,
    },
  },
  {
    key: 'murabaha',
    explanation: {
      en: 'The bank buys the home, then sells it to you at a marked-up price with a fixed profit margin. No interest — instead, the total cost is agreed upfront and paid in installments. The price is fixed and cannot change.',
      tr: 'Banka evi satın alır, sonra sabit bir kar marjıyla size satış yapar. Faiz yok — bunun yerine toplam maliyet peşin olarak belirlenir ve taksitlerle ödenir. Fiyat sabittir ve değişemez.',
    },
    flow: {
      en: ['Bank buys home', 'Bank sells to you at markup', 'Fixed installments', 'You own when paid off'],
      tr: ['Banka evi satın alır', 'Banka size kar marjıyla satar', 'Sabit taksitler', 'Ödeme bitince sahip olursunuz'],
    },
    cost: {
      purchasePrice: HOME_PRICE,
      totalCost: 740000,
      monthlyPayment: 2056,
      term: 30,
    },
  },
  {
    key: 'musharaka',
    explanation: {
      en: 'You and the bank co-own the home as partners. Each month, you buy a larger share from the bank while paying rent on their portion. Over time, you gradually become the full owner. Risk is shared — if the value drops, the bank shares the loss.',
      tr: 'Siz ve banka evi ortak olarak sahiplenirsiniz. Her ay bankadan daha büyük bir pay satın alırken, onların payına kira ödersiniz. Zamanla tam mülkiyet size geçer. Risk paylaşılır — değer düşerse, banka da zararı paylaşır.',
    },
    flow: {
      en: ['Joint ownership', 'Monthly: buy shares + rent', 'Bank share decreases', 'You become full owner'],
      tr: ['Ortak mülkiyet', 'Aylık: pay satın al + kira', 'Banka payı azalır', 'Tam mülkiyet size geçer'],
    },
    cost: {
      purchasePrice: HOME_PRICE,
      totalCost: 696000,
      monthlyPayment: 1933,
      term: 30,
    },
  },
  {
    key: 'ijara',
    explanation: {
      en: 'The bank buys the home and leases it to you. Part of each payment goes toward eventually purchasing the home. It is essentially lease-to-own. The bank bears ownership costs (major repairs, insurance) during the lease period.',
      tr: 'Banka evi satın alır ve size kiralar. Her ödemenin bir kısmı nihayetinde evi satın almaya gider. Esasen kiralama-sahip olma modelidir. Kiralama döneminde banka mülkiyet maliyetlerini (büyük onarımlar, sigorta) üstlenir.',
    },
    flow: {
      en: ['Bank buys & owns', 'You lease from bank', 'Payments build equity', 'Ownership transfers at end'],
      tr: ['Banka satın alır ve sahip olur', 'Bankadan kiralar', 'Ödemeler öz sermaye oluşturur', 'Sonunda mülkiyet devredilir'],
    },
    cost: {
      purchasePrice: HOME_PRICE,
      totalCost: 720000,
      monthlyPayment: 2000,
      term: 30,
    },
  },
];

interface ComparisonRow {
  feature: { en: string; tr: string };
  conventional: { en: string; tr: string };
  murabaha: { en: string; tr: string };
  musharaka: { en: string; tr: string };
  ijara: { en: string; tr: string };
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: { en: 'Interest charged', tr: 'Faiz uygulanir' },
    conventional: { en: 'Yes (compound)', tr: 'Evet (bilesik)' },
    murabaha: { en: 'No (fixed markup)', tr: 'Hayir (sabit kar)' },
    musharaka: { en: 'No (rent + shares)', tr: 'Hayir (kira + pay)' },
    ijara: { en: 'No (lease payments)', tr: 'Hayir (kira odemeleri)' },
  },
  {
    feature: { en: 'Shared risk', tr: 'Paylasilan risk' },
    conventional: { en: 'No — all on buyer', tr: 'Hayir — tamami alicida' },
    murabaha: { en: 'Limited', tr: 'Sinirli' },
    musharaka: { en: 'Yes — both parties', tr: 'Evet — her iki taraf' },
    ijara: { en: 'Partial — bank owns', tr: 'Kismi — banka sahip' },
  },
  {
    feature: { en: 'Price fixed upfront', tr: 'Fiyat pesin belirlenir' },
    conventional: { en: 'No (variable possible)', tr: 'Hayir (degisken olabilir)' },
    murabaha: { en: 'Yes', tr: 'Evet' },
    musharaka: { en: 'Shares are fixed', tr: 'Paylar sabit' },
    ijara: { en: 'Lease terms fixed', tr: 'Kira sartlari sabit' },
  },
  {
    feature: { en: 'Who owns during term', tr: 'Vade boyunca sahip' },
    conventional: { en: 'Buyer (bank has lien)', tr: 'Alici (banka ipotek hakki)' },
    murabaha: { en: 'Buyer', tr: 'Alici' },
    musharaka: { en: 'Both (decreasing)', tr: 'Her ikisi (azalan)' },
    ijara: { en: 'Bank (until end)', tr: 'Banka (sonuna kadar)' },
  },
  {
    feature: { en: 'Available in US', tr: "ABD'de mevcut" },
    conventional: { en: 'Everywhere', tr: 'Her yerde' },
    murabaha: { en: 'Limited', tr: 'Sinirli' },
    musharaka: { en: 'Growing (Guidance, UIF)', tr: 'Buyuyor (Guidance, UIF)' },
    ijara: { en: 'Limited', tr: 'Sinirli' },
  },
];

export default function IslamicFinanceExplainer() {
  const { t, language } = useLanguage();
  const it = t.islamicFinance;

  const [activeTab, setActiveTab] = useState<TabKey>('conventional');

  const activeModel = MODELS.find((m) => m.key === activeTab)!;
  const tabLabels: Record<TabKey, string> = {
    conventional: it.conventional,
    murabaha: it.murabaha,
    musharaka: it.musharaka,
    ijara: it.ijara,
  };

  return (
    <section className="w-full max-w-5xl mx-auto">
      <div className="bg-bg-card border border-border rounded-2xl p-6 md:p-10">
        <h2 className="font-display text-2xl md:text-3xl text-text-primary mb-1">
          {it.title}
        </h2>
        <p className="text-text-secondary mb-8">{it.subtitle}</p>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-2 mb-8">
          {MODELS.map((model) => (
            <button
              key={model.key}
              onClick={() => setActiveTab(model.key)}
              className={`px-4 py-2.5 rounded-lg text-sm font-ui transition-colors ${
                activeTab === model.key
                  ? 'bg-accent-gold text-bg-primary font-semibold'
                  : 'bg-bg-secondary text-text-secondary hover:text-text-primary border border-border'
              }`}
            >
              {tabLabels[model.key]}
            </button>
          ))}
        </div>

        {/* Active tab content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Explanation */}
          <div className="bg-bg-secondary rounded-xl p-6 border border-border">
            <h3 className="font-display text-lg text-text-primary mb-3">
              {tabLabels[activeTab]}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              {activeModel.explanation[language]}
            </p>
          </div>

          {/* Visual flow diagram */}
          <div className="bg-bg-secondary rounded-xl p-6 border border-border">
            <h4 className="text-text-muted text-xs font-ui uppercase tracking-wider mb-4">
              How it works
            </h4>
            <div className="flex flex-col items-center gap-2">
              {activeModel.flow[language].map((step, i) => (
                <div key={i} className="w-full">
                  <div className="bg-bg-card border border-border rounded-lg px-4 py-3 text-center">
                    <span className="text-text-primary text-sm font-ui">{step}</span>
                  </div>
                  {i < activeModel.flow[language].length - 1 && (
                    <div className="flex justify-center py-1">
                      <svg width="16" height="16" viewBox="0 0 16 16" className="text-accent-gold">
                        <path d="M8 2 L8 12 M4 9 L8 13 L12 9" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cost breakdown for $400K home */}
        <div className="bg-bg-secondary rounded-xl p-6 border border-border mb-8">
          <h3 className="font-display text-lg text-text-primary mb-4">
            Cost breakdown: {formatCurrency(HOME_PRICE)} home
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {MODELS.map((model) => {
              const isActive = model.key === activeTab;
              const interestOrMarkup = model.cost.totalCost - model.cost.purchasePrice;
              return (
                <div
                  key={model.key}
                  className={`rounded-lg p-4 border transition-colors ${
                    isActive
                      ? 'border-accent-gold bg-accent-gold/5'
                      : 'border-border bg-bg-card'
                  }`}
                >
                  <p className="text-text-muted text-xs font-ui mb-2">
                    {tabLabels[model.key]}
                  </p>
                  <p className="text-lg font-mono font-bold text-text-primary mb-1">
                    {formatCurrency(model.cost.totalCost)}
                  </p>
                  <p className="text-text-muted text-xs font-ui">
                    {formatCurrency(model.cost.monthlyPayment)}/mo
                  </p>
                  <p className={`text-xs font-ui mt-2 ${interestOrMarkup > 300000 ? 'text-accent-red' : 'text-accent-amber'}`}>
                    +{formatCurrency(interestOrMarkup)} over purchase
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comparison table */}
        <div className="bg-bg-secondary rounded-xl p-6 border border-border mb-8 overflow-x-auto">
          <h3 className="font-display text-lg text-text-primary mb-4">
            Feature comparison
          </h3>
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-text-muted border-b border-border">
                <th className="text-left py-2 pr-4 font-ui">Feature</th>
                <th className="text-center py-2 px-3 font-ui">{it.conventional}</th>
                <th className="text-center py-2 px-3 font-ui">{it.murabaha}</th>
                <th className="text-center py-2 px-3 font-ui">{it.musharaka}</th>
                <th className="text-center py-2 px-3 font-ui">{it.ijara}</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              {COMPARISON_ROWS.map((row, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-3 pr-4 font-ui font-semibold text-text-primary">
                    {row.feature[language]}
                  </td>
                  <td className="text-center py-3 px-3">{row.conventional[language]}</td>
                  <td className="text-center py-3 px-3">{row.murabaha[language]}</td>
                  <td className="text-center py-3 px-3">{row.musharaka[language]}</td>
                  <td className="text-center py-3 px-3">{row.ijara[language]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Honest assessment note */}
        <blockquote className="border-l-4 border-accent-gold pl-4 italic text-text-muted text-sm">
          {it.note}
        </blockquote>
      </div>
    </section>
  );
}
