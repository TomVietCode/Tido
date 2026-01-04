import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function FilterBar() {
  return (
    <div className="container flex max-w-screen-2xl items-center p-4">
        <div className="relative flex flex-1 items-center">
          <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />

          <Input
            type="text"
            placeholder="Tìm kiếm đồ thất lạc..."   
            className="pl-10 text-base bg-slate-50 border-border/50 focus-visible:ring-2 focus-visible:ring-primary "
          />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
            <Button className="ml-6 mr-6"> Tất cả </Button>
        </div>
       
    </div>
  );
}