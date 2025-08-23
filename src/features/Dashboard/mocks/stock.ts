import type { Stock } from "../types";

export const mockStocks: Stock[] = [
    {
        ID: "1",
        Ticker: "MSFT",
        Company: "Microsoft",
        Brokerage: "JP Morgan",
        Action: "Buy",
        RatingFrom: "Buy",
        RatingTo: "Strong Buy",
        TargetFrom: "$350.00",
        TargetTo: "$400.00",
        Time: "2025-08-20T00:00:00Z",
        CreatedAt: "",
        UpdatedAt: "",
    },
    {
        ID: "2",
        Ticker: "TSLA",
        Company: "Tesla",
        Brokerage: "Goldman Sachs",
        Action: "Sell",
        RatingFrom: "Neutral",
        RatingTo: "Sell",
        TargetFrom: "$280.00",
        TargetTo: "$250.00",
        Time: "2025-08-20T00:00:00Z",
        CreatedAt: "",
        UpdatedAt: "",
    },
];
