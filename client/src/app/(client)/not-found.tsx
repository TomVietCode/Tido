import { Button } from "@/components/ui/button"
import Link from "next/link"
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-xl font-bold">Không tìm thấy trang</h2>
      <p className="text-gray-500 mb-4">Trang bạn đang tìm kiếm không tồn tại</p>
      <Button>
        <Link href="/">Quay về trang chủ</Link>
      </Button>
    </div>
  )
}