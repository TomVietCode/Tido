import HeroSection from "@/components/home/HeroSection";

export default function HomePage() {
  return (
    <div className=" w-full relative overflow-hidden">
      {/* Radial Gradient Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #fff 40%, #6366f1 100%)",
        }}
      />
      <div className="relative z-10 min-h-[90vh] overflow-hidden">
        <HeroSection />
      </div>
    </div>
  );
}
