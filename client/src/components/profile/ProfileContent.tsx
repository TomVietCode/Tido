"use client";

import { Post } from "@/types";
import PostsFilter from "./PostsFilter";
import PostsTable from "./PostsTable";
import { useState } from "react";

interface ProfileContentProps {
  posts: Post[];
}

export default function ProfileContent({ posts }: ProfileContentProps) {
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <>
      <PostsFilter
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      <PostsTable posts={posts} filter={activeFilter} />
    </>
  );
}
