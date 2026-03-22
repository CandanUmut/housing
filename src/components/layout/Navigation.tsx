import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

const navItems = [
  { key: 'theData', href: '#stats' },
  { key: 'howItBroke', href: '#timeline' },
  { key: 'alternatives', href: '#alternatives' },
  { key: 'tools', href: '#mortgage' },
  { key: 'share', href: '#share' },
] as const;

export function Navigation() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (href: string) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMortgageCalcClick = () => {
    setIsOpen(false);
    const el = document.querySelector('#mortgage-calculator');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/90 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <a
            href="#"
            className="font-display text-lg font-bold text-text-primary hover:text-accent-gold transition-colors"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            The True Cost of Home
          </a>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map(({ key, href }) => (
              <button
                key={key}
                onClick={() => handleClick(href)}
                className="text-sm font-ui text-text-secondary hover:text-text-primary transition-colors"
              >
                {t.nav[key]}
              </button>
            ))}
            <button
              onClick={handleMortgageCalcClick}
              className="text-sm font-ui text-accent-gold hover:text-accent-amber transition-colors font-semibold"
              title={t.nav.mortgageCalculator}
            >
              🧮 {t.nav.mortgageCalculator}
            </button>
            <LanguageToggle />
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <LanguageToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-secondary hover:text-text-primary p-1"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-bg-secondary border-t border-border">
          <div className="px-4 py-3 space-y-2">
            {navItems.map(({ key, href }) => (
              <button
                key={key}
                onClick={() => handleClick(href)}
                className="block w-full text-left text-sm font-ui text-text-secondary hover:text-text-primary py-2 transition-colors"
              >
                {t.nav[key]}
              </button>
            ))}
            <button
              onClick={handleMortgageCalcClick}
              className="block w-full text-left text-sm font-ui text-accent-gold hover:text-accent-amber py-2 transition-colors font-semibold"
            >
              🧮 {t.nav.mortgageCalculator}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
