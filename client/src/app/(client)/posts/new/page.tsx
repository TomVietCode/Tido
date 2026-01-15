import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LostForm from "@/components/posts/LostForm"
import FoundForm from "@/components/posts/FoundForm"
import { getCategoryAction } from "@/lib/actions/category.action"

export default async function NewPostPage() {
  let categories = await getCategoryAction()
  const data = categories.data || []
  return (
    <div className="flex flex-col justify-center items-center gap-4 mt-5">
      <h1 className="text-3xl font-bold">Đăng Tin Tìm Đồ/Chủ Đồ</h1>
      <p>Điền các thông tin dưới đây để đăng tin của bạn lên hệ thống</p>
      
      <div className="flex w-full max-w-2xl flex-col gap-6">
      <Tabs defaultValue="lost">
        <TabsList className="w-full h-11">
          <TabsTrigger value="lost" className="data-[state=active]:bg-orange-400 data-[state=active]:text-white hover:bg-orange-300 hover:text-white transition-all duration-400">
            Tin mất đồ
          </TabsTrigger>
          <TabsTrigger value="found" className="data-[state=active]:bg-chart-2 data-[state=active]:text-white hover:bg-chart-1 hover:text-white transition-all duration-400">
            Tin nhặt được đồ
          </TabsTrigger>
        </TabsList>
        <LostForm categories={data}/>
        <FoundForm categories={data}/>
      </Tabs>
    </div>
    </div>
  )
}