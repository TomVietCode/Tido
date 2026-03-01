import { ContactRequestStatus, PostType } from '@common/enums';
import { IUserPayload } from '@common/interfaces';
import { IContactRequest, IContactRequestRes } from '@common/interfaces/contact-request';
import { CreateContactRequestDto, UpdateContactRequestStatusDto } from '@modules/contact-requests/contact-requests.dto';
import { PostsService } from '@modules/posts/posts.service';
import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@src/database/prisma/prisma.service';

@Injectable()
export class ContactRequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly postsService: PostsService
  ) {}

  async create(postId: string, dto: CreateContactRequestDto, user: IUserPayload): Promise<IContactRequest> {
    const post = await this.postsService.findOne(postId, user.id);
    if (post.type !== PostType.FOUND) 
      throw new BadRequestException('Chỉ bài đăng loại "Tìm thấy" mới cần yêu cầu xác minh')
    if (!post.securityQuestion) 
      throw new BadRequestException('Bài đăng này không cần yêu cầu xác minh')
    if (post.userId === user.id) 
      throw new BadRequestException('Bạn không thể yêu cầu xác minh cho bài đăng của mình')
    
    const existing = await this.prisma.contactRequest.findUnique({
      where: {
        postId_requesterId: { postId, requesterId: user.id }
      }
    })
    if (existing) {
      if (existing.status === ContactRequestStatus.PENDING) 
        throw new ConflictException('Bạn đã gửi yêu cầu cho bài đăng này rồi!')
      if (existing.status === ContactRequestStatus.ACCEPTED)
        throw new ConflictException('Yêu cầu của bạn đã được chấp thuận!')
      if (existing.status === ContactRequestStatus.REJECTED)
        throw new ConflictException('Yêu cầu của bạn đã bị từ chối!')
    }

    const contactRequest = await this.prisma.contactRequest.create({
      data: {
        postId,
        requesterId: user.id,
        ownerId: post.userId,
        answer: dto.answer,
      }
    })

    return contactRequest as IContactRequest;
  }

  async findAll(user: IUserPayload, status: ContactRequestStatus = ContactRequestStatus.PENDING): Promise<IContactRequestRes[]> {
    const data = await this.prisma.contactRequest.findMany({
      where: {
        ownerId: user.id,
        status
      },
      include: {
        post: { select: { id: true, title: true, securityQuestion: true } },
        requester: { select: { id: true, fullName: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc'}
    })

    return data as IContactRequestRes[];
  }
  
  async updateStatus(requestId: string, dto: UpdateContactRequestStatusDto, user: IUserPayload) {
    const request = await this.prisma.contactRequest.findUnique({
      where: { id: requestId }
    })

    if (!request) throw new NotFoundException('Yêu cầu không tồn tại')
    if (request.ownerId !== user.id) 
      throw new ForbiddenException("Bạn không có quyền xử lý yêu cầu này!")
    if (request.status !== ContactRequestStatus.PENDING) 
      throw new BadRequestException("Yêu cầu này đã được xử lý")

    return this.prisma.contactRequest.update({
      where: { id: requestId },
      data: { status: dto.status }
    })
  }
}
