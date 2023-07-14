import { MarketData } from "../../../../adapters/providers/messari/metrics/models/MarketData";
import { RevenueDto } from "../dtos/Revenue.dto";

export interface IBalanceProvider {
    getPercentRevenue(asset: string): number;
    calculateRevenue(percent: number, marketData: MarketData, asset: string, ammount: number): RevenueDto
}