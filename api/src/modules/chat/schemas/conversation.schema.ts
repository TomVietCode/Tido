import { MessageType } from '@common/enums'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop({ type: [String], required: true })
  participants: string[]

  @Prop({ required: false })
  postId: string

  @Prop({ type: Object })
  lastMessage: {
    content: string
    senderId: string
    type: MessageType
    createdAt: Date
    isRead: boolean
  }
}
  
export const ConversationSchema = SchemaFactory.createForClass(Conversation)
