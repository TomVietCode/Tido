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
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard'
import {
  CreatePostDto,
  GetMyPostsQueryDto,
  GetPostsQueryDto,
  UpdatePostDto,
} from '@src/modules/posts/dtos/post.dto'
import { PostsService } from '@modules/posts/posts.service'
import { SavedPostsService } from '@modules/saved-posts/saved-posts.service'
import { Request } from 'express'
import { Public } from '@modules/auth/decorators/public.decorator'
import { IPost, IPostsPaginatedResponse } from '@modules/posts/post.interface'
import { CurrentUser } from '@modules/auth/decorators/user.decorator'
import { IUserPayload } from '@common/interfaces'
import { ApiPaginatedResponse, ApiWrappedResponse } from '@src/common/decorators'
import { PostListResponseDto, PostResponseDto } from '@modules/posts/dtos'

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly savedPostsService: SavedPostsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Create a new post' })
  @ApiWrappedResponse({ type: PostResponseDto })
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
  @ApiPaginatedResponse({ type: PostListResponseDto })
  async findAll(@Query() query: GetPostsQueryDto): Promise<IPostsPaginatedResponse> {
    const data = await this.postsService.findAll(query)
    return data as IPostsPaginatedResponse
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Get all my posts' })
  @ApiPaginatedResponse({ type: PostListResponseDto })
  async findMyPosts(@Query() query: GetMyPostsQueryDto, @CurrentUser() user: IUserPayload): Promise<IPostsPaginatedResponse> {
    const result = await this.postsService.findMyPosts(query, user)
    return result as IPostsPaginatedResponse
  }

  @Get('saved')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Get my saved posts' })
  @ApiPaginatedResponse({ type: PostListResponseDto })
  async findSavedPosts(@CurrentUser() user: IUserPayload) {
    const result = await this.savedPostsService.findAll(user)
    return result
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a post by id' })
  @ApiWrappedResponse({ type: PostResponseDto })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: IUserPayload,
  ): Promise<IPost> {
    const result = await this.postsService.findOne(id, user?.id)
    return result as IPost
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('token')
  @ApiWrappedResponse({ type: PostResponseDto })
  @ApiOperation({ summary: 'Update my post by id' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @CurrentUser() user: IUserPayload,
  ) {
    const result = await this.postsService.update(id, dto, user)
    return result
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('token')
  @ApiWrappedResponse({ type: PostResponseDto })
  @ApiOperation({ summary: 'Update the status of my post by id' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @CurrentUser() user: IUserPayload,
  ) {
    const result = await this.postsService.update(
      id,
      { status: dto.status },
      user,
    )
    return result
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('token')
  @ApiWrappedResponse({ type: Boolean })
  @ApiOperation({ summary: 'Delete my post by id' })
  async delete(@Param('id') id: string, @CurrentUser() user: IUserPayload): Promise<boolean> {
    const result = await this.postsService.delete(id, user)
    return result
  }

  @Post(':id/save')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('token')
  @ApiWrappedResponse({ type: Boolean })
  @ApiOperation({ summary: 'Toggle save post' })
  async toggleSave(@Param('id') id: string, @CurrentUser() user: IUserPayload): Promise<boolean> {
    const result = await this.savedPostsService.toggleSave(id, user)
    return result
  }
}
