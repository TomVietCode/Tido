import type { MetadataRoute } from "next";
const siteUrl = "https://tido.page";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/posts", "/posts/*"],
        disallow: ["/me", "/me/*", "/chats", "/chats/*", "/auth", "/auth/*", "/posts/new"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}