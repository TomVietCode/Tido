'use client'
import { Button } from "@/components/ui/button"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-xl font-bold">Ối! Có lỗi gì đó rồi</h2>
      <p className="text-gray-500 mb-4">{error.message}</p>
      <Button onClick={() => reset()}>Thử lại</Button>
    </div>
  )
}