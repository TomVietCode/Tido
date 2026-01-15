import { Body, Controller, Post } from '@nestjs/common'
import { ChatService } from '@modules/chat/chat.service'
import { ApiAuth } from '@common/decorators'
import { CreateConversationDto } from '@modules/chat/dtos'

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiAuth()
  async createConversation(@Body() createConversationDto: CreateConversationDto) {
    const data = await this.chatService.createConversation(createConversationDto)
    return data
  }
}
