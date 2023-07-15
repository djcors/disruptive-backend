import { Assets } from "../../../../domain/shared/enums/Assets.enum";
import { MetricsDto } from "../../metrics/dtos/MetricsDto";


export type IBalance = { 
    ammount: number;
};

export class BalanceRequest  {
    ammount!: number;
    coins!: MetricsDto[]
}

export type IBlalanceRequest = {
    ammount: number,
    coins: MetricsDto[]
}

export class BalanceDto extends BalanceRequest {
    toAmmount!: number;
    roiPercent!: number;
    roiMonthly!: number;
    roiYearly!: number;
    basePrice!: number;
}

