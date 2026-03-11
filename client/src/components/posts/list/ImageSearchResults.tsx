"use client"

import { ImageSearchResponse, ImageSearchPostItem } from "@/types/post"
import PostCard from "@/components/posts/list/PostCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ImageIcon, SearchX } from "lucide-react"

interface ImageSearchResultsProps {
  results: ImageSearchResponse
  queryImageUrl: string
  onClear: () => void
}

export default function ImageSearchResults({
  results,
  queryImageUrl,
  onClear,
}: ImageSearchResultsProps) {
  if (results.data.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-20 text-muted-foreground">
        <div className="rounded-full bg-muted p-5 mb-5">
          <SearchX className="h-10 w-10" />
        </div>
        <p className="text-lg font-semibold text-foreground">
          Không tìm thấy bài đăng tương tự hình ảnh của bạn
        </p>
        <p className="text-sm mt-1.5 max-w-xs text-center">
          Thử tìm kiếm với ảnh khác hoặc quay lại danh sách bài đăng
        </p>
        <Button
          variant="outline"
          onClick={onClear}
          className="mt-6 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại danh sách
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header result */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Thumbnail image */}
          <div className="h-16 w-16 rounded-lg overflow-hidden border bg-muted shrink-0">
            <img
              src={queryImageUrl}
              alt="Ảnh tìm kiếm"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-foreground">
                Kết quả tìm kiếm bằng ảnh
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Tìm thấy {results.total} bài đăng tương tự
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={onClear}
          className="rounded-full cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại danh sách
        </Button>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {results.data.map((post: ImageSearchPostItem) => (
          <div key={post.id} className="relative">
            <PostCard post={post} />
            {/* Badge display similarity percentage */}
            <Badge
              className="absolute top-35 left-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-primary/90 text-white
                         text-xs font-medium px-2 py-0.5 pointer-events-none"
            >
              {Math.round(post.similarity * 100)}% tương đồng
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}