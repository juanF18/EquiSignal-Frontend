import { api } from "@/lib/axios";
import type { StockResponse } from "../types";

export async function getStocksService(page: number, pageSize: number, search: string) {
    const response = await api.get<StockResponse>(`/stocks?page=${page}&pageSize=${pageSize}&search=${search}`);
    return response
}

