import { Module } from '@nestjs/common'
import { PostsController } from '@modules/posts/posts.controller'
import { PostsService } from '@modules/posts/posts.service'
import { SavedPostsService } from '@modules/saved-posts/saved-posts.service'
import { AzureVisionModule } from '@modules/azure-vision/azure-vision.module'
import { ImageEmbeddingService } from '@modules/posts/image-embedding.service'

@Module({
  imports: [AzureVisionModule],
  controllers: [PostsController],
  providers: [PostsService, SavedPostsService, ImageEmbeddingService],
  exports: [PostsService],
})
export class PostsModule {}
