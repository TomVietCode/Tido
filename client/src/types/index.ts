import { CategoryStatus, PostStatus, PostType } from "@/types/enums";

export interface Category {
  id: number,
  name: string,
  slug: string,
  iconCode?: string,
  status: CategoryStatus,
  createdAt: Date,
  updatedAt: Date,
}

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

export interface UploadPresignedUrlResponse {
  uploadUrl: string
  fileUrl: string
  uploadedUrl: string
}

