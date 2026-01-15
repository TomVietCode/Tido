import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Message } from '@modules/chat/schemas/message.schema'
import { Conversation } from '@modules/chat/schemas/conversation.schema'
import { Model } from 'mongoose'
import { CreateConversationDto } from '@modules/chat/dtos'

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(Conversation.name) private conversationModel: Model<Conversation>,
  ) {}
  async createConversation(dto: CreateConversationDto) {
    const { participants, postId } = dto 
    const existingConversation = await this.conversationModel.findOne({ participants })
    if (existingConversation) {
      return existingConversation
    }
    const conversation = await this.conversationModel.create({
      participants,
      postId
    })
    return conversation
  }

  async checkRoomAccess(conversationId: string, userId: string) {
    const conversation = await this.conversationModel.findById(conversationId)
    if(!conversation) return false

    if (!conversation.participants.includes(userId)) return false
    return true
  }

  async saveMessage(conversationId: string, senderId: string, content: string) {
    const newMessage = await this.messageModel.create({
      conversationId,
      senderId,
      content
    })

    await this.conversationModel.findByIdAndUpdate(conversationId, {
      lastMessage: {
        content: newMessage.content,
        senderId: newMessage.senderId,
        createdAt: new Date()
      }
    })

    return newMessage
  }

  async getMessage(conversationId: string, limit: number = 10, skip: number = 0) {
    const messages = await this.messageModel.find({ conversationId }).sort({ createdAt: -1 }).skip(skip).limit(limit)
    return messages
  }
}
