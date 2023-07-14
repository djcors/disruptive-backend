import { Assets } from "../../../../domain/shared/enums/Assets.enum";
import { MetricsDto } from "../../metrics/dtos/MetricsDto";


export type IBalance = { 
    from: string;
    to: string;
    fromAmmount: number;
};

export class BalanceRequest  {
    from!: string;
    to!: string;
    fromAmmount!: number;
}

export type IBlalanceRequest = {
    asset: string;
    investment: BalanceRequest,
    coin: MetricsDto
}

export class BalanceDto extends BalanceRequest {
    toAmmount!: number;
    roiPercent!: number;
    roiMonthly!: number;
    roiYearly!: number;
    basePrice!: number;
}

