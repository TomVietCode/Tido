import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { PrismaService } from '@src/database/prisma/prisma.service'
import { NotificationType } from '@common/enums'
import { INotification } from '@common/interfaces'
import { ChatGateway } from '@modules/chat/chat.gateway'

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => ChatGateway))
    private readonly chatGateway: ChatGateway,
  ) {}

  async create(
    userId: string,
    type: NotificationType,
    data: Record<string, any>,
  ): Promise<INotification> {
    const notification = await this.prisma.notification.create({
      data: { userId, type, data },
    })

    this.chatGateway.server
      .to(userId)
      .emit('new_notification', notification)

    return notification as INotification
  }

  async findAll(userId: string): Promise<INotification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return notifications as INotification[]
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    })
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    })
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    })
  }
}
