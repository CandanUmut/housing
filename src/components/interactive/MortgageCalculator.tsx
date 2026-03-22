import { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  ReferenceLine,
} from 'recharts';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency, formatPercent, formatNumber } from '../../utils/formatters';
import {
  calculateTrueCost,
  calculateAmortizationSchedule,
  calculateRentVsBuy,
  calculateMonthlyPayment,
  type TrueCostInputs,
  type AmortizationYear,
} from '../../utils/calculators';

type TabKey = 'calculator' | 'rentvsbuy' | 'amortization';

// ── Slider helper ──────────────────────────────────────────────────────────────
function Slider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
  minLabel,
  maxLabel,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
  minLabel: string;
  maxLabel: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-text-secondary text-sm font-ui mb-2">
        {label}: <span className="text-text-primary font-semibold">{display}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-accent-gold"
      />
      <div className="flex justify-between text-text-muted text-xs mt-1">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
      {hint && <p className="text-text-muted text-xs mt-2 italic">{hint}</p>}
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div>
      <label className="block text-text-secondary text-sm font-ui mb-2">{label}</label>
      <div className="flex items-center gap-1 bg-bg-secondary border border-border rounded-lg px-3 py-2">
        {prefix && <span className="text-text-muted text-sm">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 bg-transparent text-text-primary text-sm font-mono outline-none min-w-0"
        />
        {suffix && <span className="text-text-muted text-sm">{suffix}</span>}
      </div>
    </div>
  );
}

function OutputCard({ label, value, color, sub }: { label: string; value: string; color: string; sub?: string }) {
  return (
    <div className="bg-bg-secondary rounded-xl p-4 text-center">
      <p className={`text-xl md:text-2xl font-mono font-bold ${color}`}>{value}</p>
      <p className="text-text-muted text-xs mt-1 font-ui">{label}</p>
      {sub && <p className="text-text-muted text-xs mt-0.5 opacity-70">{sub}</p>}
    </div>
  );
}

