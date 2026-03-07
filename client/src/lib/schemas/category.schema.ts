import { z } from "zod"

export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, "Tên danh mục không được để trống")
    .max(100, "Tên danh mục không được quá 100 ký tự"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  iconCode: z.string().optional(),
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>
