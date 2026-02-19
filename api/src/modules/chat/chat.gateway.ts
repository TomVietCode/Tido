import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { ChatService } from '@modules/chat/chat.service'
import { UseGuards } from '@nestjs/common'
import { WsJwtGuard } from '@modules/chat/guards/ws-jwt.guard'
import { MessageType } from '@common/enums'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}
  @WebSocketServer()
  server: Server

  async handleConnection(client: Socket) {
    try {
      console.log(`Client connected: ${client.id}`)
    } catch (e) {
      client.disconnect()
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`)
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('authenticate')
  async handleAuthenticate(@ConnectedSocket() client: Socket) {
    const userId = client['user'].sub
    client.join(userId)
    console.log(`User ${userId} authenticated`)
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody('conversationId') conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client['user'].sub
    const canAccess = await this.chatService.checkRoomAccess(
      conversationId,
      userId,
    )
    if (!canAccess) {
      throw new WsException('Bạn không có quyền truy cập đoạn chat này')
    }
    client.join(conversationId)
    console.log(`User ${client['user'].sub} joined room: ${conversationId}`)
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('leave_room')
  async handleLeaveRoom(
    @MessageBody('conversationId') conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(conversationId)
    console.log(`User ${client['user'].sub} left room: ${conversationId}`)
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      conversationId?: string
      recipientId?: string
      content: string
      type?: MessageType
      imageUrls: string[]
    },
  ) {
    const senderId = client['user'].sub

    const result = await this.chatService.sendMessageAtomic({
      senderId,
      conversationId: data.conversationId,
      recipientId: data.recipientId,
      content: data.content,
      type: data.type || MessageType.TEXT,
      imageUrls: data.imageUrls || [],
    })

    const messagePayload = {
      id: result.message._id.toString(),
      conversationId: result.conversationId,
      senderId,
      content: result.message.content,
      type: result.message.type,
      imageUrls: result.message.imageUrls || [],
      isRead: result.message.isRead,
      createdAt: result.message.createdAt,
    }

    // conversation room
    this.server.to(result.conversationId).emit('new_message', messagePayload)
    // user channels so both users update sidebar even before joining room
    this.server.to(senderId).emit('conversation_updated', messagePayload)
    const recipientId = result.participants.find(
      (id: string) => id !== senderId,
    )
    if (recipientId)
      this.server.to(recipientId).emit('conversation_updated', messagePayload)

    return { ok: true, conversationId: result.conversationId }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('mark_as_read')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody('conversationId') conversationId: string,
  ) {
    const userId = client['user'].sub

    const count = await this.chatService.markAsRead(conversationId, userId)

    if (count > 0) {
      this.server.to(conversationId).emit('messages_read', {
        conversationId,
      })
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('start_typing')
  async handleStartTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody('conversationId') conversationId: string,
  ) {
    this.server.to(conversationId).emit('user_typing', {
      userId: client['user'].sub,
      conversationId,
    })
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('stop_typing')
  async handleStopTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody('conversationId') conversationId: string,
  ) {
    this.server.to(conversationId).emit('user_stopped_typing', {
      userId: client['user'].sub,
      conversationId,
    })
  }
}
