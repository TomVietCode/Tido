import { ContactRequestStatus } from '@common/enums'

export interface IContactRequest {
  id: string
  postId: string
  requesterId: string
  ownerId: string
  answer: string
  status: ContactRequestStatus
  createdAt: Date
}

export interface IContactRequestRes {
  id: string
  postId: string
  requesterId: string
  ownerId: string
  answer: string
  status: ContactRequestStatus
  createdAt: Date
  updatedAt: Date
  post: {
    id: string
    title: string
    securityQuestion: string
  }
  requester: {
    id: string
    fullName: string
    avatarUrl: string | null
  }
}
