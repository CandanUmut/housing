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
  risk: { en: string; tr: string };
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: { en: 'Interest charged', tr: 'Faiz uygulanır' },
    conventional: { en: 'Yes (compound)', tr: 'Evet (bileşik)' },
    murabaha: { en: 'No (fixed markup)', tr: 'Hayır (sabit kar)' },
    musharaka: { en: 'No (rent + shares)', tr: 'Hayır (kira + pay)' },
    ijara: { en: 'No (lease payments)', tr: 'Hayır (kira ödemeleri)' },
    risk: { en: '❌ You alone', tr: '❌ Yalnızca siz' },
  },
  {
    feature: { en: 'Shared risk of loss', tr: 'Paylaşılan kayıp riski' },
    conventional: { en: '❌ You alone', tr: '❌ Tamamen alıcıda' },
    murabaha: { en: '⚠️ Limited', tr: '⚠️ Sınırlı' },
    musharaka: { en: '✅ Both parties', tr: '✅ Her iki taraf' },
    ijara: { en: '⚠️ Limited', tr: '⚠️ Sınırlı' },
    risk: { en: 'Who shares loss?', tr: 'Kim zararı paylaşır?' },
  },
  {
    feature: { en: 'Front-loaded extraction', tr: 'Ön yüklü çıkarım' },
    conventional: { en: '❌ 85% interest yr 1', tr: '❌ Yıl 1\'de %85 faiz' },
    murabaha: { en: '✅ Fixed markup', tr: '✅ Sabit kar marjı' },
    musharaka: { en: '✅ Proportional', tr: '✅ Orantılı' },
    ijara: { en: '✅ Even rent', tr: '✅ Eşit kira' },
    risk: { en: 'When is it extracted?', tr: 'Ne zaman çıkarılır?' },
  },
  {
    feature: { en: 'Asset pursuit on default', tr: 'Temerrütte varlık takibi' },
    conventional: { en: '❌ Yes (varies by state)', tr: '❌ Evet (eyalete göre)' },
    murabaha: { en: '✅ Home only', tr: '✅ Yalnızca ev' },
    musharaka: { en: '✅ Home only', tr: '✅ Yalnızca ev' },
    ijara: { en: '✅ Home only', tr: '✅ Yalnızca ev' },
    risk: { en: 'What can be seized?', tr: 'Ne el konulabilir?' },
  },
  {
    feature: { en: 'Price fixed upfront', tr: 'Fiyat peşin belirlenir' },
    conventional: { en: 'Variable possible', tr: 'Değişken olabilir' },
    murabaha: { en: '✅ Yes', tr: '✅ Evet' },
    musharaka: { en: '✅ Shares are fixed', tr: '✅ Paylar sabit' },
    ijara: { en: 'Lease terms fixed', tr: 'Kira şartları sabit' },
    risk: { en: 'Cost certainty?', tr: 'Maliyet kesinliği?' },
  },
  {
    feature: { en: 'Available in US', tr: "ABD'de mevcut" },
    conventional: { en: 'Everywhere', tr: 'Her yerde' },
    murabaha: { en: '✅ Guidance Residential', tr: '✅ Guidance Residential' },
    musharaka: { en: '✅ Guidance Residential', tr: '✅ Guidance Residential' },
    ijara: { en: 'Some providers', tr: 'Bazı sağlayıcılar' },
    risk: { en: 'Accessible?', tr: 'Erişilebilir mi?' },
  },
];

// ── Solve card for a model ─────────────────────────────────────────────────────
function SolveCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-bg-card border border-border rounded-lg p-4 flex-1">
      <p className="text-accent-green text-xs font-ui uppercase tracking-wider mb-2">{title}</p>
      <p className="text-text-secondary text-sm leading-relaxed">{body}</p>
    </div>
  );
}

// ── Problem card ───────────────────────────────────────────────────────────────
function ProblemCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-bg-secondary border border-accent-red/30 rounded-xl p-5">
      <h4 className="text-accent-red font-semibold text-sm mb-2">{title}</h4>
      <p className="text-text-secondary text-sm leading-relaxed">{body}</p>
    </div>
  );
}

