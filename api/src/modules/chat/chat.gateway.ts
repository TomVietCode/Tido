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
import { UseGuards } from '@nestjs/common'
import { WsJwtGuard } from '@modules/chat/guards/ws-jwt.guard'
import { ChatService } from '@modules/chat/chat.service'

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
  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody('conversationId') conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client['user'].id
    const canAccess = await this.chatService.checkRoomAccess(conversationId, userId)
    if (!canAccess) {
      throw new WsException("Bạn không có quyền truy cập đoạn chat này")
    }
    client.join(conversationId)
    console.log(`User ${client['user'].id} joined room: ${conversationId}`)
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; content: string },
  ) {
    const user = client['user']
    const message = {
      senderId: user.id,
      content: data.content,
      createdAt: new Date(),
    }
    console.log(message)
    this.server.to(data.conversationId).emit('new_message', message)
  }
}
