import { OnGatewayDisconnect, ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from "socket.io"
import { BotCommandService } from "./bot-command.service";

@WebSocketGateway({
    cors: {
        origin: "*"
    }
})

export class ChatListener implements OnGatewayDisconnect {


    @WebSocketServer()
    server: Server;

    constructor(
        private botCommandService: BotCommandService
    ) {}

    handleDisconnect(client: Socket) {
        // @ts-ignore
        for (let key of client.adapter.rooms.keys()) {
            const room = key;
            if (room && room.indexOf("room") > -1) {
                let totalViewers = (this.server.sockets.adapter.rooms.get(room).size);
                this.server.to(room).emit("newViewer", { from: client.id, totalViewers })
            }
        }
    }


    @SubscribeMessage('subscribe')
    subscribe(
        @MessageBody() data: { [key: string]: any },
        @ConnectedSocket() client: Socket
    ): void {
        client.join(data.room);
        const totalViewers = (this.server.sockets.adapter.rooms.get(data.room).size);
        this.server.in(data.room).emit("newViewer", { from: client.id, totalViewers })
    }

    @SubscribeMessage('messages')
    async notifyAllInChannel(
        @MessageBody() data: { [key: string]: any },
        @ConnectedSocket() client: Socket
    ): Promise<void> {
        if (this.botCommandService.isBotCommand(data.message)) {
            const reply = await this.botCommandService.replyCommand(
                data.channelId, data.message
            )
            this.server.to(client.id).emit("reply_bot_command", { 
                message: reply,
                username: "Bot",
                postedAt: new Date().toLocaleTimeString(),
                room: data.room
            })
            return;
        }
        client.to(data.room).emit("newMessage", data)
    }
}