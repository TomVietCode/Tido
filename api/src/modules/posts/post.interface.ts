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
  location: string | null
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
    | 'hasReward'
    | 'location'
    | 'createdAt'
    | 'happenedAt'
  > {}

export interface IPostsPaginatedResponse {
  meta: {
    limit: number,
    hasNextPage: boolean,
    nextCursor: string | null
  }
  data: IPostList[]
}
