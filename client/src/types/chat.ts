export interface Conversation {
  id: string
  participants: string[]
  postId?: string
  lastMessage?: {
    content: string
    senderId: string
    createdAt: string
  }
  recipient: {
    id: string
    fullName: string
    avatarUrl: string
  }
}

export interface IMessage {
  conversationId: string
  message: string
  senderId: string
  createdAt: string
}