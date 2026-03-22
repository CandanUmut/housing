import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { cityRatios } from '../../data/priceIncome';
import { formatNumber } from '../../utils/formatters';

function getRatioColor(ratio: number): { bar: string; text: string; bg: string } {
  if (ratio <= 3) return { bar: 'bg-accent-green', text: 'text-accent-green', bg: 'bg-accent-green/10' };
  if (ratio <= 6) return { bar: 'bg-accent-amber', text: 'text-accent-amber', bg: 'bg-accent-amber/10' };
  return { bar: 'bg-accent-red', text: 'text-accent-red', bg: 'bg-accent-red/10' };
}

function getRatioLabel(ratio: number): string {
  if (ratio <= 3) return 'Affordable';
  if (ratio <= 6) return 'Moderately Unaffordable';
  return 'Severely Unaffordable';
}

export default function CityExplorer() {
  const { t } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selected = cityRatios[selectedIndex];
  const colors = getRatioColor(selected.ratio);
  const maxRatio = Math.max(...cityRatios.map((c) => c.ratio));
  const benchmarkPct = (3 / maxRatio) * 100;

  return (
    <section className="w-full max-w-3xl mx-auto">
      <div className="bg-bg-card border border-border rounded-2xl p-6 md:p-10">
        <h2 className="font-display text-2xl md:text-3xl text-text-primary mb-1">
          {t.priceIncome.title}
        </h2>
        <p className="text-text-secondary mb-8">{t.priceIncome.subtitle}</p>

        {/* City dropdown */}
        <div className="mb-8">
          <label className="block text-text-secondary text-sm font-ui mb-2">
            Select a city
          </label>
          <select
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(Number(e.target.value))}
            className="w-full max-w-sm bg-bg-secondary border border-border rounded-lg px-4 py-3 text-text-primary font-ui text-lg focus:outline-none focus:border-accent-blue transition-colors"
          >
            {cityRatios.map((city, i) => (
              <option key={city.city} value={i}>
                {city.city} ({city.country})
              </option>
            ))}
          </select>
        </div>

        {/* Selected city detail */}
        <div className={`rounded-xl p-6 border ${colors.bg} border-current/20 mb-6`}>
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="font-display text-xl text-text-primary">{selected.city}</h3>
            <span className={`text-sm font-ui ${colors.text}`}>
              {getRatioLabel(selected.ratio)}
            </span>
          </div>

          {/* Horizontal bar */}
          <div className="relative">
            <div className="w-full h-8 bg-bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${colors.bar} transition-all duration-500 flex items-center justify-end pr-3`}
                style={{ width: `${(selected.ratio / maxRatio) * 100}%` }}
              >
                <span className="text-bg-primary text-sm font-mono font-bold">
                  {formatNumber(selected.ratio, 1)}x
                </span>
              </div>
            </div>

            {/* 3x benchmark line */}
            <div
              className="absolute top-0 h-8 border-l-2 border-dashed border-accent-green"
              style={{ left: `${benchmarkPct}%` }}
            >
              <span className="absolute -top-5 -translate-x-1/2 text-accent-green text-xs font-ui whitespace-nowrap">
                3x benchmark
              </span>
            </div>
          </div>

          <p className="text-text-muted text-sm mt-4 font-ui">
            Price-to-income ratio: {formatNumber(selected.ratio, 1)}x
            {selected.ratio > 3 && (
              <span className="text-accent-red">
                {' '}
                ({formatNumber(selected.ratio - 3, 1)}x above the affordable benchmark)
              </span>
            )}
          </p>
        </div>

        {/* All cities comparison */}
        <div className="space-y-3">
          <h3 className="text-text-secondary text-sm font-ui mb-2">All cities</h3>
          {cityRatios.map((city, i) => {
            const c = getRatioColor(city.ratio);
            const isSelected = i === selectedIndex;
            return (
              <button
                key={city.city}
                onClick={() => setSelectedIndex(i)}
                className={`w-full text-left rounded-lg p-3 transition-colors ${
                  isSelected
                    ? 'bg-bg-secondary border border-accent-gold/50'
                    : 'bg-bg-secondary/50 border border-transparent hover:border-border'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-ui ${isSelected ? 'text-text-primary font-semibold' : 'text-text-secondary'}`}>
                    {city.city}
                  </span>
                  <span className={`text-sm font-mono font-bold ${c.text}`}>
                    {formatNumber(city.ratio, 1)}x
                  </span>
                </div>
                <div className="w-full h-2 bg-bg-primary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${c.bar} transition-all duration-300`}
                    style={{ width: `${(city.ratio / maxRatio) * 100}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
