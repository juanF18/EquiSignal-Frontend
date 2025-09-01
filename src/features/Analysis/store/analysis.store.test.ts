// tests/analysisStore.spec.ts
import { setActivePinia, createPinia } from "pinia";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAnalysisStore } from "./analysis.store";
import { useGetRecommendations } from "../services";

// 👀 Mock del servicio
vi.mock("../services", () => ({
    useGetRecommendations: vi.fn(),
}));

describe("Analysis Store", () => {
    beforeEach(() => {
        // Inicializar un pinia fresco en cada test
        setActivePinia(createPinia());
    });

    it("inicializa con valores por defecto", () => {
        const store = useAnalysisStore();
        expect(store.recommendations).toEqual([]);
        expect(store.isLoading).toBe(false);
        expect(store.error).toBeNull();
        expect(store.selection).toBe("top5");
        expect(store.topLimit).toBe(5);
        expect(store.activeTab).toBe("recommendations");
    });

    it("cambia selección a top10", () => {
        const store = useAnalysisStore();
        store.setSelection("top10");
        expect(store.selection).toBe("top10");
        expect(store.topLimit).toBe(10);
    });

    it("cambia el tab activo", () => {
        const store = useAnalysisStore();
        store.setActiveTab("history");
        expect(store.activeTab).toBe("history");
    });

    it("getter filteredRecommendations devuelve top5", () => {
        const store = useAnalysisStore();
        store.recommendations = Array.from({ length: 10 }, (_, i) => ({ id: i, value: i } as any));

        store.setSelection("top5");
        expect(store.filteredRecommendations.length).toBe(5);

        store.setSelection("top10");
        expect(store.filteredRecommendations.length).toBe(10);
    });

    it("getRecommendations llena recomendaciones correctamente", async () => {
        const mockData = [{ id: 1, value: "rec" }];
        (useGetRecommendations as any).mockResolvedValue({
            status: 200,
            data: { data: mockData },
        });

        const store = useAnalysisStore();
        await store.getRecommendations();

        expect(store.isLoading).toBe(false);
        expect(store.error).toBeNull();
        expect(store.recommendations).toEqual(mockData);
    });

    it("getRecommendations maneja errores", async () => {
        (useGetRecommendations as any).mockRejectedValue(new Error("Network error"));

        const store = useAnalysisStore();
        await store.getRecommendations();

        expect(store.isLoading).toBe(false);
        expect(store.error).toBe("Network error");
        expect(store.recommendations).toEqual([]);
    });
});
