<script setup lang="ts">
import { ref } from "vue";
import SectionHeader from "./components/SectionHeader.vue";
// Si quieres conectarlo al store, cambia aquí:
const selection = ref<"top5" | "top10">("top5");

// watch(selection, (v) => {
//   // ejemplo: store.topLimit = v === "top5" ? 5 : 10; store.fetchRecommendations();
// });
</script>

<template>
  <div class="p-6">
    <SectionHeader title="Análisis de Recomendaciones" v-model="selection" />
    <p class="mt-4">
      📊 Mostrando las {{ selection === "top5" ? 5 : 10 }} mejores
      recomendaciones
    </p>
  </div>
</template>
