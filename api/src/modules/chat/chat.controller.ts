import { Body, Controller, ForbiddenException, Get, Param, Post, Query } from '@nestjs/common'
import { ChatService } from '@modules/chat/chat.service'
import { ApiAuth } from '@common/decorators'
import { CreateConversationDto } from '@modules/chat/dtos'
import { IUserPayload } from '@common/interfaces'
import { CurrentUser } from '@modules/auth/decorators/user.decorator'
import { IMessage } from '@common/interfaces/chat'

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Post()
  @ApiAuth()
  async createConversation(
    @Body() createConversationDto: CreateConversationDto,
  ) {
    const data = await this.chatService.createConversation(
      createConversationDto,
    )
    return data
  }

  @Get('conversations')
  @ApiAuth()
  async getConversations(@CurrentUser() user: IUserPayload) {
    const data = await this.chatService.getConversations(user.id)
    return data
  }

  @Get('conversation/:id/messages')
  @ApiAuth()
  async getMessages(
    @Param('id') conversationId: string,
    @Query('limit') limit = 50,
    @Query('skip') skip = 0,
    @CurrentUser() user: IUserPayload,
  ): Promise<IMessage[]> {
    const canAccess = await this.chatService.checkRoomAccess(
      conversationId,
      user.id,
    )
    if(!canAccess) throw new ForbiddenException("Bạn không có quyền truy cập đoạn chat này")

    return this.chatService.getMessages(conversationId, Number(limit), Number(skip))
  }
}
