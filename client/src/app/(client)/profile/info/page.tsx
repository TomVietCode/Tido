"use client";

import { getUserProfile, updateUserProfile } from "@/lib/actions/user.action";
import { LockKeyhole, Pencil, Save } from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "@/components/ui/Loading";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  profileInfoSchema,
  ProfileInfoValues,
} from "@/lib/schemas/profile.schema";
import FormErrorMessage from "@/components/ui/form-error-message";

const formatDate = (isoDate?: string) => {
  if (!isoDate) return "Chưa cập nhật";
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(isoDate));
  } catch (error) {
    return "Chưa cập nhật";
  }
};

const InfoField = ({
  label,
  value,
  placeholder,
  locked,
  isEditing,
  inputProps,
  error,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  locked?: boolean;
  isEditing?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  error?: any;
}) => (
  <div className="space-y-2">
    <p className="text-sm font-semibold text-slate-700">{label}</p>
    {isEditing && !locked ? (
      <input
        {...inputProps}
        type="text"
        placeholder={placeholder || "Chưa cập nhật"}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
          error ? "border-destructive" : "border-slate-300"
        }`}
      />
    ) : (
      <div className="relative rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-[0_1px_0_rgba(15,23,42,0.03)]">
        <span>
          {value && value.trim() ? value : placeholder || "Chưa cập nhật"}
        </span>
        {locked && (
          <span className="absolute inset-y-0 right-4 flex items-center text-slate-400">
            <LockKeyhole className="w-5 h-5" />
          </span>
        )}
      </div>
    )}
    <FormErrorMessage error={error} />
  </div>
);

export default function ProfileInfoPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { register, handleSubmit, formState, reset, watch } =
    useForm<ProfileInfoValues>({
      resolver: zodResolver(profileInfoSchema),
      defaultValues: {
        fullName: "",
        phoneNumber: "",
        facebookUrl: "",
      },
    });

  useEffect(() => {
    getUserProfile().then((data) => {
      setUser(data);
      reset({
        fullName: data.fullName || "",
        phoneNumber: data.phoneNumber || "",
        facebookUrl: data.facebookUrl || "",
      });
    });
  }, [reset]);

  const handleSave = async (values: ProfileInfoValues) => {
    setIsSaving(true);
    try {
      const payload = {
        fullName: values.fullName,
        phoneNumber: values.phoneNumber || undefined,
        facebookUrl: values.facebookUrl || undefined,
      };
      const updatedUser = await updateUserProfile(payload);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return <Loading message="Đang tải thông tin cá nhân..." />;

  const avatarUrl =
    user.avatarUrl ||
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=facearea&w=240&q=80";

  const fullNameValue = watch("fullName");
  const phoneNumberValue = watch("phoneNumber");
  const facebookUrlValue = watch("facebookUrl");

  return (
    <form onSubmit={handleSubmit(handleSave)} className="w-full">
      <div className="w-full flex items-start justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Thông tin cá nhân</h1>
        <button
          type={isEditing ? "submit" : "button"}
          onClick={(e) => {
            if (!isEditing) {
              e.preventDefault();
              setIsEditing(true);
            }
          }}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-primary/90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isEditing ? "Lưu thông tin" : "Chỉnh sửa thông tin"}
        >
          {isSaving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Đang lưu...
            </>
          ) : isEditing ? (
            <>
              <Save className="h-4 w-4" />
              Lưu
            </>
          ) : (
            <>
              <Pencil className="h-4 w-4" />
              Chỉnh sửa
            </>
          )}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8">
          {/* Avatar Section */}
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="relative h-24 w-24 mb-3">
              <img
                src={avatarUrl}
                alt={user.fullName || "Avatar"}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 text-center mb-2">
              {isEditing ? fullNameValue : user.fullName}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                {user.role}
              </span>
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                {user.status}
              </span>
            </div>
          </div>

          {/* Info Fields - 2 Columns */}
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField
                label="Họ và tên"
                value={fullNameValue}
                isEditing={isEditing}
                inputProps={register("fullName")}
                error={formState.errors.fullName}
              />
              <InfoField
                label="Số điện thoại"
                value={phoneNumberValue}
                isEditing={isEditing}
                inputProps={register("phoneNumber")}
                error={formState.errors.phoneNumber}
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField label="Email" value={user.email} locked />
              <InfoField
                label="Ngày tạo tài khoản"
                value={formatDate(user.createdAt)}
                locked
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField
                label="Facebook URL"
                value={facebookUrlValue}
                isEditing={isEditing}
                inputProps={register("facebookUrl")}
                error={formState.errors.facebookUrl}
                placeholder="https://facebook.com/yourprofile"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
