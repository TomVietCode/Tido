"use client"

import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOutIcon, UserIcon } from "lucide-react"
import { signOut } from "next-auth/react"
import { IUser } from "@/types/next-auth"
import { toast } from "sonner"
export default function UserDropDown({ user }: { user: IUser }) {
  return (
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Avatar>
        <AvatarImage src={user?.avatarUrl} />
        <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56" align="start">
      <DropdownMenuGroup>
          <Link href="/profile" className="flex items-center gap-2">
          <DropdownMenuItem className="cursor-pointer w-full">
            <UserIcon className="w-4 h-4"/>
            Thông tin tài khoản
          </DropdownMenuItem>
          </Link>
        <DropdownMenuItem onClick={() => {
          signOut({ callbackUrl: "/" })
          toast.info("Đăng xuất thành công")
        }}>
          <LogOutIcon className="w-4 h-4"/>
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
  )
}