import * as z from "zod"

const VN_PHONE_REGEX = /^(0[2-9]|84[2-9]|\+84[2-9])\d{8}$/
const FACEBOOK_URL_REGEX = /^(https?:\/\/)?(www\.)?facebook\.com\/.+$/

export const profileFormSchema = z.object({
  fullName: z
    .string()
    .min(1, "Họ tên không được để trống")
    .refine((val) => val.trim().length >= 2, "Phải có ít nhất 2 ký tự"),
  email: z.string().email(),
  phoneNumber: z
    .string()
    .optional()
    .refine((val) => !val || VN_PHONE_REGEX.test(val), "Số điện thoại không hợp lệ"),
  facebookUrl: z
    .string()
    .optional()
    .refine((val) => !val || FACEBOOK_URL_REGEX.test(val), "Facebook URL không hợp lệ"),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>
