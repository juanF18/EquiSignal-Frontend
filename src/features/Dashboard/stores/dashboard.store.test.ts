// tests/dashboard.store.spec.ts
import { setActivePinia, createPinia } from "pinia";
import { describe, it, beforeEach, expect, vi } from "vitest";
import { useDashboardStore } from "./dashboard.store";
import type { Stock } from "../types";

// Mock del servicio completo
vi.mock("../services/useGetStocks", () => ({
    getStocksService: vi.fn(),
}));

// Import del mock para poder controlarlo
import { getStocksService } from "../services/useGetStocks";

describe("Dashboard Store", () => {
    const mockGetStocksService = vi.mocked(getStocksService);

    // Mock de datos realistas
    const mockStock: Stock = {
        ID: "1",
        Ticker: "AAPL",
        Company: "Apple Inc.",
        Brokerage: "Goldman Sachs",
        Action: "Upgrade",
        RatingFrom: "Hold",
        RatingTo: "Buy",
        TargetFrom: "$150.00",
        TargetTo: "$180.00",
        Time: "2025-08-31T10:00:00.000Z",
        CreatedAt: "2025-08-31T10:00:00.000Z",
        UpdatedAt: "2025-08-31T10:00:00.000Z",
    };

    beforeEach(() => {
        setActivePinia(createPinia());
        mockGetStocksService.mockClear();
    });

    it("inicializa con el estado correcto", () => {
        const store = useDashboardStore();
        expect(store.stocks).toEqual([]);
        expect(store.isLoading).toBe(false);
        expect(store.error).toBeNull();
        expect(store.search).toBe("");
        expect(store.page).toBe(1);
        expect(store.pageSize).toBe(6);
        expect(store.totalPages).toBe(0);
        expect(store.totalItems).toBe(0);
    });

    it("getStocks maneja loading state correctamente", async () => {
        const mockResponse = {
            data: {
                data: [mockStock],
                total: 1,
                total_pages: 1,
                page: 1,
                pageSize: 6,
            },
            status: 200,
            statusText: "OK",
            headers: {},
            config: {},
        };

        // Mock que simula una llamada exitosa
        mockGetStocksService.mockResolvedValueOnce(mockResponse as any);

        const store = useDashboardStore();

        // Verificar estado inicial
        expect(store.isLoading).toBe(false);

        // Llamar la función
        const promise = store.getStocks();

        // Verificar que está cargando
        expect(store.isLoading).toBe(true);

        // Esperar a que termine
        await promise;

        // Verificar estado final
        expect(store.isLoading).toBe(false);
        expect(store.error).toBeNull();
        expect(store.stocks).toEqual([mockStock]);
        expect(store.totalItems).toBe(1);
        expect(store.totalPages).toBe(1);

        // Verificar que se llamó el servicio con los parámetros correctos
        expect(mockGetStocksService).toHaveBeenCalledWith(1, 6, "");
    });

    it("getStocks maneja errores correctamente", async () => {
        const errorMessage = "Network error";
        mockGetStocksService.mockRejectedValueOnce(new Error(errorMessage));

        const store = useDashboardStore();

        await store.getStocks();

        expect(store.isLoading).toBe(false);
        expect(store.error).toBe(errorMessage);
        expect(store.stocks).toEqual([]);
    });

    it("getStocks maneja respuesta no exitosa", async () => {
        const mockResponse = {
            data: { data: [], total: 0, total_pages: 0, page: 1, pageSize: 6 },
            status: 404,
            statusText: "Not Found",
            headers: {},
            config: {},
        };

        mockGetStocksService.mockResolvedValueOnce(mockResponse as any);

        const store = useDashboardStore();
        await store.getStocks();

        // Cuando status no es 200, no debe actualizar los stocks
        expect(store.isLoading).toBe(false);
        expect(store.error).toBeNull(); // El store no maneja errores de status diferente
        expect(store.stocks).toEqual([]); // Se mantienen vacíos
    });

    it("getStocks resetea page a 1 cuando search tiene más de 1 caracter", async () => {
        const mockResponse = {
            data: { data: [], total: 0, total_pages: 0, page: 1, pageSize: 6 },
            status: 200,
            statusText: "OK",
            headers: {},
            config: {},
        };

        mockGetStocksService.mockResolvedValueOnce(mockResponse as any);

        const store = useDashboardStore();
        store.page = 3;
        store.search = "AAPL";

        await store.getStocks();

        expect(store.page).toBe(1);
    });

    it("nextPage incrementa la página y llama getStocks", async () => {
        const mockResponse = {
            data: { data: [], total: 0, total_pages: 3, page: 2, pageSize: 6 },
            status: 200,
            statusText: "OK",
            headers: {},
            config: {},
        };

        mockGetStocksService.mockResolvedValueOnce(mockResponse as any);

        const store = useDashboardStore();
        store.totalPages = 3;
        store.page = 1;

        await store.nextPage();

        expect(store.page).toBe(2);
        expect(mockGetStocksService).toHaveBeenCalledWith(2, 6, "");
    });

    it("nextPage no hace nada si está en la última página", async () => {
        const store = useDashboardStore();
        store.page = 3;
        store.totalPages = 3;

        await store.nextPage();

        expect(store.page).toBe(3);
        expect(mockGetStocksService).not.toHaveBeenCalled();
    });

    it("prevPage decrementa la página y llama getStocks", async () => {
        const mockResponse = {
            data: { data: [], total: 0, total_pages: 3, page: 1, pageSize: 6 },
            status: 200,
            statusText: "OK",
            headers: {},
            config: {},
        };

        mockGetStocksService.mockResolvedValueOnce(mockResponse as any);

        const store = useDashboardStore();
        store.page = 2;
        store.totalPages = 3;

        await store.prevPage();

        expect(store.page).toBe(1);
        expect(mockGetStocksService).toHaveBeenCalledWith(1, 6, "");
    });

    it("prevPage no hace nada si está en la primera página", async () => {
        const store = useDashboardStore();
        store.page = 1;
        store.totalPages = 3;

        await store.prevPage();

        expect(store.page).toBe(1);
        expect(mockGetStocksService).not.toHaveBeenCalled();
    });

    it("goToPage cambia la página válida y llama getStocks", async () => {
        const mockResponse = {
            data: { data: [], total: 0, total_pages: 5, page: 3, pageSize: 6 },
            status: 200,
            statusText: "OK",
            headers: {},
            config: {},
        };

        mockGetStocksService.mockResolvedValueOnce(mockResponse as any);

        const store = useDashboardStore();
        store.totalPages = 5;

        await store.goToPage(3);

        expect(store.page).toBe(3);
        expect(mockGetStocksService).toHaveBeenCalledWith(3, 6, "");
    });

    it("goToPage no cambia si la página está fuera de rango", async () => {
        const store = useDashboardStore();
        store.page = 2;
        store.totalPages = 3;

        await store.goToPage(10);

        expect(store.page).toBe(2); // se mantiene igual
        expect(mockGetStocksService).not.toHaveBeenCalled();
    });

    it("goToPage no cambia si la página es menor a 1", async () => {
        const store = useDashboardStore();
        store.page = 2;
        store.totalPages = 3;

        await store.goToPage(0);

        expect(store.page).toBe(2);
        expect(mockGetStocksService).not.toHaveBeenCalled();
    });
});
