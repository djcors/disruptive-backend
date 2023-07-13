import { Assets } from "../../../../adapters/providers/messari/metrics/models/Assets.enum";
import { TryResult, TryWrapper } from "../../../../domain/shared/utils/TryWrapper";
import { LocaleTypeEnum } from "../../../shared/locals/LocaleType.enum";
import { UseCaseTrace } from "../../../shared/log/UseCaseTrace";
import { ILogProvider } from "../../../shared/log/providerContracts/ILogProvider";
import { BaseUseCase, IResult, IResultT, ResultT } from "../../../shared/useCase/BaseUseCase";

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
        this.initializeUseCaseTrace(trace, args.asset, []);
        const result = new ResultT<MetricsDto>();
        if (!this.validate(args.asset)) {
          this.setError(result);
          return result;
        }

        const metricResult = await this.getMetric(result, args.asset);

        if (!metricResult.success) return result;
        
        result.setData(metricResult.value as MetricsDto, this.applicationStatus.SUCCESS);

        
        return result;
      }

      async getMetric(
        result: IResult,
        asset: string,
      ): Promise<TryResult<MetricsDto>> {

        const authenticatedResult = await TryWrapper.syncExec(
          this.metricProvider.getMetric(asset)
        );

        if (!authenticatedResult.success) {
          this.setError(result);
        }

        return authenticatedResult
      }

      validate(asset: string) {
        return Object.values(Assets).some(coin =>  coin === asset);
      }

      setError(result: IResult) {
        result.setError(
          this.appMessages.get(this.appMessages.keys.INVALID_ASSET),
          this.applicationStatus.NOT_FOUND,
        );
      }
}