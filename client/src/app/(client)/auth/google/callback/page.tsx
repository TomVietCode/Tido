"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleSignIn = async () => {
    const token = searchParams.get("token")
    const userB64 = searchParams.get("user")
    const error = searchParams.get("error")
    if (!token || !userB64 || error) {
      toast.error(error || "Đăng nhập thất bại")
      router.push("/")
      return
    }
    const user = JSON.parse(Buffer.from(userB64, "base64").toString("utf-8"))
    await signIn("google-oauth", {
      redirect: true,
      callbackUrl: "/",
      token,
      user: JSON.stringify(user),
    })
  }
  useEffect(() => {
    handleSignIn()
  }, [searchParams, router])

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Spinner />
      <h1>Đang đăng nhập bằng Google...</h1>
    </main>
  )
}