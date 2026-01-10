import { Module } from '@nestjs/common';
import { SavedPostsService } from './saved-posts.service';

@Module({
  providers: [SavedPostsService],
})
export class SavedPostsModule {}
