import { Body, Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common'
import { UsersService } from '@modules/users/users.service'
import { UserResponse } from '@common/interfaces/user'
import { ApiAuth, DocsInfo } from '@common/decorators'
import { CurrentUser } from '@modules/auth/decorators/user.decorator'
import { IUserPayload } from '@common/interfaces'
import { UpdateUserProfileDto } from '@modules/users/dtos'
import { Roles } from '@modules/auth/decorators/role.decorator'
import { Role } from '@src/common/enums'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

  @Get(':id')
  @ApiAuth()
  @DocsInfo({ summary: 'Get user by id' })
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.findOne({ id })
    const { password, ...userData } = user
    return userData
  }

  @Patch('profile')
  @ApiAuth()
  @DocsInfo({ summary: 'Update user profile' })
  async updateProfile(@Body() dto: UpdateUserProfileDto, @CurrentUser() user: IUserPayload): Promise<UserResponse> {
    const data = await this.usersService.updateProfile(dto, user.id)
    return data as UserResponse
  }

  // ─── Admin Endpoints ─────────────────────────────────────────

  @Get('admin/list')
  @ApiAuth()
  @Roles(Role.ADMIN)
  @DocsInfo({ summary: 'Admin: Get all users (paginated)' })
  async adminGetUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return await this.usersService.adminGetUsers({
      page: page ? +page : 1,
      limit: limit ? +limit : 10,
    })
  }

  @Patch('admin/:id/toggle-ban')
  @ApiAuth()
  @Roles(Role.ADMIN)
  @DocsInfo({ summary: 'Admin: Toggle user ban status' })
  async adminToggleBan(@Param('id') id: string) {
    return await this.usersService.adminToggleBan(id)
  }

  @Patch('admin/:id/toggle-role')
  @ApiAuth()
  @Roles(Role.ADMIN)
  @DocsInfo({ summary: 'Admin: Toggle user role' })
  async adminToggleRole(@Param('id') id: string) {
    return await this.usersService.adminToggleRole(id)
  }

  @Delete('admin/:id')
  @ApiAuth()
  @Roles(Role.ADMIN)
  @DocsInfo({ summary: 'Admin: Delete a user' })
  async adminDeleteUser(@Param('id') id: string) {
    return await this.usersService.adminDeleteUser(id)
  }
}
