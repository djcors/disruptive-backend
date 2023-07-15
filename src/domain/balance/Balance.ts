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
}