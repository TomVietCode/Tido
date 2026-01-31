import { Post } from "@/types";
import { PostStatus } from "@/types/enums";

interface ProfileStatsProps {
  posts: Post[];
}

export default function ProfileStats({ posts }: ProfileStatsProps) {
  const totalPosts = posts?.length || 0;
  const foundPosts =
    posts?.filter((post) => post.status === PostStatus.CLOSED).length || 0;

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-slate-500">Số tin đã đăng</p>
        <p className="mt-2 text-3xl font-bold">{totalPosts}</p>
      </div>
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-slate-500">Đã tìm thấy</p>
        <p className="mt-2 text-3xl font-bold">{foundPosts}</p>
      </div>
    </div>
  );
}
