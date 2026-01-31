import ProfileStats from "@/components/profile/ProfileStats";
import ProfileContent from "@/components/profile/ProfileContent";
import { getUserProfile, getUserPosts } from "@/lib/actions/user.action";

export default async function ProfilePostsPage() {
  const [user, posts] = await Promise.all([getUserProfile(), getUserPosts()]);

  return (
    <div className="w-full">
      <div className="w-full space-y-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-5">Tin đã đăng</h1>
        <ProfileStats posts={posts} />
        <ProfileContent posts={posts} />
      </div>
    </div>
  );
}
