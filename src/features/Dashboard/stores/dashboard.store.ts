import { defineStore } from "pinia";
import { getStocksService } from "../services/useGetStocks";
import type { Stock } from "../types";

export const useDashboardStore = defineStore("dashboard", {
    state: () => ({
        stocks: [] as Stock[],
        isLoading: false,
        error: null as string | null,
        search: '',
        page: 1,
        pageSize: 6,
        totalPages: 0,
        totalItems: 0,
    }),

    actions: {
        async getStocks() {
            try {
                this.isLoading = true;
                this.error = null;

                if (this.search.length > 1) {
                    this.page = 1;
                }

                const response = await getStocksService(this.page, this.pageSize, this.search);

                if (response.status === 200) {
                    this.stocks = response.data.data;
                    this.totalItems = response.data.total;
                    this.totalPages = response.data.total_pages;
                }
            } catch (err: any) {
                this.error = err.message || "Error fetching stocks";
            } finally {
                this.isLoading = false;
            }
        },

        async nextPage() {
            if (this.page < this.totalPages) {
                this.page += 1;
                await this.getStocks();
            }
        },


        async prevPage() {
            if (this.page > 1) {
                this.page -= 1;
                await this.getStocks();
            }
        },

        async goToPage(page: number) {
            if (page >= 1 && page <= this.totalPages) {
                this.page = page;
                await this.getStocks();
            }
        },
    },
});

