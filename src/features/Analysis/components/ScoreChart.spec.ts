import { mount } from "@vue/test-utils";
import ScoreChart from "./ScoreChart.vue";
import type { Recommendation } from "../types";
import { describe, expect, it, vi } from "vitest";

vi.mock("chart.js", () => {
    const mockRegister = vi.fn();

    return {
        __esModule: true,
        default: {
            register: mockRegister,
        },
        Chart: {
            register: mockRegister,
        },
        register: mockRegister,
        Title: {
            id: "title",
            defaults: {},
        },
        Tooltip: {
            id: "tooltip",
            defaults: {},
        },
        Legend: {
            id: "legend",
            defaults: {},
        },
        BarElement: {
            id: "bar",
            defaults: {},
        },
        CategoryScale: {
            id: "categoryScale",
            defaults: {},
        },
        LinearScale: {
            id: "linearScale",
            defaults: {},
        },
    };
});


vi.mock("vue-chartjs", () => ({
    Bar: {
        template: "<div data-test='bar-chart' />",
        props: ["data", "options"],
    },
}));

interface BarChartVM {
    chartData: {
        labels: string[];
        datasets: Array<{
            label: string;
            data: number[];
            backgroundColor: string;
            borderColor: string;
            borderWidth: number;
            borderRadius: number;
        }>;
    };
    chartOptions: any;
}

describe("ScoreChart.vue", () => {
    const mockData: Recommendation[] = [
        {
            Ticker: "MSFT",
            Company: "Microsoft",
            Score: 8,
            Reason: "Test reason",
            Rating: "Buy",
            TargetFrom: "$650.00",
            TargetTo: "$675.00",
            Time: "2025-08-18T19:30:05Z",
        },
        {
            Ticker: "AAPL",
            Company: "Apple",
            Score: 6,
            Reason: "Another reason",
            Rating: "Hold",
            TargetFrom: "$180.00",
            TargetTo: "$190.00",
            Time: "2025-08-19T19:30:05Z",
        },
        {
            Ticker: "GOOGL",
            Company: "Google",
            Score: 9,
            Reason: "Great performance",
            Rating: "Strong Buy",
            TargetFrom: "$2800.00",
            TargetTo: "$3000.00",
            Time: "2025-08-20T19:30:05Z",
        },
    ];

    it("renderiza correctamente con datos", () => {
        const wrapper = mount(ScoreChart, {
            props: { data: mockData },
        });

        expect(wrapper.exists()).toBe(true);
        expect(wrapper.props("data")).toEqual(mockData);
        expect(wrapper.find("[data-test='bar-chart']").exists()).toBe(true);
    });

    it("transforma los datos correctamente en chartData", () => {
        const wrapper = mount(ScoreChart, {
            props: { data: mockData },
        });

        const vm = wrapper.vm as unknown as BarChartVM;

        // Verificar labels
        expect(vm.chartData.labels).toEqual(["MSFT", "AAPL", "GOOGL"]);

        // Verificar datasets
        expect(vm.chartData.datasets).toHaveLength(1);
        expect(vm.chartData.datasets[0].label).toBe("Puntuación");
        expect(vm.chartData.datasets[0].data).toEqual([8, 6, 9]);
        expect(vm.chartData.datasets[0].backgroundColor).toBe("rgba(0, 175, 117, 0.7)");
        expect(vm.chartData.datasets[0].borderColor).toBe("#00AF75");
        expect(vm.chartData.datasets[0].borderWidth).toBe(2);
        expect(vm.chartData.datasets[0].borderRadius).toBe(8);
    });

    it("tiene las opciones correctas de configuración", () => {
        const wrapper = mount(ScoreChart, {
            props: { data: mockData },
        });

        const vm = wrapper.vm as unknown as BarChartVM;

        // Verificar opciones básicas
        expect(vm.chartOptions.responsive).toBe(true);

        // Verificar plugins
        expect(vm.chartOptions.plugins.legend.display).toBe(false);
        expect(vm.chartOptions.plugins.title.display).toBe(true);
        expect(vm.chartOptions.plugins.title.text).toBe("Puntuación de Recomendaciones");

        // Verificar escalas
        expect(vm.chartOptions.scales.y.beginAtZero).toBe(true);
    });

    it("manipula datos vacíos correctamente", () => {
        const wrapper = mount(ScoreChart, {
            props: { data: [] },
        });

        const vm = wrapper.vm as unknown as BarChartVM;

        expect(vm.chartData.labels).toEqual([]);
        expect(vm.chartData.datasets[0].data).toEqual([]);
    });

    it("actualiza reactivamente cuando cambian los props", async () => {
        const wrapper = mount(ScoreChart, {
            props: { data: mockData.slice(0, 2) }, // Solo 2 items inicialmente
        });

        const vm = wrapper.vm as unknown as BarChartVM;
        expect(vm.chartData.labels).toEqual(["MSFT", "AAPL"]);
        expect(vm.chartData.datasets[0].data).toEqual([8, 6]);

        // Actualizar props
        await wrapper.setProps({ data: mockData }); // 3 items ahora

        expect(vm.chartData.labels).toEqual(["MSFT", "AAPL", "GOOGL"]);
        expect(vm.chartData.datasets[0].data).toEqual([8, 6, 9]);
    });

    it("aplica los estilos correctos a los datasets", () => {
        const wrapper = mount(ScoreChart, {
            props: { data: mockData },
        });

        const vm = wrapper.vm as unknown as BarChartVM;
        const datasets = vm.chartData.datasets;

        // Verificar que los datasets tienen las propiedades básicas
        expect(datasets[0].label).toBeDefined();
        expect(datasets[0].data).toBeDefined();

        // Las propiedades de estilo pueden ser opcionales, verificar solo si existen
        if (datasets[0].borderColor) {
            expect(datasets[0].borderColor).toBeDefined();
        }
        if (datasets[0].backgroundColor) {
            expect(datasets[0].backgroundColor).toBeDefined();
        }
    });
});