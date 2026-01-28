export interface IConversation {
  id: string
  participants: string[]
  postId?: string
  lastMessage?: {
    content: string
    senderId: string
    createdAt: string
    isRead?: boolean
  }
  recipient: {
    id: string
    fullName: string
    avatarUrl: string
  },
  unreadCount?: number
}

export interface IMessage {
  id: string
  conversationId: string
  senderId: string
  content: string
  isRead?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface IGetMessagesResponse {
  messages: IMessage[]
  nextCursor: string | null
  hasMore: boolean
}