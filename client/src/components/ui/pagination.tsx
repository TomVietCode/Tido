"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

interface PaginationProps {
  current: number
  pages: number
  total: number
  onPageChange: (page: number) => void
}

export function Pagination({ current, pages, total, onPageChange }: PaginationProps) {
  if (pages <= 1) return null

  const getVisiblePages = () => {
    const delta = 1
    const range: number[] = []

    for (let i = Math.max(2, current - delta); i <= Math.min(pages - 1, current + delta); i++) {
      range.push(i)
    }

    const result: (number | "...")[] = [1]
    if (range[0] > 2) result.push("...")
    result.push(...range)
    if (range[range.length - 1] < pages - 1) result.push("...")
    if (pages > 1) result.push(pages)

    return result
  }

  return (
    <div className="flex items-center justify-between px-2">
      <p className="text-muted-foreground text-sm">
        Tổng cộng <span className="font-medium">{total}</span> kết quả
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(current - 1)}
          disabled={current <= 1}
        >
          <ChevronLeftIcon />
        </Button>
        {getVisiblePages().map((page, idx) =>
          page === "..." ? (
            <span key={`dots-${idx}`} className="px-2 text-sm text-muted-foreground">
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={current === page ? "default" : "outline"}
              size="icon-sm"
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </Button>
          )
        )}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(current + 1)}
          disabled={current >= pages}
        >
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  )
}
