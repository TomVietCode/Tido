import { PostStatus, PostType } from '@common/enums'

export interface IPost {
  id: string
  title: string
  description: string | null
  images: string[]
  type: PostType
  status: PostStatus
  hasReward?: boolean
  securityQuestion: string | null
  contactVisible: boolean
  happenedAt: Date | null
  userId: string
  categoryId: number
  createdAt: Date
  updatedAt: Date
  user?: {
    fullName: string
    avatarUrl: string
  }
  category?: {
    name: string
    slug: string
  }
}

export interface IPostList
  extends Pick<
    IPost,
    | 'id'
    | 'userId'
    | 'title'
    | 'images'
    | 'type'
    | 'status'
    | 'hasReward'
    | 'createdAt'
  > {}

export interface IPostsPaginatedResponse {
  meta: {
    total: number
    page?: number
    limit?: number
    totalPages?: number
  }
  data: IPostList[]
}
