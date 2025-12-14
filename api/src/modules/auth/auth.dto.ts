import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SignInDto {
  @IsEmail({}, { message: 'Invalid email' })
  email: string

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: "Invalid Password" })
  password: string
}

export class SignUpDto {
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString({ message: "Invalid Name" })
  fullName: string

  @IsEmail({}, { message: 'Invalid email' })
  email: string

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: "Invalid Password" })
  password: string
}
