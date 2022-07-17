import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from "socket.io"

@WebSocketGateway({
    cors: {
        origin: "*"
    }
})
export class StreamListener {

    @WebSocketServer()
    server: Server;

    constructor(
    ) {}

    @SubscribeMessage('new-user')
    async notifyNewUser(
        @MessageBody() data: { [key: string]: any },
        @ConnectedSocket() client: Socket
    ): Promise<void> {
        this.server.emit(`new-viewer-${data.channelId}`, {...data, socketId: client.id })
    }

    @SubscribeMessage('create-offer')
    async notifyOfferReceived(
        @MessageBody() data: { [key: string]: any },
        @ConnectedSocket() client: Socket
    ): Promise<void> {
        this.server.to(data.to).emit("made-offer", { ...data, from: client.id })
    }

    @SubscribeMessage('create-answer')
    async notifyAnswerReceived(
        @MessageBody() data: { [key: string]: any },
        @ConnectedSocket() client: Socket
    ): Promise<void> {
        this.server.to(data.to).emit("made-answer", {...data, from: client.id })
    }

    @SubscribeMessage('ice-candidates')
    async notifyIceCandidate(
        @MessageBody() data: { [key: string]: any },
        @ConnectedSocket() client: Socket
    ): Promise<void> {
        this.server.to(data.to).emit("ice-candidates", data)
    }
}