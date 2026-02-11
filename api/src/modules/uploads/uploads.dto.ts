import { IsNotEmpty, IsString } from 'class-validator'

export class GetPresignedUrlDto {
  @IsString()
  @IsNotEmpty()
  fileName: string

  @IsString()
  @IsNotEmpty()
  contentType: string

  @IsString()
  @IsNotEmpty()
  folder: string
}
