import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  
  async getUsers() {
    return "hello"
  }

  async createUser(data: any) {
    try {
      return await this.prisma.user.create({ data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
