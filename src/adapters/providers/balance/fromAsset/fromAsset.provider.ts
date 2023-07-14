import { RevenueDto } from "../../../../application/modules/balance/dtos/Revenue.dto";
import { IBalanceProvider } from "../../../../application/modules/balance/providerContracts/IBalanceProvider";
import { AppConstants } from "../../../../domain/shared/AppConstants";
import { Assets } from "../../../../domain/shared/enums/Assets.enum";
import { BaseProvider } from "../../base/Base.provider";
import { MarketData } from "../../messari/metrics/models/MarketData";

export class FromAssetProvider extends BaseProvider implements IBalanceProvider {

    getPercentRevenue(asset: string): number {
        let revenue: number; 
        switch (asset) {
            case Assets.ADA:
                revenue = AppConstants.ADA_MONTLY
                break;
            case Assets.BTC:
                revenue = AppConstants.BTC_MONTLY
                break;
            default:
                revenue = AppConstants.ETH_MONTLY
                break;
        }
        return revenue
    }

    calculateRevenue(percent: number, marketData: MarketData, asset: string, ammount: number): RevenueDto {
        const ONE_HUNDRED = 100;
        const YEAR = 12;
        return {
           from:  asset,
           monthly: ((ONE_HUNDRED * percent) + marketData.price_usd) * ammount,
           yearly: (((ONE_HUNDRED * percent) + marketData.price_usd) * YEAR) * ammount,
           toAmmount: marketData.price_usd * ammount,
           fromAmmount: ammount,
           basePrice: marketData.price_usd,
           percent
        } as RevenueDto
    }

}