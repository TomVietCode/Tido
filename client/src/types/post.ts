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