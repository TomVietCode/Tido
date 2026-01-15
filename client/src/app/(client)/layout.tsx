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
    <div className={`min-h-dvh w-full relative ${beVietnam.className}`}>
      <div className="Container mx-auto relative z-10 flex min-h-dvh flex-col">
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </div>
    </div>
  );
}