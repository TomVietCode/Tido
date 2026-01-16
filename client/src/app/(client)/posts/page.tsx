import FilterBar from "@/components/posts/FilterBar";
import ItemGrid from "@/components/posts/ItemGrid";

export default function NewPostPage() {
  return (
    <div className="min-h-screen">
      <FilterBar />
      <ItemGrid />
    </div>
  );
}
