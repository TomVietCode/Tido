import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/message.schema';
import { Conversation, ConversationSchema } from './schemas/conversation.schema';
import { ChatGateway } from './chat.gateway';
import { UsersService } from '@modules/users/users.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, UsersService],
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([{ name: Conversation.name, schema: ConversationSchema }]),
  ],
})
export class ChatModule {}
