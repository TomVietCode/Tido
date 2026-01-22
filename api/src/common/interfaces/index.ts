import { CategoryStatus, Role, UserStatus } from '@common/enums'

export * from './chat'
export interface BackendResponse<T> {
  statusCode: number
  message: string
  data?: T
  error?: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    fullName: string
    role: Role
    status: UserStatus
    avatarUrl?: string
  }
  access_token: string
}

export interface JwtPayload {
  sub: string
  role: string
}

export interface IUserPayload {
  id: string
  role: Role
}

export interface Category {
  id: number
  name: string
  slug: string
  iconCode?: string
  status: CategoryStatus
  createdAt: Date
  updatedAt: Date
}

export interface GetPresignedUrlResponse {
  uploadUrl: string
  uploadedUrl: string
}
