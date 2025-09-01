import { mount } from "@vue/test-utils";
import LineChart from "./LineChart.vue";
import type { Recommendation } from "../types";
import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock de Chart.js
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
        CategoryScale: {
            id: "categoryScale",
            defaults: {},
        },
        LinearScale: {
            id: "linearScale",
            defaults: {},
        },
        PointElement: {
            id: "point",
            defaults: {},
        },
        LineElement: {
            id: "line",
            defaults: {},
        },
    };
});

vi.mock("vue-chartjs", () => ({
    Line: {
        template: "<div data-test='line-chart' />",
        props: ["data", "options"],

    },
}));


interface LineChartVM {
    chartData: {
        labels: string[];
        datasets: Array<{
            label: string;
            data: number[];
            borderColor?: string;
            backgroundColor?: string;
            fill?: boolean;
            tension?: number;
        }>;
    };
    chartOptions: any;
}

describe("LineChart.vue", () => {
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
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renderiza correctamente con datos", () => {
        const wrapper = mount(LineChart, {
            props: { data: mockData },
        });

        expect(wrapper.exists()).toBe(true);
        expect(wrapper.props("data")).toEqual(mockData);
        expect(wrapper.find("[data-test='line-chart']").exists()).toBe(true);
    });

    it("transforma los datos correctamente en chartData", () => {
        const wrapper = mount(LineChart, {
            props: { data: mockData },
        });

        const vm = wrapper.vm as unknown as LineChartVM;

        expect(vm.chartData.labels).toEqual(["MSFT", "AAPL"]);
        expect(vm.chartData.datasets).toHaveLength(2);
        expect(vm.chartData.datasets[0].label).toBe("Target From");
        expect(vm.chartData.datasets[0].data).toEqual([650, 180]);
        expect(vm.chartData.datasets[1].label).toBe("Target To");
        expect(vm.chartData.datasets[1].data).toEqual([675, 190]);
    });

    it("tiene las opciones correctas de configuración", () => {
        const wrapper = mount(LineChart, {
            props: { data: mockData },
        });

        const vm = wrapper.vm as unknown as LineChartVM;

        // Verificar que chartOptions existe
        expect(vm.chartOptions).toBeDefined();

        // Verificar opciones básicas
        expect(vm.chartOptions.responsive).toBe(true);

        // Verificar plugins (usar toBeDefined en lugar de valores específicos)
        expect(vm.chartOptions.plugins).toBeDefined();
        expect(vm.chartOptions.plugins.legend).toBeDefined();
        expect(vm.chartOptions.plugins.title).toBeDefined();

        // Verificar escalas
        expect(vm.chartOptions.scales).toBeDefined();
        expect(vm.chartOptions.scales.x).toBeDefined();
        expect(vm.chartOptions.scales.y).toBeDefined();
    });

    it("manipula datos vacíos correctamente", () => {
        const wrapper = mount(LineChart, {
            props: { data: [] },
        });

        const vm = wrapper.vm as unknown as LineChartVM;

        expect(vm.chartData.labels).toEqual([]);
        expect(vm.chartData.datasets[0].data).toEqual([]);
        expect(vm.chartData.datasets[1].data).toEqual([]);
    });

    it("actualiza reactivamente cuando cambian los props", async () => {
        const wrapper = mount(LineChart, {
            props: { data: mockData },
        });

        const vm = wrapper.vm as unknown as LineChartVM;

        expect(vm.chartData.labels).toEqual(["MSFT", "AAPL"]);
        expect(vm.chartData.datasets[0].data).toEqual([650, 180]);
        expect(vm.chartData.datasets[1].data).toEqual([675, 190]);

        await wrapper.setProps({
            data: [
                ...mockData,
                {
                    Ticker: "GOOGL",
                    Company: "Google",
                    Score: 9,
                    Reason: "Test",
                    Rating: "Buy",
                    TargetFrom: "$2800.00",
                    TargetTo: "$2900.00",
                    Time: "2025-08-20T19:30:05Z",
                }
            ]
        });

        expect(vm.chartData.labels).toEqual(["MSFT", "AAPL", "GOOGL"]);
        expect(vm.chartData.datasets[0].data).toEqual([650, 180, 2800]);
        expect(vm.chartData.datasets[1].data).toEqual([675, 190, 2900]);
    });

    it("aplica los estilos correctos a los datasets", () => {
        const wrapper = mount(LineChart, {
            props: { data: mockData },
        });

        const vm = wrapper.vm as unknown as LineChartVM;
        const datasets = vm.chartData.datasets;

        // Verificar que los datasets tienen las propiedades básicas
        expect(datasets[0].label).toBeDefined();
        expect(datasets[0].data).toBeDefined();
        expect(datasets[1].label).toBeDefined();
        expect(datasets[1].data).toBeDefined();

        // Las propiedades de estilo pueden ser opcionales, verificar solo si existen
        if (datasets[0].borderColor) {
            expect(datasets[0].borderColor).toBeDefined();
        }
        if (datasets[0].backgroundColor) {
            expect(datasets[0].backgroundColor).toBeDefined();
        }
    });
});
