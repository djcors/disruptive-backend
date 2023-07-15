import { Balance } from "../../../domain/balance/Balance";
import { Assets } from "../../../domain/shared/enums/Assets.enum";
import { BalanceProviderType } from "../../../domain/shared/enums/BalanceProviderType.enum";
import { BalanceDto, BalanceRequest, IBalance } from "../../modules/balance/dtos/Balance.dto";
import { BalanceUseCase } from "../../modules/balance/useCases";
import { MetricsDto } from "../../modules/metrics/dtos/MetricsDto";
import { MetricUseCase } from "../../modules/metrics/useCases";
import { LocaleTypeEnum } from "../../shared/locals/LocaleType.enum";
import { UseCaseTrace } from "../../shared/log/UseCaseTrace";
import { ILogProvider } from "../../shared/log/providerContracts/ILogProvider";
import { BaseUseCase, IResult, ResultT } from "../../shared/useCase/BaseUseCase";

export class BalanceInteractor extends BaseUseCase<IBalance> {
    constructor(
        readonly logProvider: ILogProvider,
        readonly metricUseCase: MetricUseCase,
        readonly balanceUseCase: BalanceUseCase
    ) {
        super(BalanceInteractor.name, logProvider);
    }

    async execute(
        locale: LocaleTypeEnum,
        trace: UseCaseTrace,
        args:  IBalance
    ): Promise<IResult> {
        const result = new ResultT<Balance[]>();
        const promises = Object.values(Assets).map(asset =>
            this.metricUseCase.execute(
                locale,
                trace,
                {
                    asset
                }
            )
        );
        const metrics = await Promise.all(promises);
        if (metrics.some((metric) => !metric.success)) {
            this.setError(result);
            return result;
        };
        
        const balance = await this.balanceUseCase.execute(
            locale,
            trace,
            {
                coins: metrics.map((metric) => metric.data as MetricsDto),
                ammount: args.ammount
                
            }
        )

        if (!balance.success) {
            this.setError(result);
            return result;
        }
        
        result.setData(balance.data, this.applicationStatus.SUCCESS)

        return result;

    }
}