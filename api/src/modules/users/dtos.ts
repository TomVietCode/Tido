import { IsEmail, IsNotEmpty } from "class-validator"

export class CreateUserLocalDto {
  @IsEmail({}, { message: "Invalid email" })
  @IsNotEmpty({ message: "Email is required" })
  email: string

  @IsNotEmpty({ message: "Full name is required" })
  fullName: string

  @IsNotEmpty({ message: "Password is required" })
  password: string
}

