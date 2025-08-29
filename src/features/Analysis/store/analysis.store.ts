import { defineStore } from "pinia";
import { useGetRecommendations } from "../services";
import type { Recommendation } from "../types";

export const useAnalysisStore = defineStore("analysis", {
    state: () => ({
        recommendations: [] as Recommendation[],
        isLoading: false,
        error: null as string | null,
        topLimit: 5 as number,
        selection: "top5" as "top5" | "top10",
        activeTab: "recommendations" as "recommendations" | "history",
    }),
    getters: {
        filteredRecommendations: (state) => {
            if (!state.recommendations.length) return [];

            return state.selection === "top5"
                ? state.recommendations.slice(0, 5)
                : state.recommendations.slice(0, 10);
        },
    },
    actions: {
        setSelection(value: "top5" | "top10") {
            this.selection = value;
            this.topLimit = value === "top5" ? 5 : 10;
        },
        setActiveTab(value: "recommendations" | "history") {
            this.activeTab = value;
        },
        async getRecommendations() {
            this.isLoading = true;
            this.error = null;
            try {
                const response = await useGetRecommendations();
                if (response.status === 200) {
                    this.recommendations = response.data.data;
                }
            } catch (err: any) {
                this.error = err.message || "Error fetching recommendations";
            } finally {
                this.isLoading = false;
            }
        },
    },
});