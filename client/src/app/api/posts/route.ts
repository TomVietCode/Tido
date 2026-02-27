import { getPosts } from "@/lib/actions/post.action";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const paramsObj = Object.fromEntries(req.nextUrl.searchParams.entries())
  const data = await getPosts(paramsObj)
  return NextResponse.json(data)
}