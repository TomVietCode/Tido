import { IMessage } from "@/types"
import { MessageType } from "@/types/enums"
import Image from "next/image"
import { useMemo } from "react"

interface IMessageContentProps {
  msg: IMessage
  mine: boolean
  isLastMsg: boolean
}

export const MessageContent = ({ msg, mine, isLastMsg }: IMessageContentProps) => {
  const colNum = useMemo(() => {
    if (msg.type !== MessageType.IMAGE) return 1
    return Math.min(msg.imageUrls.length, 3)
  }, [msg.imageUrls])

  if (msg.type === MessageType.EMOJI) {
    return (
      <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
        <div className="max-w-[60%] flex flex-col">
          <div className="text-3xl leading-none wrap-anywhere break-normal">{msg.content}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[60%] flex flex-col">
        {msg.type === MessageType.IMAGE ? (
          msg.imageUrls.length > 1 ? (
            <div className={`grid grid-cols-${colNum} gap-2`}>
              {msg.imageUrls.map((url) => (
                <Image
                  key={url}
                  src={url}
                  alt="Hình ảnh"
                  width={150}
                  height={200}
                  className="object-contain w-auto h-auto"
                  priority={false}
                  layout="responsive"
                  loading="lazy"
                />
              ))}
            </div>
          ) : (
            <div className="relative max-w-[350px] max-h-[400px] overflow-hidden rounded-lg">
              <Image
                src={msg.imageUrls[0]}
                alt="Hình ảnh"
                width={300}
                height={400}
                className="object-cover w-auto h-auto"
                priority={false}
                layout="responsive"
                loading="lazy"
              />
            </div>
          )
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
