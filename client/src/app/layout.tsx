import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://tido.page"
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Tido - Tìm đồ thất lạc", template: "%s | Tido" },
  description: "Nền tảng hỗ trợ tìm kiếm vật thất lạc.",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Tido",
    title: "Tido - Tìm đồ thất lạc",
    description: "Nền tảng hỗ trợ tìm kiếm vật thất lạc.",
    url: siteUrl,
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Tido",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tido - Tìm đồ thất lạc",
    description: "Nền tảng hỗ trợ tìm kiếm vật thất lạc.",
    images: ["/logo.jpg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <SessionProvider>
          <Toaster position="top-center" closeButton={true} className="z-50"/>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
