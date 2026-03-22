import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { rentBurdenHistory } from '../../data/rentBurden';

const TICK_FILL = '#666666';
const GRID_STROKE = '#2a2a2a';

interface RentBurdenTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: number;
}

function CustomTooltip({ active, payload, label }: RentBurdenTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: '10px 14px' }}>
      <p style={{ color: '#fff', margin: 0, fontWeight: 600 }}>{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color, margin: '4px 0 0' }}>
          {entry.name}: {entry.value}%
        </p>
      ))}
    </div>
  );
}

export default function RentBurdenChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={rentBurdenHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
        <XAxis dataKey="year" tick={{ fill: TICK_FILL }} />
        <YAxis domain={[0, 60]} tick={{ fill: TICK_FILL }} tickFormatter={(v: number) => `${v}%`} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="severelyBurdened"
          stackId="1"
          stroke="#ef4444"
          fill="#ef4444"
          fillOpacity={0.4}
          name="Severely Burdened"
        />
        <Area
          type="monotone"
          dataKey="costBurdened"
          stackId="1"
          stroke="#f59e0b"
          fill="#f59e0b"
          fillOpacity={0.3}
          name="Cost Burdened"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
