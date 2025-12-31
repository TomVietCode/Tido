import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
import { UserStatus } from "@/types/enums"

interface IUser {
  id: string
  email: string
  fullName: string
  role: UserRole
  status: UserStatus
  avatarUrl: string
  access_token: string
}
declare module "next-auth/jwt" {
  interface JWT {
    access_token: string
    user: IUser
    access_expire: number
    error: string
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: IUser
    access_token: string
    access_expire: number
    error: string
  }
}
