import * as z from "zod";

const optionalUrl = z
  .union([z.string().url("URL không hợp lệ"), z.literal("")])
  .optional();

export const profileInfoSchema = z.object({
  fullName: z.string().min(1, "Họ và tên không được để trống"),
  phoneNumber: z.string().optional().or(z.literal("")),
  facebookUrl: optionalUrl,
});

export type ProfileInfoValues = z.infer<typeof profileInfoSchema>;
