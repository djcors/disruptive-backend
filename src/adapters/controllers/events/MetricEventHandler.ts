import { MetricsDto } from "../../../application/modules/metrics/dtos/MetricsDto";
import { SocketEvent } from "../../../application/shared/events/SocketEvents";
import {SocketServer, Socket} from "../../../infrastructure/app/server/HttpServer"

export class MetricEventHandler {
    constructor(
        private readonly socketServer: SocketServer,
      ) {}
    
    connection(socket: Socket): void {
        console.log(`${new Date().toISOString()} Client connected: `, socket.id);
        socket.on(SocketEvent.ECHO, (message: string) => {
            console.log(SocketEvent.ECHO, message);
            socket.emit(SocketEvent.ECHO, message);
        });
    
        socket.on(SocketEvent.DISCONNECT, () => {
            console.log("Client disconnected");
        });
      
        socket.on(SocketEvent.CONNECT_ERROR, (err: any) => {
            console.log("Socket connection error: ", err.message);
        });
    }
    sendEventNotification(message: MetricsDto, socketId: string): void {
        this.socketServer.emit(socketId, message);
    }

}