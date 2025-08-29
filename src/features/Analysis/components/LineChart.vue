<script setup lang="ts">
import { defineProps, computed } from "vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Line } from "vue-chartjs";
import type { Recommendation } from "../types";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

const props = defineProps<{
  data: Recommendation[];
}>();

// 🔥 Computed para recalcular cuando cambie props.data
const chartData = computed(() => {
  const labels = props.data.map((d) => d.Ticker);
  const fromValues = props.data.map((d) =>
    Number(d.TargetFrom.replace("$", ""))
  );

  const toValues = props.data.map((d) => Number(d.TargetTo.replace("$", "")));

  return {
    labels,
    datasets: [
      {
        label: "Target From",
        data: fromValues,
        borderColor: "rgba(0, 175, 117, 0.6)",
        backgroundColor: "rgba(0, 175, 117, 0.6)",
        tension: 0.4,
      },
      {
        label: "Target To",
        data: toValues,
        borderColor: "rgba(0, 175, 117, 1)",
        backgroundColor: "rgba(0, 175, 117, 1)",
        borderDash: [5, 5],
        tension: 0.4,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
      labels: { color: "#333" },
    },
    title: {
      display: true,
      text: "Potencial de Crecimiento por Acción",
      color: "#111",
    },
  },
  scales: {
    x: { ticks: { color: "#555" } },
    y: { ticks: { color: "#555" } },
  },
};
</script>

<template>
  <div class="bg-white p-4 rounded-2xl shadow-md">
    <Line :data="chartData" :options="chartOptions" class="max-h-[50vh]" />
  </div>
</template>
