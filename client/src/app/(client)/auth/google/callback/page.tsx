"use client"

import { useEffect, Suspense } from "react" // 1. Import Suspense
import { useSearchParams, useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"

// Tách logic chính ra một component riêng
function GoogleCallbackHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const handleSignIn = async () => {
      const token = searchParams.get("token")
      const userB64 = searchParams.get("user")
      const error = searchParams.get("error")

      if (!token || !userB64 || error) {
        toast.error(error || "Đăng nhập thất bại")
        router.push("/")
        return
      }

      try {
        const user = JSON.parse(Buffer.from(userB64, "base64").toString("utf-8"))
        await signIn("google-oauth", {
          redirect: true,
          callbackUrl: "/",
          token,
          user: JSON.stringify(user),
        })
      } catch (e) {
        toast.error("Dữ liệu người dùng không hợp lệ")
        router.push("/")
      }
    }

    handleSignIn()
  }, [searchParams, router])

  return (
    <main className="flex w-full items-center justify-center gap-2">
      <Spinner />
      <h1>Đang đăng nhập bằng Google...</h1>
    </main>
  )
}

// Export chính phải được bọc trong Suspense
export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <main className="flex w-full items-center justify-center gap-2">
        <Spinner />
        <h1>Đang tải...</h1>
      </main>
    }>
      <GoogleCallbackHandler />
    </Suspense>
  )
}