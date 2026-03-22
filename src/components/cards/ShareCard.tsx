import { useState, useCallback } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useLanguage } from '../../context/LanguageContext';

interface ShareCardProps {
  stat: string;
  context: string;
  source: string;
  index: number;
}

const accentColors = [
  'var(--accent-red)',
  'var(--accent-amber)',
  'var(--accent-gold)',
  'var(--accent-green)',
  'var(--accent-blue)',
];

export function ShareCard({ stat, context, source, index }: ShareCardProps) {
  const ref = useScrollReveal(index * 100);
  const { t } = useLanguage();
  const [copied, setCopied] = useState<string | null>(null);
  const accentColor = accentColors[index % accentColors.length];

  const twitterText = `${stat}\n\n${context}\n\nSource: ${source}\n\n#HousingCrisis`;
  const instagramText = `${stat}\n\n${context}\n\nSource: ${source}\n\nhousingcrisis.info`;

  const copyToClipboard = useCallback(async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  }, []);

  return (
    <div ref={ref} className="flex flex-col gap-4">
      {/* Card Preview */}
      <div
        className="relative aspect-[4/5] bg-bg-card border border-border rounded-lg overflow-hidden flex flex-col justify-between p-6 md:p-8 transition-all duration-300 hover:border-border-accent hover:shadow-lg"
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: accentColor }}
        />

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center">
          <p
            className="font-display text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-4"
            style={{ color: accentColor }}
          >
            {stat}
          </p>
          <p className="text-sm md:text-base text-text-secondary leading-relaxed">
            {context}
          </p>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border flex items-end justify-between">
          <div>
            <p className="text-xs text-text-muted">{source}</p>
          </div>
          <p className="text-xs font-mono text-text-muted">housingcrisis.info</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => copyToClipboard(twitterText, 'twitter')}
          className="flex-1 px-3 py-2 text-xs font-body bg-bg-elevated border border-border rounded hover:border-border-accent hover:text-text-primary text-text-secondary transition-all duration-200"
        >
          {copied === 'twitter' ? 'Copied!' : t.share.copyTwitter}
        </button>
        <button
          onClick={() => copyToClipboard(instagramText, 'instagram')}
          className="flex-1 px-3 py-2 text-xs font-body bg-bg-elevated border border-border rounded hover:border-border-accent hover:text-text-primary text-text-secondary transition-all duration-200"
        >
          {copied === 'instagram' ? 'Copied!' : t.share.copyInstagram}
        </button>
        <button
          onClick={() => copyToClipboard(instagramText, 'download')}
          className="px-3 py-2 text-xs font-body bg-bg-elevated border border-border rounded hover:border-border-accent hover:text-text-primary text-text-secondary transition-all duration-200"
          title={t.share.downloadPng}
        >
          {copied === 'download' ? 'Copied!' : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
