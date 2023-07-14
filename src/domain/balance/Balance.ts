import { BalanceDto, BalanceRequest } from "../../application/modules/balance/dtos/Balance.dto";
import { RevenueDto } from "../../application/modules/balance/dtos/Revenue.dto";
import { Assets } from "../shared/enums/Assets.enum";

export class Balance {
    from!: Assets;
    to!: Assets;
    fromAmmount!: number;
    toAmmount!: number;
    roiPercent!: number;
    roiMonthly!: number;
    roiYearly!: number;
    basePrice!: number;

    static toDto(
        investment: BalanceRequest,
        revenue: RevenueDto
    ): BalanceDto {
        const balance: BalanceDto = new BalanceDto();
        balance.from = investment.from;
        balance.to = investment.to;
        balance.fromAmmount = investment.fromAmmount;
        balance.roiPercent = revenue.percent;
        balance.roiMonthly = revenue.monthly
        balance.roiYearly = revenue.yearly;
        balance.toAmmount = revenue.toAmmount;
        balance.basePrice = revenue.basePrice;
        return balance
    }
}