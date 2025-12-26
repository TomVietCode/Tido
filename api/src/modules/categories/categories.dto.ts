import { CategoryStatus } from "@/common/enums";
import { PartialType } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
  @IsString({ message: "Invalid name" })
  name: string

  iconCode?: string

  @IsOptional()
  @IsEnum(CategoryStatus, { message: "Invalid status"})
  status?: CategoryStatus
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}