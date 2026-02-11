import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '@src/database/prisma/prisma.service'
import { CreateUserLocalDto, UpdateUserProfileDto } from '@modules/users/dtos'
import * as bcrypt from 'bcrypt'
import { Prisma } from 'prisma/generated/prisma/browser'
import { User, UserResponse } from '@common/interfaces/user'
import slugify from 'slugify'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    const users = await this.prisma.user.findMany({ omit: { password: true } })
    if (!users || users.length === 0) {
      throw new NotFoundException('Không tìm thấy tài khoản nào')
    }
    return users as UserResponse[]
  }

  async findMany(options: any) {
    const users = await this.prisma.user.findMany({
      where: options.where,
      select: options.select,
      skip: options.skip,
      take: options.take,
    })
    return users as unknown as UserResponse[]
  }

  async createUserFromLocal(data: CreateUserLocalDto) {
    try {
      const { password, ...props } = data
      const existingUser = await this.findOne({ email: props.email })
      if (existingUser) {
        throw new BadRequestException('Tài khoản với email này đã tồn tại')
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const avatarUrl = this.generateAvatarUrl(props.fullName)
      const user = await this.prisma.user.create({
        data: { ...props, password: hashedPassword, avatarUrl },
      })

      const { password: pass, ...rest } = user
      return rest
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async createUserFromGoogle(data: any): Promise<User> {
    const { email, fullName, googleId, provider } = data
    let avatarUrl = data.avatarUrl
    if (!avatarUrl) {
      avatarUrl = this.generateAvatarUrl(fullName)
    }

    const user = await this.prisma.user.create({
      data: { email, fullName, googleId, provider, avatarUrl },
    })
    return user as User
  }

  async findOne(props: Prisma.UserWhereUniqueInput): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: props,
    })

    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản')
    }

    return user as User
  }

  async updateProfile(dto: UpdateUserProfileDto, id: string) {
    await this.findOne({ id })
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { ...dto },
    })

    const { password, ...userData } = updatedUser
    return userData
  }

  generateAvatarUrl(fullName: string) {
    const name = slugify(fullName, { strict: true })
    return `https://ui-avatars.com/api/?name=${name}&background=random&size=100`
  }
}
