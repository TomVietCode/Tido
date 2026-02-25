"use client"

import useSWRInfinite from "swr/infinite"
import { PostListResponse } from "@/types/post"
import PostCard from "@/components/posts/list/PostCard"
import PostCardSkeleton from "@/components/posts/list/PostCardSkeleton"
import { Button } from "@/components/ui/button"
import { Loader2, SearchX } from "lucide-react"
import { buildQueryString } from "@/lib/utils"

interface PostListClientProps {
  initialData: PostListResponse
  searchParams: Record<string, string | undefined>
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL

const fetcher = async (url: string): Promise<PostListResponse> => {
  const res = await fetch(`${API_BASE}${url}`)
  const json = await res.json()
  if (!res.ok) throw new Error("Có lỗi khi tải dữ liệu")
  return json.data
}

export default function PostListClient({
  initialData,
  searchParams,
}: PostListClientProps) {
  const baseQuery = buildQueryString(searchParams)

  const getKey = (pageIndex: number, prev: PostListResponse | null) => {
    if (prev && !prev.meta.hasNextPage) return null

    const params = new URLSearchParams(baseQuery)
    if (pageIndex > 0 && prev?.meta.nextCursor) {
      params.set("cursor", prev.meta.nextCursor)
    }
    const qs = params.toString()
    return `/posts${qs ? `?${qs}` : ""}`
  }

  const { data, size, setSize, isValidating } = useSWRInfinite(getKey, fetcher, {
    fallbackData: [initialData],
    revalidateFirstPage: false,
    revalidateOnFocus: false,
  })

  const pages = data ?? [initialData]
  const posts = pages.flatMap((page) => page.data)
  const hasNextPage = pages[pages.length - 1]?.meta.hasNextPage ?? false
  const isLoadingMore = isValidating && size > 1

  if (posts.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-20 text-muted-foreground">
        <div className="rounded-full bg-muted p-5 mb-5">
          <SearchX className="h-10 w-10" />
        </div>
        <p className="text-lg font-semibold text-foreground">
          Không tìm thấy bài đăng nào
        </p>
        <p className="text-sm mt-1.5 max-w-xs text-center">
          Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem kết quả khác
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {isLoadingMore
          ? Array.from({ length: 4 }, (_, i) => <PostCardSkeleton key={`skel-${i}`} />)
          : null}
      </div>

      {hasNextPage ? (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            size="lg"
            disabled={isLoadingMore}
            onClick={() => setSize(size + 1)}
            className="min-w-[200px] cursor-pointer"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Đang tải...
              </>
            ) : (
              "Xem thêm"
            )}
          </Button>
        </div>
      ) : posts.length > 0 ? (
        <p className="text-center text-sm text-muted-foreground mt-8">
          Đã hiển thị tất cả bài đăng
        </p>
      ) : null}
    </div>
  )
}
