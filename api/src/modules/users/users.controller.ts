import { Body, Controller, Get, Patch } from '@nestjs/common'
import { UsersService } from '@modules/users/users.service'
import { UserResponse } from '@common/interfaces/user'
import { ApiAuth, DocsInfo } from '@common/decorators'
import { CurrentUser } from '@modules/auth/decorators/user.decorator'
import { IUserPayload } from '@common/interfaces'
import { UpdateUserProfileDto } from '@modules/users/dtos'

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Get()
  @DocsInfo({ summary: 'Get all users' })
  async getUsers(): Promise<UserResponse[]> {
    const data = await this.usersService.getUsers()
    return data
  }
  
  @Get('profile')
  @ApiAuth()
  @DocsInfo({ summary: 'Get user profile' })
  async getProfile(@CurrentUser() user: IUserPayload) {
    const data = await this.usersService.findOne({ id: user.id })
    const { password, ...userData } = data
    return userData
  }

  @Patch('profile')
  @ApiAuth()
  @DocsInfo({ summary: 'Update user profile' })
  async updateProfile(@Body() dto: UpdateUserProfileDto, @CurrentUser() user: IUserPayload): Promise<UserResponse> {
    const data = await this.usersService.updateProfile(dto, user.id)
    return data as UserResponse
  }
} 
