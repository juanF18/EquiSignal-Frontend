import { mount } from "@vue/test-utils";
import TargetChart from "./TargetsChart.vue";
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

// Mock de vue-chartjs
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
        }>;
    };
    chartOptions: any;
}

describe("TargetChart.vue", () => {
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

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renderiza correctamente con datos", () => {
        const wrapper = mount(TargetChart, {
            props: { data: mockData },
        });

        expect(wrapper.exists()).toBe(true);
        expect(wrapper.props("data")).toEqual(mockData);
        expect(wrapper.find("[data-test='bar-chart']").exists()).toBe(true);
    });

    it("transforma los datos correctamente en chartData", () => {
        const wrapper = mount(TargetChart, {
            props: { data: mockData },
        });

        const vm = wrapper.vm as unknown as BarChartVM;

        // Verificar labels
        expect(vm.chartData.labels).toEqual(["MSFT", "AAPL", "GOOGL"]);

        // Verificar datasets
        expect(vm.chartData.datasets).toHaveLength(2);

        // Dataset 1 - Target From
        expect(vm.chartData.datasets[0].label).toBe("Target From");
        expect(vm.chartData.datasets[0].data).toEqual([650, 180, 2800]);
        expect(vm.chartData.datasets[0].backgroundColor).toBe("rgba(0, 175, 117, 0.6)");

        // Dataset 2 - Target To
        expect(vm.chartData.datasets[1].label).toBe("Target To");
        expect(vm.chartData.datasets[1].data).toEqual([675, 190, 3000]);
        expect(vm.chartData.datasets[1].backgroundColor).toBe("rgba(0, 175, 117, 1)");
    });

    it("tiene las opciones correctas de configuración", () => {
        const wrapper = mount(TargetChart, {
            props: { data: mockData },
        });

        const vm = wrapper.vm as unknown as BarChartVM;

        // Verificar que chartOptions existe
        expect(vm.chartOptions).toBeDefined();

        // Verificar opciones básicas
        expect(vm.chartOptions.responsive).toBe(true);

        // Verificar plugins
        expect(vm.chartOptions.plugins).toBeDefined();
        expect(vm.chartOptions.plugins.legend).toBeDefined();
        expect(vm.chartOptions.plugins.legend.position).toBe("top");
        expect(vm.chartOptions.plugins.title).toBeDefined();
        expect(vm.chartOptions.plugins.title.display).toBe(true);
        expect(vm.chartOptions.plugins.title.text).toBe("Comparación de Targets");

        // Verificar escalas
        expect(vm.chartOptions.scales).toBeDefined();
        expect(vm.chartOptions.scales.x).toBeDefined();
        expect(vm.chartOptions.scales.y).toBeDefined();
    });

    it("manipula datos vacíos correctamente", () => {
        const wrapper = mount(TargetChart, {
            props: { data: [] },
        });

        const vm = wrapper.vm as unknown as BarChartVM;

        expect(vm.chartData.labels).toEqual([]);
        expect(vm.chartData.datasets[0].data).toEqual([]);
        expect(vm.chartData.datasets[1].data).toEqual([]);
    });

    it("actualiza reactivamente cuando cambian los props", async () => {
        const wrapper = mount(TargetChart, {
            props: { data: mockData.slice(0, 2) }, // Solo 2 items inicialmente
        });

        const vm = wrapper.vm as unknown as BarChartVM;

        // Verificar datos iniciales
        expect(vm.chartData.labels).toEqual(["MSFT", "AAPL"]);
        expect(vm.chartData.datasets[0].data).toEqual([650, 180]);
        expect(vm.chartData.datasets[1].data).toEqual([675, 190]);

        // Actualizar props
        await wrapper.setProps({ data: mockData }); // 3 items ahora

        // Verificar datos actualizados
        expect(vm.chartData.labels).toEqual(["MSFT", "AAPL", "GOOGL"]);
        expect(vm.chartData.datasets[0].data).toEqual([650, 180, 2800]);
        expect(vm.chartData.datasets[1].data).toEqual([675, 190, 3000]);
    });

    it("maneja correctamente valores numéricos sin símbolo de dólar", () => {
        const numericData: Recommendation[] = [
            {
                Ticker: "TEST",
                Company: "Test Company",
                Score: 10,
                Reason: "Test",
                Rating: "Buy",
                TargetFrom: "100.50", // Sin símbolo de dólar
                TargetTo: "200.75",   // Sin símbolo de dólar
                Time: "2025-08-18T19:30:05Z",
            }
        ];

        const wrapper = mount(TargetChart, {
            props: { data: numericData },
        });

        const vm = wrapper.vm as unknown as BarChartVM;

        expect(vm.chartData.datasets[0].data).toEqual([100.5]);
        expect(vm.chartData.datasets[1].data).toEqual([200.75]);
    });

    it("maneja correctamente datos con formato inválido", () => {
        const invalidData: Recommendation[] = [
            {
                Ticker: "TEST",
                Company: "Test Company",
                Score: 10,
                Reason: "Test",
                Rating: "Buy",
                TargetFrom: "invalid", // Valor inválido
                TargetTo: "$200.75",   // Valor válido
                Time: "2025-08-18T19:30:05Z",
            }
        ];

        const wrapper = mount(TargetChart, {
            props: { data: invalidData },
        });

        const vm = wrapper.vm as unknown as BarChartVM;

        // Debería manejar NaN gracefulmente
        expect(vm.chartData.datasets[0].data[0]).toBeNaN(); // TargetFrom inválido
        expect(vm.chartData.datasets[1].data[0]).toBe(200.75); // TargetTo válido
    });

    it("aplica los colores correctos a los datasets", () => {
        const wrapper = mount(TargetChart, {
            props: { data: mockData },
        });

        const vm = wrapper.vm as unknown as BarChartVM;
        const datasets = vm.chartData.datasets;

        // Verificar colores
        expect(datasets[0].backgroundColor).toBe("rgba(0, 175, 117, 0.6)"); // Target From con transparencia
        expect(datasets[1].backgroundColor).toBe("rgba(0, 175, 117, 1)");   // Target To sólido
    });
});