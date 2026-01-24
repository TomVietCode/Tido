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
  ) { }

  async getConversations(userId: string) {
    const conversations = await this.conversationModel
      .find({ participants: { $in: [userId] } })
      .sort({ updatedAt: -1 })
      .lean()
    if (conversations.length === 0) return []

    const otherUserIds = conversations.map(conv => conv.participants.find(pId => pId !== userId))
    const users = await this.usersService.findManyByIds(otherUserIds)
    const userMap = users.reduce((acc, user) => {
      acc[user.id] = user
      return acc
    }, {})

    const result = conversations.map((conv) => {
      const otherId = conv.participants.find(pId => pId !== userId)
      const { _id, ...rest } = conv
      return {
        ...rest,
        id: _id.toString(),
        recipient: userMap[otherId!]
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
    return conversation
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
      },
    })

    return newMessage
  }

  async getMessages(conversationId: string, limit: number = 10, skip: number = 0): Promise<IMessage[]> {
    const messages = await this.messageModel
      .find({ conversationId })
      .sort({ createdAt: 1 })
      .select('_id conversationId senderId content isRead createdAt updatedAt')
      .skip(skip)
      .limit(limit)
      .lean()

    const result = messages.map((msg) => {
      const { _id, ...rest } = msg
      return {
        id: _id.toString(),
        ...rest,
      }
    })
    return result as unknown as IMessage[]
  }
}
