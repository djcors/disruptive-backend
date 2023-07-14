import { BalanceInteractor } from "../../../../application/iteractors/balance/Balance.iteractor";
import { BalanceUseCase } from "../../../../application/modules/balance/useCases";
import {  LogProvider } from "../../../providers/container";
import kernel from "../../../shared/kernel";
import { MetricUseCase } from "../../metrics/container";

const CONTEXT = "BalanceInteractor";

kernel.addScoped(
    BalanceInteractor.name,
  () =>
    new BalanceInteractor(
      kernel.get<LogProvider>(CONTEXT, LogProvider.name),
      kernel.get<MetricUseCase>(CONTEXT, MetricUseCase.name),
      kernel.get<BalanceUseCase>(CONTEXT, BalanceUseCase.name)
    ),
);


kernel.addScoped(
  BalanceUseCase.name,
  () => 
  new BalanceUseCase(
    kernel.get<LogProvider>(CONTEXT, LogProvider.name)
  )
)

export { BalanceInteractor };
export default kernel;
