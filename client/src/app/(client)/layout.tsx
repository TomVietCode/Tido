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
    <div
      className={`min-h-full w-full flex flex-col overflow-hidden ${beVietnam.className}`}
    >
      <div className="sticky top-0 z-50 shrink-0">
        <Header />
      </div>
      <main className="flex flex-1 pt-14">{children}</main>
      <div className="shrink-0 z-50">
        <Footer />
      </div>
    </div>
  );
}
