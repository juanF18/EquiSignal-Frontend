import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import type { Recommendation } from "../types";
import GrowthChartWithCards from "./GrowthChartWithCards.vue";

// Stub de LineChart para evitar dependencias externas
const LineChartStub = {
    template: `<div data-testid="linechart"></div>`,
    props: ["data"],
};

const mockData: Recommendation[] = [
    {
        Ticker: "AAPL",
        Company: "Apple Inc.",
        Score: 8,
        Reason: "Positive outlook",
        Rating: "Buy",
        TargetFrom: "$100",
        TargetTo: "$150",
        Time: "2025-08-20T00:00:00Z",
    },
    {
        Ticker: "MSFT",
        Company: "Microsoft",
        Score: 7,
        Reason: "Strong fundamentals",
        Rating: "Buy",
        TargetFrom: "$200",
        TargetTo: "$250",
        Time: "2025-08-21T00:00:00Z",
    },
];

describe("GrowthChartWithCards.vue", () => {
    const mountFactory = (props = { data: mockData }) =>
        shallowMount(GrowthChartWithCards, {
            props,
            global: {
                stubs: {
                    LineChart: LineChartStub,
                },
            },
        });

    it("renderiza el LineChart con los datos", () => {
        const wrapper = mountFactory();
        const chart = wrapper.find("[data-testid='linechart']");
        expect(chart.exists()).toBe(true);
        expect(wrapper.findComponent(LineChartStub).props("data")).toEqual(mockData);
    });

    it("renderiza una card por cada stock", () => {
        const wrapper = mountFactory();
        const cards = wrapper.findAll("div.border-l-4");
        expect(cards).toHaveLength(mockData.length);
    });

    it("muestra el ticker, diferencia en $, %, y company en cada card", () => {
        const wrapper = mountFactory();
        const cards = wrapper.findAll("div.border-l-4");

        // Apple
        const appleCard = cards[0];
        expect(appleCard.text()).toContain("AAPL");
        expect(appleCard.text()).toContain("+50.00"); // 150 - 100
        expect(appleCard.text()).toContain("50.00%"); // (50/100) * 100
        expect(appleCard.text()).toContain("Apple Inc.");

        // Microsoft
        const msftCard = cards[1];
        expect(msftCard.text()).toContain("MSFT");
        expect(msftCard.text()).toContain("+50.00"); // 250 - 200
        expect(msftCard.text()).toContain("25.00%"); // (50/200) * 100
        expect(msftCard.text()).toContain("Microsoft");
    });

    it("usa las clases de estilo en las cards", () => {
        const wrapper = mountFactory();
        const firstCard = wrapper.find("div.border-l-4");
        expect(firstCard.classes()).toContain("border-[#00AF75]");
        expect(firstCard.classes()).toContain("rounded-r-2xl");
    });
});
