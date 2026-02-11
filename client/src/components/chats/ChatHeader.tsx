import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IConversation } from "@/types"
import Link from "next/link"

export default function ChatHeader({ conversation }: { conversation?: IConversation }) {
  return (
    <div className="flex items-center justify-between border-b p-2 shadow-b shadow-md">
      <Link
        href={`/users/${conversation?.recipient.id}`}
        className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded-md transition-colors"
      >
        <Avatar className="size-10">
          <AvatarImage src={conversation?.recipient.avatarUrl} />
          <AvatarFallback>{conversation?.recipient.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-semibold truncate">{conversation?.recipient.fullName}</span>
      </Link>
    </div>
  )
}
