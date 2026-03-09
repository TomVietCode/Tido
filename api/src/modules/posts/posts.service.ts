import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
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
import { ImageEmbeddingService } from '@modules/posts/image-embedding.service'
import { ImageSearchQueryDto } from '@modules/posts/dtos'
import { AzureVisionService } from '@modules/azure-vision/azure-vision.service'

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name)
  constructor(
    private readonly prisma: PrismaService,
    private readonly savedPost: SavedPostsService,
    private readonly imageEmbedding: ImageEmbeddingService,
    private readonly azureVision: AzureVisionService,
  ) {}

  async create(dto: CreatePostDto, user: any) {
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
          ...dto,
          userId: user.id,
          status: PostStatus.OPEN,
          hasReward: dto.type === PostType.LOST ? true : false,
        },
      })

      // Create embeddings for images (non-blocking)
      if (dto.images?.length > 0) {
        // Run asynchronously, without blocking the response to the user
        this.imageEmbedding
          .createEmbeddingsForPost(result.id, dto.images)
          .catch((err) => {
            this.logger.error(
              `Failed to create embeddings for post ${result.id}`,
              err,
            )
          })
      }
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
          select: { name: true, slug: true },
        },
        ...(userId
          ? {
              savedPosts: {
                where: { userId },
                select: { userId: true },
                take: 1,
              },
            }
          : {}),
      },
    })

    const hasNextPage = rows.length > safeLimit
    const sliced = hasNextPage ? rows.slice(0, safeLimit) : rows
    const data = sliced.map(({ savedPosts, ...rest }) => ({
      ...rest,
      isSaved: Array.isArray(savedPosts) && savedPosts.length > 0,
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

  async findByIds(ids: string[]) {
    return this.prisma.post.findMany({
      where: {
        id: { in: ids },
        status: PostStatus.OPEN,
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        user: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    })
  }

  async searchByImage(file: any, query: ImageSearchQueryDto) {
    if (!file) {
      throw new BadRequestException('Vui lòng upload ảnh để tìm kiếm')
    }

    // Step 1: Convert uploaded image to vector
    const queryVector = await this.azureVision.getImageEmbeddingFromBuffer(
      file.buffer,
    )

    // Step 2: Search for similar posts
    const matches = await this.imageEmbedding.searchSimilarPosts(
      queryVector,
      query.limit,
      query.threshold,
    )

    if (matches.length === 0) {
      return { data: [], total: 0 }
    }

    // Step 3: Get full information of the posts
    const postIds = matches.map((m) => m.postId)
    const posts = await this.findByIds(postIds)

    // Sort by distance
    const postMap = new Map(posts.map((p) => [p.id, p]))
    const sortedPosts = matches
      .map((m) => {
        const post = postMap.get(m.postId)
        if (!post) return null
        return {
          ...post,
          similarity: Number((1 - m.distance).toFixed(4)),
          matchedImage: m.imageUrl,
        }
      })
      .filter(Boolean)

    return {
      data: sortedPosts,
      total: sortedPosts.length,
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

  async findMyPosts(query: GetMyPostsQueryDto, user: IUserPayload) {
    const {
      limit = 20,
      cursor,
      status,
      type,
      sortOrder = SortOrder.DESC,
    } = query
    const safeLimit = Math.min(limit, 30)
    const where: any = { userId: user.id }

    if (type) where.type = type
    if (status) where.status = status

    const [rows, totalPosts, totalResolved] = await Promise.all([
      this.prisma.post.findMany({
        where,
        take: safeLimit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        orderBy: { createdAt: sortOrder },
        select: {
          id: true,
          userId: true,
          title: true,
          images: true,
          type: true,
          status: true,
          hasReward: true,
          location: true,
          happenedAt: true,
          createdAt: true,
          category: {
            select: { name: true, slug: true },
          },
        },
      }),
      this.prisma.post.count({ where: { userId: user.id } }),
      this.prisma.post.count({
        where: { userId: user.id, status: PostStatus.CLOSED },
      }),
    ])

    const hasNextPage = rows.length > safeLimit
    const data = hasNextPage ? rows.slice(0, safeLimit) : rows
    const nextCursor = hasNextPage ? data[data.length - 1].id : null

    return {
      meta: {
        limit: safeLimit,
        hasNextPage,
        nextCursor,
      },
      summary: {
        totalPosts,
        totalResolved,
      },
      data,
    }
  }

  async findOne(id: string, requesterId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        category: true,
        user: {
          select: {
            fullName: true,
            avatarUrl: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    })
    if (!post) throw new NotFoundException('Bài viết không tồn tại')

    if (post.status === PostStatus.HIDDEN && post.userId !== requesterId) {
      throw new NotFoundException('Bài viết không tồn tại')
    }

    if (!post.contactVisible && post.user) {
      delete (post.user as any).email
      delete (post.user as any).phoneNumber
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

  // ─── Admin Methods ───────────────────────────────────────────

  async adminFindAll(query: any) {
    const {
      page = 1,
      limit = 10,
      search,
      catId,
      status,
      type,
      sortOrder = SortOrder.DESC,
    } = query
    const skip = (page - 1) * limit
    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (catId) where.categoryId = catId
    if (type) where.type = type
    if (status) where.status = status

    const [data, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: sortOrder },
        select: {
          id: true,
          title: true,
          images: true,
          type: true,
          status: true,
          createdAt: true,
          category: {
            select: { name: true, slug: true },
          },
          user: {
            select: { fullName: true, avatarUrl: true },
          },
        },
      }),
      this.prisma.post.count({ where }),
    ])

    return {
      meta: {
        current: page,
        pageSize: limit,
        pages: Math.ceil(total / limit),
        total,
      },
      result: data,
    }
  }

  async adminFindOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        category: true,
        user: {
          select: {
            fullName: true,
            avatarUrl: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    })
    if (!post) throw new NotFoundException('Bài viết không tồn tại')
    return post
  }

  async adminToggleHide(id: string): Promise<any> {
    const post = await this.prisma.post.findUnique({ where: { id } })
    if (!post) throw new NotFoundException('Bài viết không tồn tại')

    const newStatus =
      post.status === PostStatus.HIDDEN ? PostStatus.OPEN : PostStatus.HIDDEN

    const updated = await this.prisma.post.update({
      where: { id },
      data: { status: newStatus },
    })
    return updated
  }

  async adminDelete(id: string): Promise<boolean> {
    const post = await this.prisma.post.findUnique({ where: { id } })
    if (!post) throw new NotFoundException('Bài viết không tồn tại')

    await this.prisma.post.delete({ where: { id } })
    return true
  }
}
