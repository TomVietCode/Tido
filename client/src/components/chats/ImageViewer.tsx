"use client"

import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"

interface ImageViewerProps {
  images: string[]
  initialIndex?: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImageViewer({ images, initialIndex = 0, open, onOpenChange }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  // sync index when dialog opens with a new image
  useEffect(() => {
    if (open) setCurrentIndex(initialIndex)
  }, [open, initialIndex])

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext()
      if (e.key === "ArrowLeft") goPrev()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, goNext, goPrev])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-5xl w-[95vw] h-[90vh] p-0 bg-black/95 border-none
                   flex flex-col gap-0 rounded-xl overflow-hidden
                   sm:max-w-5xl"
      >
        <DialogTitle className="sr-only"></DialogTitle>

        <DialogClose
          className="absolute top-3 right-3 z-20 p-2 rounded-full
                    bg-black/40 hover:bg-black/60 text-white/80 hover:text-white
                    transition-colors"
        >
          <X className="size-5" />
        </DialogClose>

        {/* Counter badge */}
        {images.length > 1 ? (
          <div
            className="absolute top-4 left-4 z-20 text-white/70 text-sm
                      bg-black/50 px-3 py-1 rounded-full"
          >
            {currentIndex + 1} / {images.length}
          </div>
        ) : null}

        {/* Main image area */}
        <div className="flex-1 relative flex items-center justify-center min-h-0 px-12 py-6">
          {/* Previous button */}
          {images.length > 1 ? (
            <button
              onClick={goPrev}
              className="absolute left-2 z-10 p-2 rounded-full
                         bg-black/40 hover:bg-black/60 text-white/80 hover:text-white
                         transition-colors"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="size-6" />
            </button>
          ) : null}

          {/* Full-size image */}
          <div className="relative w-full h-full">
            {images[currentIndex] ? (
              <Image
              key={images[currentIndex]}
              src={images[currentIndex]}
              alt={`Ảnh ${currentIndex + 1} / ${images.length}`}
              fill
              className="object-contain"
              sizes="95vw"
              priority
            />
            ) : null}
          </div>

          {/* Next button */}
          {images.length > 1 ? (
            <button
              onClick={goNext}
              className="absolute right-2 z-10 p-2 rounded-full
                         bg-black/40 hover:bg-black/60 text-white/80 hover:text-white
                         transition-colors"
              aria-label="Ảnh tiếp"
            >
              <ChevronRight className="size-6" />
            </button>
          ) : null}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 ? (
          <div className="flex justify-center gap-2 px-4 py-3 bg-black/80">
            {images.map((url, i) => (
              <button
                key={url}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  "relative w-14 h-14 rounded-md overflow-hidden border-2 transition-all shrink-0",
                  i === currentIndex
                    ? "border-white opacity-100 scale-105"
                    : "border-transparent opacity-50 hover:opacity-80"
                )}
                aria-label={`Ảnh ${i + 1}`}
              >
                <Image src={url} alt={`Thumbnail ${i + 1}`} fill className="object-cover" sizes="56px" />
              </button>
            ))}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
