import { Provider, Role, UserStatus } from "@/common/enums"

export interface User {
  id: string
  email: string
  fullName: string
  avatarUrl: string | null
  password: string | null
  googleId: string | null
  phoneNumber: string | null
  role: Role
  provider: Provider
  status: UserStatus
  createdAt: Date
  updatedAt: Date
}

export interface UserResponse extends Omit<User, 'password'> {}