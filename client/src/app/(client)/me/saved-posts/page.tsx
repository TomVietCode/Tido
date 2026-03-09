import { getSavedPosts } from "@/lib/actions/post.action"
import SavedPostsClient from "@/components/me/SavedPostsClient"

export default async function SavedPostsPage() {
  const res = await getSavedPosts()
  const posts = res.data ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tin đã lưu</h1>
        {posts.length > 0 && (
          <span className="text-sm text-muted-foreground">{posts.length} tin đã lưu</span>
        )}
      </div>
      <SavedPostsClient initialPosts={posts} />
    </div>
  )
}
