import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator'

export class CreateUserLocalDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string

  @IsNotEmpty({ message: 'Tên không được để trống' })
  fullName: string

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string
}

export class UpdateUserProfileDto {
  @IsString({ message: 'Tên không hợp lệ' })
  fullName: string

  @IsOptional()
  @IsString({ message: 'Số điện thoại không hợp lệ' })
  phoneNumber?: string

  @IsOptional()
  @IsString({ message: 'Avatar không hợp lệ' })
  avatarUrl?: string
}
