import { Body, Controller, Get, Post } from '@nestjs/common'
import { ChatService } from '@modules/chat/chat.service'
import { ApiAuth } from '@common/decorators'
import { CreateConversationDto } from '@modules/chat/dtos'
import { IUserPayload } from '@common/interfaces'
import { CurrentUser } from '@modules/auth/decorators/user.decorator'

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiAuth()
  async createConversation(@Body() createConversationDto: CreateConversationDto) {
    const data = await this.chatService.createConversation(createConversationDto)
    return data
  }

  @Get('conversations')
  @ApiAuth()
  async getConversations(@CurrentUser() user: IUserPayload) {
    const data = await this.chatService.getConversations(user.id)
    return data
  }
}