export default function IslamicFinanceExplainer() {
  const { t, language } = useLanguage();
  const it = t.islamicFinance;

  const [activeTab, setActiveTab] = useState<TabKey>('conventional');
  const [comparePrice, setComparePrice] = useState(400000);

  const activeModel = MODELS.find((m) => m.key === activeTab)!;
  const tabLabels: Record<TabKey, string> = {
    conventional: it.conventional,
    murabaha: it.murabaha,
    musharaka: it.musharaka,
    ijara: it.ijara,
  };

  // Scaled costs for interactive comparison
  const scale = comparePrice / HOME_PRICE;
  const scaledCosts = MODELS.map((m) => ({
    key: m.key,
    label: tabLabels[m.key],
    totalCost: m.cost.totalCost * scale,
    monthly: m.cost.monthlyPayment * scale,
  }));

  // Solve texts per model
  const solveTexts: Record<TabKey, { s1: string; s2: string; s3: string }> = {
    conventional: { s1: '', s2: '', s3: '' },
    murabaha: {
      s1: it.murabahaSolve1,
      s2: it.murabahaSolve2,
      s3: it.murabahaSolve3,
    },
    musharaka: {
      s1: it.musharakaSolve1,
      s2: it.musharakaSolve2,
      s3: it.musharakaSolve3,
    },
    ijara: {
      s1: it.ijaraSolve1,
      s2: it.ijaraSolve2,
      s3: it.ijaraSolve3,
    },
  };

  const nonConventionalModels: TabKey[] = ['murabaha', 'musharaka', 'ijara'];

  return (
    <section className="w-full max-w-5xl mx-auto">
      <div className="bg-bg-card border border-border rounded-2xl p-6 md:p-10">
        <h2 className="font-display text-2xl md:text-3xl text-text-primary mb-1">
          {it.title}
        </h2>
        <p className="text-text-secondary mb-10">{it.subtitle}</p>

        {/* ── STRUCTURAL PROBLEMS SECTION ──────────────────────────────────── */}
        <div className="mb-10">
          <h3 className="font-display text-xl text-text-primary mb-6">
            {it.problemsSectionTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ProblemCard title={it.problem1Title} body={it.problem1Body} />
            <ProblemCard title={it.problem2Title} body={it.problem2Body} />
            <ProblemCard title={it.problem3Title} body={it.problem3Body} />
          </div>
        </div>

        {/* ── HOW ALTERNATIVES SOLVE IT ─────────────────────────────────────── */}
        <div className="mb-10">
          <h3 className="font-display text-lg text-text-primary mb-6">
            {it.howAlternativesSolve}
          </h3>
          <div className="space-y-4">
            {nonConventionalModels.map((key) => {
              const solve = solveTexts[key];
              const label = tabLabels[key];
              return (
                <div key={key} className="border border-border rounded-xl overflow-hidden">
                  <div className="bg-bg-secondary px-5 py-3 border-b border-border">
                    <h4 className="font-semibold text-text-primary text-sm">{label}</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
                    <div className="bg-bg-card p-4">
                      <p className="text-accent-green text-xs font-ui uppercase tracking-wider mb-2">
                        {it.solvesLabel} Problem 1: {it.solveProblem1}
                      </p>
                      <p className="text-text-secondary text-sm leading-relaxed">{solve.s1}</p>
                    </div>
                    <div className="bg-bg-card p-4">
                      <p className="text-accent-green text-xs font-ui uppercase tracking-wider mb-2">
                        {it.solvesLabel} Problem 2: {it.solveProblem2}
                      </p>
                      <p className="text-text-secondary text-sm leading-relaxed">{solve.s2}</p>
                    </div>
                    <div className="bg-bg-card p-4">
                      <p className="text-accent-green text-xs font-ui uppercase tracking-wider mb-2">
                        {it.solvesLabel} Problem 3: {it.solveProblem3}
                      </p>
                      <p className="text-text-secondary text-sm leading-relaxed">{solve.s3}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── TAB SWITCHER + MODEL DETAIL ───────────────────────────────────── */}
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
          <div className="bg-bg-secondary rounded-xl p-6 border border-border">
            <h3 className="font-display text-lg text-text-primary mb-3">
              {tabLabels[activeTab]}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              {activeModel.explanation[language]}
            </p>
          </div>
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
                  <p className="text-text-muted text-xs font-ui mb-2">{tabLabels[model.key]}</p>
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

        {/* Interactive cost comparison */}
        <div className="bg-bg-secondary rounded-xl p-6 border border-border mb-8">
          <h3 className="font-display text-lg text-text-primary mb-2">{it.interactiveCompTitle}</h3>
          <p className="text-text-muted text-xs mb-4">{it.interactiveNote}</p>
          <div className="mb-4">
            <label className="text-text-secondary text-sm font-ui mb-2 block">
              Home Price: <span className="text-text-primary font-semibold">{formatCurrency(comparePrice)}</span>
            </label>
            <input
              type="range"
              min={100000}
              max={1000000}
              step={10000}
              value={comparePrice}
              onChange={(e) => setComparePrice(Number(e.target.value))}
              className="w-full accent-accent-gold"
            />
            <div className="flex justify-between text-text-muted text-xs mt-1">
              <span>$100K</span>
              <span>$1M</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {scaledCosts.map((m) => (
              <div key={m.key} className="bg-bg-card border border-border rounded-lg p-3 text-center">
                <p className="text-text-muted text-xs mb-1">{m.label}</p>
                <p className="font-mono font-bold text-text-primary">{formatCurrency(m.totalCost)}</p>
                <p className="text-text-muted text-xs">{formatCurrency(m.monthly)}/mo</p>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced comparison table */}
        <div className="bg-bg-secondary rounded-xl p-6 border border-border mb-8 overflow-x-auto">
          <h3 className="font-display text-lg text-text-primary mb-4">Feature comparison</h3>
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="text-text-muted border-b border-border">
                <th className="text-left py-2 pr-4 font-ui">Feature</th>
                <th className="text-center py-2 px-3 font-ui">{it.conventional}</th>
                <th className="text-center py-2 px-3 font-ui">{it.murabaha}</th>
                <th className="text-center py-2 px-3 font-ui">{it.musharaka}</th>
                <th className="text-center py-2 px-3 font-ui">{it.ijara}</th>
                <th className="text-center py-2 px-3 font-ui text-accent-amber">{it.whoBearsRisk}</th>
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
                  <td className="text-center py-3 px-3 text-text-muted text-xs italic">{row.risk[language]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Honest assessment — prominent */}
        <div className="border-2 border-accent-gold rounded-xl p-6 bg-accent-gold/5">
          <p className="text-accent-gold font-semibold text-sm mb-3">⚖️ {it.honestAssessmentTitle}</p>
          <p className="text-text-secondary text-sm leading-relaxed">{it.honestAssessmentBody}</p>
        </div>
      </div>
    </section>
  );
}

// Keep SolveCard export for potential future use
export { SolveCard };
