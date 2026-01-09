import { Injectable } from '@nestjs/common';
import { IUserPayload } from '@common/interfaces';
import { PrismaService } from '@src/database/prisma/prisma.service';
import { PostStatus } from '@src/common/enums';

@Injectable()
export class SavedPostsService {
  constructor(private readonly prisma: PrismaService) {}
  create(createSavedPostDto: any) {
    return 'This action adds a new savedPost';
  }

  async findAll(user: IUserPayload) {
    const where = {
      userId: user.id,
      post: {
        status: { not: PostStatus.HIDDEN }
      }
    }
    const [savedPosts, total] = await Promise.all([
      this.prisma.savedPost.findMany({
        where,
        include: {
          post: {
            include: {
              category: { select: { name: true, slug: true } },
              user: { select: { fullName: true, avatarUrl: true } },
            },
          },
        },
      }),
      this.prisma.savedPost.count({
        where,
      }),
    ])

    return {
      meta: {
        total,
      },
      data: savedPosts
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} savedPost`;
  }

  update(id: number, updateSavedPostDto: any) {
    return `This action updates a #${id} savedPost`;
  }

  remove(id: number) {
    return `This action removes a #${id} savedPost`;
  }
}
