export interface IMarketData {
    price_usd: number,
    price_btc?: number,
    price_eth?: number;
    price_ada?: number;
    volume_last_24_hours: number;
    percent_change_usd_last_24_hours: number;
    percent_change_btc_last_24_hours: number;
}

export class MarketData implements IMarketData {
    price_usd!: number;
    price_btc?: number;
    price_eth?: number;
    price_ada?: number;
    volume_last_24_hours!: number;
    percent_change_usd_last_24_hours!: number;
    percent_change_btc_last_24_hours!: number;
}