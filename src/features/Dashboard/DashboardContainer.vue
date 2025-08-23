<script setup lang="ts">
import StockCard from "./components/StockCard.vue";
import { mockStocks } from "./mocks";
import { mapStockToCardProps } from "./utils";

const stocks = mockStocks.map(mapStockToCardProps);

// 👇 más adelante aquí harías el fetch real
// const { data } = await fetch("/api/stocks");
// const stocks = data.map(mapStockToCardProps);
</script>

<template>
  <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <StockCard v-for="s in stocks" :key="s.Ticker" v-bind="s" />
  </div>
</template>
