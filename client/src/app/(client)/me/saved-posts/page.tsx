import { getSavedPosts } from "@/lib/actions/post.action"
import SavedPostsClient from "@/components/me/SavedPostsClient"

export default async function SavedPostsPage() {
  const res = await getSavedPosts()
  const posts = res.data ?? []

  return (
    <div>
      <div className="mb-4 flex flex-col gap-1 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold sm:text-2xl">Tin đã lưu</h1>
        {posts.length > 0 && (
          <span className="text-sm text-muted-foreground">{posts.length} tin đã lưu</span>
        )}
      </div>
      <SavedPostsClient initialPosts={posts} />
    </div>
  )
}
