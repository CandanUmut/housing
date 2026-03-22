import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function Hero() {
  const { t } = useLanguage();

  const handleCta = () => {
    document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' });
  };

  const microStats = [
    t.hero.stats.ratio,
    t.hero.stats.burdened,
    t.hero.stats.hours,
  ];

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <motion.div
        className="max-w-4xl mx-auto px-4 py-20 text-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Eyebrow */}
        <motion.span
          variants={fadeUp}
          className="inline-block text-xs md:text-sm tracking-[0.2em] uppercase text-text-muted font-body mb-6 border border-border rounded-full px-4 py-1.5"
        >
          {t.hero.eyebrow}
        </motion.span>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-text-primary mb-6"
        >
          {t.hero.headline}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeUp}
          className="font-body text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          {t.hero.subheadline}
        </motion.p>

        {/* Micro stats */}
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap justify-center gap-8 md:gap-12 mb-12"
        >
          {microStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="block font-mono text-2xl md:text-3xl font-bold text-accent-amber">
                {stat.value}
              </span>
              <span className="block text-xs md:text-sm text-text-muted mt-1 max-w-[160px]">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.button
          variants={fadeUp}
          onClick={handleCta}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-accent-amber text-bg-primary font-body font-semibold text-sm md:text-base transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_-5px_var(--accent-amber)] cursor-pointer"
        >
          {t.hero.cta}
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.button>
      </motion.div>
    </section>
  );
}
