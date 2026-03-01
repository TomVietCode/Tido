import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '@src/database/prisma/prisma.service'
import {
  CreatePostDto,
  GetMyPostsQueryDto,
  GetPostsQueryDto,
  UpdatePostDto,
} from '@src/modules/posts/dtos/post.dto'
import { PostStatus, PostType, SortOrder, UserStatus } from '@common/enums'
import { IUserPayload } from '@common/interfaces'
import { SavedPostsService } from '@modules/saved-posts/saved-posts.service'

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly savedPost: SavedPostsService,
  ) {}

  async create(dto: CreatePostDto, user: any) {
    const { location, ...rest } = dto
    if (user.status === UserStatus.BANNED) {
      throw new ForbiddenException('Tài khoản của bạn đã bị khóa')
    }
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    })
    if (!category) {
      throw new BadRequestException('Danh mục không tồn tại')
    }

    if (dto?.images?.length > 5) {
      throw new BadRequestException('Số lượng ảnh không được vượt quá 5')
    }
    try {
      const result = await this.prisma.post.create({
        data: {
          ...rest,
          userId: user.id,
          status: PostStatus.OPEN,
        },
      })
      return result
    } catch (error) {
      throw new InternalServerErrorException('Có lỗi xảy ra khi tạo bài viết')
    }
  }

  async findAll(query: GetPostsQueryDto, userId?: string) {
    const {
      limit = 20,
      search,
      catSlug,
      catId,
      type,
      sortOrder = SortOrder.DESC,
      cursor,
    } = query
    const safeLimit = Math.min(limit, 30)

    const where: any = { status: PostStatus.OPEN }
    if (userId) where.userId = { not: userId }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (catId) where.categoryId = catId
    if (catSlug) where.category = { slug: catSlug }
    if (type) where.type = type

    const rows = await this.prisma.post.findMany({
      where,
      take: safeLimit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { id: sortOrder },
      select: {
        id: true,
        userId: true,
        title: true,
        images: true,
        type: true,
        hasReward: true,
        location: true,
        securityQuestion: true,
        happenedAt: true,
        createdAt: true,
        category: {
          select: { name: true, slug: true, },
        },
        ...(userId ? {
          savedPosts: {
            where: { userId },
            select: { userId: true },
            take: 1,
          }
        } : {})
      },
    })

    const hasNextPage = rows.length > safeLimit
    const sliced = hasNextPage ? rows.slice(0, safeLimit) : rows
    const data = sliced.map(({ savedPosts, ...rest }) => ({
      ...rest,
      isSaved: Array.isArray(savedPosts) && savedPosts.length > 0
    }))
    const nextCursor = hasNextPage ? data[data.length - 1].id : null

    return {
      meta: {
        limit: safeLimit,
        hasNextPage,
        nextCursor,
      },
      data,
    }
  }

  // async findMyPosts(query: GetMyPostsQueryDto, user: IUserPayload) {
  //   const {
  //     page = 1,
  //     limit = 10,
  //     catSlug,
  //     catId,
  //     status,
  //     type,
  //     sortBy = 'createdAt',
  //     sortOrder = SortOrder.DESC,
  //   } = query
  //   const skip = (page - 1) * limit
  //   const where: any = { userId: user.id }

  //   if (catId) where.categoryId = catId
  //   if (catSlug) where.category = { slug: catSlug }
  //   if (type) where.type = type
  //   if (status) where.status = status

  //   const [data, total] = await Promise.all([
  //     this.prisma.post.findMany({
  //       where,
  //       skip,
  //       take: limit,
  //       orderBy: { [sortBy]: sortOrder },
  //     }),
  //     this.prisma.post.count({ where }),
  //   ])

  //   return {
  //     meta: {
  //       total,
  //       page,
  //       limit,
  //       totalPages: Math.ceil(total / limit),
  //     },
  //     data,
  //   }
  // }

  async findSavedPosts(user: IUserPayload) {
    const savedPosts = await this.savedPost.findAll(user)
    const savedPostIds = savedPosts.map((savedPost) => savedPost.postId)
    const where = {
      id: { in: savedPostIds },
      status: { not: PostStatus.HIDDEN },
    }
    const [result, total] = await Promise.all([
      this.prisma.post.findMany({ where }),
      this.prisma.post.count({ where }),
    ])
    return {
      meta: { total },
      data: result,
    }
  }

  async findOne(id: string, requesterId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        category: true,
        user: { select: { fullName: true, avatarUrl: true } },
      },
    })
    if (!post) throw new NotFoundException('Bài viết không tồn tại')

    if (post.status === PostStatus.HIDDEN && post.userId !== requesterId) {
      throw new NotFoundException('Bài viết không tồn tại')
    }

    return post
  }

  async update(id: string, dto: UpdatePostDto, user: IUserPayload) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    })
    if (!post) throw new NotFoundException('Bài viết không tồn tại')
    if (post.userId !== user.id)
      throw new ForbiddenException('Bạn không có quyền cập nhật bài viết này')

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: dto,
    })

    return updatedPost
  }

  async delete(id: string, user: IUserPayload): Promise<boolean> {
    const post = await this.prisma.post.findUnique({ where: { id } })
    if (!post) throw new NotFoundException('Không tìm thấy bài viết')
    if (post.userId !== user.id)
      throw new ForbiddenException('Bạn không có quyền xóa bài viết này')

    await this.prisma.post.delete({ where: { id } })

    return true
  }
}
