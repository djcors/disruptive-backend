import { Assets } from "../../../../domain/shared/enums/Assets.enum";

export class RevenueDto {
    from!: Assets;
    monthly!: number;
    yearly!: number;
    percent!: number;
    toAmmount!: number;
    basePrice!: number;
}
