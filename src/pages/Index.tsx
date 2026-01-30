import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { CategorySection } from '@/components/home/CategorySection';
import { MensFashionSection } from '@/components/home/MensFashionSection';
import { StyleShowcase } from '@/components/home/StyleShowcase';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { PromoSection } from '@/components/home/PromoSection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <CategorySection />
        <MensFashionSection />
        <StyleShowcase />
        <FeaturedProducts />
        <PromoSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
