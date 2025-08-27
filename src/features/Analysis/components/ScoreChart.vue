<script setup lang="ts">
import { defineProps } from "vue";
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

// Transformación de datos
const labels = props.data.map((d) => d.Ticker);
const scores = props.data.map((d) => d.Score);

// Configuración del gráfico
const chartData = {
  labels,
  datasets: [
    {
      label: "Puntuación",
      data: scores,
      backgroundColor: "rgba(59, 130, 246, 0.7)", // azul con transparencia
      borderRadius: 8,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false, // solo mostramos la barra
    },
    title: {
      display: true,
      text: "Puntuación de Recomendaciones",
      font: {
        size: 16,
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
    },
    y: {
      beginAtZero: true,
      ticks: { color: "#555" },
    },
  },
};
</script>

<template>
  <div class="bg-white p-4 rounded-2xl shadow-md">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
