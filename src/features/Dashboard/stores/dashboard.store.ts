import { defineStore } from "pinia";
import { getStocksService } from "../service/useGetStocks";
import type { Stock } from "../types";

export const useDashboardStore = defineStore("dashboard", {
    state: () => ({
        stocks: [] as Stock[],
        isLoading: false,
        error: null as string | null,
    }),

    // --- ACTIONS ---
    actions: {
        async getStocks() {
            this.isLoading = true;
            this.error = null;

            try {
                const response = await getStocksService();
                console.log("Raw response:", response);

                if (response.status === 200) {
                    console.log("Processed response:", response.data);
                    console.log("Stock data:", response.data.data);

                    this.stocks = response.data.data;
                }
            } catch (err: any) {
                this.error = err.message || "Error fetching stocks";
            } finally {
                this.isLoading = false;
            }
        },
    },
});

