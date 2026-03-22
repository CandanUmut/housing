import { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { homeownershipByGeneration } from '../../data/homeownership';
import { priceIncomeHistory } from '../../data/priceIncome';
import { formatCurrency, formatNumber } from '../../utils/formatters';

interface GenerationCard {
  key: 'silent' | 'boomers' | 'genX' | 'millennials';
  birthRange: string;
  rate: number;
  quote: string;
}

const GENERATION_CARDS: GenerationCard[] = [
  {
    key: 'silent',
    birthRange: '1928–1945',
    rate: 55,
    quote: 'Homes cost 2× income. A single salary bought a house.',
  },
  {
    key: 'boomers',
    birthRange: '1946–1964',
    rate: 48,
    quote: 'Bought cheap, rode the wave, pulled the ladder up behind them.',
  },
  {
    key: 'genX',
    birthRange: '1965–1980',
    rate: 42,
    quote: 'Caught the tail end. Survived 2008 — barely.',
  },
  {
    key: 'millennials',
    birthRange: '1981–1996',
    rate: 33,
    quote: 'Student debt meets unaffordable housing. The dream deferred.',
  },
];

function findClosestYear(year: number): (typeof priceIncomeHistory)[number] {
  let closest = priceIncomeHistory[0];
  let minDiff = Math.abs(year - closest.year);
  for (const entry of priceIncomeHistory) {
    const diff = Math.abs(year - entry.year);
    if (diff < minDiff) {
      minDiff = diff;
      closest = entry;
    }
  }
  return closest;
}

function getGenerationName(birthYear: number): string {
  if (birthYear <= 1945) return 'Silent Generation';
  if (birthYear <= 1964) return 'Baby Boomers';
  if (birthYear <= 1980) return 'Gen X';
  if (birthYear <= 1996) return 'Millennials';
  return 'Gen Z';
}

export default function GenerationComparison() {
  const { t } = useLanguage();
  const gt = t.generations;

  const [birthYear, setBirthYear] = useState('');

  const birthYearNum = Number(birthYear) || 0;

  const personalResult = useMemo(() => {
    if (birthYearNum < 1930 || birthYearNum > 2006) return null;

    const birthData = findClosestYear(birthYearNum);
    const currentAge = 2024 - birthYearNum;

    // Parent generation: assume parents born ~25 years earlier
    const parentBirthYear = birthYearNum - 25;
    const parentAtSameAge = findClosestYear(parentBirthYear + currentAge);
    const userCurrentData = findClosestYear(2024);

    return {
      birthPrice: birthData.medianPrice,
      birthRatio: birthData.ratio,
      birthDataYear: birthData.year,
      parentRatio: parentAtSameAge.ratio,
      parentDataYear: parentAtSameAge.year,
      currentRatio: userCurrentData.ratio,
      currentAge,
      generationName: getGenerationName(birthYearNum),
    };
  }, [birthYearNum]);

  return (
    <section className="w-full max-w-4xl mx-auto">
      <div className="bg-bg-card border border-border rounded-2xl p-6 md:p-10">
        <h2 className="font-display text-2xl md:text-3xl text-text-primary mb-1">
          {gt.title}
        </h2>
        <p className="text-text-secondary mb-8">{gt.subtitle}</p>

        {/* Birth year input */}
        <div className="mb-8">
          <label className="block text-text-secondary text-sm font-ui mb-2">
            Enter your birth year
          </label>
          <input
            type="number"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            placeholder="1990"
            min={1930}
            max={2006}
            className="w-full max-w-xs bg-bg-secondary border border-border rounded-lg px-4 py-3 text-text-primary font-mono text-lg focus:outline-none focus:border-accent-blue transition-colors"
          />
        </div>

        {/* Personal result */}
        {personalResult && (
          <div className="bg-bg-secondary rounded-xl p-6 mb-8 border border-border">
            <p className="text-text-primary text-lg leading-relaxed">
              When you were born ({birthYearNum}), a median US home cost{' '}
              <span className="text-accent-green font-mono font-bold">
                {formatCurrency(personalResult.birthPrice)}
              </span>
              . Your parents, at your age, faced a{' '}
              <span className="text-accent-amber font-mono font-bold">
                {formatNumber(personalResult.parentRatio, 1)}x
              </span>{' '}
              price-to-income ratio. You face{' '}
              <span className="text-accent-red font-mono font-bold">
                {formatNumber(personalResult.currentRatio, 1)}x
              </span>
              .
            </p>
            <p className="text-text-muted text-sm mt-3 font-ui">
              Generation: {personalResult.generationName} | Age: {personalResult.currentAge}
            </p>
          </div>
        )}

        {/* Generation stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {GENERATION_CARDS.map((gen) => {
            const genData = homeownershipByGeneration.find(
              (g) => g.generation === (gen.key === 'silent' ? 'Silent' : gen.key === 'boomers' ? 'Boomers' : gen.key === 'genX' ? 'Gen X' : 'Millennials')
            );
            const rate = genData?.rate ?? gen.rate;
            const rateColor =
              rate >= 50
                ? 'text-accent-green'
                : rate >= 40
                ? 'text-accent-amber'
                : 'text-accent-red';

            return (
              <div
                key={gen.key}
                className="bg-bg-secondary rounded-xl p-5 border border-border hover:border-accent-gold/50 transition-colors"
              >
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="font-display text-lg text-text-primary">
                    {gt[gen.key]}
                  </h3>
                  <span className="text-text-muted text-xs font-ui">{gen.birthRange}</span>
                </div>
                <p className={`text-3xl font-mono font-bold ${rateColor} mb-1`}>
                  {rate}%
                </p>
                <p className="text-text-muted text-xs font-ui mb-3">
                  Homeownership rate at 30
                </p>
                <p className="text-text-secondary text-sm italic border-t border-border/50 pt-3">
                  &ldquo;{gen.quote}&rdquo;
                </p>
              </div>
            );
          })}
        </div>

        {/* Gen Z callout */}
        <div className="mt-4 bg-accent-red/10 border border-accent-red/30 rounded-xl p-5 text-center">
          <p className="font-display text-lg text-text-primary mb-1">{gt.genZ}</p>
          <p className="text-4xl font-mono font-bold text-accent-red mb-2">
            {homeownershipByGeneration.find((g) => g.generation === 'Gen Z')?.rate ?? 28}%
          </p>
          <p className="text-text-muted text-sm">(projected)</p>
          <p className="text-text-secondary text-sm mt-2 italic">{gt.genZQuote}</p>
        </div>
      </div>
    </section>
  );
}
