import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Roles } from 'src/gurads/roles/enum/role.enum';
import { UserService } from 'src/modules/user/v1/user.service';

@WebSocketGateway()
export class PaymentGateway implements OnGatewayConnection {
  constructor(private readonly userService: UserService) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    try {
      //   if (socket.eventNames().length != 1) {
      //     throw new WsException('Can only listen to one event');
      //   }
      const user = await this.userService.getUserFromSocket(socket);
      if (user.role !== Roles.DRIVER) {
        throw new WsException('Only driver can subscribe');
      }
      //   if (socket.eventNames()[0] !== user.id) {
      //     throw new WsException('Can only listen to your own id');
      //   }
    } catch (error) {
      socket.disconnect(true);
    }
  }
}
