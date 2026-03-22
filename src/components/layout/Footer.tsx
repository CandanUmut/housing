import { Github, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-bg-secondary border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-display text-xl font-bold text-text-primary mb-3">
              The True Cost of Home
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              {t.footer.description}
            </p>
            <p className="text-text-muted text-xs">{t.footer.openSource}</p>
          </div>

          <div>
            <h4 className="font-ui font-semibold text-text-primary mb-3">{t.footer.sources}</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-center gap-1.5">
                <ExternalLink size={12} className="text-text-muted flex-shrink-0" />
                US Census Bureau
              </li>
              <li className="flex items-center gap-1.5">
                <ExternalLink size={12} className="text-text-muted flex-shrink-0" />
                Harvard Joint Center for Housing Studies
              </li>
              <li className="flex items-center gap-1.5">
                <ExternalLink size={12} className="text-text-muted flex-shrink-0" />
                HUD Exchange — Annual Homeless Assessment
              </li>
              <li className="flex items-center gap-1.5">
                <ExternalLink size={12} className="text-text-muted flex-shrink-0" />
                National Low Income Housing Coalition
              </li>
              <li className="flex items-center gap-1.5">
                <ExternalLink size={12} className="text-text-muted flex-shrink-0" />
                Demographia International Housing Affordability
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-ui font-semibold text-text-primary mb-3">{t.footer.getInvolved}</h4>
            <div className="space-y-3">
              <LanguageToggle />
              <div className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent-gold transition-colors cursor-pointer">
                <Github size={16} />
                <span>{t.footer.contribute}</span>
              </div>
            </div>
            <div className="mt-6 text-xs text-text-muted">
              {t.footer.license}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center text-xs text-text-muted">
          The True Cost of Home / Evin Gerçek Bedeli — Open Source, Evidence-Based
        </div>
      </div>
    </footer>
  );
}
