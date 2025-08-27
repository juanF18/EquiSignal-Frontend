<script setup lang="ts">
import { onMounted } from "vue";
import SectionHeader from "./components/SectionHeader.vue";
import TabsSection from "./components/TabsSection.vue";
import TargetsChart from "./components/TargetsChart.vue";
import { useAnalysisStore } from "./store/analysis.store";
import type { Tab } from "@/types/ui";
import GrowthChartWithCards from "./components/GrowthChartWithCards.vue";

const analysisStore = useAnalysisStore();

const tabs: Tab[] = [
  {
    value: "recommendations",
    label: "Recomendaciones",
    content: () => ({
      component: TargetsChart,
      props: { data: analysisStore.recommendations },
    }),
  },
  {
    value: "growth",
    label: "Crecimiento",
    content: () => ({
      component: GrowthChartWithCards,
      props: { data: analysisStore.recommendations },
    }),
  },
  {
    value: "history",
    label: "Historial",
    content:
      "📈 Aquí encontrarás un registro detallado del historial de recomendaciones y cambios de targets realizados por los analistas en el tiempo.",
  },
];

onMounted(async () => {
  await analysisStore.getRecommendations();
  console.log("recommendations:", analysisStore.recommendations);
});
</script>

<template>
  <div class="p-6">
    <SectionHeader
      title="Análisis de Recomendaciones"
      v-model="analysisStore.selection"
    />
    <TabsSection v-model="analysisStore.activeTab" :tabs="tabs" />
  </div>
</template>
