import { LanguageProvider } from './context/LanguageContext';
import { Navigation } from './components/layout/Navigation';
import Hero from './components/sections/Hero';
import StatsCounter from './components/sections/StatsCounter';
import PriceIncomeSection from './components/sections/PriceIncomeSection';
import RentBurdenSection from './components/sections/RentBurdenSection';
import MortgageSection from './components/sections/MortgageSection';
import GenerationsSection from './components/sections/GenerationsSection';
import HomelessnessSection from './components/sections/HomelessnessSection';
import HumanCostSection from './components/sections/HumanCostSection';
import WhoBrekeItSection from './components/sections/WhoBrekeItSection';
import WallStreetSection from './components/sections/WallStreetSection';
import ZoningSection from './components/sections/ZoningSection';
import AlternativesSection from './components/sections/AlternativesSection';
import GlobalModelsSection from './components/sections/GlobalModelsSection';
import ReformSection from './components/sections/ReformSection';
import ShareSection from './components/sections/ShareSection';
import { Footer } from './components/layout/Footer';

export default function App() {
  return (
    <LanguageProvider>
      <Navigation />
      <main>
        <Hero />
        <StatsCounter />
        <PriceIncomeSection />
        <RentBurdenSection />
        <MortgageSection />
        <GenerationsSection />
        <HomelessnessSection />
        <HumanCostSection />
        <WhoBrekeItSection />
        <WallStreetSection />
        <ZoningSection />
        <AlternativesSection />
        <GlobalModelsSection />
        <ReformSection />
        <ShareSection />
      </main>
      <Footer />
    </LanguageProvider>
  );
}
