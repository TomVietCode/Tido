import { IsOptional, IsNumber, Min, Max } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

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
    default: 0.8,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  threshold?: number = 0.8
}