export interface IMessage {
  id: string
  conversationId: string
  senderId: string
  content: string
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}