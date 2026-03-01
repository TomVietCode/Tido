import { ContactRequestStatus } from "@/types/enums"

export interface IContactRequest {
  id: string
  postId: string
  requesterId: string
  ownerId: string
  answer: string
  status: ContactRequestStatus
  createdAt: string
  post: {
    id: string
    title: string
    securityQuestion: string
  }
  requester: {
    id: string
    fullName: string
    avatarUrl: string
  }
}