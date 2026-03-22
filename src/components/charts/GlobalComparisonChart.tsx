import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { globalModels, usBaseline, type ModelStats } from '../../data/globalModels';

interface GlobalComparisonChartProps {
  selectedModel: string;
}

const AXES: { key: keyof ModelStats; label: string }[] = [
  { key: 'affordability', label: 'Affordability' },
  { key: 'quality', label: 'Quality' },
  { key: 'tenantProtection', label: 'Tenant Protection' },
  { key: 'supply', label: 'Supply' },
  { key: 'publicInvestment', label: 'Public Investment' },
  { key: 'inequality', label: 'Inequality' },
];

export default function GlobalComparisonChart({ selectedModel }: GlobalComparisonChartProps) {
  const model = globalModels.find((m) => m.city === selectedModel);
  const modelStats = model?.stats ?? usBaseline;
  const modelColor = model?.color ?? '#888';

  const data = AXES.map(({ key, label }) => ({
    subject: label,
    US: usBaseline[key],
    Model: modelStats[key],
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="#2a2a2a" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#666666', fontSize: 12 }} />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 10]}
          tick={{ fill: '#444' }}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8 }}
          labelStyle={{ color: '#fff' }}
        />
        <Radar
          name="US"
          dataKey="US"
          stroke="#666"
          fill="#666"
          fillOpacity={0.15}
          strokeWidth={2}
        />
        <Radar
          name={selectedModel}
          dataKey="Model"
          stroke={modelColor}
          fill={modelColor}
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Legend wrapperStyle={{ color: '#999', fontSize: 13 }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
