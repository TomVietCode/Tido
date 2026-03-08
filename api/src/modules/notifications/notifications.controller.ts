import { Controller, Get, Param, Patch } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { ApiTags } from '@nestjs/swagger'
import { ApiAuth } from '@common/decorators'
import { CurrentUser } from '@modules/auth/decorators/user.decorator'
import { IUserPayload } from '@common/interfaces'

@Controller('notifications')
@ApiTags('Notifications')
@ApiAuth()
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @Get()
  async findAll(@CurrentUser() user: IUserPayload) {
    return this.notificationsService.findAll(user.id)
  }

  @Get('unread-count')
  async getUnreadCount(@CurrentUser() user: IUserPayload) {
    return this.notificationsService.getUnreadCount(user.id)
  }

  @Patch('read-all')
  async markAllAsRead(@CurrentUser() user: IUserPayload) {
    return this.notificationsService.markAllAsRead(user.id)
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @CurrentUser() user: IUserPayload,
  ) {
    return this.notificationsService.markAsRead(id, user.id)
  }
}
