export interface Stock {
    ID: string;
    Ticker: string;
    Company: string;
    Brokerage: string;
    Action: string;
    RatingFrom: string;
    RatingTo: string;
    TargetFrom: string; // vienen como "$278.00" => string
    TargetTo: string;
    Time: string;       // ISO datetime
    CreatedAt: string;  // ISO datetime
    UpdatedAt: string;  // ISO datetime
}

export interface StockResponse {
    data: Stock[];
    page: number;
    pageSize: number;
    total: number;
    total_pages: number;
}

export interface StockCardProps {
    Ticker: string;
    Company: string;
    Brokerage: string;
    prevTarget: number;
    currentTarget: number;
    Trend: "up" | "down" | "neutral";
    Rating?: string;
}