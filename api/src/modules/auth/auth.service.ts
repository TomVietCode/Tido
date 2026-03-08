import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import { SignUpDto } from '@modules/auth/auth.dto'
import { AuthResponse, JwtPayload } from '@src/common/interfaces'
import bcrypt from 'bcrypt'
import { Provider, Role, UserStatus } from '@src/common/enums'
import { User } from '@src/common/interfaces/user'

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
    const user = await this.usersService.findByEmail(email)
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng')
    }
    if (!user.password) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng')
    }

    const check = await this.comparePassword(password, user.password)
    if (!check) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng')
    }

    return user
  }

  async adminSignIn(email: string, password: string): Promise<AuthResponse> {
    // Query explicitly enforces ADMIN role before token generation.
    const adminUser = await this.usersService.findAdminByEmail(email)

    if (!adminUser) {
      const existingUser = await this.usersService.findByEmail(email)

      if (existingUser) {
        throw new ForbiddenException('Không có quyền truy cập')
      }

      throw new UnauthorizedException('Email hoặc mật khẩu không đúng')
    }

    if (!adminUser.password) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng')
    }

    const isValidPassword = await this.comparePassword(password, adminUser.password)

    if (!isValidPassword) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng')
    }

    return this.signIn(adminUser)
  }

  async signIn(user: User): Promise<AuthResponse> {
    const payload: JwtPayload = { sub: user.id, role: user.role }
    const response = {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role as Role,
        status: user.status,
        avatarUrl: user.avatarUrl,
      },
      access_token: this.jwtService.sign(payload),
    }

    return response
  }

  async signUp(dto: SignUpDto): Promise<AuthResponse> {
    const { fullName, email, password } = dto

    const user = await this.usersService.createUserFromLocal({
      fullName,
      email,
      password,
    })

    const payload: JwtPayload = { sub: user.id, role: user.role }
    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role as Role,
        status: user.status as UserStatus,
        avatarUrl: user.avatarUrl ?? undefined,
      },
      access_token: this.jwtService.sign(payload),
    }
  }

  async oAuthSignIn(user) {
    let existingUser = await this.usersService.findByEmail(user.email)
    if (!existingUser) {
      existingUser = await this.usersService.createUserFromGoogle(user)
    }

    if (existingUser.provider !== Provider.GOOGLE) {
      throw new BadRequestException('Email này đã được sử dụng')
    }
    const payload: JwtPayload = {
      sub: existingUser.id,
      role: existingUser.role,
    }
    return {
      user: {
        id: existingUser.id,
        email: existingUser.email,
        fullName: existingUser.fullName,
        role: existingUser.role as Role,
        status: existingUser.status,
        avatarUrl: existingUser.avatarUrl ?? undefined,
      },
      access_token: this.jwtService.sign(payload),
    }
  }
}
