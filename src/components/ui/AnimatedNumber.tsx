import { useCountUp } from '../../hooks/useCountUp';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { formatNumber, formatCurrency } from '../../utils/formatters';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  format?: 'number' | 'currency' | 'none';
  decimals?: number;
  duration?: number;
  className?: string;
}

export function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  format = 'number',
  decimals = 0,
  duration = 1800,
  className = '',
}: AnimatedNumberProps) {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.3 });
  const animatedValue = useCountUp(value, isVisible, duration);

  let display: string;
  if (format === 'currency') {
    display = formatCurrency(Math.round(animatedValue));
  } else if (format === 'number') {
    display = formatNumber(animatedValue, decimals);
  } else {
    display = animatedValue.toFixed(decimals);
  }

  return (
    <span ref={ref} className={`font-mono ${className}`}>
      {prefix}{display}{suffix}
    </span>
  );
}
