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

// Registramos módulos de Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

// Props con los datos
const props = defineProps<{
  data: Recommendation[];
}>();

// Transformamos los datos
const labels = props.data.map((d) => d.Ticker);
const fromValues = props.data.map((d) => Number(d.TargetFrom.replace("$", "")));
const toValues = props.data.map((d) => Number(d.TargetTo.replace("$", "")));

const chartData = {
  labels,
  datasets: [
    {
      label: "Target From",
      data: fromValues,
      backgroundColor: "rgba(0, 175, 117, 0.6)",
    },
    {
      label: "Target To",
      data: toValues,
      backgroundColor: "rgba(0, 175, 117, 1)",
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        color: "#333",
      },
    },
    title: {
      display: true,
      text: "Comparación de Targets",
      color: "#111",
    },
  },
  scales: {
    x: {
      ticks: { color: "#555" },
    },
    y: {
      ticks: { color: "#555" },
    },
  },
};
</script>

<template>
  <div class="bg-white p-4 rounded-2xl shadow-md">
    <Bar :data="chartData" :options="chartOptions" class="max-h-[50vh]" />
  </div>
</template>
