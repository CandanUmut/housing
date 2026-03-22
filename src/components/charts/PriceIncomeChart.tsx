import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { priceIncomeHistory } from '../../data/priceIncome';

const TICK_FILL = '#666666';
const GRID_STROKE = '#2a2a2a';

const affordableData = priceIncomeHistory.map((d) => ({
  ...d,
  affordableZone: 3.0,
}));

interface PriceIncomeTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: (typeof priceIncomeHistory)[number] }>;
  label?: number;
}

function CustomTooltip({ active, payload, label }: PriceIncomeTooltipProps) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: '10px 14px' }}>
      <p style={{ color: '#fff', margin: 0, fontWeight: 600 }}>{label}</p>
      <p style={{ color: '#f59e0b', margin: '4px 0 0' }}>Ratio: {data.ratio}x</p>
      <p style={{ color: '#999', margin: '4px 0 0' }}>
        Price: ${data.medianPrice.toLocaleString()}
      </p>
      <p style={{ color: '#999', margin: '4px 0 0' }}>
        Income: ${data.medianIncome.toLocaleString()}
      </p>
    </div>
  );
}

export default function PriceIncomeChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={affordableData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
        <XAxis dataKey="year" tick={{ fill: TICK_FILL }} />
        <YAxis domain={[0, 6]} tick={{ fill: TICK_FILL }} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="affordableZone"
          fill="#22c55e"
          fillOpacity={0.1}
          stroke="none"
          name="Affordable Zone"
        />
        <ReferenceLine y={3.0} stroke="#22c55e" strokeDasharray="6 4" label={{ value: '3.0x Benchmark', fill: '#22c55e', fontSize: 12, position: 'right' }} />
        <Line
          type="monotone"
          dataKey="ratio"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={{ fill: '#f59e0b', r: 4 }}
          activeDot={{ r: 6 }}
          name="Price-to-Income Ratio"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
