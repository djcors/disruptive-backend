import "express-async-errors";
import AppWrapper from "./infrastructure/app/AppWrapper";
import { HttpServer } from "./infrastructure/app/server/HttpServer";
import errorHandlerMiddleware from "./infrastructure/middleware/error";
import BaseController from "./adapters/controllers/base/Base.controller";
import { AuthController } from "./adapters/controllers/auth/Auth.controller";
import StatusController from "./adapters/controllers/status/Status.controller";
import { MetricsController } from "./adapters/controllers/metrics/Metrics.controller";

// const controllers: BaseController[] = [
//   AuthController,
//   StatusController,
//   MetricsController,
  
// ]

const appWrapper = new AppWrapper();
const server = new HttpServer(appWrapper);
server.start();

process.on("uncaughtException", (error: NodeJS.UncaughtExceptionListener) => {
  errorHandlerMiddleware.manageNodeException("UncaughtException", error);
});

process.on("unhandledRejection", (reason: NodeJS.UnhandledRejectionListener) => {
  errorHandlerMiddleware.manageNodeException("UnhandledRejection", reason);
});
