import { Search, ChevronDown } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function FilterBar() {
  const categories = ["Tất cả", "Giấy tờ", "Ví tiền", "Điện tử", "Khác"];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm đồ thất lạc..."
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent"
            />
          </div>

          {/* Filter Pills & Dropdown */}
          <div className="flex flex-wrap gap-2 lg:gap-3 items-center">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 ">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={cat === "Tất cả" ? "default" : "outline"}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    cat === "Tất cả"
                      ? "bg-primary hover:bg-primary/90 text-white"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {cat}
                </Button>
              ))}
            </div>

            {/* Dropdown */}
            <div className="relative group ">
              <Button className="rounded-full px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-2 ">
                Mới nhất
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
