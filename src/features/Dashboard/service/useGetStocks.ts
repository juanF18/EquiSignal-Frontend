import { api } from "@/lib/axios";
import type { StockResponse } from "../types";

export async function getStocksService() {
    const res = await api.get<StockResponse>("/stocks");
    return res; // 👈 devuelve el objeto con data, page, etc
}

