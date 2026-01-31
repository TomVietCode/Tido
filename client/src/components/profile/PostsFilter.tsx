"use client";

interface PostsFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function PostsFilter({
  activeFilter,
  onFilterChange,
}: PostsFilterProps) {
  const filters = [
    { id: "all", label: "Tất cả" },
    { id: "active", label: "Đang hiển thị" },
    { id: "completed", label: "Đã ẩn/Đã xong" },
  ];

  return (
    <div className="flex gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`rounded-lg px-4 py-2 text-sm font-semibold ${
            activeFilter === filter.id
              ? "bg-slate-200 text-primary"
              : "bg-white text-slate-600 shadow-sm"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
