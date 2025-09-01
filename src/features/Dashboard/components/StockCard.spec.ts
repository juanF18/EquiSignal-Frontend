// tests/StockCard.spec.ts
import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import StockCard from "./StockCard.vue";

// Mock de los componentes UI
vi.mock("@/components/ui/card", () => ({
    Card: {
        name: "Card",
        template: '<div data-test="card" :class="$attrs.class"><slot /></div>',
        inheritAttrs: false,
    },
    CardContent: {
        name: "CardContent",
        template: '<div data-test="card-content" :class="$attrs.class"><slot /></div>',
        inheritAttrs: false,
    },
}));

// Mock de los iconos
vi.mock("lucide-vue-next", () => ({
    ArrowUpRight: {
        name: "ArrowUpRight",
        template: '<svg data-test="arrow-up-right"><use /></svg>',
    },
    ArrowDownRight: {
        name: "ArrowDownRight",
        template: '<svg data-test="arrow-down-right"><use /></svg>',
    },
}));

describe("StockCard.vue", () => {
    const baseProps = {
        Ticker: "AAPL",
        Company: "Apple Inc.",
        Trend: "up" as const,
        Rating: "Buy",
        prevTarget: 150,
        currentTarget: 180,
        Brokerage: "Goldman Sachs",
    };

    it("muestra el ticker y la compañía", () => {
        const wrapper = mount(StockCard, { props: baseProps });

        // Verificar ticker
        const ticker = wrapper.find("h2");
        expect(ticker.exists()).toBe(true);
        expect(ticker.text()).toBe("AAPL");

        // Verificar compañía
        const company = wrapper.find("p.text-gray-500");
        expect(company.exists()).toBe(true);
        expect(company.text()).toBe("Apple Inc.");
    });

    it("muestra tendencia hacia arriba con icono verde", () => {
        const wrapper = mount(StockCard, {
            props: { ...baseProps, Trend: "up", Rating: "Buy" }
        });

        // Buscar el icono de flecha hacia arriba
        const arrowIcon = wrapper.find("[data-test='arrow-up-right']");
        expect(arrowIcon.exists()).toBe(true);

        // Verificar que el texto del rating está presente
        expect(wrapper.text()).toContain("Buy");
    });

    it("muestra tendencia hacia abajo con icono rojo", () => {
        const wrapper = mount(StockCard, {
            props: { ...baseProps, Trend: "down", Rating: "Sell" }
        });

        // Buscar el icono de flecha hacia abajo
        const arrowIcon = wrapper.find("[data-test='arrow-down-right']");
        expect(arrowIcon.exists()).toBe(true);

        // Verificar que el texto del rating está presente
        expect(wrapper.text()).toContain("Sell");
    });

    it("muestra tendencia neutral si Trend no es up/down", () => {
        const wrapper = mount(StockCard, {
            props: { ...baseProps, Trend: "neutral" as any, Rating: "" }
        });

        // No debe mostrar iconos de flecha
        expect(wrapper.find("[data-test='arrow-up-right']").exists()).toBe(false);
        expect(wrapper.find("[data-test='arrow-down-right']").exists()).toBe(false);

        // Debe mostrar "Neutral" cuando no hay rating
        expect(wrapper.text()).toContain("Neutral");
    });

    it("formatea correctamente los objetivos", () => {
        const wrapper = mount(StockCard, { props: baseProps });

        // Verificar formato de moneda para objetivo anterior
        expect(wrapper.text()).toContain("$150.00");

        // Verificar formato de moneda para objetivo actual  
        expect(wrapper.text()).toContain("$180.00");

        // Verificar etiquetas
        expect(wrapper.text()).toContain("Objetivo Anterior");
        expect(wrapper.text()).toContain("Objetivo Actual");
    });

    it("muestra el brokerage", () => {
        const wrapper = mount(StockCard, { props: baseProps });

        // Verificar etiqueta y valor del brokerage
        expect(wrapper.text()).toContain("Brokerage");
        expect(wrapper.text()).toContain("Goldman Sachs");
    });

    it("maneja correctamente valores decimales en objetivos", () => {
        const propsWithDecimals = {
            ...baseProps,
            prevTarget: 123.456,
            currentTarget: 187.89,
        };

        const wrapper = mount(StockCard, { props: propsWithDecimals });

        // Debe formatear con 2 decimales
        expect(wrapper.text()).toContain("$123.46");
        expect(wrapper.text()).toContain("$187.89");
    });

    it("maneja rating vacío o undefined", () => {
        const propsWithoutRating = {
            ...baseProps,
            Rating: undefined,
        };

        const wrapper = mount(StockCard, { props: propsWithoutRating });

        // Debe mostrar "Neutral" cuando no hay rating
        expect(wrapper.text()).toContain("Neutral");
    });

    it("renderiza correctamente la estructura del card", () => {
        const wrapper = mount(StockCard, { props: baseProps });

        // Verificar que se renderiza el Card principal
        expect(wrapper.find("[data-test='card']").exists()).toBe(true);

        // Verificar que se renderiza el CardContent
        expect(wrapper.find("[data-test='card-content']").exists()).toBe(true);
    });
});
