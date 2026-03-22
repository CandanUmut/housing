import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency, formatPercent, formatNumber } from '../../utils/formatters';

function calculateMonthly(principal: number, annualRate: number, years: number): number {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export default function MortgageCalculator() {
  const { t } = useLanguage();
  const mt = t.mortgage;

  const [homePrice, setHomePrice] = useState(400000);
  const [downPaymentPct, setDownPaymentPct] = useState(10);
  const [interestRate, setInterestRate] = useState(7);
  const [loanTermIndex, setLoanTermIndex] = useState(1); // 0=15, 1=30

  const loanTerm = loanTermIndex === 0 ? 15 : 30;

  const results = useMemo(() => {
    const downPayment = homePrice * (downPaymentPct / 100);
    const principal = homePrice - downPayment;
    const monthly = calculateMonthly(principal, interestRate, loanTerm);
    const totalPaid = monthly * loanTerm * 12 + downPayment;
    const totalInterest = totalPaid - homePrice;
    const interestPctOfTotal = (totalInterest / totalPaid) * 100;
    const homesMultiple = totalPaid / homePrice;

    // Break-even: year when equity > total interest paid so far
    // Simplified: when cumulative principal paid > cumulative interest paid
    let breakEvenYear = loanTerm;
    const r = interestRate / 100 / 12;
    let balance = principal;
    let cumulativePrincipal = downPayment;
    let cumulativeInterest = 0;
    for (let month = 1; month <= loanTerm * 12; month++) {
      const interestPayment = balance * r;
      const principalPayment = monthly - interestPayment;
      cumulativePrincipal += principalPayment;
      cumulativeInterest += interestPayment;
      balance -= principalPayment;
      if (cumulativePrincipal >= cumulativeInterest && breakEvenYear === loanTerm) {
        breakEvenYear = Math.ceil(month / 12);
      }
    }

    // Comparison at 3%
    const monthly3 = calculateMonthly(principal, 3, loanTerm);
    const totalPaid3 = monthly3 * loanTerm * 12 + downPayment;
    const totalInterest3 = totalPaid3 - homePrice;

    return {
      monthly,
      totalPaid,
      totalInterest,
      interestPctOfTotal,
      homesMultiple,
      breakEvenYear,
      principal,
      downPayment,
      comparison3: { monthly: monthly3, totalPaid: totalPaid3, totalInterest: totalInterest3 },
    };
  }, [homePrice, downPaymentPct, interestRate, loanTerm]);

  const donutData = [
    { name: 'Principal', value: results.principal + results.downPayment },
    { name: 'Interest', value: results.totalInterest },
  ];
  const DONUT_COLORS = ['#22c55e', '#ef4444'];

  return (
    <section className="w-full max-w-4xl mx-auto">
      <div className="bg-bg-card border-2 border-accent-gold rounded-2xl p-6 md:p-10">
        <h2 className="font-display text-2xl md:text-3xl text-text-primary mb-1">{mt.title}</h2>
        <p className="text-text-secondary mb-8">{mt.subtitle}</p>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Home Price */}
          <div>
            <label className="block text-text-secondary text-sm font-ui mb-2">
              {mt.homePrice}: <span className="text-text-primary font-semibold">{formatCurrency(homePrice)}</span>
            </label>
            <input
              type="range"
              min={100000}
              max={2000000}
              step={10000}
              value={homePrice}
              onChange={(e) => setHomePrice(Number(e.target.value))}
              className="w-full accent-accent-gold"
            />
            <div className="flex justify-between text-text-muted text-xs mt-1">
              <span>$100K</span>
              <span>$2M</span>
            </div>
          </div>

          {/* Down Payment */}
          <div>
            <label className="block text-text-secondary text-sm font-ui mb-2">
              {mt.downPayment}: <span className="text-text-primary font-semibold">{downPaymentPct}% ({formatCurrency(homePrice * downPaymentPct / 100)})</span>
            </label>
            <input
              type="range"
              min={3}
              max={40}
              step={1}
              value={downPaymentPct}
              onChange={(e) => setDownPaymentPct(Number(e.target.value))}
              className="w-full accent-accent-gold"
            />
            <div className="flex justify-between text-text-muted text-xs mt-1">
              <span>3%</span>
              <span>40%</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <label className="block text-text-secondary text-sm font-ui mb-2">
              {mt.interestRate}: <span className="text-text-primary font-semibold">{formatPercent(interestRate)}</span>
            </label>
            <input
              type="range"
              min={3}
              max={10}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-accent-gold"
            />
            <div className="flex justify-between text-text-muted text-xs mt-1">
              <span>3%</span>
              <span>10%</span>
            </div>
          </div>

          {/* Loan Term Toggle */}
          <div>
            <label className="block text-text-secondary text-sm font-ui mb-2">{mt.loanTerm}</label>
            <div className="inline-flex rounded-lg bg-bg-secondary border border-border overflow-hidden">
              {[15, 30].map((term, i) => (
                <button
                  key={term}
                  onClick={() => setLoanTermIndex(i)}
                  className={`px-6 py-2.5 text-sm font-ui transition-colors ${
                    loanTermIndex === i
                      ? 'bg-accent-gold text-bg-primary font-semibold'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {term} {mt.years}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Outputs */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <OutputCard label={mt.monthlyPayment} value={formatCurrency(results.monthly)} color="text-accent-amber" />
          <OutputCard label={mt.totalPaid} value={formatCurrency(results.totalPaid)} color="text-accent-red" />
          <OutputCard label={mt.totalInterest} value={formatCurrency(results.totalInterest)} color="text-accent-red" />
          <OutputCard label={mt.interestPercent} value={formatPercent(results.interestPctOfTotal)} color="text-accent-amber" />
          <OutputCard
            label={mt.youArePaying.replace('{count}', formatNumber(results.homesMultiple, 1))}
            value={`${formatNumber(results.homesMultiple, 2)}×`}
            color="text-accent-red"
          />
          <OutputCard label={mt.breakEven} value={`${results.breakEvenYear} ${mt.years}`} color="text-accent-green" />
        </div>

        {/* Donut Chart */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8 bg-bg-secondary rounded-xl p-6">
          <div className="w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  stroke="none"
                >
                  {donutData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={DONUT_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8 }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-text-secondary text-sm">Principal: {formatCurrency(results.principal + results.downPayment)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-text-secondary text-sm">Interest: {formatCurrency(results.totalInterest)}</span>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-bg-secondary rounded-xl p-6 mb-8 overflow-x-auto">
          <h3 className="font-display text-lg text-text-primary mb-4">
            {formatCurrency(homePrice)} — 3% vs {formatPercent(interestRate, 1)}
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-text-muted border-b border-border">
                <th className="text-left py-2 pr-4" />
                <th className="text-right py-2 px-4">3% Rate</th>
                <th className="text-right py-2 px-4">{formatPercent(interestRate, 1)} Rate</th>
                <th className="text-right py-2 pl-4">Difference</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-ui">{mt.monthlyPayment}</td>
                <td className="text-right py-2 px-4 text-accent-green">{formatCurrency(results.comparison3.monthly)}</td>
                <td className="text-right py-2 px-4 text-accent-red">{formatCurrency(results.monthly)}</td>
                <td className="text-right py-2 pl-4 text-accent-amber">
                  +{formatCurrency(results.monthly - results.comparison3.monthly)}
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-ui">{mt.totalPaid}</td>
                <td className="text-right py-2 px-4 text-accent-green">{formatCurrency(results.comparison3.totalPaid)}</td>
                <td className="text-right py-2 px-4 text-accent-red">{formatCurrency(results.totalPaid)}</td>
                <td className="text-right py-2 pl-4 text-accent-amber">
                  +{formatCurrency(results.totalPaid - results.comparison3.totalPaid)}
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-ui">{mt.totalInterest}</td>
                <td className="text-right py-2 px-4 text-accent-green">{formatCurrency(results.comparison3.totalInterest)}</td>
                <td className="text-right py-2 px-4 text-accent-red">{formatCurrency(results.totalInterest)}</td>
                <td className="text-right py-2 pl-4 text-accent-amber">
                  +{formatCurrency(results.totalInterest - results.comparison3.totalInterest)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Death Pledge Quote */}
        <blockquote className="border-l-4 border-accent-gold pl-4 italic text-text-muted text-sm">
          {mt.deathPledge}
        </blockquote>
      </div>
    </section>
  );
}

function OutputCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-bg-secondary rounded-xl p-4 text-center">
      <p className={`text-xl md:text-2xl font-mono font-bold ${color}`}>{value}</p>
      <p className="text-text-muted text-xs mt-1 font-ui">{label}</p>
    </div>
  );
}
