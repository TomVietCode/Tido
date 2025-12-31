import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePostDto } from '@/modules/posts/post.dto';
import { PostStatus, UserStatus } from '@/common/enums';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(dto: CreatePostDto, user: any){
    const { location, ...rest } = dto
    if (user.status === UserStatus.BANNED) {
      throw new ForbiddenException("Tài khoản của bạn đã bị khóa")
    }
    const category = await this.prisma.category.findUnique({ where: { id: dto.categoryId } })
    if (!category) {
      throw new BadRequestException("Danh mục không tồn tại")
    }

    if (dto?.images?.length > 5) {
      throw new BadRequestException("Số lượng ảnh không được vượt quá 5")
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
      throw new InternalServerErrorException("Có lỗi xảy ra khi tạo bài viết")
    }
  }
}
