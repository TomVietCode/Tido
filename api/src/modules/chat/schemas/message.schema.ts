import { MessageType } from '@common/enums'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true })
  conversationId: Types.ObjectId

  @Prop({ required: true })
  senderId: string

  @Prop({ required: false })
  content: string

  @Prop({ default: MessageType.TEXT, enum: MessageType })
  type: MessageType
  
  @Prop({ required: false, type: [String] })
  imageUrls: string[]
  
  @Prop({ default: false })
  isRead: boolean
}

export const MessageSchema = SchemaFactory.createForClass(Message)

MessageSchema.index(
  { conversationId: 1, createdAt: -1 },
  { name: 'cursor_pagination_index' },
)
