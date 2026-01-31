"use client";

import { Post } from "@/types";
import { PostStatus } from "@/types/enums";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deletePost, updatePostStatus } from "@/lib/actions/user.action";
import { useState } from "react";

interface PostsTableProps {
  posts: Post[];
  filter: string;
}

export default function PostsTable({ posts, filter }: PostsTableProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const filteredPosts =
    posts?.filter((post) => {
      if (filter === "all") return true;
      if (filter === "active") return post.status === PostStatus.OPEN;
      if (filter === "completed")
        return (
          post.status === PostStatus.CLOSED || post.status === PostStatus.HIDDEN
        );
      return true;
    }) || [];

  const handleMarkAsFound = async (postId: string) => {
    setLoading(postId);
    try {
      const res = await updatePostStatus(postId, PostStatus.CLOSED);
      if (res.success) {
        toast.success("Đã đánh dấu tin là đã tìm thấy");
        router.refresh();
      } else {
        toast.error(res.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tin này?")) return;

    setLoading(postId);
    try {
      const res = await deletePost(postId);
      if (res.success) {
        toast.success("Đã xóa tin thành công");
        router.refresh();
      } else {
        toast.error(res.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    } finally {
      setLoading(null);
    }
  };

  const getStatusBadge = (status: PostStatus) => {
    switch (status) {
      case PostStatus.OPEN:
        return (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
            Đang tìm
          </span>
        );
      case PostStatus.CLOSED:
        return (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            Đã xong
          </span>
        );
      case PostStatus.HIDDEN:
        return (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
            Đã ẩn
          </span>
        );
      default:
        return null;
    }
  };

  if (filteredPosts.length === 0) {
    return (
      <div className="rounded-xl bg-white p-12 text-center shadow-sm">
        <p className="text-slate-500">Không có tin đăng nào</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-100 text-left text-slate-600">
          <tr>
            <th className="px-6 py-3">SẢN PHẨM</th>
            <th className="px-6 py-3">NGÀY ĐĂNG</th>
            <th className="px-6 py-3">TRẠNG THÁI</th>
            <th className="px-6 py-3 text-right">HÀNH ĐỘNG</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {filteredPosts.map((post) => (
            <tr key={post.id}>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={post.images[0] || "https://via.placeholder.com/40"}
                    className="h-10 w-10 rounded-md object-cover"
                    alt={post.title}
                  />
                  <span className="font-medium">{post.title}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-500">
                {format(new Date(post.createdAt), "dd/MM/yyyy", {
                  locale: vi,
                })}
              </td>
              <td className="px-6 py-4">{getStatusBadge(post.status)}</td>
              <td className="px-6 py-4 text-right space-x-2">
                <button
                  onClick={() => router.push(`/profile/posts/edit/${post.id}`)}
                  className="hover:scale-110 transition-transform"
                  disabled={loading === post.id}
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-red-500 hover:scale-110 transition-transform"
                  disabled={loading === post.id}
                >
                  🗑
                </button>
                {post.status === PostStatus.OPEN && (
                  <button
                    onClick={() => handleMarkAsFound(post.id)}
                    className="rounded-md bg-green-500 px-3 py-1 text-xs font-semibold text-white hover:bg-green-600 disabled:opacity-50"
                    disabled={loading === post.id}
                  >
                    {loading === post.id ? "Đang xử lý..." : "Đã tìm thấy"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
