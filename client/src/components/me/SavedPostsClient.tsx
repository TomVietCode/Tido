"use client"

import { useState } from "react"
import Link from "next/link"
import PostCard from "@/components/posts/list/PostCard"
import { PostListItem } from "@/types/post"
import { Bookmark, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SavedPostsClientProps {
  initialPosts: PostListItem[]
}

export default function SavedPostsClient({ initialPosts }: SavedPostsClientProps) {
  const [posts, setPosts] = useState(initialPosts)

  const handleToggleSave = (postId: string, isSaved: boolean) => {
    if (!isSaved) {
      setPosts((prev) => prev.filter((p) => p.id !== postId))
    }
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl bg-card px-4 py-16 sm:py-20">
        <Bookmark className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <p className="mb-1 text-center text-base font-medium text-muted-foreground sm:text-lg">Bạn chưa lưu bài đăng nào</p>
        <Button asChild>
          <Link href="/posts">
            <Search className="h-4 w-4" />
            Quay lại trang bài đăng.
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onToggleSave={handleToggleSave}
        />
      ))}
    </div>
  )
}
