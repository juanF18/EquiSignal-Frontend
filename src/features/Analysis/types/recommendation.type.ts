export interface Recommendation {
    Ticker: string;
    Company: string;
    Score: number;
    Reason: string;
    Rating: string;
    TargetFrom: string;
    TargetTo: string;
    Time: string; // ISO string
}

export interface RecommendationsResponse {
    data: Recommendation[];
}
