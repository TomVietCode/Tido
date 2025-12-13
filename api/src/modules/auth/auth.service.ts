import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import { SignUpDto } from '@/modules/auth/dtos'
import { ApiResponse, JwtPayload } from '@/common/interfaces'
import bcrypt from 'bcrypt'
import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email)
    if (user?.password !== pass) {
      throw new UnauthorizedException()
    }
    const payload = { sub: user.id, role: user.role }
    const accessToken = await this.jwtService.signAsync(payload)
    return { accessToken }
  }

  async signUp(dto: SignUpDto): Promise<ApiResponse<string>> {
    const { fullName, email, password } = dto
    const existingUser = await this.prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      throw new BadRequestException('User with this email already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await this.prisma.user.create({ data: { fullName, email, password: hashedPassword } })

    const payload: JwtPayload = { sub: user.id, role: user.role }
    const accessToken = await this.jwtService.signAsync(payload)
    return { 
      statusCode: HttpStatus.CREATED,
      message: 'Signup successfully',
      data: accessToken
     }
  }
}
