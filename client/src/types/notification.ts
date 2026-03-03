export enum NotificationType {
  FIRST_MESSAGE = 'FIRST_MESSAGE',
  CONTACT_REQUEST = 'CONTACT_REQUEST',
}

interface BaseNotification {
  id: string
  userId: string
  type: NotificationType
  isRead: boolean
  createdAt: string
}

export interface FirstMessageNotification extends BaseNotification {
  type: NotificationType.FIRST_MESSAGE
  data: {
    senderId: string
    senderName: string
    senderAvatar: string | null
    conversationId: string
  }
}

export interface ContactRequestNotification extends BaseNotification {
  type: NotificationType.CONTACT_REQUEST
  data: {
    requesterId: string
    requesterName: string
    requesterAvatar: string | null
    contactRequestId: string
    postId: string
    postTitle: string
    answerPreview: string
  }
}

export type INotification = FirstMessageNotification | ContactRequestNotification
