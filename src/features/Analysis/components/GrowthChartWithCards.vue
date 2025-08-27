<script setup lang="ts">
import { defineProps } from "vue";
import LineChart from "./LineChart.vue";
import type { Recommendation } from "../types";

const props = defineProps<{
  data: Recommendation[];
}>();
</script>

<template>
  <div>
    <LineChart :data="props.data" />
    <!-- Cards debajo -->
    <div
      class="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
    >
      <div
        v-for="stock in props.data"
        :key="stock.Ticker"
        class="border-l-4 border-[#00AF75] rounded-r-2xl p-4 text-center shadow-sm hover:shadow-md transition bg-white"
      >
        <h3 class="font-bold text-lg text-[#00AF75]">{{ stock.Ticker }}</h3>
        <p class="text-xl font-bold text-green-600">
          +{{
            (
              Number(stock.TargetTo.replace("$", "")) -
              Number(stock.TargetFrom.replace("$", ""))
            ).toFixed(2)
          }}
        </p>
        <p class="text-sm text-gray-600">
          {{
            (
              ((Number(stock.TargetTo.replace("$", "")) -
                Number(stock.TargetFrom.replace("$", ""))) /
                Number(stock.TargetFrom.replace("$", ""))) *
              100
            ).toFixed(2)
          }}%
        </p>
        <p class="mt-1 text-gray-500 text-sm">{{ stock.Company }}</p>
      </div>
    </div>
  </div>
</template>
