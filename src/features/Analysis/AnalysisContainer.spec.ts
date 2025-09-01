import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import AnalysisContainer from "./AnalysisContainer.vue";
import { useAnalysisStore } from "./store/analysis.store";
import type { Recommendation } from "./types";

// Mocks de componentes hijos con mayor detalle
vi.mock("./components/SectionHeader.vue", () => ({
    default: {
        name: "SectionHeader",
        template: '<div data-test="section-header"><slot /></div>',
        props: ["title", "modelValue"],
        emits: ["update:modelValue"],
    },
}));

vi.mock("./components/TabsSection.vue", () => ({
    default: {
        name: "TabsSection",
        template: '<div data-test="tabs-section">TabsSection</div>',
        props: ["tabs", "modelValue"],
        emits: ["update:modelValue"],
    },
}));

vi.mock("./components/TargetsChart.vue", () => ({
    default: {
        name: "TargetsChart",
        template: '<div data-test="targets-chart">TargetsChart</div>',
        props: ["data"],
    },
}));

vi.mock("./components/GrowthChartWithCards.vue", () => ({
    default: {
        name: "GrowthChartWithCards",
        template: '<div data-test="growth-chart">GrowthChartWithCards</div>',
        props: ["data"],
    },
}));

vi.mock("./components/ScoreChart.vue", () => ({
    default: {
        name: "ScoreChart",
        template: '<div data-test="score-chart">ScoreChart</div>',
        props: ["data"],
    },
}));

vi.mock("@/components/layout/AppSpinner.vue", () => ({
    default: {
        name: "AppSpinner",
        template: '<div data-test="app-spinner">AppSpinner</div>',
        props: ["position", "size"],
    },
}));

describe("AnalysisContainer.vue", () => {
    const mockRecommendation: Recommendation = {
        Ticker: "AAPL",
        Company: "Apple Inc.",
        Score: 85,
        Reason: "Strong growth potential",
        Rating: "BUY",
        TargetFrom: "$150",
        TargetTo: "$180",
        Time: "2025-08-31T10:00:00.000Z"
    };

    function factory(initialState?: Partial<ReturnType<typeof useAnalysisStore>>) {
        return mount(AnalysisContainer, {
            global: {
                plugins: [
                    createTestingPinia({
                        createSpy: vi.fn,
                        initialState: {
                            analysis: {
                                recommendations: [],
                                isLoading: false,
                                error: null,
                                selection: "top5",
                                activeTab: "recommendations",
                                topLimit: 5,
                                filteredRecommendations: [],
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

        // Verificar que se renderiza el contenedor principal
        expect(wrapper.find("div.p-6").exists()).toBe(true);

        // Verificar que SectionHeader está presente
        expect(wrapper.find("[data-test='section-header']").exists()).toBe(true);

        // Verificar que SectionHeader recibe las props correctas
        const sectionHeader = wrapper.findComponent({ name: "SectionHeader" });
        expect(sectionHeader.props("title")).toBe("Análisis de Recomendaciones");
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

    it("muestra un mensaje de error cuando hay un error", () => {
        const errorMessage = "Error al cargar las recomendaciones";
        const wrapper = factory({ error: errorMessage });

        const errorElement = wrapper.find("p.text-red-500");
        expect(errorElement.exists()).toBe(true);
        expect(errorElement.text()).toBe(errorMessage);

        // No debe mostrar el spinner ni TabsSection
        expect(wrapper.find("[data-test='app-spinner']").exists()).toBe(false);
        expect(wrapper.find("[data-test='tabs-section']").exists()).toBe(false);
    });

    it("renderiza TabsSection cuando hay recomendaciones y no está cargando", () => {
        const mockRecommendations = [mockRecommendation];
        const wrapper = factory({
            recommendations: mockRecommendations,
            filteredRecommendations: mockRecommendations,
            isLoading: false
        });

        const tabsSection = wrapper.find("[data-test='tabs-section']");
        expect(tabsSection.exists()).toBe(true);

        // Verificar que TabsSection recibe las props correctas
        const tabsSectionComponent = wrapper.findComponent({ name: "TabsSection" });
        expect(tabsSectionComponent.props("tabs")).toBeDefined();
        expect(tabsSectionComponent.props("tabs")).toHaveLength(3);
    });

    it("no muestra TabsSection when isLoading es true, aunque haya recomendaciones", () => {
        const wrapper = factory({
            recommendations: [mockRecommendation],
            isLoading: true
        });

        expect(wrapper.find("[data-test='tabs-section']").exists()).toBe(false);
        expect(wrapper.find("[data-test='app-spinner']").exists()).toBe(true);
    });

    it("no muestra TabsSection cuando no hay recomendaciones", () => {
        const wrapper = factory({
            recommendations: [],
            isLoading: false
        });

        expect(wrapper.find("[data-test='tabs-section']").exists()).toBe(false);
        expect(wrapper.find("[data-test='app-spinner']").exists()).toBe(false);
    });

    it("llama getRecommendations onMounted", async () => {
        const mockGetRecommendations = vi.fn().mockResolvedValue(undefined);

        mount(AnalysisContainer, {
            global: {
                plugins: [
                    createTestingPinia({
                        createSpy: vi.fn,
                        initialState: {
                            analysis: {
                                getRecommendations: mockGetRecommendations,
                            },
                        },
                    }),
                ],
            },
        });

        const store = useAnalysisStore();
        expect(store.getRecommendations).toHaveBeenCalledOnce();
    });

    it("genera tabs correctos con las propiedades apropiadas", () => {
        const mockRecommendations = [mockRecommendation];
        const wrapper = factory({
            recommendations: mockRecommendations,
            filteredRecommendations: mockRecommendations,
        });

        const tabsSectionComponent = wrapper.findComponent({ name: "TabsSection" });
        const tabs = tabsSectionComponent.props("tabs");

        // Verificar que hay 3 tabs
        expect(tabs).toHaveLength(3);

        // Verificar la estructura de los tabs
        expect(tabs[0].value).toBe("recommendations");
        expect(tabs[0].label).toBe("Recomendaciones");
        expect(tabs[1].value).toBe("growth");
        expect(tabs[1].label).toBe("Crecimiento");
        expect(tabs[2].value).toBe("scores");
        expect(tabs[2].label).toBe("Puntuaciones");

        // Verificar que cada tab tiene contenido
        tabs.forEach((tab: any) => {
            expect(tab.content).toBeTypeOf("function");
        });
    });

    it("maneja el estado de carga correctamente después de resolver la promesa", async () => {
        const wrapper = factory({
            isLoading: false,
            recommendations: [mockRecommendation],
            filteredRecommendations: [mockRecommendation],
        });

        // Debe mostrar las recomendaciones cuando la carga termina
        expect(wrapper.find("[data-test='tabs-section']").exists()).toBe(true);
        expect(wrapper.find("[data-test='app-spinner']").exists()).toBe(false);
    });

    it("prioriza el estado de carga sobre el error", () => {
        const wrapper = factory({
            isLoading: true,
            error: "Error de conexión",
        });

        // Debe mostrar el spinner, no el error (según la lógica v-if/v-else-if)
        expect(wrapper.find("[data-test='app-spinner']").exists()).toBe(true);
        expect(wrapper.find("p.text-red-500").exists()).toBe(false);
    });
});
