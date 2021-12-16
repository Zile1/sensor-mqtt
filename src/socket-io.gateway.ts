import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import type { Room } from 'socket.io-adapter';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  // transports: ['socketio'],
})
export class SocketIoGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('SocketIoGateway');

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.logger.log('Joining room ' + room);
    client.join(room);
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.logger.log('Leaving room ' + room);
    client.leave(room);
  }

  @SubscribeMessage('getRooms')
  async getRooms(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): Promise<Set<Room>> {
    return client.rooms;
  }

  async emitInRoom(room: string, data: any) {
    this.server.in(room).emit('sensor', data);
  }

  async emit(data: any) {
    this.server.emit('sensor', data);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
