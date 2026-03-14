import type { MetadataRoute } from "next";
import { PostStatus } from "@/types/enums";

const siteUrl = "https://tido.page";
const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

type PostItem = {
  id: string;
  updatedAt?: string;
};

type PostListApiResponse = {
  success: boolean;
  data?: {
    data: PostItem[];
    meta: {
      hasNextPage: boolean;
      nextCursor: string | null;
    };
  };
};

async function fetchAllPublicPosts(): Promise<PostItem[]> {
  const posts: PostItem[] = [];
  let cursor: string | null = null;

  do {
    const params = new URLSearchParams({
      limit: "100",
      status: PostStatus.OPEN,
    });
    if (cursor) params.set("cursor", cursor);

    const res = await fetch(`${apiBase}/posts?${params.toString()}`, {
      next: { revalidate: 900 },
    });

    if (!res.ok) break;

    const json = (await res.json()) as PostListApiResponse;
    if (!json.success || !json.data) break;

    posts.push(...json.data.data);
    cursor = json.data.meta.hasNextPage ? json.data.meta.nextCursor : null;
  } while (cursor);

  return posts;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/posts`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
  ];

  const posts = await fetchAllPublicPosts();
  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/posts/${post.id}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticUrls, ...postUrls];
}