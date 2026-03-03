import { CategoryStatus } from '@src/common/enums'
import { PartialType } from '@nestjs/swagger'
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator'
import { Transform } from 'class-transformer'

export class CreateCategoryDto {
  @IsString({ message: 'Invalid name' })
  name: string

  iconCode?: string

  @IsOptional()
  @IsEnum(CategoryStatus, { message: 'Invalid status' })
  status?: CategoryStatus
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class GetCategoriesQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  limit?: number = 10

  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsEnum(CategoryStatus)
  status?: CategoryStatus
}
