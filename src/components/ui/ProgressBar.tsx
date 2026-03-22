import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max,
  color = 'var(--accent-amber)',
  label,
  showValue = true,
  className = '',
}: ProgressBarProps) {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.3 });
  const pct = Math.min((value / max) * 100, 100);

  return (
    <div ref={ref} className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1 text-sm">
          {label && <span className="text-text-secondary font-ui">{label}</span>}
          {showValue && <span className="font-mono text-text-primary">{value}</span>}
        </div>
      )}
      <div className="w-full h-3 bg-bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: isVisible ? `${pct}%` : '0%',
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
