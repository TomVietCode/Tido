import { z } from "zod"

export const SignUpSchema = z
  .object({
    fullName: z.string().min(2, { message: "Tên phải có ít nhất 2 ký tự" }),
    email: z.email({ message: "Email không hợp lệ" }),
    password: z.string("Mật khẩu không hợp lệ").min(6, { message: "Mật khẩu tối thiểu 6 ký tự" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["confirmPassword"],
  })

export const SignInSchema = z.object({
  email: z.email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu tối thiểu 6 ký tự" }),
})
// Tạo kiểu dữ liệu từ Schema
export type SignUpValues = z.infer<typeof SignUpSchema>
export type SignInValues = z.infer<typeof SignInSchema>
