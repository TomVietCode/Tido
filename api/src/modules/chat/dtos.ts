import { IsArray, IsNotEmpty, IsOptional } from "class-validator";

export class CreateConversationDto {
  @IsNotEmpty({ message: "Người dùng không được để trống" })
  @IsArray()
  participants: string[]
  
  @IsOptional()
  postId?: string
}