import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchUserResponse } from "@/types";
import { memo } from "react";

interface UserSearchItemProps {
  user: SearchUserResponse
  onClick: () => void
}
export const UserSearchItem = memo(function UserSearchItem({ user, onClick }: UserSearchItemProps) {
  return (
    <div onClick={onClick} className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer transition-colors">
      <Avatar>
        <AvatarImage src={user.avatarUrl} />
        <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium truncate">{user.fullName}</span>
    </div>
  )
})