import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Get()
  async getUsers() {
    return this.usersService.getUsers();
  }

  @Post()
  async createUser(@Body() data: any) {
    return await this.usersService.createUser(data);
  }
}
