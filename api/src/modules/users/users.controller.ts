import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly  usersService: UsersService
  ) {}

  @Get()
  async getUsers() {
    return this.usersService.getUsers();
  }

  @Get(':email')
  async findByEmail(@Param('email') email: string) {
    return await this.usersService.findOne({ email });
  }

  @Post()
  async createUser(@Body() data: any) {
    return await this.usersService.createUser(data);
  }
}
