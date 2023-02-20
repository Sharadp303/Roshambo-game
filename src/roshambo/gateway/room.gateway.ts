// import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayInit } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';

// @WebSocketGateway()
// export class ChatGateway implements OnGatewayInit {
//   @WebSocketServer() server: Server;

//   private rooms = new Map<string, Set<string>>();

//   afterInit(server: Server) {
//     console.log('WebSocket gateway initialized');
//   }

//   @SubscribeMessage('joinRoom')
//   handleJoinRoom(client: Socket, room: string) {
//     if (!this.rooms.has(room)) {
//       this.rooms.set(room, new Set());
//     }

//     const users = this.rooms.get(room);
//     if (users.size >= 2) {
//       client.emit('roomFull', `The room ${room} is already full`);
//       return;
//     }

//     users.add(client.id);
//     client.join(room);
//     this.server.to(room).emit('roomUsers', Array.from(users));
//   }
// }
