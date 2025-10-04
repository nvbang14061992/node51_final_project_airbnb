import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RealtimeNotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('RealtimeNotificationGateway');

  constructor(private readonly jwtService: JwtService) {}

  afterInit(server: Server) {
    this.logger.log('Gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        this.logger.warn('No token provided');
        return client.disconnect();
      }

      const payload = this.jwtService.verify(token);
      const hostId = payload?.userId;

      if (!hostId) {
        this.logger.warn('token invalid');
        return client.disconnect();
      }

      client.data.user = payload;

      const room = `host-${hostId}`;
      client.join(room);
      this.logger.log(`Client ${client.id} joined room ${room}`);

      // TTL auto disconnect after 3 seconds
      setTimeout(() => {
        if (client.connected) {
          client.disconnect(true);
          this.logger.log(`Client ${client.id} TTL disconnect`);
        }
      }, 30000);
    } catch (err) {
      this.logger.error(`JWT validation failed: ${err.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  sendToHostRoom(hostId: string, payload: any) {
    const room = `host-${hostId}`;
    this.server.to(room).emit('new-notification', payload);
    this.logger.log(`Notification sent to ${room}: ${JSON.stringify(payload)}`);
  }
}
