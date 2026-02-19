import { MessageType } from '@common/enums'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop({ type: [String], required: true })
  participants: string[]

  @Prop({ required: true })
  participantKey: string 

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

  @Prop({ type: [String], default: [] })
  deletedBy: string[]
}
  
export const ConversationSchema = SchemaFactory.createForClass(Conversation)
ConversationSchema.index({ participantKey: 1 }, { unique: true, name: 'uniq_dm_pair' })
ConversationSchema.index({ participants: 1, updatedAt: -1 }, { name: 'list_by_user' })