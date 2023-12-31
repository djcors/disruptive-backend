import { UserRepository } from "../../repositories/user/User.repository";
import { BaseHttpClient } from "../../shared/httpClient/BaseHttpClient";
import { IUserModel } from "../../repositories/user/IUser.model";
import { HealthProvider } from "../health/Health.provider";
import { WorkerProvider } from "../worker/Worker.provider";
import { LogProvider } from "../log/Log.provider";
import kernel from "../../shared/kernel";
import { ILogger } from "../log/ILogger";
import { MessariMetricProvider } from "../messari/metrics/Messari.metric.provider";


const CONTEXT = "ProviderContainer";

kernel.addSingleton(
  LogProvider.name,
  new LogProvider(kernel.get<ILogger>(CONTEXT, kernel.classToInterfaceName(LogProvider.name))),
);
kernel.addSingleton(
  HealthProvider.name,
  new HealthProvider(kernel.get<BaseHttpClient>(CONTEXT, BaseHttpClient.name)),
);
kernel.addSingleton(
  WorkerProvider.name,
  new WorkerProvider(kernel.get<LogProvider>(CONTEXT, LogProvider.name)),
);

kernel.addSingleton(
  MessariMetricProvider.name,
  new MessariMetricProvider(
    kernel.get<LogProvider>(CONTEXT, LogProvider.name)
  )
)

export { LogProvider, HealthProvider, WorkerProvider };
export default kernel;
