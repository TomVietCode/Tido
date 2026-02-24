import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common'
import { ChatService } from '@modules/chat/chat.service'
import { ApiAuth } from '@common/decorators'
import { CreateConversationDto } from '@modules/chat/dtos'
import { IUserPayload } from '@common/interfaces'
import { CurrentUser } from '@modules/auth/decorators/user.decorator'
import { IMessage, SearchUserResponse } from '@common/interfaces'
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

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
    @CurrentUser() user: IUserPayload,
    @Param('id') conversationId: string,
    @Query('limit') limit = 50,
    @Query('cursor') cursor?: string,
  ) {
    const canAccess = await this.chatService.checkRoomAccess(
      conversationId,
      user.id,
    )
    if (!canAccess)
      throw new ForbiddenException('Bạn không có quyền truy cập đoạn chat này')

    const result = await this.chatService.getMessages(
      conversationId,
      Number(limit),
      cursor,
    )
    return result
  }

  @Delete('conversation/:id')
  @ApiAuth()
  async deleteConversation(
    @CurrentUser() user: IUserPayload,
    @Param('id') conversationId: string,
  ) {
    return this.chatService.deleteConversationForMe(conversationId, user.id)
  }

  @Get('unread-count')
  @ApiAuth()
  async getUnReadCount(@CurrentUser() user: IUserPayload) {
    const { total } = await this.chatService.getUnreadCounts(user.id)
    return total
  }
  
  @Get('search')
  @ApiAuth()
  async searchUser(
    @CurrentUser() user: IUserPayload,
    @Query('query') query: string,
  ): Promise<SearchUserResponse[]> {
    if (!query || query.trim().length < 2) {
      return []
    }
    const decodedQuery = decodeURIComponent(query.trim())
    const result = await this.chatService.searchUser(user.id, decodedQuery)

    return result
  }
}
