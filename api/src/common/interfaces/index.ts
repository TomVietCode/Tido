import { CategoryStatus, PostStatus, PostType, Role, UserStatus } from "@src/common/enums"

export interface BackendResponse<T> {
  statusCode: number
  message: string 
  data?: T
  error?: string
}

export interface AuthResponse {
  user: {
    id: string,
    email: string,
    fullName: string,
    role: Role,
    status: UserStatus
    avatarUrl?: string,
  },
  access_token: string,
}

export interface JwtPayload {
  sub: string,
  role: string
}

export interface Category {
  id: number,
  name: string,
  slug: string,
  iconCode?: string,
  status: CategoryStatus,
  createdAt: Date,
  updatedAt: Date,
}

export interface Post {
  id: string
  userId: string
  categoryId: string | number
  title: string
  description: string
  images: string[]
  type: PostType
  status: PostStatus
  hasReward?: boolean
  securityQuestion?: string 
  contactVisible: boolean 
  happenedAt: Date | string      
  createdAt: Date | string     
  updatedAt: Date | string     
}


export interface GetPresignedUrlResponse {
  uploadUrl: string,
  uploadedUrl: string,
}