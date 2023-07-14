import { RevenueDto } from "../dtos/Revenue.dto";

export interface IBalanceProvider {
    getPercentRevenue(asset: string): number;
    calculateRevenue(percent: number, basePrice: number, asset: string, ammount: number): RevenueDto
}