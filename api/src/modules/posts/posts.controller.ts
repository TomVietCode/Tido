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
import { ApiTags } from '@nestjs/swagger'
import {
  CreatePostDto,
  GetAdminPostsQueryDto,
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
import { ApiAuth, DocsInfo } from '@common/decorators'
import { PostListResponseDto, PostResponseDto } from '@modules/posts/dtos'
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard'
import { RoleGuard } from '@modules/auth/guards/role.guard'
import { Roles } from '@modules/auth/decorators/role.decorator'
import { Role } from '@common/enums'

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly savedPostsService: SavedPostsService,
  ) {}

  @Post()
  @ApiAuth()
  @DocsInfo({ summary: 'Create a new post', type: PostResponseDto })
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
  @UseGuards(JwtAuthGuard)
  @DocsInfo({
    summary: 'Get all posts',
    type: PostListResponseDto,
    paginated: true,
  })
  async findAll(
    @CurrentUser() user: IUserPayload,
    @Query() query: GetPostsQueryDto,
  ): Promise<IPostsPaginatedResponse> { 
    const data = await this.postsService.findAll(query, user?.id)
    return data as IPostsPaginatedResponse
  }

  @Get('me')
  @ApiAuth()
  @DocsInfo({
    summary: 'Get all my posts',
    type: PostListResponseDto,
    paginated: true,
  })
  async findMyPosts(
    @Query() query: GetMyPostsQueryDto,
    @CurrentUser() user: IUserPayload,
  ): Promise<any> {
    const result = await this.postsService.findMyPosts(query, user)
    return result
  }

  @Get('saved')
  @ApiAuth()
  @DocsInfo({
    summary: 'Get my saved posts',
    type: PostListResponseDto,
    paginated: true,
  })
  async findSavedPosts(@CurrentUser() user: IUserPayload) {
    const result = await this.savedPostsService.findAll(user)
    return result
  }

  @Get(':id')
  @Public()
  @DocsInfo({ summary: 'Get a post by id', type: PostResponseDto })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: IUserPayload,
  ): Promise<IPost> {
    const result = await this.postsService.findOne(id, user?.id)
    return result as IPost
  }

  @Patch(':id')
  @ApiAuth()
  @DocsInfo({ summary: 'Update my post by id', type: PostResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @CurrentUser() user: IUserPayload,
  ) {
    const result = await this.postsService.update(id, dto, user)
    return result
  }

  @Patch(':id/status')
  @ApiAuth()
  @DocsInfo({
    summary: 'Update the status of my post by id',
    type: PostResponseDto,
  })
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
  @ApiAuth()
  @DocsInfo({ summary: 'Delete my post by id', type: Boolean })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: IUserPayload,
  ): Promise<boolean> {
    const result = await this.postsService.delete(id, user)
    return result
  }

  @Post(':id/save')
  @ApiAuth()
  @DocsInfo({ summary: 'Toggle save post', type: Boolean })
  async toggleSave(
    @Param('id') postId: string,
    @CurrentUser() user: IUserPayload,
  ): Promise<boolean> {
    const result = await this.savedPostsService.toggleSave(postId, user)
    return result
  }

  // ─── Admin Endpoints ─────────────────────────────────────────

  @Get('admin/list')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @DocsInfo({
    summary: 'Admin: Get all posts (paginated)',
    type: PostListResponseDto,
    paginated: true,
  })
  async adminFindAll(@Query() query: GetAdminPostsQueryDto) {
    return this.postsService.adminFindAll(query)
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @DocsInfo({ summary: 'Admin: Get post detail', type: PostResponseDto })
  async adminFindOne(@Param('id') id: string) {
    return this.postsService.adminFindOne(id)
  }

  @Patch('admin/:id/toggle-hide')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @DocsInfo({ summary: 'Admin: Toggle post visibility', type: PostResponseDto })
  async adminToggleHide(@Param('id') id: string) {
    return this.postsService.adminToggleHide(id)
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @DocsInfo({ summary: 'Admin: Delete a post', type: Boolean })
  async adminDelete(@Param('id') id: string): Promise<boolean> {
    return this.postsService.adminDelete(id)
  }
}
