import { Provider, UserRole, UserStatus } from "@/types/enums"

export interface UserProfile {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
  phoneNumber?: string | null
  facebookUrl?: string | null
  role: UserRole
  provider: Provider
  status: UserStatus
  createdAt: string
  updatedAt: string
}

export interface SearchUserResponse {
  id: string
  fullName: string
  avatarUrl?: string
}

export interface AdminUserListItem {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
  phoneNumber?: string
  role: UserRole
  provider: Provider
  status: UserStatus
  createdAt: string
}