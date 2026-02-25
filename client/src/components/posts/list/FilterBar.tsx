"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PostType, SortOrder } from "@/types/enums"
import { Category } from "@/types/category"
import { useDebounce } from "@/lib/hooks/useDebounce"

const TYPE_OPTIONS = [
  { label: "Tất cả", value: "all" },
  { label: "Mất đồ", value: PostType.LOST },
  { label: "Tìm được đồ", value: PostType.FOUND },
] as const

const ALL_CATEGORIES_VALUE = "all"

interface FilterBarProps {
  categories?: Category[]
}

export default function FilterBar({ categories = [] }: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentSearch = searchParams.get("search") ?? ""
  const currentType = searchParams.get("type") ?? ""
  const currentSort = searchParams.get("sortOrder") ?? SortOrder.DESC
  const currentCatSlug = searchParams.get("catSlug") ?? ""

  const [searchValue, setSearchValue] = useState(currentSearch)
  const debouncedSearch = useDebounce(searchValue, 500)

  const pushParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("cursor")
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      }
      router.push(`?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  useEffect(() => {
    if (debouncedSearch !== currentSearch) {
      pushParams({ search: debouncedSearch })
    }
  }, [debouncedSearch])

  useEffect(() => {
    setSearchValue(currentSearch)
  }, [currentSearch])

  const handleTypeChange = (type: string) => {
    pushParams({ type: type === "all" ? "" : type })
  }

  const handleSortChange = (sort: string) => {
    pushParams({ sortOrder: sort })
  }

  const handleCategoryChange = (slug: string) => {
    pushParams({ catSlug: slug === ALL_CATEGORIES_VALUE ? "" : slug })
  }

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative flex-1 lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Tìm kiếm đồ thất lạc..."
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 lg:gap-3 items-center">
            {/* Type pills */}
            <div className="flex flex-wrap gap-2">
              {TYPE_OPTIONS.map((opt) => {
                const isActive = opt.value === "all" ? currentType === "" : currentType === opt.value
                return (
                  <Button
                    key={opt.value}
                    variant={isActive ? "default" : "outline"}
                    onClick={() => handleTypeChange(opt.value)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary hover:bg-primary/90 text-white"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </Button>
                )
              })}
            </div>

            {/* Category select */}
            {categories.length > 0 ? (
              <Select value={currentCatSlug || ALL_CATEGORIES_VALUE} onValueChange={handleCategoryChange}>
                <SelectTrigger className="rounded-full min-w-[140px]">
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value={ALL_CATEGORIES_VALUE} className="rounded-t-xl">
                    Tất cả danh mục
                  </SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}

            {/* Sort select */}
            <Select value={currentSort} onValueChange={handleSortChange}>
              <SelectTrigger className="rounded-full min-w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value={SortOrder.DESC} className="rounded-t-xl">
                  Mới nhất
                </SelectItem>
                <SelectItem value={SortOrder.ASC}>
                  Cũ nhất
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
