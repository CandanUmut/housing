import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ScrollReveal } from '../ui/ScrollReveal';
import { ModelCard } from '../cards/ModelCard';
import GlobalComparisonChart from '../charts/GlobalComparisonChart';
import { globalModels } from '../../data/globalModels';

export default function GlobalModelsSection() {
  const { language, t } = useLanguage();
  const [selectedModel, setSelectedModel] = useState(globalModels[0].city);

  return (
    <section id="global-models" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <ScrollReveal>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4">
          {t.globalModels.title}
        </h2>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mb-12">
          {t.globalModels.subtitle}
        </p>
      </ScrollReveal>

      {/* 2x2 Grid of Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {globalModels.map((model, index) => (
          <ModelCard
            key={model.city}
            city={model.city}
            country={model.country}
            flag={model.flag}
            heroStat={model.heroStat}
            heroLabel={model.heroLabel[language]}
            color={model.color}
            howItWorks={model.howItWorks[language]}
            keyOutcome={model.keyOutcome[language]}
            usLesson={model.usLesson[language]}
            delay={index * 150}
          />
        ))}
      </div>

      {/* Radar Chart with Model Selector */}
      <ScrollReveal delay={200}>
        <div className="bg-bg-card border border-border rounded-lg p-6">
          <h3 className="font-display text-lg font-bold text-text-primary mb-4 text-center">
            US vs. {selectedModel}
          </h3>

          {/* Model Selector Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {globalModels.map((model) => (
              <button
                key={model.city}
                onClick={() => setSelectedModel(model.city)}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                  selectedModel === model.city
                    ? 'border-transparent text-white'
                    : 'border-border text-text-secondary hover:border-border-accent hover:text-text-primary bg-bg-elevated'
                }`}
                style={
                  selectedModel === model.city
                    ? { backgroundColor: model.color }
                    : undefined
                }
              >
                {model.flag} {model.city}
              </button>
            ))}
          </div>

          <GlobalComparisonChart selectedModel={selectedModel} />
        </div>
      </ScrollReveal>
    </section>
  );
}
