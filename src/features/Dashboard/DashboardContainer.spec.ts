// tests/DashboardView.spec.ts
import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import DashboardContainer from "./DashboardContainer.vue";
import { useDashboardStore } from "./stores/dashboard.store";
import type { Stock } from "./types";

// Mock componentes hijos
vi.mock("./components/StockCard.vue", () => ({
    default: {
        name: "StockCard",
        template: '<div data-test="stock-card">StockCard</div>',
        props: ["Ticker", "Company", "Brokerage", "prevTarget", "currentTarget", "Trend", "Rating"],
    },
}));

vi.mock("@/components/layout/Pagination.vue", () => ({
    default: {
        name: "Pagination",
        template: '<div data-test="pagination">Pagination</div>',
        props: ["page", "totalPages"],
        emits: ["prev", "next", "go-to-page"],
    },
}));

vi.mock("@/components/layout/AppSpinner.vue", () => ({
    default: {
        name: "AppSpinner",
        template: '<div data-test="app-spinner">AppSpinner</div>',
        props: ["position", "size"],
    },
}));

describe("DashboardContainer.vue", () => {
    // Mock de datos que coincide con el tipo Stock
    const createMockStock = (ticker: string, company: string): Stock => ({
        ID: `${ticker}-${Date.now()}`,
        Ticker: ticker,
        Company: company,
        Brokerage: "Goldman Sachs",
        Action: "Upgrade",
        RatingFrom: "Hold",
        RatingTo: "Buy",
        TargetFrom: "$150.00",
        TargetTo: "$180.00",
        Time: "2025-08-31T10:00:00.000Z",
        CreatedAt: "2025-08-31T10:00:00.000Z",
        UpdatedAt: "2025-08-31T10:00:00.000Z",
    });

    function factory(initialState?: Partial<ReturnType<typeof useDashboardStore>>) {
        return mount(DashboardContainer, {
            global: {
                plugins: [
                    createTestingPinia({
                        createSpy: vi.fn,
                        initialState: {
                            dashboard: {
                                stocks: [],
                                page: 1,
                                pageSize: 6,
                                totalPages: 3,
                                totalItems: 18,
                                isLoading: false,
                                error: null,
                                search: '',
                                ...initialState,
                            },
                        },
                    }),
                ],
            },
        });
    }

    it("renderiza correctamente la estructura básica", () => {
        const wrapper = factory();

        // Verificar que se renderiza el grid principal
        const mainGrid = wrapper.find("div.p-6.grid");
        expect(mainGrid.exists()).toBe(true);
        expect(mainGrid.classes()).toContain("md:grid-cols-2");
        expect(mainGrid.classes()).toContain("lg:grid-cols-3");
    });

    it("muestra el spinner cuando isLoading es true", () => {
        const wrapper = factory({ isLoading: true });

        const spinner = wrapper.find("[data-test='app-spinner']");
        expect(spinner.exists()).toBe(true);

        // Verificar las props del spinner
        const spinnerComponent = wrapper.findComponent({ name: "AppSpinner" });
        expect(spinnerComponent.props("position")).toBe("fullscreen");
        expect(spinnerComponent.props("size")).toBe("lg");
    });

    it("renderiza StockCard por cada stock", () => {
        const mockStocks = [
            createMockStock("AAPL", "Apple Inc."),
            createMockStock("MSFT", "Microsoft Corp."),
        ];

        const wrapper = factory({ stocks: mockStocks });

        // Verificar que se renderizan los StockCard
        const stockCards = wrapper.findAll("[data-test='stock-card']");
        expect(stockCards).toHaveLength(2);

        // Verificar que los componentes StockCard reciben las props correctas
        const stockCardComponents = wrapper.findAllComponents({ name: "StockCard" });
        expect(stockCardComponents).toHaveLength(2);
        expect(stockCardComponents[0].props("Ticker")).toBe("AAPL");
        expect(stockCardComponents[1].props("Ticker")).toBe("MSFT");
    });

    it("renderiza el componente de paginación siempre", () => {
        const wrapper = factory();

        const pagination = wrapper.find("[data-test='pagination']");
        expect(pagination.exists()).toBe(true);

        // Verificar que está dentro del div con padding
        const paginationContainer = wrapper.find("div.p-6.w-full");
        expect(paginationContainer.exists()).toBe(true);
        expect(paginationContainer.find("[data-test='pagination']").exists()).toBe(true);
    });

    it("pasa las props correctas al componente Pagination", () => {
        const wrapper = factory({ page: 2, totalPages: 5 });

        const paginationComponent = wrapper.findComponent({ name: "Pagination" });
        expect(paginationComponent.props("page")).toBe(2);
        expect(paginationComponent.props("totalPages")).toBe(5);
    });

    it("llama getStocks onMounted", async () => {
        factory();
        const store = useDashboardStore();
        expect(store.getStocks).toHaveBeenCalledOnce();
    });

    it("llama prevPage al emitir evento prev desde Pagination", async () => {
        const wrapper = factory();
        const store = useDashboardStore();

        const paginationComponent = wrapper.findComponent({ name: "Pagination" });
        await paginationComponent.vm.$emit("prev");

        expect(store.prevPage).toHaveBeenCalledOnce();
    });

    it("llama nextPage al emitir evento next desde Pagination", async () => {
        const wrapper = factory();
        const store = useDashboardStore();

        const paginationComponent = wrapper.findComponent({ name: "Pagination" });
        await paginationComponent.vm.$emit("next");

        expect(store.nextPage).toHaveBeenCalledOnce();
    });

    it("llama goToPage al emitir evento go-to-page desde Pagination", async () => {
        const wrapper = factory();
        const store = useDashboardStore();

        const paginationComponent = wrapper.findComponent({ name: "Pagination" });
        await paginationComponent.vm.$emit("go-to-page", 2);

        expect(store.goToPage).toHaveBeenCalledWith(2);
        expect(store.goToPage).toHaveBeenCalledOnce();
    });

    it("no renderiza stocks cuando están vacíos", () => {
        const wrapper = factory({ stocks: [] });

        const stockCards = wrapper.findAll("[data-test='stock-card']");
        expect(stockCards).toHaveLength(0);

        // Pero la paginación debe seguir ahí
        expect(wrapper.find("[data-test='pagination']").exists()).toBe(true);
    });

    it("maneja correctamente el estado de error", () => {
        const wrapper = factory({ error: "Error de conexión" });

        // El componente debe renderizarse normalmente incluso con error
        // (asumiendo que no hay UI específica para mostrar errores en este componente)
        expect(wrapper.find("div.p-6.grid").exists()).toBe(true);
        expect(wrapper.find("[data-test='pagination']").exists()).toBe(true);
    });
});
