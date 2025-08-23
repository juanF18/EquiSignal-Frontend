import type { Stock, StockCardProps } from "../types";

export function mapStockToCardProps(stock: Stock): StockCardProps {
    const prev = parseFloat(stock.TargetFrom.replace(/[$,]/g, ""));
    const curr = parseFloat(stock.TargetTo.replace(/[$,]/g, ""));

    return {
        Ticker: stock.Ticker,
        Company: stock.Company,
        Brokerage: stock.Brokerage,
        prevTarget: prev,
        currentTarget: curr,
        Trend: curr > prev ? "up" : curr < prev ? "down" : "neutral",
        Rating: stock.RatingTo,
    };
}
