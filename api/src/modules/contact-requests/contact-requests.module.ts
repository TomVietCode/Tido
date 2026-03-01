import { Module } from '@nestjs/common';
import { ContactRequestsService } from './contact-requests.service';
import { ContactRequestsController } from './contact-requests.controller';
import { PostsModule } from '@modules/posts/posts.module';

@Module({
  controllers: [ContactRequestsController],
  providers: [ContactRequestsService],
  imports: [PostsModule],
})
export class ContactRequestsModule {}
