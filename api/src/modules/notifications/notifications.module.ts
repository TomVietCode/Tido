import { Module, forwardRef } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { NotificationsController } from './notifications.controller'
import { ChatModule } from '@modules/chat/chat.module'

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  imports: [forwardRef(() => ChatModule)],
  exports: [NotificationsService],
})
export class NotificationsModule {}
