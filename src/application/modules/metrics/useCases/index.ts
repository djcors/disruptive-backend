import { Assets } from "../../../../adapters/providers/messari/metrics/models/Assets.enum";
import { LocaleTypeEnum } from "../../../shared/locals/LocaleType.enum";
import { UseCaseTrace } from "../../../shared/log/UseCaseTrace";
import { ILogProvider } from "../../../shared/log/providerContracts/ILogProvider";
import { BaseUseCase, IResultT, ResultT } from "../../../shared/useCase/BaseUseCase";

import { MetricsDto } from "../dtos/MetricsDto";
import { IMetricProvider } from "../providerContracts/IMetric.provider";

export class MetricUseCase extends BaseUseCase<{asset: string}> {
    constructor(readonly logProvider: ILogProvider, private readonly metricProvider: IMetricProvider) {
      super(MetricUseCase.name, logProvider);
    }

    async execute(
        locale: LocaleTypeEnum,
        trace: UseCaseTrace,
        args: { asset: string},
      ): Promise<IResultT<MetricsDto>> {

        this.setLocale(locale);
        const result = new ResultT<MetricsDto>();
        const message = await this.metricProvider.getMetric(
          args.asset
          );
        
        console.error(message)
        if (!message.success) {
          result.setError(
            this.appMessages.get(this.appMessages.keys.INVALID_USER_OR_PASSWORD),
            this.applicationStatus.INVALID_INPUT,
          );
        }
        
        result.setData(message, this.applicationStatus.SUCCESS);
      
        return result;
      }
}