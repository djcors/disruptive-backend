import { ILogProvider } from "../../../../application/shared/log/providerContracts/ILogProvider";
import { AppConstants } from "../../../../domain/shared/AppConstants";
import { BalanceProviderType } from "../../../../domain/shared/enums/BalanceProviderType.enum";
import { FromAssetProvider } from "../fromAsset/fromAsset.provider";
import { FromUsdProvider } from "../fromUsd/fromUsd.provider";

export class BalanceFactory {
    
    getProvider(logProvider: ILogProvider, fromInvestment: string) {
        const provierType = this.getType(fromInvestment)
        return this[provierType](logProvider)
    }

    getType(asset: string): BalanceProviderType {
        switch (asset) {
            case "usd":
                return BalanceProviderType.USD
            case "eth":
                return BalanceProviderType.ETH
            case "btc":
                return BalanceProviderType.BTC
            default:
                return BalanceProviderType.ADA
        }
    }

    [BalanceProviderType.ADA] = (logProvider: ILogProvider) => {
        return new FromAssetProvider(logProvider)
    }

    [BalanceProviderType.BTC] = (logProvider: ILogProvider) => {
        return new FromAssetProvider(logProvider)
    }

    [BalanceProviderType.ETH] = (logProvider: ILogProvider) => {
        return new FromAssetProvider(logProvider)
    }

    [BalanceProviderType.USD] = (logProvider: ILogProvider) => {
        return new FromUsdProvider(logProvider)
    }
}