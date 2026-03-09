import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { HttpError, sendRequest } from "@/lib/helpers/api"
import { IUser } from "@/types/next-auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials): Promise<IUser | null> => {
        const { email, password } = credentials
        const res = await sendRequest<IBackendRes<IAuth>>({
          url: "/auth/signin",
          method: "POST",
          body: { email, password },
        })

        if (res.statusCode === 200) {
          const user = { ...res.data?.user, access_token: res.data?.access_token }
          return user as IUser
        } else {
          throw new Error("Invalid credentials")
        }
      },
    }),
    Credentials({
      id: "google-oauth",
      credentials: { token: {}, user: {} },
      authorize: async (credentials): Promise<IUser | null> => {
        const token = credentials.token as string
        const userStr = credentials.user as string
        if (!token || !userStr) return null
        const user = JSON.parse(userStr) as IUser
        return { ...user, access_token: token } as IUser
      },
    }),
    Credentials({
      id: "admin-credentials",
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials): Promise<IUser | null> => {
        const { email, password } = credentials

        try {
          const res = await sendRequest<IBackendRes<IAuth>>({
            url: "/auth/admin/login",
            method: "POST",
            body: { email, password },
          })

          if (res.statusCode === 200 && res.data) {
            const user = { ...res.data.user, access_token: res.data.access_token }
            return user as IUser
          }

          throw new Error("INVALID_CREDENTIALS")
        } catch (error) {
          if (error instanceof HttpError && error.status === 403) {
            throw new Error("FORBIDDEN")
          }

          throw new Error("INVALID_CREDENTIALS")
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = user as IUser
      }
      if (trigger === "update" && session?.user) {
        token.user = { ...token.user, ...session.user }
      }
      return token
    },
    session({ session, token }) {
      ;(session.user as IUser) = token.user
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
})
