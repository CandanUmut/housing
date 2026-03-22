import { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { cities } from '../../data/cities';
import { formatCurrency, formatPercent } from '../../utils/formatters';

type Step = 'income' | 'city' | 'results';

function getBurdenColor(pct: number): string {
  if (pct < 30) return 'text-accent-green';
  if (pct < 50) return 'text-accent-amber';
  return 'text-accent-red';
}

function getBurdenBg(pct: number): string {
  if (pct < 30) return 'bg-accent-green/20 border-accent-green';
  if (pct < 50) return 'bg-accent-amber/20 border-accent-amber';
  return 'bg-accent-red/20 border-accent-red';
}

export default function AffordabilityCalculator() {
  const { t } = useLanguage();
  const at = t.affordability;

  const [step, setStep] = useState<Step>('income');
  const [income, setIncome] = useState('');
  const [cityIndex, setCityIndex] = useState(0);
  const [rent, setRent] = useState('');

  const incomeNum = Number(income.replace(/[^0-9]/g, '')) || 0;
  const rentNum = Number(rent.replace(/[^0-9]/g, '')) || 0;

  const selectedCity = cities[cityIndex];

  const results = useMemo(() => {
    if (incomeNum <= 0) return null;
    const affordable3x = incomeNum * 3;
    const affordable5x = incomeNum * 5;
    const medianPrice = selectedCity.medianHomePrice;
    const monthlyIncome = incomeNum / 12;
    const rentBurdenPct = rentNum > 0 && monthlyIncome > 0 ? (rentNum / monthlyIncome) * 100 : null;

    return {
      affordable3x,
      affordable5x,
      medianPrice,
      gap3x: medianPrice - affordable3x,
      gap5x: medianPrice - affordable5x,
      rentBurdenPct,
    };
  }, [incomeNum, selectedCity, rentNum]);

  const canProceedToCity = incomeNum > 0;
  const canProceedToResults = canProceedToCity && selectedCity;

  return (
    <section className="w-full max-w-3xl mx-auto">
      <div className="bg-bg-card border border-border rounded-2xl p-6 md:p-10">
        <h2 className="font-display text-2xl md:text-3xl text-text-primary mb-1">{at.title}</h2>
        <p className="text-text-secondary mb-8">{at.subtitle}</p>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-8">
          {(['income', 'city', 'results'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-ui font-bold transition-colors ${
                  step === s
                    ? 'bg-accent-blue text-text-primary'
                    : i < ['income', 'city', 'results'].indexOf(step)
                    ? 'bg-accent-green text-bg-primary'
                    : 'bg-bg-secondary text-text-muted'
                }`}
              >
                {i + 1}
              </div>
              {i < 2 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        {/* Step 1: Income */}
        {step === 'income' && (
          <div className="space-y-6">
            <div>
              <label className="block text-text-secondary text-sm font-ui mb-2">{at.income}</label>
              <input
                type="text"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="75000"
                className="w-full bg-bg-secondary border border-border rounded-lg px-4 py-3 text-text-primary font-mono text-lg focus:outline-none focus:border-accent-blue transition-colors"
              />
            </div>
            <div>
              <label className="block text-text-secondary text-sm font-ui mb-2">
                {at.renting} ({at.rentBurden})
              </label>
              <input
                type="text"
                value={rent}
                onChange={(e) => setRent(e.target.value)}
                placeholder="1500"
                className="w-full bg-bg-secondary border border-border rounded-lg px-4 py-3 text-text-primary font-mono text-lg focus:outline-none focus:border-accent-blue transition-colors"
              />
              <p className="text-text-muted text-xs mt-1">Monthly rent (optional)</p>
            </div>
            <button
              onClick={() => canProceedToCity && setStep('city')}
              disabled={!canProceedToCity}
              className="w-full bg-accent-blue text-text-primary py-3 rounded-lg font-ui font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2: City */}
        {step === 'city' && (
          <div className="space-y-6">
            <div>
              <label className="block text-text-secondary text-sm font-ui mb-2">{at.city}</label>
              <select
                value={cityIndex}
                onChange={(e) => setCityIndex(Number(e.target.value))}
                className="w-full bg-bg-secondary border border-border rounded-lg px-4 py-3 text-text-primary font-ui text-lg focus:outline-none focus:border-accent-blue transition-colors"
              >
                {cities.map((city, i) => (
                  <option key={city.name} value={i}>
                    {city.name}, {city.state}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep('income')}
                className="flex-1 bg-bg-secondary text-text-secondary py-3 rounded-lg font-ui hover:text-text-primary transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => canProceedToResults && setStep('results')}
                disabled={!canProceedToResults}
                className="flex-1 bg-accent-blue text-text-primary py-3 rounded-lg font-ui font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity"
              >
                See Results
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 'results' && results && (
          <div className="space-y-6">
            {/* Median price */}
            <div className="bg-bg-secondary rounded-xl p-5">
              <p className="text-text-muted text-sm font-ui mb-1">
                {at.medianPrice} — {selectedCity.name}, {selectedCity.state}
              </p>
              <p className="text-3xl font-mono font-bold text-text-primary">
                {formatCurrency(results.medianPrice)}
              </p>
            </div>

            {/* Affordability bars */}
            <div className="space-y-4">
              {/* 3x rule */}
              <AffordabilityBar
                label={at.affordableAt3x}
                value={results.affordable3x}
                median={results.medianPrice}
                color="bg-accent-green"
                textColor="text-accent-green"
              />
              {/* 5x rule */}
              <AffordabilityBar
                label={at.affordableAt5x}
                value={results.affordable5x}
                median={results.medianPrice}
                color="bg-accent-amber"
                textColor="text-accent-amber"
              />
              {/* Actual median */}
              <AffordabilityBar
                label={at.medianPrice}
                value={results.medianPrice}
                median={results.medianPrice}
                color={results.medianPrice > results.affordable5x ? 'bg-accent-red' : 'bg-accent-amber'}
                textColor={results.medianPrice > results.affordable5x ? 'text-accent-red' : 'text-accent-amber'}
              />
            </div>

            {/* Gap display */}
            {results.gap3x > 0 && (
              <div className="bg-accent-red/10 border border-accent-red/30 rounded-xl p-4 text-center">
                <p className="text-text-muted text-sm">Gap from 3x affordability</p>
                <p className="text-2xl font-mono font-bold text-accent-red">{formatCurrency(results.gap3x)}</p>
              </div>
            )}

            {/* Rent burden */}
            {results.rentBurdenPct !== null && (
              <div className={`rounded-xl p-5 border ${getBurdenBg(results.rentBurdenPct)}`}>
                <p className="text-text-secondary text-sm font-ui mb-1">{at.rentBurden}</p>
                <p className={`text-3xl font-mono font-bold ${getBurdenColor(results.rentBurdenPct)}`}>
                  {formatPercent(results.rentBurdenPct)}
                </p>
                <p className="text-text-muted text-xs mt-2">
                  {results.rentBurdenPct < 30
                    ? 'Affordable range'
                    : results.rentBurdenPct < 50
                    ? 'Cost-burdened'
                    : 'Severely cost-burdened'}
                </p>
              </div>
            )}

            {/* Share button */}
            <button className="w-full bg-bg-secondary border border-border text-text-secondary py-3 rounded-lg font-ui hover:text-text-primary hover:border-accent-blue transition-colors">
              {at.share}
            </button>

            <button
              onClick={() => setStep('income')}
              className="w-full text-text-muted text-sm font-ui hover:text-text-secondary transition-colors"
            >
              Start over
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function AffordabilityBar({
  label,
  value,
  median,
  color,
  textColor,
}: {
  label: string;
  value: number;
  median: number;
  color: string;
  textColor: string;
}) {
  const widthPct = Math.min((value / median) * 100, 100);
  return (
    <div>
      <div className="flex justify-between text-sm font-ui mb-1">
        <span className="text-text-secondary">{label}</span>
        <span className={`font-mono font-semibold ${textColor}`}>{formatCurrency(value)}</span>
      </div>
      <div className="w-full h-3 bg-bg-secondary rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${widthPct}%` }} />
      </div>
    </div>
  );
}
