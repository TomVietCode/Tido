import { PostStatus, PostType } from "@/common/enums";
import { Transform, Type } from "class-transformer";
import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxDate } from "class-validator";

export class CreatePostDto {
  @IsNotEmpty({ message: "Tiêu đề không hợp lệ" })
  @IsString({ message: "Tiêu đề không hợp lệ" })
  title: string;

  @IsNotEmpty({ message: "Danh mục không hợp lệ" })
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: "Danh mục không hợp lệ" })
  categoryId: number;

  description: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined) return [];
    return value;
  })
  images: string[] = [];

  @IsEnum(PostType, { message: "Loại bài đăng không hợp lệ" })
  type: PostType;

  // Check date not in future
  @IsOptional()
  @IsDate({ message: "Thời gian không hợp lệ" })
  @Type(() => Date)
  @MaxDate(new Date(), { message: "Thời gian không thể xảy ra trong tương lai" })
  happenedAt?: Date;

  location?: string | undefined;

  contactVisible?: boolean | undefined;
  
  hasReward?: boolean | undefined;
}