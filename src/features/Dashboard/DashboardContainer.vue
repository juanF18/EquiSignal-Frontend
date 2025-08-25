<script setup lang="ts">
import { onMounted } from "vue";
import StockCard from "./components/StockCard.vue";
import { useDashboardStore } from "./stores/dashboard.store";
import { mapStockToCardProps } from "./utils";
import Pagination from "@/components/layout/Pagination.vue";

const dashboardStore = useDashboardStore();

onMounted(async () => {
  await dashboardStore.getStocks();
  console.log(dashboardStore.stocks);
});

const handlePrev = () => dashboardStore.prevPage();
const handleNext = () => dashboardStore.nextPage();
const handleGoToPage = (page: number) => dashboardStore.goToPage(page);
</script>

<template>
  <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <StockCard
      v-for="s in dashboardStore.stocks.map(mapStockToCardProps)"
      :key="s.Ticker"
      v-bind="s"
    />
  </div>
  <div class="p-6 w-full">
    <Pagination
      :page="dashboardStore.page"
      :total-pages="dashboardStore.totalPages"
      @prev="handlePrev"
      @next="handleNext"
      @go-to-page="handleGoToPage"
    />
  </div>
</template>
