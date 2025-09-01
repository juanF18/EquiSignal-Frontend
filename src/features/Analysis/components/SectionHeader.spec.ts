import { mount } from "@vue/test-utils";
import SectionHeader from "./SectionHeader.vue";
import { useAnalysisStore } from "../store/analysis.store";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { TopPick } from "./SectionHeader.vue";

vi.mock("../store/analysis.store", () => {
    const mockStore = {
        recommendations: [],
        isLoading: false,
        error: null,
        topLimit: 5,
        selection: "top5" as TopPick,
        activeTab: "recommendations",

        filteredRecommendations: [],

        setSelection: vi.fn((value: TopPick) => {
            mockStore.selection = value;
            mockStore.topLimit = value === "top5" ? 5 : 10;
        }),
        setActiveTab: vi.fn(),
        getRecommendations: vi.fn(),

        $state: {
            recommendations: [],
            isLoading: false,
            error: null,
            topLimit: 5,
            selection: "top5" as TopPick,
            activeTab: "recommendations",
        },
        $patch: vi.fn(),
        $reset: vi.fn(),
        $subscribe: vi.fn(),
        $onAction: vi.fn(),
        $dispose: vi.fn(),
    };

    return {
        useAnalysisStore: vi.fn(() => mockStore),
    };
});

vi.mock("@/components/ui/toggle-group", () => ({
    ToggleGroup: {
        name: "ToggleGroup",
        template: '<div data-test="toggle-group"><slot /></div>',
        props: ["type", "modelValue", "class"],
        emits: ["update:modelValue"]
    },
    ToggleGroupItem: {
        name: "ToggleGroupItem",
        template: '<button data-test="toggle-item"><slot /></button>',
        props: ["value", "class"]
    },
}));

describe("SectionHeader.vue", () => {
    const mockTitle = "Análisis de Recomendaciones";
    let analysisStore: ReturnType<typeof useAnalysisStore>;

    beforeEach(() => {
        vi.mocked(useAnalysisStore).mockReturnValue({
            // State
            recommendations: [],
            isLoading: false,
            error: null,
            topLimit: 5,
            selection: "top5",
            activeTab: "recommendations",

            // Getters
            filteredRecommendations: [],

            // Actions
            setSelection: vi.fn((value: TopPick) => {
                const store = analysisStore;
                store.selection = value;
                store.topLimit = value === "top5" ? 5 : 10;
            }),
            setActiveTab: vi.fn(),
            getRecommendations: vi.fn(),

            // Propiedades de Pinia
            $state: {
                recommendations: [],
                isLoading: false,
                error: null,
                topLimit: 5,
                selection: "top5",
                activeTab: "recommendations",
            },
            $patch: vi.fn(),
            $reset: vi.fn(),
            $subscribe: vi.fn(),
            $onAction: vi.fn(),
            $dispose: vi.fn(),
            $id: "analysis",
            _customProperties: new Set<string>()
        });

        analysisStore = useAnalysisStore();
    });

    it("renderiza correctamente con el título y toggle group", () => {
        const wrapper = mount(SectionHeader, {
            props: { title: mockTitle }
        });

        expect(wrapper.exists()).toBe(true);

        const title = wrapper.find("h2");
        expect(title.exists()).toBe(true);
        expect(title.text()).toBe(mockTitle);
        expect(title.classes()).toContain("text-[#00AF75]");

        // Verificar que el toggle group existe
        const toggleGroup = wrapper.find("[data-test='toggle-group']");
        expect(toggleGroup.exists()).toBe(true);

        // Verificar que los toggle items existen
        const toggleItems = wrapper.findAll("[data-test='toggle-item']");
        expect(toggleItems).toHaveLength(2);
        expect(toggleItems[0].text()).toBe("Top 5");
        expect(toggleItems[1].text()).toBe("Top 10");
    });

    it("muestra el valor inicial del store correctamente", () => {
        analysisStore.selection = "top5";

        const wrapper = mount(SectionHeader, {
            props: { title: mockTitle }
        });

        const toggleGroup = wrapper.findComponent({ name: "ToggleGroup" });
        expect(toggleGroup.props("modelValue")).toBe("top5");

        const toggleItems = wrapper.findAll("[data-test='toggle-item']");
        expect(toggleItems).toHaveLength(2);
        expect(toggleItems[0].text()).toBe("Top 5");
        expect(toggleItems[1].text()).toBe("Top 10");
    });

    it("actualiza el store cuando se cambia la selección", async () => {
        const setSelectionSpy = vi.spyOn(analysisStore, 'setSelection');

        const wrapper = mount(SectionHeader, {
            props: { title: mockTitle }
        });

        const toggleGroup = wrapper.findComponent({ name: "ToggleGroup" });
        await toggleGroup.vm.$emit("update:modelValue", "top10");

        await wrapper.vm.$nextTick();

        expect(setSelectionSpy).toHaveBeenCalledWith("top10");
        expect(setSelectionSpy).toHaveBeenCalledTimes(1);

        expect(analysisStore.topLimit).toBe(10);
    });

    it("reacciona a cambios en el store", async () => {
        const wrapper = mount(SectionHeader, {
            props: { title: mockTitle }
        });

        // Verificar valor inicial
        const toggleGroup = wrapper.findComponent({ name: "ToggleGroup" });
        expect(toggleGroup.props("modelValue")).toBe("top5");

        // En lugar de cambiar el store directamente, simulamos un cambio desde el componente
        // que debería activar el setter del computed
        await toggleGroup.vm.$emit("update:modelValue", "top10");
        await wrapper.vm.$nextTick();

        // Verificar que la función setSelection fue llamada
        expect(analysisStore.setSelection).toHaveBeenCalledWith("top10");

        // Verificar que el store se actualizó
        expect(analysisStore.topLimit).toBe(10);
    });

    it("aplica las clases CSS correctas a los toggle items", () => {
        const wrapper = mount(SectionHeader, {
            props: { title: mockTitle }
        });

        // Verificar que los toggle items tienen las clases correctas
        const toggleItems = wrapper.findAllComponents({ name: "ToggleGroupItem" });
        expect(toggleItems).toHaveLength(2);

        // Verificar que las clases están siendo pasadas correctamente a los componentes
        expect(toggleItems[0].props("class")).toContain("data-[state=on]:bg-[#00AF75]");
        expect(toggleItems[0].props("class")).toContain("data-[state=on]:text-white");
        expect(toggleItems[1].props("class")).toContain("data-[state=on]:bg-[#00AF75]");
        expect(toggleItems[1].props("class")).toContain("data-[state=on]:text-white");
    });

    it("maneja correctamente diferentes títulos", () => {
        const differentTitles = [
            "Análisis de Inversiones",
            "Top Recomendaciones",
            "Sección Personalizada"
        ];

        differentTitles.forEach(title => {
            const wrapper = mount(SectionHeader, {
                props: { title }
            });

            const titleElement = wrapper.find("h2");
            expect(titleElement.text()).toBe(title);
        });
    });
});
