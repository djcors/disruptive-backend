import { Balance } from "../../../../domain/balance/Balance";
import { AppConstants } from "../../../../domain/shared/AppConstants";
import { Assets } from "../../../../domain/shared/enums/Assets.enum";
import { TryResult, TryWrapper } from "../../../../domain/shared/utils/TryWrapper";
import { LocaleTypeEnum } from "../../../shared/locals/LocaleType.enum";
import { UseCaseTrace } from "../../../shared/log/UseCaseTrace";
import { ILogProvider } from "../../../shared/log/providerContracts/ILogProvider";
import { BaseUseCase, IResult, IResultT, ResultT } from "../../../shared/useCase/BaseUseCase";
import { MetricsDto } from "../../metrics/dtos/MetricsDto";
import { BalanceDto, BalanceRequest, IBalance, IBlalanceRequest } from "../dtos/Balance.dto";
import { RevenueDto } from "../dtos/Revenue.dto";

export class BalanceUseCase extends BaseUseCase<IBlalanceRequest> {
    constructor(
        readonly logProvider: ILogProvider,
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
        const revenuePercent = this.getPercentRevenue(args.asset);
        const revenue = this.calculateRevenue(
            revenuePercent,
            args.coin.marketData.price_usd,
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

    getPercentRevenue(asset: string): number {
        let revenue: number; 
        switch (asset) {
            case Assets.ADA:
                revenue = AppConstants.ADA_MONTLY
                break;
            case Assets.BTC:
                revenue = AppConstants.BTC_MONTLY
            default:
                revenue = AppConstants.ETH_MONTLY
                break;
        }

        return revenue
    }

    calculateRevenue(percent: number, basePrice: number, asset: string, ammount: number): RevenueDto {
        const ONE_HUNDRED = 100;
        const YEAR = 12;
        return {
           from:  asset,
           monthly: ((ONE_HUNDRED * percent) + basePrice) * ammount,
           yearly: (((ONE_HUNDRED * percent) + basePrice) * YEAR) * ammount,
           toAmmount: basePrice * ammount,
           fromAmmount: ammount,
           basePrice,
           percent
        } as RevenueDto
    }
    
}