// ── Custom tooltip for amortization chart ──────────────────────────────────────
function AmortTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; fill: string }>; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="bg-bg-elevated border border-border rounded-lg p-3 text-xs shadow-lg">
      <p className="font-semibold text-text-primary mb-2">Year {label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex justify-between gap-4">
          <span style={{ color: p.fill }}>{p.name}</span>
          <span className="text-text-primary font-mono">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function MortgageCalculator() {
  const { t } = useLanguage();
  const mt = t.mortgage;

  // ── Core loan inputs ─────────────────────────────────────────────────────────
  const [homePrice, setHomePrice] = useState(400000);
  const [downPaymentPct, setDownPaymentPct] = useState(10);
  const [interestRate, setInterestRate] = useState(7);
  const [loanTermIndex, setLoanTermIndex] = useState(1);

  // ── True cost inputs ─────────────────────────────────────────────────────────
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.1);
  const [hoaMonthly, setHoaMonthly] = useState(0);
  const [insuranceAnnual, setInsuranceAnnual] = useState(1500);
  const [maintenancePct, setMaintenancePct] = useState(1);
  const [appreciationRate, setAppreciationRate] = useState(3);
  const [yearsToStay, setYearsToStay] = useState(7);

  // ── Rent vs Buy inputs ───────────────────────────────────────────────────────
  const [monthlyRent, setMonthlyRent] = useState(2000);
  const [rentIncreaseRate, setRentIncreaseRate] = useState(4);
  const [investmentReturnRate, setInvestmentReturnRate] = useState(7);

  // ── UI state ─────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<TabKey>('calculator');
  const [showAmortTable, setShowAmortTable] = useState(false);
  const [showAllYears, setShowAllYears] = useState(false);

  const loanTerm = loanTermIndex === 0 ? 15 : 30;

  const trueCostInputs: TrueCostInputs = useMemo(() => ({
    homePrice,
    downPaymentPct,
    interestRate,
    loanTerm,
    propertyTaxRate,
    hoaMonthly,
    insuranceAnnual,
    maintenancePct,
    appreciationRate,
    yearsToStay,
  }), [homePrice, downPaymentPct, interestRate, loanTerm, propertyTaxRate, hoaMonthly, insuranceAnnual, maintenancePct, appreciationRate, yearsToStay]);

  const trueCost = useMemo(() => calculateTrueCost(trueCostInputs), [trueCostInputs]);

  const amortSchedule = useMemo(
    () => calculateAmortizationSchedule(trueCostInputs),
    [trueCostInputs]
  );

  const rentVsBuyResult = useMemo(
    () => calculateRentVsBuy({ ...trueCostInputs, monthlyRent, rentIncreaseRate, investmentReturnRate }),
    [trueCostInputs, monthlyRent, rentIncreaseRate, investmentReturnRate]
  );

  // Comparison at 3%
  const comparison3 = useMemo(() => {
    const principal = homePrice * (1 - downPaymentPct / 100);
    const monthly3 = calculateMonthlyPayment(principal, 3, loanTerm);
    const totalPaid3 = monthly3 * loanTerm * 12 + homePrice * (downPaymentPct / 100);
    return { monthly: monthly3, totalInterest: totalPaid3 - homePrice, totalPaid: totalPaid3 };
  }, [homePrice, downPaymentPct, loanTerm]);

  // Amortization chart data (clipped to yearsToStay for the chart)
  const chartYears = Math.min(yearsToStay, loanTerm);
  const chartData = amortSchedule.slice(0, chartYears).map((y) => ({
    year: y.year,
    Interest: Math.round(y.interestPaid),
    Principal: Math.round(y.principalPaid),
    'Property Tax': Math.round(y.propertyTax),
    'Maint/Ins/HOA': Math.round(y.maintenance + y.insurance + y.hoa),
  }));

  // Year 1 interest pct
  const year1InterestPct = amortSchedule.length > 0
    ? Math.round((amortSchedule[0].interestPaid / amortSchedule[0].piPayment) * 100)
    : 85;

  // Rows shown in table
  const tableRows: AmortizationYear[] = showAllYears
    ? amortSchedule
    : amortSchedule.slice(0, 10);

  // Summary cents breakdown
  const stayRows = amortSchedule.slice(0, Math.min(yearsToStay, loanTerm));
  const totalDollarsOverStay = stayRows.reduce(
    (s, y) => s + y.piPayment + y.propertyTax + y.hoa + y.insurance + y.maintenance,
    0
  ) + trueCost.downPayment;
  const centsInterest = totalDollarsOverStay > 0
    ? Math.round((trueCost.interestPaidOverStay / totalDollarsOverStay) * 100)
    : 0;
  const centsEquity = totalDollarsOverStay > 0
    ? Math.round((trueCost.equityBuilt / totalDollarsOverStay) * 100)
    : 0;
  const centsOther = 100 - centsInterest - centsEquity;

  // Rent vs Buy insight message
  const rvbInsight = useMemo(() => {
    const diff = rentVsBuyResult.buyWinsBy;
    const absDiff = formatCurrency(Math.abs(diff));
    if (Math.abs(diff) < 5000) {
      return mt.neutralMessage;
    } else if (diff > 0) {
      return mt.buyWinsMessage
        .replace('{amount}', absDiff)
        .replace('{years}', String(yearsToStay))
        .replace('{years}', String(yearsToStay))
        .replace('{rate}', String(appreciationRate));
    } else {
      return mt.rentWinsMessage
        .replace('{amount}', absDiff)
        .replace('{years}', String(yearsToStay))
        .replace('{reason}', rentVsBuyResult.primaryReason);
    }
  }, [rentVsBuyResult, yearsToStay, appreciationRate, mt]);

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'calculator', label: mt.tabCalculator },
    { key: 'rentvsbuy', label: mt.tabRentVsBuy },
    { key: 'amortization', label: mt.tabAmortization },
  ];

  return (
    <section id="mortgage-calculator" className="w-full max-w-5xl mx-auto">
      <div className="bg-bg-card border-2 border-accent-gold rounded-2xl p-6 md:p-10">
        <h2 className="font-display text-2xl md:text-3xl text-text-primary mb-1">{mt.title}</h2>
        <p className="text-text-secondary mb-6">{mt.subtitle}</p>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-lg text-sm font-ui transition-colors ${
                activeTab === key
                  ? 'bg-accent-gold text-bg-primary font-semibold'
                  : 'bg-bg-secondary text-text-secondary hover:text-text-primary border border-border'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── CALCULATOR TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'calculator' && (
          <>
            {/* Loan inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Slider
                label={mt.homePrice}
                value={homePrice}
                min={100000}
                max={2000000}
                step={10000}
                display={formatCurrency(homePrice)}
                onChange={setHomePrice}
                minLabel="$100K"
                maxLabel="$2M"
              />
              <Slider
                label={mt.downPayment}
                value={downPaymentPct}
                min={3}
                max={40}
                step={1}
                display={`${downPaymentPct}% (${formatCurrency(homePrice * downPaymentPct / 100)})`}
                onChange={setDownPaymentPct}
                minLabel="3%"
                maxLabel="40%"
              />
              <Slider
                label={mt.interestRate}
                value={interestRate}
                min={3}
                max={10}
                step={0.1}
                display={formatPercent(interestRate)}
                onChange={setInterestRate}
                minLabel="3%"
                maxLabel="10%"
              />
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

            {/* True cost inputs */}
            <div className="bg-bg-secondary rounded-xl p-6 border border-border mb-8">
              <h3 className="font-display text-base text-text-primary mb-4">{mt.trueCostInputsTitle}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Slider
                  label={mt.propertyTaxRate}
                  value={propertyTaxRate}
                  min={0.5}
                  max={3.0}
                  step={0.1}
                  display={`${propertyTaxRate.toFixed(1)}% (${formatCurrency(homePrice * propertyTaxRate / 100)}/yr)`}
                  onChange={setPropertyTaxRate}
                  minLabel="0.5%"
                  maxLabel="3%"
                />
                <NumberInput
                  label={mt.hoaFees}
                  value={hoaMonthly}
                  onChange={setHoaMonthly}
                  prefix="$"
                  suffix="/mo"
                />
                <NumberInput
                  label={mt.homeInsurance}
                  value={insuranceAnnual}
                  onChange={setInsuranceAnnual}
                  prefix="$"
                  suffix="/yr"
                />
                <Slider
                  label={mt.maintenanceBudget}
                  value={maintenancePct}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  display={`${maintenancePct.toFixed(1)}% (${formatCurrency(homePrice * maintenancePct / 100)}/yr)`}
                  onChange={setMaintenancePct}
                  minLabel="0.5%"
                  maxLabel="2%"
                  hint={mt.maintenanceHelper}
                />
                <Slider
                  label={mt.expectedAppreciation}
                  value={appreciationRate}
                  min={0}
                  max={6}
                  step={0.5}
                  display={`${appreciationRate.toFixed(1)}%/yr`}
                  onChange={setAppreciationRate}
                  minLabel="0%"
                  maxLabel="6%"
                />
                <Slider
                  label={mt.yearsToStay}
                  value={yearsToStay}
                  min={1}
                  max={30}
                  step={1}
                  display={`${yearsToStay} ${mt.years}`}
                  onChange={setYearsToStay}
                  minLabel="1"
                  maxLabel="30"
                />
              </div>
            </div>

            {/* Output: two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Left: What you pay the bank */}
              <div className="bg-bg-secondary rounded-xl p-6 border border-border">
                <h3 className="font-ui text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
                  {mt.whatYouPayBank}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-secondary text-sm">{mt.monthlyPayment}</span>
                    <span className="text-accent-amber font-mono font-bold">{formatCurrency(trueCost.monthlyPI)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary text-sm">{mt.totalInterest}</span>
                    <span className="text-accent-red font-mono font-bold">{formatCurrency(trueCost.totalInterestOverTerm)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary text-sm">{mt.interestPercent}</span>
                    <span className="text-accent-red font-mono font-bold">{formatPercent(trueCost.interestPctOfTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary text-sm">{mt.principalExceedsInterest}</span>
                    <span className="text-accent-green font-mono font-bold">
                      {mt.breakEven.split(' ')[0]} {trueCost.principalExceedsInterestYear}
                    </span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-bg-card rounded-lg border border-border/50 space-y-1">
                  <p className="text-accent-red text-xs">
                    {mt.bankCallout1.replace('{amount}', formatCurrency(trueCost.totalInterestOverTerm))}
                  </p>
                  <p className="text-text-muted text-xs">{mt.bankCallout2}</p>
                  <p className="text-text-muted text-xs">{mt.bankCallout3}</p>
                </div>
              </div>

              {/* Right: What the bank doesn't tell you */}
              <div className="bg-bg-secondary rounded-xl p-6 border border-border">
                <h3 className="font-ui text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
                  {mt.whatBankWontTell}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-text-secondary text-sm flex-1">{mt.propertyTaxRate} <span className="text-text-muted text-xs">{mt.yourRisk}</span></span>
                    <span className="text-accent-amber font-mono text-sm font-bold whitespace-nowrap">{formatCurrency(trueCost.monthlyPropertyTax)}/mo</span>
                  </div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-text-secondary text-sm flex-1">{mt.hoaFees} <span className="text-text-muted text-xs">{mt.yourRiskHOA}</span></span>
                    <span className="text-accent-amber font-mono text-sm font-bold whitespace-nowrap">{formatCurrency(trueCost.monthlyHOA)}/mo</span>
                  </div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-text-secondary text-sm flex-1">{mt.homeInsurance} <span className="text-text-muted text-xs">{mt.yourRiskRequired}</span></span>
                    <span className="text-accent-amber font-mono text-sm font-bold whitespace-nowrap">{formatCurrency(trueCost.monthlyInsurance)}/mo</span>
                  </div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-text-secondary text-sm flex-1">{mt.maintenanceBudget} <span className="text-text-muted text-xs">{mt.yourRiskUnpredictable}</span></span>
                    <span className="text-accent-amber font-mono text-sm font-bold whitespace-nowrap">{formatCurrency(trueCost.monthlyMaintenance)}/mo</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="text-text-primary text-sm font-semibold">{mt.totalMonthlyTrueCost}</span>
                    <span className="text-accent-red font-mono font-bold">{formatCurrency(trueCost.totalMonthlyTrueCost)}/mo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Over X years panel */}
            <div className="bg-bg-secondary rounded-xl p-6 border border-border mb-8">
              <h3 className="font-display text-base text-text-primary mb-4">
                {mt.overYearsYouPlanToStay.replace('{years}', String(yearsToStay))}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <OutputCard label={mt.propertyTaxPaid} value={formatCurrency(trueCost.propertyTaxPaidOverStay)} color="text-accent-amber" />
                <OutputCard label={mt.hoaPaid} value={formatCurrency(trueCost.hoaPaidOverStay)} color="text-accent-amber" />
                <OutputCard label={mt.insurancePaid} value={formatCurrency(trueCost.insurancePaidOverStay)} color="text-accent-amber" />
                <OutputCard label={mt.maintenancePaid} value={formatCurrency(trueCost.maintenancePaidOverStay)} color="text-accent-amber" />
                <OutputCard label={mt.interestPaidPortion} value={formatCurrency(trueCost.interestPaidOverStay)} color="text-accent-red" />
                <OutputCard label={mt.totalNonEquityCost} value={formatCurrency(trueCost.totalNonEquityCost)} color="text-accent-red" />
              </div>
              <div className="border-t border-border pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <OutputCard label={mt.equityBuilt} value={formatCurrency(trueCost.equityBuilt)} color="text-accent-green" />
                <OutputCard
                  label={mt.homeValueAtExit}
                  value={formatCurrency(trueCost.homeValueAtExit)}
                  color="text-accent-green"
                  sub={`at ${appreciationRate}% appreciation`}
                />
                <OutputCard
                  label={mt.netPositionAtExit}
                  value={formatCurrency(trueCost.netPositionAtExit)}
                  color={trueCost.netPositionAtExit >= 0 ? 'text-accent-green' : 'text-accent-red'}
                />
              </div>
            </div>

            {/* Red callout box */}
            <div className="border-2 border-accent-red rounded-xl p-6 mb-8 bg-accent-red/5">
              <p className="text-accent-red font-semibold text-sm mb-3">🏦 {mt.bankWinsEitherWay}</p>
              <div className="space-y-1 text-text-secondary text-sm">
                <p>• {mt.roofCollapses}</p>
                <p>• {mt.taxesDouble}</p>
                <p>• {mt.marketCrashes}</p>
                <p>• {mt.cantSell}</p>
              </div>
              <p className="text-accent-red text-sm font-semibold mt-3">{mt.bankGetsFirst}</p>
            </div>

            {/* Comparison table */}
            <div className="bg-bg-secondary rounded-xl p-6 border border-border mb-8 overflow-x-auto">
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
                    <td className="text-right py-2 px-4 text-accent-green">{formatCurrency(comparison3.monthly)}</td>
                    <td className="text-right py-2 px-4 text-accent-red">{formatCurrency(trueCost.monthlyPI)}</td>
                    <td className="text-right py-2 pl-4 text-accent-amber">+{formatCurrency(trueCost.monthlyPI - comparison3.monthly)}</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-ui">{mt.totalPaid}</td>
                    <td className="text-right py-2 px-4 text-accent-green">{formatCurrency(comparison3.totalPaid)}</td>
                    <td className="text-right py-2 px-4 text-accent-red">{formatCurrency(trueCost.totalPaidOverTerm)}</td>
                    <td className="text-right py-2 pl-4 text-accent-amber">+{formatCurrency(trueCost.totalPaidOverTerm - comparison3.totalPaid)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-ui">{mt.totalInterest}</td>
                    <td className="text-right py-2 px-4 text-accent-green">{formatCurrency(comparison3.totalInterest)}</td>
                    <td className="text-right py-2 px-4 text-accent-red">{formatCurrency(trueCost.totalInterestOverTerm)}</td>
                    <td className="text-right py-2 pl-4 text-accent-amber">+{formatCurrency(trueCost.totalInterestOverTerm - comparison3.totalInterest)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Death pledge */}
            <blockquote className="border-l-4 border-accent-gold pl-4 italic text-text-muted text-sm">
              {mt.deathPledge}
            </blockquote>
          </>
        )}

        {/* ── RENT VS BUY TAB ───────────────────────────────────────────────── */}
        {activeTab === 'rentvsbuy' && (
          <>
            <h3 className="font-display text-xl text-text-primary mb-6">{mt.rentVsBuyTitle}</h3>

            {/* Rent side inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-bg-secondary rounded-xl p-6 border border-border">
              <NumberInput
                label={mt.currentMonthlyRent}
                value={monthlyRent}
                onChange={setMonthlyRent}
                prefix="$"
                suffix="/mo"
              />
              <Slider
                label={mt.annualRentIncrease}
                value={rentIncreaseRate}
                min={0}
                max={8}
                step={0.5}
                display={`${rentIncreaseRate.toFixed(1)}%/yr`}
                onChange={setRentIncreaseRate}
                minLabel="0%"
                maxLabel="8%"
              />
              <Slider
                label={mt.investmentReturn}
                value={investmentReturnRate}
                min={4}
                max={10}
                step={0.5}
                display={`${investmentReturnRate.toFixed(1)}%/yr`}
                onChange={setInvestmentReturnRate}
                minLabel="4%"
                maxLabel="10%"
                hint={mt.investmentReturnHelper}
              />
            </div>

            {/* Comparison table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left py-3 pr-4 text-text-muted font-ui" />
                    <th className="text-right py-3 px-4 text-accent-amber font-ui">🏠 {mt.buyScenario}</th>
                    <th className="text-right py-3 pl-4 text-accent-blue font-ui">🔑 {mt.rentScenario}</th>
                  </tr>
                </thead>
                <tbody className="text-text-secondary">
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4 font-ui">{mt.monthlyPaymentYear1}</td>
                    <td className="text-right py-3 px-4 text-text-primary font-mono">{formatCurrency(rentVsBuyResult.buy.monthlyPaymentYear1)}</td>
                    <td className="text-right py-3 pl-4 text-text-primary font-mono">{formatCurrency(rentVsBuyResult.rent.monthlyPaymentYear1)}</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4 font-ui">{mt.totalPaidOverYears.replace('{years}', String(yearsToStay))}</td>
                    <td className="text-right py-3 px-4 text-accent-red font-mono">{formatCurrency(rentVsBuyResult.buy.totalPaidOverStay)}</td>
                    <td className="text-right py-3 pl-4 text-accent-green font-mono">{formatCurrency(rentVsBuyResult.rent.totalPaidOverStay)}</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4 font-ui">{mt.equityWealthAtExit}</td>
                    <td className="text-right py-3 px-4 text-accent-green font-mono">{formatCurrency(rentVsBuyResult.buy.equityAtExit)}</td>
                    <td className="text-right py-3 pl-4 text-accent-green font-mono">
                      {formatCurrency(rentVsBuyResult.rent.portfolioValue)}
                      <span className="block text-text-muted text-xs">{mt.rentPortfolioNote}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-ui font-semibold">{mt.netFinancialPosition}</td>
                    <td className={`text-right py-3 px-4 font-mono font-bold ${rentVsBuyResult.buy.netPosition >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                      {rentVsBuyResult.buy.netPosition >= 0 ? '+' : ''}{formatCurrency(rentVsBuyResult.buy.netPosition)}
                    </td>
                    <td className={`text-right py-3 pl-4 font-mono font-bold ${rentVsBuyResult.rent.netPosition >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                      {rentVsBuyResult.rent.netPosition >= 0 ? '+' : ''}{formatCurrency(rentVsBuyResult.rent.netPosition)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Insight callout */}
            <div className={`rounded-xl p-5 border mb-6 ${
              Math.abs(rentVsBuyResult.buyWinsBy) < 5000
                ? 'border-accent-amber bg-accent-amber/5'
                : rentVsBuyResult.buyWinsBy > 0
                  ? 'border-accent-green bg-accent-green/5'
                  : 'border-accent-blue bg-accent-blue/5'
            }`}>
              <p className="text-text-primary text-sm leading-relaxed">{rvbInsight}</p>
            </div>

            {/* Disclaimer */}
            <div className="bg-bg-secondary rounded-xl p-4 border border-border">
              <p className="text-text-muted text-xs italic leading-relaxed">{mt.rvbDisclaimer}</p>
            </div>
          </>
        )}

        {/* ── AMORTIZATION TAB ─────────────────────────────────────────────── */}
        {activeTab === 'amortization' && (
          <>
            <h3 className="font-display text-xl text-text-primary mb-6">{mt.amortizationTitle}</h3>

            {/* Stacked bar chart */}
            <div className="bg-bg-secondary rounded-xl p-4 border border-border mb-6" style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 10 }}>
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 11, fill: '#888' }}
                    label={{ value: 'Year', position: 'insideBottom', offset: -2, fontSize: 11, fill: '#888' }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#888' }}
                    tickFormatter={(v) => `$${Math.round(v / 1000)}K`}
                    width={50}
                  />
                  <ReTooltip content={<AmortTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#aaa' }} />
                  {/* Annotation: year 1 */}
                  {chartData.length > 0 && (
                    <ReferenceLine
                      x={1}
                      stroke="#ef4444"
                      strokeDasharray="4 4"
                      label={{ value: `${year1InterestPct}% interest`, position: 'top', fontSize: 10, fill: '#ef4444' }}
                    />
                  )}
                  {/* Break-even marker */}
                  <ReferenceLine
                    x={trueCost.principalExceedsInterestYear}
                    stroke="#22c55e"
                    strokeDasharray="4 4"
                    label={{ value: 'Break-even', position: 'top', fontSize: 10, fill: '#22c55e' }}
                  />
                  {/* Exit marker */}
                  {yearsToStay <= loanTerm && (
                    <ReferenceLine
                      x={yearsToStay}
                      stroke="#f59e0b"
                      strokeDasharray="4 4"
                      label={{ value: 'Exit', position: 'top', fontSize: 10, fill: '#f59e0b' }}
                    />
                  )}
                  <Bar dataKey="Interest" stackId="a" fill="#ef4444">
                    {chartData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={`rgba(239,68,68,${Math.max(0.4, 1 - i / chartData.length * 0.6)})`}
                      />
                    ))}
                  </Bar>
                  <Bar dataKey="Principal" stackId="a" fill="#22c55e" />
                  <Bar dataKey="Property Tax" stackId="a" fill="#eab308" />
                  <Bar dataKey="Maint/Ins/HOA" stackId="a" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Summary */}
            <div className="bg-bg-secondary rounded-xl p-5 border border-border mb-6">
              <p className="text-text-primary font-semibold mb-3">
                {mt.amortSummary.replace('{year}', String(yearsToStay))}
              </p>
              <ul className="space-y-1 text-text-secondary text-sm">
                <li>• {mt.amortTotalInterest.replace('{amount}', formatCurrency(trueCost.interestPaidOverStay))}</li>
                <li>• {mt.amortEquityViaPayments.replace('{amount}', formatCurrency(trueCost.equityBuilt))}</li>
                <li>• {mt.amortOtherCosts.replace('{amount}', formatCurrency(trueCost.propertyTaxPaidOverStay + trueCost.maintenancePaidOverStay + trueCost.insurancePaidOverStay))}</li>
              </ul>
              {totalDollarsOverStay > 0 && (
                <div className="mt-4 pt-4 border-t border-border space-y-1 text-sm">
                  <p className="text-accent-red">{mt.amortCentsInterest.replace('{cents}', String(centsInterest))}</p>
                  <p className="text-accent-green">{mt.amortCentsEquity.replace('{cents}', String(centsEquity))}</p>
                  <p className="text-accent-amber">{mt.amortCentsOther.replace('{cents}', String(Math.max(0, centsOther)))}</p>
                </div>
              )}
            </div>

            {/* Table toggle */}
            <button
              onClick={() => setShowAmortTable(!showAmortTable)}
              className="w-full text-center text-sm font-ui text-accent-gold border border-accent-gold/40 rounded-lg py-2 hover:bg-accent-gold/5 transition-colors mb-4"
            >
              {showAmortTable ? mt.hideAmortizationTable : mt.showAmortizationTable}
            </button>

            {showAmortTable && (
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-xs min-w-[700px]">
                  <thead>
                    <tr className="bg-bg-secondary border-b border-border text-text-muted">
                      <th className="text-left py-2.5 px-3 font-ui">{mt.amortYear}</th>
                      <th className="text-right py-2.5 px-3 font-ui">{mt.amortBalanceStart}</th>
                      <th className="text-right py-2.5 px-3 font-ui">{mt.amortPIPayment}</th>
                      <th className="text-right py-2.5 px-3 font-ui">{mt.amortInterest}</th>
                      <th className="text-right py-2.5 px-3 font-ui">{mt.amortPrincipal}</th>
                      <th className="text-right py-2.5 px-3 font-ui">{mt.amortBalanceEnd}</th>
                      <th className="text-right py-2.5 px-3 font-ui">{mt.amortEquityPct}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((row) => {
                      const isExit = row.year === yearsToStay;
                      const isBreakEven = row.year === trueCost.principalExceedsInterestYear;
                      const interestFraction = row.interestPaid / row.piPayment;
                      const interestColor = `rgba(239,68,68,${Math.max(0.3, interestFraction)})`;
                      const principalAlpha = Math.min(1, row.principalPaid / row.piPayment * 2);
                      const principalColor = `rgba(34,197,94,${Math.max(0.2, principalAlpha)})`;

                      return (
                        <tr
                          key={row.year}
                          className={`border-b border-border/30 ${
                            isExit ? 'font-bold bg-accent-amber/5' : isBreakEven ? 'bg-accent-green/5' : ''
                          }`}
                        >
                          <td className="py-2 px-3 text-text-secondary">
                            {row.year}
                            {isExit && <span className="ml-1 text-accent-amber text-xs">⬅ {mt.exitHereLabel}</span>}
                            {isBreakEven && !isExit && <span className="ml-1 text-accent-green text-xs">⬅ {mt.breakEvenLabel}</span>}
                          </td>
                          <td className="text-right py-2 px-3 font-mono text-text-secondary">{formatCurrency(row.balanceStart)}</td>
                          <td className="text-right py-2 px-3 font-mono text-text-secondary">{formatCurrency(row.piPayment)}</td>
                          <td className="text-right py-2 px-3 font-mono font-bold" style={{ color: interestColor }}>{formatCurrency(row.interestPaid)}</td>
                          <td className="text-right py-2 px-3 font-mono font-bold" style={{ color: principalColor }}>{formatCurrency(row.principalPaid)}</td>
                          <td className="text-right py-2 px-3 font-mono text-text-secondary">{formatCurrency(row.balanceEnd)}</td>
                          <td className="text-right py-2 px-3 font-mono text-text-secondary">{formatNumber(row.cumulativeEquityPct, 1)}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {amortSchedule.length > 10 && (
                  <div className="p-3 text-center border-t border-border">
                    <button
                      onClick={() => setShowAllYears(!showAllYears)}
                      className="text-sm text-accent-gold hover:underline font-ui"
                    >
                      {showAllYears
                        ? mt.showFewerYears
                        : mt.showAllYears.replace('{years}', String(loanTerm))}
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
