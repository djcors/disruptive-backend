import { BalanceFactory } from "../../../../adapters/providers/balance/factory/BalanceFactory";
import { Balance } from "../../../../domain/balance/Balance";
import { LocaleTypeEnum } from "../../../shared/locals/LocaleType.enum";
import { UseCaseTrace } from "../../../shared/log/UseCaseTrace";
import { ILogProvider } from "../../../shared/log/providerContracts/ILogProvider";
import { BaseUseCase, IResultT, ResultT } from "../../../shared/useCase/BaseUseCase";
import { IBlalanceRequest } from "../dtos/Balance.dto";

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
      ): Promise<IResultT<Balance[]>> {
        this.setLocale(locale);
        this.initializeUseCaseTrace(trace, args, []);
        const result = new ResultT<Balance[]>();
        const coins = args.coins;
        const revenues:any[] = [];
        coins.forEach((coin) => {
            const provider = this.providerFactory.getProvider(this.logProvider, coin.symbol);
            const revenuePercent = provider.getPercentRevenue(coin.symbol)
            const revenue = provider.calculateRevenue(
                revenuePercent,
                coin.marketData,
                coin.symbol,
                args.ammount,
            )
            revenues.push(revenue)
        });
        console.log({revenues})
        result.setData(revenues as Balance[], this.applicationStatus.SUCCESS);   

        return result
    }
}
