import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { PostStatus, PostType } from '@common/enums'

export class PostResponseDto {
  @ApiProperty({ example: 'clx1234567890abcdef' })
  id: string

  @ApiProperty({ example: 'Tìm iPhone 15 Pro Max màu đen' })
  title: string

  @ApiPropertyOptional({
    example: 'Bị mất tại công viên Thống Nhất vào lúc 18h ngày 08/01/2026',
    nullable: true,
  })
  description?: string | null

  @ApiProperty({
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],

    type: [String],
  })
  images: string[]

  @ApiProperty({
    enum: PostType,

    example: PostType.LOST,

    description:
      'Loại bài đăng: LOST (tìm đồ đã mất) hoặc FOUND (tìm thấy đồ)',
  })
  type: PostType

  @ApiProperty({
    enum: PostStatus,

    example: PostStatus.OPEN,

    description: 'Trạng thái: OPEN, CLOSED, HIDDEN',
  })
  status: PostStatus

  @ApiPropertyOptional({
    example: true,
  })
  hasReward?: boolean

  @ApiPropertyOptional({
    example: 'Màu sắc của ốp lưng là gì?',
    nullable: true,
  })
  securityQuestion?: string | null

  @ApiProperty({ example: 'uuid' })
  userId: string

  @ApiProperty({ example: 1 })
  categoryId: number

  @ApiPropertyOptional({
    example: {
      fullName: 'John Doe',
      avatarUrl: 'https://example.com/avatar.jpg',
    },
    nullable: true,
  })
  user?: {
    fullName: string
    avatarUrl: string
  }

  @ApiPropertyOptional({
    example: {
      name: 'Đồ điện tử',
      slug: 'do-dien-tu',
    },
    nullable: true,
  })
  category?: {
    name: string
    slug: string
  }

  @ApiProperty({ example: '2026-01-08T12:00:00.000Z' })
  createdAt: Date

  @ApiProperty({ example: '2026-01-08T12:00:00.000Z' })
  updatedAt: Date
}

export class PostListResponseDto extends PickType(PostResponseDto, [
  'id',
  'title',
  'images',
  'type',
  'status',
  'userId',
  'hasReward',
  'createdAt',
] as const) {}
