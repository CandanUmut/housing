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
import { reforms, type Verdict } from '../../data/reforms';

const TICK_FILL = '#666666';
const GRID_STROKE = '#2a2a2a';

const VERDICT_COLORS: Record<Verdict, string> = {
  strong: '#22c55e',
  mixed: '#f59e0b',
  weak: '#ef4444',
};

const VERDICT_SCORES: Record<Verdict, number> = {
  strong: 3,
  mixed: 2,
  weak: 1,
};

const data = reforms.map((r) => ({
  name: r.name.en,
  score: VERDICT_SCORES[r.verdict],
  verdict: r.verdict,
  details: r.details.en,
  location: r.location,
}));

interface ReformTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: (typeof data)[number] }>;
  label?: string;
}

function CustomTooltip({ active, payload }: ReformTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: '10px 14px', maxWidth: 300 }}>
      <p style={{ color: '#fff', margin: 0, fontWeight: 600 }}>{d.name}</p>
      <p style={{ color: VERDICT_COLORS[d.verdict], margin: '4px 0', textTransform: 'capitalize' }}>
        Evidence: {d.verdict}
      </p>
      <p style={{ color: '#999', margin: '4px 0 0', fontSize: 12 }}>{d.details}</p>
      <p style={{ color: '#666', margin: '4px 0 0', fontSize: 11 }}>{d.location}</p>
    </div>
  );
}

export default function ReformOutcomesChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
        <XAxis type="number" domain={[0, 3]} tick={{ fill: TICK_FILL }} hide />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fill: TICK_FILL, fontSize: 12 }}
          width={180}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
        <Bar dataKey="score" radius={[0, 4, 4, 0]} name="Evidence Strength" barSize={20}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={VERDICT_COLORS[entry.verdict]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
