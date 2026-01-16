import { Injectable } from '@nestjs/common'
import { IUserPayload } from '@common/interfaces'
import { PrismaService } from '@src/database/prisma/prisma.service'
import { PostStatus } from '@src/common/enums'

@Injectable()
export class SavedPostsService {
  constructor(private readonly prisma: PrismaService) {}
  async toggleSave(postId: string, user: IUserPayload) {
    const where = { userId_postId: { userId: user.id, postId } }
    const savedPost = await this.prisma.savedPost.findUnique({ where })
    if (savedPost) {
      await this.prisma.savedPost.delete({ where })
    } else {
      await this.prisma.savedPost.create({
        data: {
          userId: user.id,
          postId,
        },
      })
    }
    return true
  }

  async findAll(user: IUserPayload) {
    const where = {
      userId: user.id,
      post: {
        status: { not: PostStatus.HIDDEN },
      },
    }
    const savedPosts = await this.prisma.savedPost.findMany({
      where,
    })
    return savedPosts
  }
}
