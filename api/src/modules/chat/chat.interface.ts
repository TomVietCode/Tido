export interface IConversation {
  _id: string
  participants: string[]
  postId: string
  lastMessage: {
    content: string
    senderId: string
    createdAt: Date
    isRead: boolean
  }
}

export interface IConversationResponse {
  id: string
  participants: string[]
  postId: string
  lastMessage: {
    content: string
    senderId: string
    createdAt: Date
    isRead: boolean
  }
  recipient: {
    id: string
    fullName: string
    avatarUrl: string
  }
  unreadCount: number
}