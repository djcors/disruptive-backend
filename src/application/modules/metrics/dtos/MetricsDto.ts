import { MarketData } from "../../../../adapters/providers/messari/metrics/models/MarketData";
import { RoiData } from "../../../../adapters/providers/messari/metrics/models/RoiData";

export class MetricsDto {
    success: boolean = false;
    id!: string;
    symbol!: string;
    name!: string;
    slug!: string;
    marketData: MarketData = new MarketData;
    roiData: RoiData = new RoiData;
}