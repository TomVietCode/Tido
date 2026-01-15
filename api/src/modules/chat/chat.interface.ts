export interface IConversation {
  _id: string
  participants: string[]
  postId: string
  lastMessage: {
    content: string
    senderId: string
    createdAt: Date
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
  }
  recipient: {
    id: string
    fullName: string
    avatarUrl: string
  }
}