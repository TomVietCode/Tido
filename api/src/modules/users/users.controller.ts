import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { BackendResponse } from '@/common/interfaces';
import { UserResponse } from '@/common/interfaces/user';

@Controller('users')
export class UsersController {
  constructor(
    private readonly  usersService: UsersService
  ) {}

  @Get()
  async getUsers(): Promise<BackendResponse<UserResponse[]>> {
    const data = await this.usersService.getUsers();
    return {
      statusCode: 200,
      message: 'Users fetched successfully',
      data,
    }
  }

  @Get(':email')
  async findByEmail(@Param('email') email: string) {
    return await this.usersService.findOne({ email });
  }

  @Post()
  async createUser(@Body() data: any) {
    return await this.usersService.createUserFromLocal(data);
  }
} 
