import { PartialType } from '@nestjs/swagger'
import { PostStatus, PostType, SortOrder } from '@src/common/enums'
import { Transform, Type } from 'class-transformer'
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxDate,
  Min,
} from 'class-validator'

export class CreatePostDto {
  @IsNotEmpty({ message: 'Tiêu đề không hợp lệ' })
  @IsString({ message: 'Tiêu đề không hợp lệ' })
  title: string

  @IsNotEmpty({ message: 'Danh mục không hợp lệ' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Danh mục không hợp lệ' },
  )
  categoryId: number

  @IsOptional()
  description?: string

  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined) return []
    return value
  })
  images: string[] = []

  @IsEnum(PostType, { message: 'Loại bài đăng không hợp lệ' })
  type: PostType

  // Check date not in future
  @IsOptional()
  @IsDate({ message: 'Thời gian không hợp lệ' })
  @Type(() => Date)
  @MaxDate(new Date(), {
    message: 'Thời gian không thể xảy ra trong tương lai',
  })
  happenedAt?: Date

  location?: string | undefined

  contactVisible?: boolean | undefined

  hasReward?: boolean | undefined
}

export class GetPostsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20

  @IsOptional()
  @IsString()
  cursor?: string

  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsString()
  catSlug?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  catId?: number

  @IsOptional()
  @IsEnum(PostType, { message: 'Loại bài đăng không hợp lệ' })
  type?: PostType

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC
}

export class GetMyPostsQueryDto extends GetPostsQueryDto {
  @IsOptional()
  @IsEnum(PostStatus, { message: 'Trạng thái không hợp lệ' })
  status?: PostStatus
}

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsOptional()
  @IsEnum(PostStatus, { message: 'Trạng thái không hợp lệ' })
  status?: PostStatus
}
