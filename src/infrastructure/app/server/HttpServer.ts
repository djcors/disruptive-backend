import AppSettings from "../../../application/shared/settings/AppSettings";
import { Server, createServer } from "http";
import AppWrapper from "../AppWrapper";
import { Server as SocketServer, Socket } from "socket.io";
import { SocketEvent } from "../../../application/shared/events/SocketEvents";
import { MetricEventHandler } from "../../../adapters/controllers/events/MetricEventHandler";
export { Socket, SocketServer };
export class HttpServer {
  #appWrapper: AppWrapper;
  server: Server;
  ws: SocketServer;
  metricEventHanlder: MetricEventHandler;

  constructor(appWrapper: AppWrapper) {
    this.#appWrapper = appWrapper;
    this.server = createServer(this.#appWrapper.app);
    this.ws = new SocketServer(this.server, {
      cors: { origin: "*", methods: ["GET", "POST", "PATCH", "PUT", "DELETE"] },
      path: AppSettings.socketRoot,
    });
    this.metricEventHanlder = new MetricEventHandler(this.ws);
  }

  start(): void {
    this.#appWrapper
      .initializeServices()
      .then(() => {
        this.server.listen(AppSettings.ServerPort);
      })
      .catch((error) => {
        console.log("Server starting error:", error);
      });
    this.ws.on(SocketEvent.CONNECTION, this.metricEventHanlder.connection);
    this.server.on("listening", () => {
      this.#appWrapper.apiDocGenerator.setServer(
        `${AppSettings.ServerHost}:${AppSettings.ServerPort}${AppSettings.ServerRoot}`,
        "Local server",
      );
      console.log(
        `Server ${AppSettings.ServiceName} running on ${AppSettings.ServerHost}:${AppSettings.ServerPort}${AppSettings.ServerRoot}`,
      );
    });
  }
}
