// app/page.tsx
import HeroSection from "@/components/home/HeroSection";
import ItemGrid from "@/components/home/ItemGrid";
import { Be_Vietnam_Pro } from "next/font/google"

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
})

export default function HomePage() {
  return (
    <div className={`${beVietnam.className}`}>
      {/* Content Container */}
      <HeroSection />
      
      {/* Content Container */}
      <ItemGrid />

    </div>
  );
}