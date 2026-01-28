import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Message } from '@modules/chat/schemas/message.schema'
import { Conversation } from '@modules/chat/schemas/conversation.schema'
import { Model } from 'mongoose'
import { CreateConversationDto } from '@modules/chat/dtos'
import { UsersService } from '@modules/users/users.service'
import { IConversationResponse } from '@modules/chat/chat.interface'
import { IMessage } from '@common/interfaces/chat'

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    private usersService: UsersService,
  ) {}

  async getConversations(userId: string) {
    const [conversations, unreadCounts] = await Promise.all([
      this.conversationModel
        .find({ participants: { $in: [userId] } })
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

  async getConversation(conversationId: string) {
    const conversation = await this.conversationModel
      .findById(conversationId)
      .lean()
    if (!conversation) return null

    const { _id, ...rest } = conversation

    return {
      id: _id.toString(),
      ...rest,
    }
  }

  async checkRoomAccess(conversationId: string, userId: string) {
    const conversation = await this.conversationModel.findById(conversationId)
    if (!conversation) return false

    if (!conversation.participants.includes(userId)) return false
    return true
  }

  async saveMessage(conversationId: string, senderId: string, content: string) {
    const newMessage = await this.messageModel.create({
      conversationId,
      senderId,
      content,
    })

    await this.conversationModel.findByIdAndUpdate(conversationId, {
      lastMessage: {
        content: newMessage.content,
        senderId: newMessage.senderId,
        createdAt: new Date(),
        isRead: false,
      },
    })

    return newMessage
  }

  async getMessages(
    conversationId: string,
    limit: number = 10,
    skip: number = 0,
  ): Promise<IMessage[]> {
    const messages = await this.messageModel
      .find({ conversationId })
      .sort({ createdAt: -1 })
      .select('_id conversationId senderId content isRead createdAt updatedAt')
      .limit(limit)
      .lean()
    messages.reverse()

    const result = messages.map((msg) => {
      const { _id, ...rest } = msg
      return {
        id: _id.toString(),
        ...rest,
      }
    })
    return result as unknown as IMessage[]
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
