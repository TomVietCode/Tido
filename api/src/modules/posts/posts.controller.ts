import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard'
import { CreatePostDto } from '@modules/posts/post.dto'
import { PostsService } from '@modules/posts/posts.service'
import { Request } from 'express'

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(@Body() dto: CreatePostDto, @Req() req: Request) {
    const user = req.user
    const data = await this.postsService.createPost(dto, user)
    return {
      statusCode: 200,
      message: 'Tạo bài viết thành công',
      data: data,
    }
  }
}
