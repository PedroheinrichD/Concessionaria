import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import StockPreview from "@/components/home/StockPreview";
import CinematicSection from "@/components/home/CinematicSection";
import Benefits from "@/components/home/Benefits";
import FinalCTA from "@/components/home/FinalCTA";
import { getFeaturedVehicles, getVehicles } from "@/lib/vehicles";

export default async function Home() {
  const featured = await getFeaturedVehicles(3);
  const stockPreview = (await getVehicles()).slice(0, 4);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedVehicles vehicles={featured} />
        <StockPreview vehicles={stockPreview} />
        <CinematicSection />
        <Benefits />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
