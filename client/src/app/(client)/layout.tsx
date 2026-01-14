// client/src/app/(client)/layout.tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Be_Vietnam_Pro } from "next/font/google";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`min-h-screen w-full relative ${beVietnam.className}`}>
      {/* Radial Gradient Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #fff 40%, #6366f1 100%)",
        }}
      />
      <div className="Container mx-auto relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}