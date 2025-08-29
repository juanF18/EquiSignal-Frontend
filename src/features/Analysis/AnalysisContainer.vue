<script setup lang="ts">
import { computed, onMounted } from "vue";
import SectionHeader from "./components/SectionHeader.vue";
import TabsSection from "./components/TabsSection.vue";
import TargetsChart from "./components/TargetsChart.vue";
import { useAnalysisStore } from "./store/analysis.store";
import type { Tab } from "@/types/ui";
import GrowthChartWithCards from "./components/GrowthChartWithCards.vue";
import AppSpinner from "@/components/layout/AppSpinner.vue";
import ScoreChart from "./components/ScoreChart.vue";

const analysisStore = useAnalysisStore();

onMounted(async () => {
  await analysisStore.getRecommendations();
});

const tabs = computed<Tab[]>(() => [
  {
    value: "recommendations",
    label: "Recomendaciones",
    content: () => ({
      component: TargetsChart,
      props: { data: analysisStore.filteredRecommendations },
    }),
  },
  {
    value: "growth",
    label: "Crecimiento",
    content: () => ({
      component: GrowthChartWithCards,
      props: { data: analysisStore.filteredRecommendations },
    }),
  },
  {
    value: "scores",
    label: "Puntuaciones",
    content: () => ({
      component: ScoreChart,
      props: { data: analysisStore.filteredRecommendations },
    }),
  },
]);
</script>

<template>
  <div class="p-6">
    <SectionHeader
      title="Análisis de Recomendaciones"
      v-model="analysisStore.selection"
    />
    <!-- Spinner (usando el store) -->
    <AppSpinner
      v-if="analysisStore.isLoading"
      position="fullscreen"
      size="lg"
    />

    <!-- Error -->
    <p v-else-if="analysisStore.error" class="text-red-500">
      {{ analysisStore.error }}
    </p>

    <TabsSection
      v-if="!analysisStore.isLoading && analysisStore.recommendations.length"
      v-model="analysisStore.activeTab"
      :tabs="tabs"
    />
  </div>
</template>
