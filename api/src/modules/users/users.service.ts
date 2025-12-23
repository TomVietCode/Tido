import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto } from '@/modules/users/dtos';
import * as bcrypt from 'bcrypt';
import { Prisma } from 'prisma/generated/prisma/browser';
import { User, UserResponse } from '@/common/interfaces/user';
import slugify from 'slugify';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  
  async getUsers() {
    const users = await this.prisma.user.findMany({ omit: { password: true } })
    if(!users || users.length === 0) {
      throw new NotFoundException('No users found')
    }
    return users as UserResponse[]
  }

  async createUser(data: CreateUserDto) {
    try {
      const { password, ...props } = data;
      const existingUser = await this.findOne({ email: props.email });
      if(existingUser) {
        throw new BadRequestException('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const avatarUrl= this.generateAvatarUrl(props.fullName);
      const user = await this.prisma.user.create({ data: { ...props, password: hashedPassword, avatarUrl } });

      const { password: pass, ...rest } = user
      return rest;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(props: Prisma.UserWhereUniqueInput): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: props,
    });
    return user as User
  }

  generateAvatarUrl(fullName: string) {
    const name = slugify(fullName, { strict: true })
    return `https://ui-avatars.com/api/?name=${name}&background=random&size=100`
  }
}
