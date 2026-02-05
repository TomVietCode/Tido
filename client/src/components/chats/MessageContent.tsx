import { IMessage } from "@/types"
import { MessageType } from "@/types/enums"
import Image from "next/image"

interface IMessageContentProps {
  msg: IMessage
  mine: boolean
  isLastMsg: boolean
}

export const MessageContent = ({ msg, mine, isLastMsg }: IMessageContentProps) => {
  return (
    <div  className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[60%] flex flex-col">
        {msg.type === MessageType.IMAGE && msg.imageUrl ? (
          <div className="relative max-w-[300px] max-h-[400px] overflow-hidden rounded-lg">
            <Image
              src={msg.imageUrl}
              alt="Hình ảnh"
              width={300}
              height={400}
              className="object-cover w-auto h-auto"
              priority={false}
              layout="responsive"
              loading="lazy"
            />
          </div>
        ) : ( 
          <div
            className={`px-3 py-2 rounded-lg wrap-anywhere break-normal ${
              mine ? "bg-primary text-white rounded-br-none" : "bg-white text-slate-900 border rounded-bl-none"
            }`}
          >
            {msg.content}
          </div>
        )}

        {mine && isLastMsg && (
          <span className="text-[10px] text-gray-500 text-right">{msg.isRead ? "Đã đọc" : "Đã gửi"}</span>
        )}
      </div>
    </div>
  )
}
