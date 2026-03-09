"use client"

import { useState, useRef, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, Loader2, Lock, Pencil } from "lucide-react"
import { profileFormSchema, type ProfileFormValues } from "@/lib/schemas/user.schema"
import { updateProfile } from "@/lib/actions/user.action"
import { getPresignedUrl } from "@/lib/actions/upload.action"
import { uploadFile } from "@/lib/helpers/client-upload"
import { UserProfile } from "@/types/user"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

interface ProfileContentProps {
  profile: UserProfile
}

export default function ProfileContent({ profile }: ProfileContentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [currentProfile, setCurrentProfile] = useState(profile)
  const [avatarPreview, setAvatarPreview] = useState(profile.avatarUrl || "")
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { update: updateSession } = useSession()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: currentProfile.fullName,
      email: currentProfile.email,
      phoneNumber: currentProfile.phoneNumber || "",
      facebookUrl: currentProfile.facebookUrl || "",
    },
  })

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Chỉ cho phép định dạng JPG, GIF hoặc PNG")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh tối đa 5MB")
      return
    }

    setIsUploadingAvatar(true)
    try {
      const { uploadUrl, uploadedUrl } = await getPresignedUrl(file.name, file.type, "avatars")
      await uploadFile(file, uploadUrl)

      setAvatarPreview(uploadedUrl)

      const updated = await updateProfile({ fullName: currentProfile.fullName, avatarUrl: uploadedUrl })
      setCurrentProfile(updated)
      await updateSession({
        user: { avatarUrl: uploadedUrl },
      })
      toast.success("Cập nhật ảnh đại diện thành công")
    } catch {
      toast.error("Không thể tải ảnh lên, vui lòng thử lại")
      setAvatarPreview(currentProfile.avatarUrl || "")
    } finally {
      setIsUploadingAvatar(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    reset({
      fullName: currentProfile.fullName,
      email: currentProfile.email,
      phoneNumber: currentProfile.phoneNumber || "",
      facebookUrl: currentProfile.facebookUrl || "",
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    reset({
      fullName: currentProfile.fullName,
      email: currentProfile.email,
      phoneNumber: currentProfile.phoneNumber || "",
      facebookUrl: currentProfile.facebookUrl || "",
    })
  }

  const onSubmit = (data: ProfileFormValues) => {
    startTransition(async () => {
      try {
        const updated = await updateProfile({
          fullName: data.fullName,
          phoneNumber: data.phoneNumber || undefined,
          facebookUrl: data.facebookUrl || undefined,
        })
        setCurrentProfile(updated)
        setIsEditing(false)
        await updateSession({
          user: { fullName: data.fullName },
        })
        toast.success("Cập nhật thông tin thành công")
      } catch {
        toast.error("Cập nhật thất bại, vui lòng thử lại")
      }
    })
  }

  return (
    <div className="flex-1 min-w-0">
      <h1 className="text-2xl font-bold mb-6">Thông tin chung</h1>

      <div className="rounded-xl border bg-card p-8 shadow-sm">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <Avatar className="h-28 w-28">
              <AvatarImage src={avatarPreview} alt={currentProfile.fullName} />
              <AvatarFallback className="text-3xl">{currentProfile.fullName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-md transition-transform hover:scale-110 disabled:opacity-50"
            >
              {isUploadingAvatar ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Cho phép định dạng JPG, GIF hoặc PNG. Tối đa 5MB.
          </p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            {/* Họ và tên */}
            <div className="flex flex-col">
              <Label htmlFor="fullName" className="mb-2">
                Họ và tên {isEditing ? <span className="text-destructive">*</span> : ""}
              </Label>
              {isEditing ? (
                <Input
                  id="fullName"
                  {...register("fullName")}
                  aria-invalid={!!errors.fullName}
                />
              ) : (
                <p className="h-9 flex items-center px-3 text-sm">{currentProfile.fullName}</p>
              )}
              <p className="h-5 text-xs text-destructive mt-1">
                {errors.fullName?.message ?? "\u00A0"}
              </p>
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <Label htmlFor="email" className="mb-2">
                Email
              </Label>
              {isEditing ? (
                <div className="relative">
                  <Input
                    id="email"
                    {...register("email")}
                    disabled
                    className="pr-9 bg-muted"
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              ) : (
                <p className="h-9 flex items-center px-3 text-sm text-muted-foreground">{currentProfile.email}</p>
              )}
              <p className="h-5 text-xs mt-1">{"\u00A0"}</p>
            </div>

            {/* Số điện thoại */}
            <div className="flex flex-col">
              <Label htmlFor="phoneNumber" className="mb-2">
                Số điện thoại
              </Label>
              {isEditing ? (
                <Input
                  id="phoneNumber"
                  placeholder="09xx xxx xxx"
                  {...register("phoneNumber")}
                  aria-invalid={!!errors.phoneNumber}
                />
              ) : (
                <p className="h-9 flex items-center px-3 text-sm">
                  {currentProfile.phoneNumber || <span className="text-muted-foreground italic">Chưa cập nhật</span>}
                </p>
              )}
              <p className="h-5 text-xs text-destructive mt-1">
                {errors.phoneNumber?.message ?? "\u00A0"}
              </p>
            </div>

            {/* Link Facebook */}
            <div className="flex flex-col">
              <Label htmlFor="facebookUrl" className="mb-2">
                Link Facebook
              </Label>
              {isEditing ? (
                <Input
                  id="facebookUrl"
                  placeholder="facebook.com/username"
                  {...register("facebookUrl")}
                  aria-invalid={!!errors.facebookUrl}
                />
              ) : (
                <p className="h-9 flex items-center px-3 text-sm">
                  {currentProfile.facebookUrl ? (
                    <a
                      href={currentProfile.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate"
                    >
                      {currentProfile.facebookUrl}
                    </a>
                  ) : (
                    <span className="text-muted-foreground italic">Chưa cập nhật</span>
                  )}
                </p>
              )}
              <p className="h-5 text-xs text-destructive mt-1">
                {errors.facebookUrl?.message ?? "\u00A0"}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex justify-end gap-3">
            {isEditing ? (
              <>
                <Button type="button" variant="outline" onClick={handleCancel} disabled={isPending}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Lưu thay đổi
                </Button>
              </>
            ) : (
              <Button type="button" onClick={handleEdit}>
                <Pencil className="h-4 w-4" />
                Cập nhật thông tin
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
