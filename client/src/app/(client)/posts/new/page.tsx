import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LostForm from "@/components/posts/form/LostForm"
import FoundForm from "@/components/posts/form/FoundForm"
import { getCategoryAction } from "@/lib/actions/category.action"

export default async function NewPostPage() {
  let categories = await getCategoryAction()
  const data = categories.data || []
  return (
    <div className="mx-auto my-4 flex w-full max-w-3xl flex-col items-center gap-4 px-4 sm:my-6 sm:px-6">
      <h1 className="text-center text-2xl font-bold sm:text-3xl">Đăng Tin Tìm Kiếm</h1>
      <p className="text-center text-sm text-muted-foreground sm:text-base">
        Điền các thông tin dưới đây để đăng tin của bạn lên hệ thống
      </p>

      <div className="mb-4 w-full">
        <Tabs defaultValue="lost" className="w-full">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 p-1">
            <TabsTrigger
              value="lost"
              className="whitespace-normal px-2 py-2 text-xs sm:text-sm data-[state=active]:bg-orange-400 data-[state=active]:text-white hover:bg-orange-300 hover:text-white"
            >
              Tôi làm mất / Thất lạc
            </TabsTrigger>
            <TabsTrigger
              value="found"
              className="whitespace-normal px-2 py-2 text-xs sm:text-sm data-[state=active]:bg-chart-2 data-[state=active]:text-white hover:bg-chart-1 hover:text-white"
            >
              Tôi nhặt được / Tìm thấy
            </TabsTrigger>
          </TabsList>
          <LostForm categories={data} />
          <FoundForm categories={data} />
        </Tabs>
      </div>
    </div>
  )
}
