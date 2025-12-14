import { Role } from "@/common/enums"

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
  },
  access_token: string,
}

export interface JwtPayload {
  sub: string,
  role: string
}