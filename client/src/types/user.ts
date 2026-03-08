import { Provider, UserRole, UserStatus } from "@/types/enums"

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