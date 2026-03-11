"use client"

import { useState } from "react"
import FilterBar from "@/components/posts/list/FilterBar"
import PostListClient from "@/components/posts/list/PostListClient"
import ImageSearchResults from "@/components/posts/list/ImageSearchResults"
import { Category } from "@/types/category"
import { PostListResponse, ImageSearchResponse } from "@/types/post"

interface PostPageClientProps {
  categories: Category[]
  initialData: PostListResponse
  searchParams: Record<string, string | undefined>
}

export default function PostPageClient({ categories, initialData, searchParams }: PostPageClientProps) {
  const [imageSearchResults, setImageSearchResults] = useState<ImageSearchResponse | null>(null)
  const [queryImageUrl, setQueryImageUrl] = useState<string | null>(null)

  const handleImageSearchResults = (results: ImageSearchResponse, previewUrl: string) => {
    setImageSearchResults(results)
    setQueryImageUrl(previewUrl)
  }

  const handleClearImageSearch = () => {
    setImageSearchResults(null)
    setQueryImageUrl(null)
  }

  return (
    <div className="flex w-full min-h-[calc(100svh-4rem)] flex-col">
      <FilterBar
        categories={categories}
        onImageSearchResults={handleImageSearchResults}
        isImageSearchActive={imageSearchResults !== null}
        onClearImageSearch={handleClearImageSearch}
      />

      <div className="flex flex-1 flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {imageSearchResults && queryImageUrl ? (
          <ImageSearchResults
            results={imageSearchResults}
            queryImageUrl={queryImageUrl}
            onClear={handleClearImageSearch}
          />
        ) : (
          <PostListClient initialData={initialData} searchParams={searchParams} />
        )}
      </div>
    </div>
  )
}
