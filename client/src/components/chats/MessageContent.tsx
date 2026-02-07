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
  const imageSizeMap: Record<number, { width: number; height: number; sizes: string }> = {
    1: { width: 350, height: 450, sizes: "350px" },
    2: { width: 250, height: 250, sizes: "200px" },
    3: { width: 150, height: 200, sizes: "150px" },
  }
  const imageCount = msg?.imageUrls?.length ?? 0
  const { width, height, sizes } = imageSizeMap[imageCount] ?? imageSizeMap[3]

  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[60%] flex flex-col">
        {/* Emoji Type */}
        {msg.type === MessageType.EMOJI && (
          <div className="text-4xl leading-none wrap-anywhere break-normal">{msg.content}</div>
        )}

        {/* Image Type */}
        {msg.type === MessageType.IMAGE && (
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${colNum}, minmax(0, 1fr))` }}>
            {msg.imageUrls.map((url) => (
              <div key={url} className="relative overflow-hidden rounded-lg">
                <Image
                  src={url}
                  alt="Hình ảnh"
                  width={width}
                  height={height}
                  className="object-cover rounded-lg"
                  sizes={sizes}
                  priority={false}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

        {/* Text/Default Type */}
        {msg.type !== MessageType.EMOJI && msg.type !== MessageType.IMAGE && (
          <div
            className={`px-3 py-2 rounded-lg wrap-anywhere break-normal ${
              mine ? "bg-primary text-white rounded-br-none" : "bg-white text-slate-900 border rounded-bl-none"
            }`}
          >
            {msg.content}
          </div>
        )}

        {mine && isLastMsg && (
          <span className="text-[10px] text-gray-500 text-right mt-1">{msg.isRead ? "Đã đọc" : "Đã gửi"}</span>
        )}
      </div>
    </div>
  )
}
