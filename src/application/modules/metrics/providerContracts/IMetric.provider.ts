import { MetricsDto } from "../../metrics/dtos/MetricsDto";

export interface IMetricProvider {
    getMetric(assets: string): Promise<MetricsDto>
}