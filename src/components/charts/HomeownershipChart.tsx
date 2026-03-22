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
import { homeownershipByGeneration } from '../../data/homeownership';

const TICK_FILL = '#666666';
const GRID_STROKE = '#2a2a2a';

const COLORS = ['#22c55e', '#84cc16', '#f59e0b', '#f97316', '#ef4444'];

interface OwnershipTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: (typeof homeownershipByGeneration)[number] }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: OwnershipTooltipProps) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: '10px 14px' }}>
      <p style={{ color: '#fff', margin: 0, fontWeight: 600 }}>{label}</p>
      <p style={{ color: '#999', margin: '4px 0 0' }}>
        Rate at age 30: {data.rate}%
        {data.projected ? ' (projected)' : ''}
      </p>
    </div>
  );
}

export default function HomeownershipChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={homeownershipByGeneration} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
        <XAxis dataKey="generation" tick={{ fill: TICK_FILL }} />
        <YAxis domain={[0, 70]} tick={{ fill: TICK_FILL }} tickFormatter={(v: number) => `${v}%`} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
        <Bar dataKey="rate" radius={[4, 4, 0, 0]} name="Homeownership at 30">
          {homeownershipByGeneration.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
