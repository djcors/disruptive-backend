import { MetricUseCase } from "../../../../application/modules/metrics/useCases";
import {  LogProvider } from "../../../providers/container";
import { MessariMetricProvider } from "../../../providers/messari/metrics/Messari.metric.provider";
import kernel from "../../../shared/kernel";

const CONTEXT = "MetricsController";

kernel.addScoped(
  MetricUseCase.name,
  () =>
    new MetricUseCase(
      kernel.get<LogProvider>(CONTEXT, LogProvider.name),
      kernel.get<MessariMetricProvider>(CONTEXT, MessariMetricProvider.name),
    ),
);

export { MetricUseCase };
export default kernel;
