import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSiteContent } from "@/lib/useSiteContent";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Hero from "@/components/sections/Hero";
import FeaturedProperties from "@/components/sections/FeaturedProperties";
import Categories from "@/components/sections/Categories";
import AboutSection from "@/components/sections/AboutSection";
import Differentials from "@/components/sections/Differentials";
import SellSection from "@/components/sections/SellSection";
import InvestmentSection from "@/components/sections/InvestmentSection";
import Reviews from "@/components/sections/Reviews";
import CTASection from "@/components/sections/CTASection";
import Contact from "@/components/sections/Contact";

export default function Home() {
  const { content } = useSiteContent();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      setProgress(Math.min(scrolled * 100, 100));
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (filters) => {
    const params = new URLSearchParams();
    if (filters.purpose) params.set("finalidade", filters.purpose);
    if (filters.type) params.set("tipo", filters.type);
    if (filters.location) params.set("localizacao", filters.location);
    if (filters.priceRange) params.set("preco", filters.priceRange);
    navigate(`/imoveis?${params.toString()}`);
  };

  return (
    <div className="bg-obsidian min-h-screen">
      {/* Gold scroll progress */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-transparent">
        <div className="h-full gold-gradient-bg transition-all duration-150" style={{ width: `${progress}%` }} />
      </div>

      <Header content={content} />
      <main>
        <Hero content={content} />
        <FeaturedProperties content={content} onSearch={handleSearch} />
        <Categories />
        <AboutSection content={content} />
        <Differentials />
        <SellSection content={content} />
        <InvestmentSection content={content} />
        <Reviews content={content} />
        <CTASection content={content} />
        <Contact content={content} />
      </main>
      <Footer content={content} />
      <WhatsAppButton content={content} />
    </div>
  );
}
