import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface MortgageCostChartProps {
  principal: number;
  interestRate: number;
  years: number;
}

function calculateMortgage(principal: number, annualRate: number, years: number) {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;

  if (monthlyRate === 0) {
    return { monthlyPayment: principal / numPayments, totalPaid: principal, totalInterest: 0 };
  }

  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);
  const totalPaid = monthlyPayment * numPayments;
  const totalInterest = totalPaid - principal;

  return { monthlyPayment, totalPaid, totalInterest };
}

function formatCurrency(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

const GREEN = '#22c55e';
const RED = '#ef4444';

export default function MortgageCostChart({ principal, interestRate, years }: MortgageCostChartProps) {
  const { totalPaid, totalInterest } = calculateMortgage(principal, interestRate, years);

  const data = [
    { name: 'Principal', value: principal },
    { name: 'Interest', value: totalInterest },
  ];

  const COLORS = [GREEN, RED];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={2}
          dataKey="value"
          stroke="none"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize={20} fontWeight={700}>
          {formatCurrency(totalPaid)}
        </text>
        <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" fill="#999" fontSize={13}>
          Total Paid
        </text>
        <text x="50%" y="92%" textAnchor="middle" fill={GREEN} fontSize={12}>
          Principal: {formatCurrency(principal)}
        </text>
        <text x="50%" y="98%" textAnchor="middle" fill={RED} fontSize={12}>
          Interest: {formatCurrency(totalInterest)}
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
}
