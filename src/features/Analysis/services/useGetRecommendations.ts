import { api } from "@/lib/axios";
import type { RecommendationsResponse } from "../types";

export async function useGetRecommendations() {
    const response = await api.get<RecommendationsResponse>("/stocks/recommend")
    return response
}