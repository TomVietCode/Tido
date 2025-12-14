import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto } from '@/modules/users/dtos';
import * as bcrypt from 'bcrypt';
import { Prisma } from 'prisma/generated/prisma/browser';
import { User } from '@/common/interfaces/user';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  
  async getUsers() {
    const users = await this.prisma.user.findMany()
    if(!users || users.length === 0) {
      throw new NotFoundException('No users found')
    }
    return users
  }

  async createUser(data: CreateUserDto) {
    try {
      const { password, ...props } = data;
      const existingUser = await this.findOne({ email: props.email });
      if(existingUser) {
        throw new BadRequestException('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.create({ data: { ...props, password: hashedPassword } });

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
}
