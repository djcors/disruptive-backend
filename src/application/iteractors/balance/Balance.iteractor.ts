import { Balance } from "../../../domain/balance/Balance";
import { BalanceProviderType } from "../../../domain/shared/enums/BalanceProviderType.enum";
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
        const balanceRequest = args.balanceRequest as BalanceRequest;
        const asset = this.validateFromInvestment(
            args.asset as string,
            balanceRequest.to
        );

        const metrics = await this.metricUseCase.execute(
            locale,
            trace,
            {
                asset
            }
        );
        if (!metrics.success) {
            this.setError(result);
            return result;
        };
        
        const balance = await this.balanceUseCase.execute(
            locale,
            trace,
            {
                investment: balanceRequest,
                coin: metrics.data as MetricsDto,
                asset: args.asset as string,
                
            }
        )

        if (!balance.success) {
            this.setError(result);
            return result;
        }
        
        result.setData(balance.data, this.applicationStatus.SUCCESS)

        return result;

    }

    validateFromInvestment(from: string, to: string): string {
        if (from === BalanceProviderType.USD) return to
        return from
    }

}