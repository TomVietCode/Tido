// client/src/app/(client)/layout.tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Be_Vietnam_Pro } from "next/font/google";
import { SocketProvider } from "@/lib/contexts/SocketContext";
import { auth } from "@/auth";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export default async function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  return (
    <SocketProvider token={session?.user?.access_token}>
      <div
        className={`min-h-full w-full flex flex-col overflow-hidden ${beVietnam.className}`}
      >
        <div className="sticky top-0 z-50 shrink-0">
          <Header />
        </div>
        <main className="flex flex-1 justify-center pt-14">{children}</main>
        <div className="shrink-0 z-50">
          <Footer />
        </div>
      </div>
    </SocketProvider>
  );
}
