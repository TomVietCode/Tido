import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { UserRole } from "@/types/enums"

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname

  if (path === "/admin/login") {
    return NextResponse.next()
  }

  const session = await auth()
  const userRole = session?.user?.role

  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", req.url))
  }

  if (userRole !== UserRole.ADMIN) {
    return NextResponse.redirect(new URL("/admin/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
