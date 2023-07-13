export class MetricError {
    status!: {
        timestamp: Date;
        error_code: number;
        error_message: string;
        elapsed: number;
    }
}