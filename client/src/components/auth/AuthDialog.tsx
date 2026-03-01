"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { FcGoogle } from "react-icons/fc"
import { SignInSchema, SignInValues, SignUpSchema, SignUpValues } from "@/lib/schemas/auth.schema"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Spinner } from "../ui/spinner"
import { signInAction, signUpAction } from "@/lib/actions/auth.action"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

interface AuthDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

export default function AuthDialog({ open, onOpenChange, trigger }: AuthDialogProps) {
  const { update } = useSession()
  const router = useRouter()
  const [authMode, setAuthMode] = useState<string | null>(null)

  const isOpen = open !== undefined ? open : authMode !== null
  const handleOpenChange = (val: boolean) => {
    if (!val) {
      setAuthMode(null)
      onOpenChange?.(false)
    }
  }

  // Open from outside
  useEffect(() => {
    if (open && authMode === null) {
      setAuthMode("signIn")
      signInForm.reset()
    }
  }, [open])

  const OpenSignIn = () => {
    setAuthMode("signIn")
    signInForm.reset()
    signUpForm.reset()
  }
  const OpenSignUp = () => {
    setAuthMode("signUp")
    signInForm.reset()
    signUpForm.reset()
  }
  const closeDialog = () => {
    setAuthMode(null)
    onOpenChange?.(false)
  }

  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })
  const signInForm = useForm<SignInValues>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSignUpSubmit = async (data: SignUpValues) => {
    try {
      await signUpAction(data)
      toast.success("Đăng ký tài khoản thành công!")
      signUpForm.reset()
      closeDialog()
      await update()
      router.push("/profile")
    } catch (error: any) {
      toast.error(error.message ?? "Có lỗi xảy ra, vui lòng thử lại sau.")
    }
  }

  const onSignInSubmit = async (data: SignInValues) => {
    const res = await signInAction(data)
    if (res.statusCode === 200) {
      toast.success(res.message)
      signInForm.reset()
      closeDialog()
      await update()
      router.refresh()
    } else {
      toast.error(res.message ?? "Có lỗi xảy ra, vui lòng thử lại sau.")
    }
  }

  const handleOauth = async (event: any) => {
    event.preventDefault()
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {open === undefined && (
        <DialogTrigger asChild>
          {trigger ?? (
            <div className="flex gap-2">
              <Button className="cursor-pointer" onClick={OpenSignUp} variant="outline">
                Đăng ký
              </Button>
              <Button className="cursor-pointer" onClick={OpenSignIn}>
                Đăng nhập
              </Button>
            </div>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        {authMode === "signUp" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex justify-center">Đăng ký tài khoản mới</DialogTitle>
            </DialogHeader>

            <Form {...signUpForm}>
              <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-1">
                {/* FullName */}
                <FormField
                  control={signUpForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và Tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nguyễn Văn A" {...field} disabled={signUpForm.formState.isSubmitting} />
                      </FormControl>
                      <div className="h-5 flex items-center">
                        <FormMessage className="text-xs" />
                      </div>
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={signUpForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="email@example.com"
                          {...field}
                          disabled={signUpForm.formState.isSubmitting}
                        />
                      </FormControl>
                      <div className="h-5 flex items-center">
                        <FormMessage className="text-xs" />
                      </div>
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={signUpForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="******"
                          {...field}
                          disabled={signUpForm.formState.isSubmitting}
                        />
                      </FormControl>
                      <div className="h-5 flex items-center">
                        <FormMessage className="text-xs" />
                      </div>
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={signUpForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhập lại mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="******"
                          {...field}
                          disabled={signUpForm.formState.isSubmitting}
                        />
                      </FormControl>
                      <div className="h-5 flex items-center">
                        <FormMessage className="text-xs" />
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-3 pt-2">
                  <Button type="submit" className="w-full" disabled={signUpForm.formState.isSubmitting}>
                    {signUpForm.formState.isSubmitting ? <Spinner /> : "Đăng ký"}
                  </Button>

                  <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    disabled={signUpForm.formState.isSubmitting}
                    onClick={handleOauth}
                  >
                    <FcGoogle className="mr-2 h-5 w-5" />
                    Đăng ký với Google
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    Đã có tài khoản?{" "}
                    <a onClick={OpenSignIn} className="text-primary hover:underline font-medium">
                      Đăng nhập
                    </a>
                  </p>
                </div>
              </form>
            </Form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex justify-center">Đăng nhập tài khoản của bạn</DialogTitle>
            </DialogHeader>

            <Form {...signInForm}>
              <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-1">
                {/* Email */}
                <FormField
                  control={signInForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="email@example.com"
                          {...field}
                          disabled={signInForm.formState.isSubmitting}
                        />
                      </FormControl>
                      <div className="h-5 flex items-center">
                        <FormMessage className="text-xs" />
                      </div>
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={signInForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="******"
                          {...field}
                          disabled={signInForm.formState.isSubmitting}
                        />
                      </FormControl>
                      <div className="h-5 flex items-center">
                        <FormMessage className="text-xs" />
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-3 pt-2">
                  <Button type="submit" className="w-full" disabled={signInForm.formState.isSubmitting}>
                    {signInForm.formState.isSubmitting ? <Spinner /> : "Đăng nhập"}
                  </Button>

                  <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    disabled={signInForm.formState.isSubmitting}
                    onClick={handleOauth}
                  >
                    <FcGoogle className="mr-2 h-5 w-5" />
                    Đăng nhập với Google
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    Chưa có tài khoản?{" "}
                    <a onClick={OpenSignUp} className="text-primary hover:underline font-medium">
                      Đăng ký
                    </a>
                  </p>
                </div>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
