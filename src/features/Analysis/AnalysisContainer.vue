<script setup lang="ts">
import { ref } from "vue";
import SectionHeader from "./components/SectionHeader.vue";
import TabsSection from "./components/TabsSection.vue";
import TargetsChart from "./components/TargetsChart.vue";
import { mockData } from "./mocks/Analysis.mock";
// Si quieres conectarlo al store, cambia aquí:
const selection = ref<"top5" | "top10">("top5");
const activeTab = ref("recommendations");

const tabs = [
  {
    value: "recommendations",
    label: "Recomendaciones",
    content: "📊 Aquí van las recomendaciones",
  },
  { value: "history", label: "Historial", content: "📈 Aquí va el historial" },
];
// watch(selection, (v) => {
//   // ejemplo: store.topLimit = v === "top5" ? 5 : 10; store.fetchRecommendations();
// });
</script>

<template>
  <div class="p-6">
    <SectionHeader title="Análisis de Recomendaciones" v-model="selection" />

    <TabsSection v-model="activeTab" :tabs="tabs" />

    <TargetsChart :data="mockData.data" />
  </div>
</template>
