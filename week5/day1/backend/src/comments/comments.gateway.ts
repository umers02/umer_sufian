import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommentsService } from './comments.service';

@WebSocketGateway({
  cors: {
      origin: [
      'http://localhost:3000',               // local frontend
      'https://real-time-comments-frontend.vercel.app',    // production frontend
    ],
    methods: ["GET", "POST"],
    credentials: true,
  }
})
export class CommentsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>();

  constructor(private commentsService: CommentsService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    
    // Send existing comments to new client
    const comments = this.commentsService.getAllComments();
    client.emit('existing_comments', comments);
    
    // Broadcast user count
    this.server.emit('user_count', this.connectedUsers.size + 1);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedUsers.delete(client.id);
    this.server.emit('user_count', this.connectedUsers.size);
  }

  @SubscribeMessage('join')
  handleJoin(@MessageBody() username: string, @ConnectedSocket() client: Socket) {
    this.connectedUsers.set(client.id, username);
    this.server.emit('user_count', this.connectedUsers.size);
    console.log(`${username} joined the chat`);
  }

  @SubscribeMessage('add_comment')
  handleAddComment(
    @MessageBody() data: { username: string; message: string; parentId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const comment = this.commentsService.addComment(data.username, data.message, data.parentId);
    
    // Broadcast updated comments tree to all clients so everyone receives the nested structure immediately
    const updatedComments = this.commentsService.getAllComments();
    this.server.emit('existing_comments', updatedComments);

    // Emit to all clients except sender (kept for backward-compatibility/notifications)
    client.broadcast.emit('new_comment', comment);
    
    // Send confirmation to sender
    client.emit('comment_added', comment);
    
    console.log(`New comment from ${data.username}: ${data.message}`);
  }

  @SubscribeMessage('delete_comment')
  handleDeleteComment(
    @MessageBody() data: { commentId: string; username: string },
    @ConnectedSocket() client: Socket,
  ) {
    const deleted = this.commentsService.deleteComment(data.commentId, data.username);
    
    if (deleted) {
      const updatedComments = this.commentsService.getAllComments();
      this.server.emit('existing_comments', updatedComments);
      this.server.emit('comment_deleted');
      console.log(`Comment ${data.commentId} deleted by ${data.username}`);
    }
  }

  @SubscribeMessage('like_comment')
  handleLikeComment(
    @MessageBody() data: { commentId: string; username: string },
    @ConnectedSocket() client: Socket,
  ) {
    const liked = this.commentsService.likeComment(data.commentId, data.username);
    
    if (liked) {
      const updatedComments = this.commentsService.getAllComments();
      this.server.emit('existing_comments', updatedComments);
    }
  }

  @SubscribeMessage('get_comments')
  handleGetComments(@ConnectedSocket() client: Socket) {
    const comments = this.commentsService.getAllComments();
    client.emit('existing_comments', comments);
  }
}