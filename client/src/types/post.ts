import { PostStatus, PostType } from "@/types/enums"

export interface Post {
  id: string
  userId: string
  categoryId: string | number
  title: string
  description: string
  images: string[]
  type: PostType
  status: PostStatus
  hasReward?: boolean
  securityQuestion?: string 
  contactVisible: boolean 
  happenedAt: Date | string      
  createdAt: Date | string     
  updatedAt: Date | string     
}

export interface PostListItem {
  id: string
  userId: string
  title: string
  images: string[]
  type: PostType
  category?: {
    name: string
    slug: string
  }
  hasReward?: boolean
  securityQuestion?: string 
  contactVisible?: boolean 
  location?: string
  happenedAt?: Date | string  
  createdAt: Date | string
}

export interface PostListResponse {
  meta: {
    limit: number
    hasNextPage: boolean
    nextCursor: string | null
  }
  data: PostListItem[]
}