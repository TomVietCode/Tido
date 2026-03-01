import { ContactRequestStatus } from "@common/enums";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateContactRequestDto {
  @IsNotEmpty({ message: "Câu trả lời không được để trống"})
  @IsString({ message: "Câu trả lời không hợp lệ"})
  answer: string
}

export class UpdateContactRequestStatusDto {
  @IsNotEmpty()
  @IsEnum(ContactRequestStatus, { message: "Trạng thái không hợp lệ"})
  status: ContactRequestStatus
}