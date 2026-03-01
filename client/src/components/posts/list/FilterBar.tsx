"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, SearchIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PostType, SortOrder } from "@/types/enums"
import { Category } from "@/types/category"
import { useDebounce } from "@/lib/hooks/useDebounce"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"

const TYPE_OPTIONS = [
  { label: "Tất cả", value: "all" },
  { label: "Thất lạc", value: PostType.LOST },
  { label: "Tìm thấy", value: PostType.FOUND },
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
  const currentCatSlug = searchParams.get("catSlug") ?? ALL_CATEGORIES_VALUE
  const [searchValue, setSearchValue] = useState(currentSearch)
  const debouncedSearch = useDebounce(searchValue, 500)

  const [isPending, startTransition] = useTransition()
  const pushParams = useCallback(
    (updates: Record<string, string>, mode: "push" | "replace" = "push") => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("cursor")
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      }
      startTransition(() => {
        const url = `?${params.toString()}`
        if (mode === "replace") {
          router.replace(url, { scroll: false })
        } else {
          router.push(url, { scroll: false })
        }
      })
    },
    [router, searchParams]
  )

  useEffect(() => {
    if (debouncedSearch !== currentSearch) {
      pushParams({ search: debouncedSearch }, "replace")
    }
  }, [debouncedSearch])
  const isSearching = isPending && debouncedSearch !== currentSearch

  const handleTypeChange = (type: string) => {
    pushParams({ type: type === "all" ? "" : type })
  }

  const handleSortChange = (sort: string) => {
    pushParams({ sortOrder: sort })
  }

  const handleCategoryChange = (slug: string) => {
    pushParams({ catSlug: slug === ALL_CATEGORIES_VALUE ? "" : slug })
  }

  // Check valid search params
  const isValidSlug = currentCatSlug === ALL_CATEGORIES_VALUE || categories.some((cat) => cat.slug === currentCatSlug)
  const validSlug = isValidSlug ? currentCatSlug : undefined
  const isValidSort = currentSort === SortOrder.DESC || currentSort === SortOrder.ASC
  const validSort = isValidSort ? currentSort : undefined

  return (
    <div className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative flex-1 lg:max-w-md">
            <InputGroup className="py-2 bg-gray-50 border border-gray-200 rounded-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent">
              <InputGroupInput
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Tìm kiếm bài đăng..."
              />
              <InputGroupAddon>{isSearching ? <Loader2 className="animate-spin" /> : <SearchIcon />}</InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  title="Xóa"
                  size="icon-xs"
                  onClick={() => setSearchValue("")}
                  className={`rounded-full ${!searchValue ? "hidden" : ""} cursor-pointer`}
                >
                  <XIcon />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 lg:gap-3 items-center">
            {/* Type pills */}
            <div className="flex flex-wrap gap-2">
              {TYPE_OPTIONS.map((opt) => {
                const isActive = opt.value === "all" ? currentType === "" : currentType.toUpperCase() === opt.value
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
            {categories.length > 0 && (
              <Select value={validSlug} onValueChange={handleCategoryChange}>
                <SelectTrigger className="rounded-full min-w-[170px]">
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
            )}

            {/* Sort select */}
            <Select value={validSort} onValueChange={handleSortChange}>
              <SelectTrigger className="rounded-full min-w-[120px]">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value={SortOrder.DESC} className="rounded-t-xl">
                  Mới nhất
                </SelectItem>
                <SelectItem value={SortOrder.ASC}>Cũ nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
