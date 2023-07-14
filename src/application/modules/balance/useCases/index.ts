import { BalanceFactory } from "../../../../adapters/providers/balance/factory/BalanceFactory";
import { Balance } from "../../../../domain/balance/Balance";
import { AppConstants } from "../../../../domain/shared/AppConstants";
import { Assets } from "../../../../domain/shared/enums/Assets.enum";
import { BalanceProviderType } from "../../../../domain/shared/enums/BalanceProviderType.enum";
import { TryResult, TryWrapper } from "../../../../domain/shared/utils/TryWrapper";
import { LocaleTypeEnum } from "../../../shared/locals/LocaleType.enum";
import { UseCaseTrace } from "../../../shared/log/UseCaseTrace";
import { ILogProvider } from "../../../shared/log/providerContracts/ILogProvider";
import { BaseUseCase, IResult, IResultT, ResultT } from "../../../shared/useCase/BaseUseCase";
import { MetricsDto } from "../../metrics/dtos/MetricsDto";
import { BalanceDto, BalanceRequest, IBalance, IBlalanceRequest } from "../dtos/Balance.dto";
import { RevenueDto } from "../dtos/Revenue.dto";
import { IBalanceProvider } from "../providerContracts/IBalanceProvider";

export class BalanceUseCase extends BaseUseCase<IBlalanceRequest> {
    constructor(
        readonly logProvider: ILogProvider,
        readonly providerFactory: BalanceFactory
    ) {
        super(BalanceUseCase.name, logProvider);
    }

    async execute(
        locale: LocaleTypeEnum,
        trace: UseCaseTrace,
        args: IBlalanceRequest,
      ): Promise<IResultT<Balance>> {
        this.setLocale(locale);
        this.initializeUseCaseTrace(trace, args, []);
        const result = new ResultT<Balance>();
        const provider = this.providerFactory.getProvider(this.logProvider, args.asset);
        const asset = this.validateFromInvestment(args.investment.from, args.investment.to)
        const revenuePercent = provider.getPercentRevenue(asset)
        const revenue = provider.calculateRevenue(
            revenuePercent,
            args.coin.marketData,
            args.asset,
            args.investment.fromAmmount,
        )

        const balance =  Balance.toDto(
            args.investment,
            revenue
        )
        result.setData(balance as Balance, this.applicationStatus.SUCCESS);   

        return result
    }
    
    validateFromInvestment(from: string, to: string): string {
        if (from === BalanceProviderType.USD) return to
        return from
    }
}
