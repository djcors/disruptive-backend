import { Balance } from "../../../domain/balance/Balance";
import { BalanceDto, BalanceRequest, IBalance } from "../../modules/balance/dtos/Balance.dto";
import { BalanceUseCase } from "../../modules/balance/useCases";
import { MetricsDto } from "../../modules/metrics/dtos/MetricsDto";
import { MetricUseCase } from "../../modules/metrics/useCases";
import { LocaleTypeEnum } from "../../shared/locals/LocaleType.enum";
import { UseCaseTrace } from "../../shared/log/UseCaseTrace";
import { ILogProvider } from "../../shared/log/providerContracts/ILogProvider";
import { BaseUseCase, IResult, ResultT } from "../../shared/useCase/BaseUseCase";

export class BalanceInteractor extends BaseUseCase<{[key: string]: IBalance | string }> {
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
        args: {[key: string]: IBalance | string }  
    ): Promise<IResult> {
        const result = new ResultT<Balance>();
        const metrics = await this.metricUseCase.execute(
            locale,
            trace,
            {
                asset: args.asset as string
            }
        );
        if (!metrics.success) {
            this.setError(result);
            return result;
        };

        const balanceRequest = args.balanceRequest as BalanceRequest;
        const balance = await this.balanceUseCase.execute(
            locale,
            trace,
            {
                asset: args.asset as string,
                investment: balanceRequest,
                coin: metrics.data as MetricsDto
                
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