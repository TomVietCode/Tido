import { searchPostsByImage } from "@/lib/actions/post.action"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const result = await searchPostsByImage(formData)
  return NextResponse.json(result)
}