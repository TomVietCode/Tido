"use client"

import { useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Camera, Pencil } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import FormErrorMessage from "@/components/ui/form-error-message"

import { profileFormSchema, type ProfileFormValues } from "@/lib/schemas/user.schema"
import { getProfile, updateProfile } from "@/lib/actions/user.action"
import { getPresignedUrl } from "@/lib/actions/upload.action"
import type { UserProfile } from "@/types/user"

export default function ProfilePage() {
  const { update: updateSession } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      facebookUrl: "",
    },
  })

  useEffect(() => {
    loadProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      const data = await getProfile()
      setProfile(data)
      form.reset({
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber ?? "",
        facebookUrl: data.facebookUrl ?? "",
      })
    } catch {
      toast.error("Không thể tải thông tin cá nhân")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh không được vượt quá 5MB")
      return
    }

    try {
      setIsUploadingAvatar(true)

      const { uploadUrl, uploadedUrl } = await getPresignedUrl(
        file.name,
        file.type,
        "avatars"
      )

      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      })

      const updated = await updateProfile({ fullName: profile!.fullName, avatarUrl: uploadedUrl })
      setProfile(updated)
      await updateSession()
      toast.success("Cập nhật ảnh đại diện thành công")
    } catch {
      toast.error("Cập nhật ảnh đại diện thất bại")
    } finally {
      setIsUploadingAvatar(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const updated = await updateProfile({
        fullName: values.fullName,
        phoneNumber: values.phoneNumber || undefined,
        facebookUrl: values.facebookUrl || undefined,
      })
      setProfile(updated)
      setIsEditing(false)
      await updateSession()
      toast.success("Cập nhật thông tin thành công")
    } catch {
      toast.error("Cập nhật thông tin thất bại")
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (profile) {
      form.reset({
        fullName: profile.fullName,
        email: profile.email,
        phoneNumber: profile.phoneNumber ?? "",
        facebookUrl: profile.facebookUrl ?? "",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Không thể tải thông tin cá nhân
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card p-6 space-y-8">
      <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>

      {/* Avatar section */}
      <div className="flex justify-center">
        <div className="relative group">
          <Avatar className="h-28 w-28">
            <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
            <AvatarFallback className="text-3xl">
              {profile.fullName?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <button
            type="button"
            onClick={handleAvatarClick}
            disabled={isUploadingAvatar}
            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            {isUploadingAvatar ? (
              <Spinner className="h-6 w-6 text-white" />
            ) : (
              <Camera className="h-6 w-6 text-white" />
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Display mode / Edit mode */}
      {!isEditing ? (
        <div className="space-y-4">
          <InfoRow label="Họ tên" value={profile.fullName} />
          <InfoRow label="Email" value={profile.email} />
          <InfoRow label="Số điện thoại" value={profile.phoneNumber || "Chưa cập nhật"} />
          <InfoRow label="Facebook" value={profile.facebookUrl || "Chưa cập nhật"} />

          <Button onClick={() => setIsEditing(true)} className="mt-4">
            <Pencil className="h-4 w-4 mr-2" />
            Cập nhật thông tin
          </Button>
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <Label htmlFor="fullName">Họ tên *</Label>
            <Input id="fullName" {...form.register("fullName")} />
            <FormErrorMessage error={form.formState.errors.fullName} />
          </div>

          {/* Email (disabled) */}
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" {...form.register("email")} disabled />
            <FormErrorMessage error={form.formState.errors.email} />
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <Label htmlFor="phoneNumber">Số điện thoại</Label>
            <Input
              id="phoneNumber"
              placeholder="VD: 0912345678"
              {...form.register("phoneNumber")}
            />
            <FormErrorMessage error={form.formState.errors.phoneNumber} />
          </div>

          {/* Facebook URL */}
          <div className="space-y-1">
            <Label htmlFor="facebookUrl">Facebook</Label>
            <Input
              id="facebookUrl"
              placeholder="https://facebook.com/username"
              {...form.register("facebookUrl")}
            />
            <FormErrorMessage error={form.formState.errors.facebookUrl} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Spinner className="h-4 w-4 mr-2" />}
              Lưu thay đổi
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-2 items-center">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}
