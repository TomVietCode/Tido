import * as z from "zod"

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/heic"]

export const lostFormSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống").max(100, "Tiêu đề không được quá 100 ký tự"),
  categoryId: z.number("Vui lòng chọn danh mục"),
  description: z.string().max(1000, "Mô tả không được quá 1000 ký tự"),
  files: z
    .array(z.any())
    .min(0)
    .max(5, "Chỉ được phép tải lên tối đa 5 ảnh")
    .refine(
      (files) => files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      "Chỉ chấp nhận định dạng .jpg, .jpeg, .png và .heic"
    ),
  happenedAt: z.string().optional(),
  location: z.string().optional(),
  contactVisible: z.boolean().default(false).optional(),
  hasReward: z.boolean().default(false).optional(),
})

export const foundFormSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống").max(100, "Tiêu đề không được quá 100 ký tự"),
  categoryId: z.number("Vui lòng chọn danh mục"),
  description: z.string().max(1000, "Mô tả không được quá 1000 ký tự"),
  securityQuestion: z.string().optional(),
  files: z
    .array(z.any())
    .min(0)
    .max(5, "Chỉ được phép tải lên tối đa 5 ảnh")
    .refine(
      (files) => files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      "Chỉ chấp nhận định dạng .jpg, .jpeg, .png và .heic"
    ),
  happenedAt: z.string().optional(),
  location: z.string().optional(),
  contactVisible: z.boolean().default(false).optional(),
})

export type LostFormValues = z.infer<typeof lostFormSchema>
export type FoundFormValues = z.infer<typeof foundFormSchema>
