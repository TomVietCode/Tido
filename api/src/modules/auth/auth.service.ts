import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import { SignUpDto } from '@/modules/auth/auth.dto'
import { AuthResponse, JwtPayload } from '@/common/interfaces'
import bcrypt from 'bcrypt'
import { Role } from '@/common/enums'
import { User } from '@/common/interfaces/user'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  
  async comparePassword(
    password: string,
    storePasswordHash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, storePasswordHash)
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOne({ email })
    if (!user) {
      throw new UnauthorizedException("Invalid Credentials")
    }
    const check = await this.comparePassword(password, user!.password!)
    if (!check) {
      throw new UnauthorizedException("Invalid Credentials")
    }

    return user
  }

  async signIn(user: User): Promise<AuthResponse> {
    const payload: JwtPayload = { sub: user.id, role: user.role }
    const response = {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role as Role,
        avatarUrl: user.avatarUrl,
      },
      access_token: this.jwtService.sign(payload),
    }

    return response
  }

  async signUp(dto: SignUpDto): Promise<AuthResponse> {
    const { fullName, email, password } = dto

    const existingUser = await this.usersService.findOne({ email })
    if (existingUser) {
      throw new BadRequestException('User with this email already exists')
    }

    const user = await this.usersService.createUser({ fullName, email, password })

    const payload: JwtPayload = { sub: user.id, role: user.role }
    return { 
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role as Role,
        avatarUrl: user.avatarUrl ?? undefined,
      },
      access_token: this.jwtService.sign(payload),
    }
  }
}
