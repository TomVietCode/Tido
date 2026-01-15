import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTriangle, HandHeart } from "lucide-react";

export default function HeroSection() {
  return (
    <main className="min-h-full flex items-center justify-center mt-20">
      <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-24">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          Nền tảng hỗ trợ tìm kiếm đồ thất lạc
        </h1>
        <h2 className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          Nhanh chóng - An toàn - Tin cậy
        </h2>
        <div className="mx-auto mt-10 flex max-w-sm flex-col items-center justify-center gap-4 sm:flex-row">
          {/* Tôi bị mất đồ */}
          <Button
            variant="destructive"
            asChild
            className="w-45 md:w-48 h-12 px-5 font-bold gap-2 shadow-[0_0_20px_rgba(239,68,68,0.6)] hover:shadow-[0_0_30px_rgba(239,68,68,0.9)] transition-shadow"
          >
            <Link href="/posts?lost">
              <AlertTriangle className="h-5 w-5" />
              Tôi bị mất đồ
            </Link>
          </Button>

          <Button
            variant="default"
            asChild
            className="w-45 md:w-48 h-12 px-5 font-bold gap-2 shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:shadow-[0_0_30px_rgba(59,130,246,0.9)] transition-shadow"
          >
            <Link href="/posts?found">
              <HandHeart className="h-5 w-5" />
              Tôi nhặt được đồ
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
