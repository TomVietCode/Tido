import { NotificationType } from '@common/enums'

export interface INotification {
  id: string
  userId: string
  type: NotificationType
  data: Record<string, any>
  isRead: boolean
  createdAt: Date
}

export interface IFirstMessageData {
  senderId: string
  senderName: string
  senderAvatar: string | null
  conversationId: string
}

export interface IContactRequestData {
  requesterId: string
  requesterName: string
  requesterAvatar: string | null
  contactRequestId: string
  postId: string
  postTitle: string
  answerPreview: string
}
