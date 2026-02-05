import { MessageType } from "@common/enums"

export interface IMessage {
  id: string
  conversationId: string
  senderId: string
  content: string
  type: MessageType
  imageUrl?: string
  isRead?: boolean
  createdAt?: string
  updatedAt?: string
}
