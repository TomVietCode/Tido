import { Module } from '@nestjs/common';
import { ContactRequestsService } from './contact-requests.service';
import { ContactRequestsController } from './contact-requests.controller';
import { PostsModule } from '@modules/posts/posts.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { ChatModule } from '@modules/chat/chat.module';

@Module({
  controllers: [ContactRequestsController],
  providers: [ContactRequestsService],
  imports: [PostsModule, NotificationsModule, ChatModule],
})
export class ContactRequestsModule {}
