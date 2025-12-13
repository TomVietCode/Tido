import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto } from '@/modules/users/dtos';
import * as bcrypt from 'bcrypt';
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

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if(!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }

  async createUser(data: CreateUserDto) {
    try {
      const { password, ...props } = data;
      const existingUser = await this.findByEmail(props.email);
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
}
