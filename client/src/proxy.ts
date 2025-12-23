// middleware.ts
import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { UserRole } from "@/types/enums"

export default auth((req) => {
  const path = req.nextUrl.pathname
  const userRole = req.auth?.user?.role

  if (path.startsWith("/admin") && userRole !== UserRole.ADMIN) {
    return NextResponse.redirect(new URL("/not-found", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth|verify|$).*)"],
}
