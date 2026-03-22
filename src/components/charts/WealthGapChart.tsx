import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';

const TICK_FILL = '#666666';
const GRID_STROKE = '#2a2a2a';
const GOLD = '#eab308';
const RED = '#ef4444';

const data = [
  { group: 'Homeowner', netWorth: 396200 },
  { group: 'Renter', netWorth: 10400 },
];

const COLORS = [GOLD, RED];

interface WealthTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: (typeof data)[number] }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: WealthTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: '10px 14px' }}>
      <p style={{ color: '#fff', margin: 0, fontWeight: 600 }}>{label}</p>
      <p style={{ color: '#999', margin: '4px 0 0' }}>
        Net Worth: ${d.netWorth.toLocaleString()}
      </p>
    </div>
  );
}

export default function WealthGapChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
        <XAxis dataKey="group" tick={{ fill: TICK_FILL }} />
        <YAxis
          tick={{ fill: TICK_FILL }}
          tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
        <Bar dataKey="netWorth" radius={[4, 4, 0, 0]} name="Net Worth">
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
