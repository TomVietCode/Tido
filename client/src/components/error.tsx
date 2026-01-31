"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-6 flex items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Có lỗi xảy ra
        </h1>
        <p className="text-slate-600 mb-4">
          Vui lòng đăng nhập để xem trang này hoặc thử lại.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-primary px-6 py-2 font-semibold text-white hover:bg-primary/90"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}
