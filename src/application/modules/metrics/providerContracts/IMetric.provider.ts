import { Assets } from "../../../../adapters/providers/messari/metrics/models/Assets.enum";
import { MetricsDto } from "../../metrics/dtos/MetricsDto";

export interface IMetricProvider {
    getMetric(assets: string): Promise<MetricsDto>
}