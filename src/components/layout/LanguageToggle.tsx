import { useLanguage } from '../../context/LanguageContext';

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`inline-flex rounded-lg bg-bg-secondary border border-border overflow-hidden ${className}`}>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 text-sm font-ui font-medium transition-colors ${
          language === 'en'
            ? 'bg-accent-blue text-text-primary'
            : 'text-text-secondary hover:text-text-primary'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('tr')}
        className={`px-3 py-1.5 text-sm font-ui font-medium transition-colors ${
          language === 'tr'
            ? 'bg-accent-blue text-text-primary'
            : 'text-text-secondary hover:text-text-primary'
        }`}
        aria-label="Türkçe'ye geç"
      >
        TR
      </button>
    </div>
  );
}
