<script setup lang="ts">
import { onMounted } from "vue";
import StockCard from "./components/StockCard.vue";
import { useDashboardStore } from "./stores/dashboard.store";
import { mapStockToCardProps } from "./utils";

const dashboardStore = useDashboardStore();

onMounted(async () => {
  await dashboardStore.getStocks();
  console.log(dashboardStore.stocks);
});
</script>

<template>
  <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <StockCard
      v-for="s in dashboardStore.stocks.map(mapStockToCardProps)"
      :key="s.Ticker"
      v-bind="s"
    />
  </div>
</template>
