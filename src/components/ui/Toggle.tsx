interface ToggleProps {
  options: [string, string];
  value: number;
  onChange: (index: number) => void;
  className?: string;
}

export function Toggle({ options, value, onChange, className = '' }: ToggleProps) {
  return (
    <div className={`inline-flex rounded-lg bg-bg-secondary border border-border overflow-hidden ${className}`}>
      {options.map((option, i) => (
        <button
          key={option}
          onClick={() => onChange(i)}
          className={`px-4 py-2 text-sm font-ui transition-colors ${
            value === i
              ? 'bg-accent-blue text-text-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
