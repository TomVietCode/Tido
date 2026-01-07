import { Module } from '@nestjs/common'
import { PostsController } from '@modules/posts/posts.controller'
import { PostsService } from '@modules/posts/posts.service'

@Module({
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
