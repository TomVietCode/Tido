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
    @MessageBody() data: { conversationId: string; content: string },
  ) {
    const user = client['user']

    const result = await this.chatService.saveMessage(
      data.conversationId,
      user.sub,
      data.content,
    )

    const conv = await this.chatService.getConversation(data.conversationId)

    const message = {
      id: result._id.toString(),
      conversationId: data.conversationId,
      senderId: user.sub,
      content: data.content,
      isRead: result.isRead,
      createdAt: new Date(),
    }
    this.server.to(data.conversationId).emit('new_message', message)

    const recipientId = conv?.participants.find(pId => pId !== user.sub)
    if (recipientId) {
      this.server.to(recipientId).emit('conversation_updated', message)
    }
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
}
