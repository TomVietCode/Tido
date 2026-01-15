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
    <div className={`min-h-screen w-full flex flex-col ${beVietnam.className}`}>
      <Header />
      <main className="flex-1 overflow-auto pt-14">{children}</main>
      <Footer />
    </div>
  );
}
