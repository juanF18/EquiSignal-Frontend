import { mount } from "@vue/test-utils";
import TabsSection from "./TabsSection.vue";
import { Tabs } from "@/components/ui/tabs";
import { describe, expect, it, vi } from "vitest";
import type { Tab } from "@/types/ui";

// Mock de los componentes UI de tabs
vi.mock("@/components/ui/tabs", () => ({
    Tabs: {
        name: "Tabs",
        template: `<div data-test="tabs"><slot /></div>`,
        props: ["modelValue"],
        emits: ["update:modelValue"],
    },
    TabsList: {
        name: "TabsList",
        template: `<div data-test="tabs-list"><slot /></div>`,
    },
    TabsTrigger: {
        name: "TabsTrigger",
        template: `<button data-test="tab-trigger" :data-value="value"><slot /></button>`,
        props: ["value", "class"],
    },
    TabsContent: {
        name: "TabsContent",
        template: `<div data-test="tab-content" :data-value="value"><slot /></div>`,
        props: ["value", "class"],
    },
}));

// Componente mock para testing
const MockComponent = {
    template: `<div data-test="mock-component">Mock Component</div>`,
    props: ["testProp"],
};

describe("TabsSection.vue", () => {
    const mockTabs: Tab[] = [
        {
            value: "tab1",
            label: "Tab 1",
            content: "Contenido del tab 1",
        },
        {
            value: "tab2",
            label: "Tab 2",
            content: () => ({
                component: MockComponent,
                props: { testProp: "test-value" },
            }),
        },
    ];

    it("renderiza correctamente con tabs básicos", () => {
        const wrapper = mount(TabsSection, {
            props: { tabs: mockTabs },
        });

        expect(wrapper.exists()).toBe(true);

        // Verificar que los tabs se renderizan
        expect(wrapper.find("[data-test='tabs']").exists()).toBe(true);
        expect(wrapper.find("[data-test='tabs-list']").exists()).toBe(true);

        // Verificar que los triggers se renderizan
        const triggers = wrapper.findAll("[data-test='tab-trigger']");
        expect(triggers).toHaveLength(2);
        expect(triggers[0].text()).toBe("Tab 1");
        expect(triggers[1].text()).toBe("Tab 2");

        // Verificar que los contenidos se renderizan
        const contents = wrapper.findAll("[data-test='tab-content']");
        expect(contents).toHaveLength(2);
    });

    it("selecciona el primer tab por defecto cuando no hay modelValue", () => {
        const wrapper = mount(TabsSection, {
            props: { tabs: mockTabs },
        });

        const tabsComponent = wrapper.findComponent(Tabs);
        expect(tabsComponent.props("modelValue")).toBe("tab1");
    });

    it("usa el modelValue cuando está proporcionado", () => {
        const wrapper = mount(TabsSection, {
            props: {
                tabs: mockTabs,
                modelValue: "tab2"
            },
        });

        const tabsComponent = wrapper.findComponent(Tabs);
        expect(tabsComponent.props("modelValue")).toBe("tab2");
    });

    it("emite evento update:modelValue cuando se cambia la pestaña", async () => {
        const wrapper = mount(TabsSection, {
            props: { tabs: mockTabs },
        });

        // Simular cambio de tab
        const tabsComponent = wrapper.findComponent(Tabs);
        await tabsComponent.vm.$emit("update:modelValue", "tab2");

        // Verificar que se emite el evento
        expect(wrapper.emitted("update:modelValue")).toBeTruthy();
        expect(wrapper.emitted("update:modelValue")![0]).toEqual(["tab2"]);
    });

    it("renderiza contenido de tipo string correctamente", () => {
        const wrapper = mount(TabsSection, {
            props: { tabs: mockTabs },
        });

        // Encontrar el contenido del primer tab (string)
        const tabContents = wrapper.findAll("[data-test='tab-content']");
        const firstTabContent = tabContents.find(content =>
            content.attributes("data-value") === "tab1"
        );

        expect(firstTabContent?.exists()).toBe(true);

        // Buscar el párrafo dentro del contenido del tab
        const paragraph = firstTabContent?.find("p");
        expect(paragraph?.exists()).toBe(true);
        expect(paragraph?.text()).toBe("Contenido del tab 1");
        expect(paragraph?.classes()).toContain("text-gray-700");
    });

    it("renderiza contenido de tipo componente correctamente", () => {
        const wrapper = mount(TabsSection, {
            props: { tabs: mockTabs },
            global: {
                components: {
                    MockComponent
                }
            }
        });

        // Encontrar el contenido del segundo tab (componente)
        const tabContents = wrapper.findAll("[data-test='tab-content']");
        const secondTabContent = tabContents.find(content =>
            content.attributes("data-value") === "tab2"
        );

        expect(secondTabContent?.exists()).toBe(true);

        // Verificar que el div wrapper existe
        const componentWrapper = secondTabContent?.find("div.w-full");
        expect(componentWrapper?.exists()).toBe(true);

        // Verificar que el componente mock se renderiza
        const mockComponent = componentWrapper?.findComponent(MockComponent);
        expect(mockComponent?.exists()).toBe(true);
        expect(mockComponent?.props("testProp")).toBe("test-value");
    });

    it("maneja correctamente tabs vacíos", () => {
        const wrapper = mount(TabsSection, {
            props: { tabs: [] },
        });

        // No debería haber triggers ni contenidos
        const triggers = wrapper.findAll("[data-test='tab-trigger']");
        const contents = wrapper.findAll("[data-test='tab-content']");

        expect(triggers).toHaveLength(0);
        expect(contents).toHaveLength(0);
    });

    it("maneja el caso cuando el primer tab no tiene value", () => {
        const invalidTabs: Tab[] = [
            { value: "", label: "Empty Tab", content: "Empty content" },
            { value: "valid", label: "Valid Tab", content: "Valid content" },
        ];

        const wrapper = mount(TabsSection, {
            props: { tabs: invalidTabs },
        });

        // Debería usar el value vacío como valor por defecto
        const tabsComponent = wrapper.findComponent(Tabs);
        expect(tabsComponent.props("modelValue")).toBe("");
    });

    it("aplica las clases CSS correctas a los triggers activos", () => {
        const wrapper = mount(TabsSection, {
            props: { tabs: mockTabs },
        });

        const triggers = wrapper.findAllComponents({ name: "TabsTrigger" });

        // Verificar que los triggers tienen las clases correctas
        triggers.forEach(trigger => {
            expect(trigger.props("class")).toContain("data-[state=active]:bg-[#00AF75]");
            expect(trigger.props("class")).toContain("data-[state=active]:text-white");
        });
    });

    it("mantiene la sincronización bidireccional con v-model", async () => {
        const wrapper = mount(TabsSection, {
            props: {
                tabs: mockTabs,
                modelValue: "tab1"
            },
        });

        // Verificar valor inicial
        const tabsComponent = wrapper.findComponent(Tabs);
        expect(tabsComponent.props("modelValue")).toBe("tab1");

        // Cambiar el valor desde el componente padre (simulado)
        await wrapper.setProps({ modelValue: "tab2" });

        // Verificar que el componente interno se actualiza
        expect(tabsComponent.props("modelValue")).toBe("tab2");

        // Cambiar desde el componente interno
        await tabsComponent.vm.$emit("update:modelValue", "tab1");

        // Verificar que se emite el evento
        expect(wrapper.emitted("update:modelValue")![0]).toEqual(["tab1"]);
    });

    it("maneja contenido undefined o null gracefulmente", () => {
        const tabsWithUndefinedContent: Tab[] = [
            {
                value: "tab1",
                label: "Tab 1",
                content: undefined as any,
            },
            {
                value: "tab2",
                label: "Tab 2",
                content: null as any,
            },
        ];

        const wrapper = mount(TabsSection, {
            props: { tabs: tabsWithUndefinedContent },
        });

        // Debería renderizar sin errores
        expect(wrapper.exists()).toBe(true);
        const contents = wrapper.findAll("[data-test='tab-content']");
        expect(contents).toHaveLength(2);
    });
});