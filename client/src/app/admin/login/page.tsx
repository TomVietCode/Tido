"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { HttpError, sendRequest } from "@/lib/helpers/api"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Loader2 } from "lucide-react"

const AdminLoginSchema = z.object({
  email: z.email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu tối thiểu 6 ký tự" }),
})

type AdminLoginValues = z.infer<typeof AdminLoginSchema>

export default function AdminLoginPage() {
  const router = useRouter()
  const form = useForm<AdminLoginValues>({
    resolver: zodResolver(AdminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: AdminLoginValues) => {
    try {
      await sendRequest<IBackendRes<IAuth>>({
        url: "/auth/admin/login",
        method: "POST",
        body: values,
      })

      const result = await signIn("admin-credentials", {
        ...values,
        redirect: false,
      })

      if (result?.ok && !result.error) {
        toast.success("Đăng nhập quản trị thành công")
        router.push("/admin/dashboard")
        router.refresh()
        return
      }

      toast.error("Không thể tạo phiên đăng nhập")
    } catch (error) {
      if (error instanceof HttpError && error.status === 403) {
        toast.error("Không có quyền truy cập")
        return
      }

      toast.error("Tài khoản hoặc mật khẩu không đúng")
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl mx-auto">Đăng nhập trang quản trị</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@example.com"
                        autoComplete="email"
                        disabled={form.formState.isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        placeholder="******"
                        autoComplete="current-password"
                        disabled={form.formState.isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Đang đăng nhập...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  )
}
