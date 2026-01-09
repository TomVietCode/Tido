import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard'
import {
  CreatePostDto,
  GetMyPostsQueryDto,
  GetPostsQueryDto,
  UpdatePostDto,
} from '@modules/posts/post.dto'
import { PostsService } from '@modules/posts/posts.service'
import { SavedPostsService } from '@modules/saved-posts/saved-posts.service'
import { Request } from 'express'
import { Public } from '@modules/auth/decorators/public.decorator'
import { IPost, IPostResponse } from '@modules/posts/post.interface'
import { CurrentUser } from '@modules/auth/decorators/user.decorator'
import { IUserPayload } from '@common/interfaces'

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly savedPostsService: SavedPostsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new post' })
  async create(
    @Body() dto: CreatePostDto,
    @Req() req: Request,
  ): Promise<IPost> {
    const user = req.user
    const data = await this.postsService.create(dto, user)
    return data as IPost
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiQuery({ type: GetPostsQueryDto })
  async findAll(@Query() query: GetPostsQueryDto): Promise<IPostResponse> {
    const data = await this.postsService.findAll(query)
    return data as IPostResponse
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all posts of the current user' })
  async findMyPosts(
    @Query() query: GetMyPostsQueryDto,
    @CurrentUser() user: IUserPayload,
  ): Promise<IPostResponse> {
    const result = await this.postsService.findMyPosts(query, user)
    return result as IPostResponse
  }

  @Get('saved')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all saved posts of the current user' })
  async findSavedPosts(@CurrentUser() user: IUserPayload) {
    const result = await this.savedPostsService.findAll(user)
    return result
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a post by id' })
  async findOne(@Param('id') id: string, @CurrentUser() user: IUserPayload ): Promise<IPost> {
    const result = await this.postsService.findOne(id, user?.id)
    return result as IPost
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update my post by id' })
  async update(@Param('id') id: string, @Body() dto: UpdatePostDto, @CurrentUser() user: IUserPayload) {
    const result = await this.postsService.update(id, dto, user)
    return result
  }

  @Patch(":id/status")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update the status of my post by id' })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdatePostDto, @CurrentUser() user: IUserPayload) {
    const result = await this.postsService.update(id, { status: dto.status }, user)
    return result
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete my post by id' })
  async delete(@Param('id') id: string, @CurrentUser() user: IUserPayload) {
    const result = await this.postsService.delete(id, user)
    return result
  }
}
