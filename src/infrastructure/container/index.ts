import { UseCaseTraceRepository } from "../../adapters/repositories/trace/UseCaseTrace.repository";
import { UserRepository } from "../../adapters/repositories/user/User.repository";
import { BaseHttpClient } from "../../adapters/shared/httpClient/BaseHttpClient";
import kernel, { IServiceContainer } from "../../adapters/shared/kernel";
import { LogProvider } from "../../adapters/providers/log/Log.provider";
import HttpClient from "../httpClient/HttpClient";
import { Logger } from "../logger/Logger";

class InfrastructureServiceContainer {
  constructor(readonly tsKernel: IServiceContainer) {}

  load(): void {
    // Load Providers to kernel
    this.tsKernel.addSingleton(this.tsKernel.classToInterfaceName(LogProvider.name), new Logger());
    this.tsKernel.addSingleton(UseCaseTraceRepository.name, new UseCaseTraceRepository());

    // Load HttpClient to kernel
    this.tsKernel.addSingleton(BaseHttpClient.name, HttpClient);
  }
}

export default new InfrastructureServiceContainer(kernel);
