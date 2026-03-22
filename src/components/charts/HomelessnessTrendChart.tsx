import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { homelessnessTrend } from '../../data/homelessness';

const TICK_FILL = '#666666';
const GRID_STROKE = '#2a2a2a';
const RED = '#ef4444';

interface HomelessTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: (typeof homelessnessTrend)[number] }>;
  label?: number;
}

function CustomTooltip({ active, payload, label }: HomelessTooltipProps) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: '10px 14px' }}>
      <p style={{ color: '#fff', margin: 0, fontWeight: 600 }}>{label}</p>
      <p style={{ color: RED, margin: '4px 0 0' }}>
        {data.count.toLocaleString()} people
      </p>
    </div>
  );
}

export default function HomelessnessTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={homelessnessTrend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
        <XAxis dataKey="year" tick={{ fill: TICK_FILL }} />
        <YAxis
          tick={{ fill: TICK_FILL }}
          tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
          domain={['dataMin - 50000', 'dataMax + 50000']}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="count"
          stroke={RED}
          strokeWidth={2}
          fill={RED}
          fillOpacity={0.15}
          dot={{ fill: RED, r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6 }}
          name="Homeless Count"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
