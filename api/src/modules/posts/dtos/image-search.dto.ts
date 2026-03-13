import { IsOptional, IsNumber, Min, Max, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { PostType } from '@common/enums'

export class ImageSearchQueryDto {
  @ApiPropertyOptional({ description: 'Số kết quả tối đa', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number = 10

  @ApiPropertyOptional({
    description: 'Ngưỡng cosine distance (0-1, càng nhỏ càng giống)',
    default: 0.2,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  threshold?: number = 0.2

  @ApiPropertyOptional({ description: 'Loại bài đăng', default: PostType.LOST })
  @IsOptional()
  @IsEnum(PostType)
  postType?: PostType = PostType.LOST
}