import { MetricsDto } from "../../../../../application/modules/metrics/dtos/MetricsDto";
import { MarketData } from "./MarketData";
import { RoiData } from "./RoiData";

export class MetricResponse {
    id!: string;
    symbol!: string;
    name!: string;
    slug!: string;
    market_data!: MarketData;
    roi_data!: RoiData;

    static toDto(
        metric: MetricResponse,
      ): MetricsDto {
        const metricResponse: MetricsDto = new MetricsDto();
        metricResponse.success = true;
        metricResponse.id = metric.id;
        metricResponse.symbol = metric.symbol;
        metricResponse.name = metric.name;
        metricResponse.slug = metric.slug;
        metricResponse.marketData = metric?.market_data;
        metricResponse.roiData = metric?.roi_data;
        return metricResponse;
      }
}