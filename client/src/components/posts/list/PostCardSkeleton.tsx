import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function PostCardSkeleton() {
  return (
    <Card className="w-full overflow-hidden rounded-2xl py-0 flex flex-col gap-2">
      <Skeleton className="aspect-video w-full shrink-0 rounded-none" />

      <CardContent className="flex flex-1 flex-col gap-4 px-5 pb-5 pt-2">
        <div className="flex-1 space-y-2.5">
          <Skeleton className="h-[18px] w-4/5" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-4 w-2/5" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>

        <div className="flex gap-3 shrink-0">
          <Skeleton className="h-10 flex-1 rounded-md" />
          <Skeleton className="h-10 flex-1 rounded-md" />
        </div>
      </CardContent>
    </Card>
  )
}
