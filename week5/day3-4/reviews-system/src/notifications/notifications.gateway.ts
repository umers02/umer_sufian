import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>(); // userId -> socketId

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (token) {
        const payload = jwt.verify(token, process.env.JWT_SECRET) as any;
        const userId = payload.id;
        
        this.connectedUsers.set(userId, client.id);
        client.join(`user_${userId}`);
        client.data.userId = userId;
      } else {
        client.disconnect();
      }
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.connectedUsers.delete(userId);
      console.log(`User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
  }

  broadcastNotification(notification: any) {
    this.server.emit('new_notification', notification);
  }

  sendToUser(userId: string, notification: any) {
    this.server.to(`user_${userId}`).emit('notification', notification);
  }

  notifyProductRoom(productId: string, data: any) {
    this.server.to(`product_${productId}`).emit('product_update', data);
  }
}