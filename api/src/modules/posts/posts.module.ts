import { Module } from '@nestjs/common'
import { PostsController } from '@modules/posts/posts.controller'
import { PostsService } from '@modules/posts/posts.service'
import { SavedPostsService } from '@modules/saved-posts/saved-posts.service'

@Module({
  controllers: [PostsController],
  providers: [PostsService, SavedPostsService]
})
export class PostsModule {}
