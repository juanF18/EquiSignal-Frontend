<script setup lang="ts">
import { computed } from "vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "vue-chartjs";
import type { Recommendation } from "../types";

// Registramos los módulos de Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

// Props
const props = defineProps<{
  data: Recommendation[];
}>();

// 🔥 Computed reactivo
const chartData = computed(() => {
  const labels = props.data.map((d) => d.Ticker);
  const scores = props.data.map((d) => d.Score);

  return {
    labels,
    datasets: [
      {
        label: "Puntuación",
        data: scores,
        backgroundColor: "rgba(0, 175, 117, 0.7)", // verde principal con transparencia
        borderColor: "#00AF75", // borde sólido verde
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };
});

// Configuración del gráfico
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false, // solo mostramos las barras
    },
    title: {
      display: true,
      text: "Puntuación de Recomendaciones",
      color: "#111",
      font: {
        size: 16,
        weight: "bold" as const,
      },
    },
    tooltip: {
      callbacks: {
        label: (ctx: any) => `Score: ${ctx.raw}`,
      },
    },
  },
  scales: {
    x: {
      ticks: { color: "#555" },
      grid: { color: "rgba(0,0,0,0.05)" },
    },
    y: {
      beginAtZero: true,
      ticks: { color: "#555" },
      grid: { color: "rgba(0,0,0,0.05)" },
    },
  },
};
</script>

<template>
  <div class="bg-white p-4 rounded-2xl shadow-md">
    <Bar :data="chartData" :options="chartOptions" class="max-h-[50vh]" />
  </div>
</template>
