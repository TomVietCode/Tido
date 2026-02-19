import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Message } from '@modules/chat/schemas/message.schema'
import { Conversation } from '@modules/chat/schemas/conversation.schema'
import { Model } from 'mongoose'
import { CreateConversationDto } from '@modules/chat/dtos'
import { UsersService } from '@modules/users/users.service'
import { IConversationResponse } from '@modules/chat/chat.interface'
import { IMessage } from '@common/interfaces/chat'
import { MessageType } from '@common/enums'

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    private usersService: UsersService,
  ) {}

  private buildParticipantKey(a: string, b: string) {
    return [a, b].sort().join(':')
  }

  async findConversationBetween(userA: string, userB: string) {
    const participantKey = this.buildParticipantKey(userA, userB)
    return this.conversationModel.findOne({ participantKey }).lean()
  }

  async getConversations(userId: string) {
    const [conversations, unreadCounts] = await Promise.all([
      this.conversationModel
        .find({
          participants: { $in: [userId] },
          deletedBy: { $nin: [userId] },
        })
        .sort({ updatedAt: -1 })
        .lean(),
      this.getUnreadCounts(userId),
    ])

    if (conversations.length === 0) return []

    const otherUserIds = conversations.map((conv) =>
      conv.participants.find((pId) => pId !== userId),
    )
    const findUserOptions = {
      where: { id: { in: otherUserIds } },
      select: { id: true, fullName: true, avatarUrl: true },
    }
    const users = await this.usersService.findMany(findUserOptions)
    const userMap = users.reduce((acc, user) => {
      acc[user.id] = user
      return acc
    }, {})

    const result = conversations.map((conv) => {
      const otherId = conv.participants.find((pId) => pId !== userId)
      const { _id, ...rest } = conv
      return {
        ...rest,
        id: _id.toString(),
        recipient: userMap[otherId!],
        unreadCount: unreadCounts[_id.toString()] || 0,
      }
    })
    return result as IConversationResponse[]
  }

  async createConversation(dto: CreateConversationDto) {
    const { participants, postId } = dto
    const existingConversation = await this.conversationModel.findOne({
      participants,
    })
    if (existingConversation) {
      return existingConversation
    }
    const conversation = await this.conversationModel.create({
      participants,
      postId,
    })

    const { _id, ...rest } = conversation.toObject()
    return {
      id: _id.toString(),
      ...rest,
    }
  }

  async deleteConversationForMe(conversationId: string, userId: string): Promise<boolean> {
    const conv = await this.conversationModel.findById(conversationId).lean()
    if (!conv) throw new NotFoundException('Cuộc trò chuyện không tồn tại')
  
    if (!conv.participants.includes(userId)) {
      throw new ForbiddenException('Bạn không có quyền thao tác cuộc trò chuyện này')
    }
  
    await this.conversationModel.findByIdAndUpdate(conversationId, {
      $addToSet: { deletedBy: userId },
    })
  
    return true
  }

  async checkRoomAccess(conversationId: string, userId: string) {
    const conversation = await this.conversationModel.findById(conversationId)
    if (!conversation) return false

    if (!conversation.participants.includes(userId)) return false

    if ((conversation.deletedBy || []).includes(userId)) return false

    return true
  }

  async sendMessageAtomic(params: {
    senderId: string
    conversationId?: string
    recipientId?: string
    content: string
    type: MessageType
    imageUrls?: string[]
  }) {
    const {
      senderId,
      conversationId,
      recipientId,
      content,
      type,
      imageUrls = [],
    } = params

    let conversation: any
    if (conversationId) {
      conversation = await this.conversationModel.findById(conversationId)
    } else {
      if (!recipientId)
        throw new Error('recipientId is required for draft send')

      const participantKey = this.buildParticipantKey(senderId, recipientId)
      conversation = await this.conversationModel.findOneAndUpdate(
        { participantKey },
        {
          $setOnInsert: {
            participants: [senderId, recipientId],
            participantKey,
          },
        },
        { upsert: true, returnDocument: 'after' },
      )
    }

    const message = await this.messageModel.create({
      conversationId: conversation._id.toString(),
      senderId,
      content,
      type,
      imageUrls,
    })

    const lastMsgContent = type === MessageType.IMAGE ? '[Hình ảnh]' : content
    await this.conversationModel.findByIdAndUpdate(conversation._id, {
      $set: {
        lastMessage: {
          content: lastMsgContent,
          senderId,
          type,
          createdAt: new Date(),
          isRead: false,
        },
      },
      $pull: {
        deletedBy: { $in: conversation.participants }
      }
    })

    return {
      conversationId: conversation._id.toString(),
      participants: conversation.participants,
      message,
      createdConversation: !conversationId,
    }
  }

  async getMessages(
    conversationId: string,
    limit: number = 50,
    cursor?: string,
  ): Promise<{
    messages: IMessage[]
    nextCursor: string | null
    hasMore: boolean
  }> {
    const filter: any = { conversationId }

    if (cursor) {
      filter.createdAt = { $lt: new Date(cursor) }
    }

    const messages = await this.messageModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .lean()

    const hasMore = messages.length > limit
    if (hasMore) {
      messages.pop()
    }
    messages.reverse()

    const result = messages.map((msg) => {
      const { _id, ...rest } = msg
      return {
        id: _id.toString(),
        ...rest,
      }
    })

    // calculate next cursor
    const nextCursor =
      hasMore && messages.length > 0
        ? (result[0] as any).createdAt.toISOString()
        : null

    return {
      messages: result as unknown as IMessage[],
      nextCursor,
      hasMore,
    }
  }

  async searchUser(userId: string, query: string) {
    const findUserOptions = {
      where: {
        id: { not: userId },
        fullName: { contains: query, mode: 'insensitive' },
      },
      select: { id: true, fullName: true, avatarUrl: true },
    }
    const result = await this.usersService.findMany(findUserOptions)
    return result
  }

  async markAsRead(conversationId: string, userId: string): Promise<number> {
    const result = await this.messageModel.updateMany(
      {
        conversationId,
        senderId: { $ne: userId },
        isRead: false,
      },
      { $set: { isRead: true } },
    )

    // update conversation last message
    const lastMsg = await this.messageModel
      .findOne({ conversationId })
      .sort({ createdAt: -1 })
      .lean()

    if (lastMsg && lastMsg.senderId !== userId) {
      await this.conversationModel.findByIdAndUpdate(conversationId, {
        'lastMessage.isRead': true,
      })
    }

    // return number of messages marked as read
    return result.modifiedCount
  }

  async getUnreadCounts(userId: string): Promise<Record<string, number>> {
    const result = await this.messageModel.aggregate([
      {
        $match: {
          senderId: { $ne: userId },
          isRead: false,
        },
      },
      {
        $group: {
          _id: '$conversationId',
          count: { $sum: 1 },
        },
      },
    ])

    return result.reduce((acc, item) => {
      acc[item._id.toString()] = item.count
      return acc
    }, {})
  }
}
