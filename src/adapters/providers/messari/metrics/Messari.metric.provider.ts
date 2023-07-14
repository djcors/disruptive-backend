
import HttpClient from "../../../../infrastructure/httpClient/HttpClient";
import { MetricError } from "./models/MetricError";
import { BaseProvider } from "../../base/Base.provider";
import { MetricsDto } from "../../../../application/modules/metrics/dtos/MetricsDto";
import { MetricResponse } from "./models/MetricResponse";
import { ILogProvider } from "../../../../application/shared/log/providerContracts/ILogProvider";
import { IMetricProvider } from "../../../../application/modules/metrics/providerContracts/IMetric.provider";


export class MessariMetricProvider extends BaseProvider implements IMetricProvider {
    
    constructor(
        readonly logProvider: ILogProvider,
    ) {
        super(logProvider);
    }

    async getMetric(assetKey: string): Promise<MetricsDto> {
        const endpoint: string = `https://data.messari.io/api/v1/assets/${assetKey}/metrics`;
        const args = {
            method: HttpClient.Methods.GET,
            serializationMethod: 'arrayBuffer'
        }
   
        const metricResult = await HttpClient.send<MetricResponse, MetricError>(
            endpoint,
            args
        );
        
        if ((metricResult.response as MetricError).status.error_code) {
            return Promise.reject(null)
        };
        
        return MetricResponse.toDto(
            (metricResult.response as any).data as MetricResponse
        );
    }
}
