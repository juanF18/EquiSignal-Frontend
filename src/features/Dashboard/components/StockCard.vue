<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-vue-next";
import type { StockCardProps } from "../types";

const props = defineProps<StockCardProps>();

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
</script>

<template>
  <Card class="rounded-xl shadow-sm border border-gray-200">
    <CardContent class="p-5 flex flex-col gap-2">
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div>
          <h2 class="text-lg font-bold text-[#00AF75]">
            {{ props.Ticker }}
          </h2>
          <p class="text-gray-500 text-sm">{{ props.Company }}</p>
        </div>

        <div class="flex items-center gap-2 text-sm">
          <span
            v-if="props.Trend === 'up'"
            class="text-[#00AF75] flex items-center"
          >
            <ArrowUpRight class="h-4 w-4 mr-1" />
            {{ props.Rating || "Neutral" }}
          </span>
          <span
            v-else-if="props.Trend === 'down'"
            class="text-red-600 flex items-center"
          >
            <ArrowDownRight class="h-4 w-4 mr-1" />
            {{ props.Rating || "Neutral" }}
          </span>
          <span v-else class="text-gray-500">
            {{ props.Rating || "Neutral" }}
          </span>
        </div>
      </div>

      <!-- Body -->
      <div class="grid grid-cols-2 gap-4 mt-3">
        <div>
          <p class="text-gray-500 text-sm">Objetivo Anterior</p>
          <p class="text-[#00AF75] font-medium">
            {{ formatCurrency(props.prevTarget) }}
          </p>
        </div>
        <div>
          <p class="text-gray-500 text-sm">Objetivo Actual</p>
          <p class="text-[#00AF75] font-medium">
            {{ formatCurrency(props.currentTarget) }}
          </p>
        </div>
      </div>

      <!-- Brokerage -->
      <div class="mt-2">
        <p class="text-gray-500 text-sm">Brokerage</p>
        <p class="text-[#00AF75] font-medium">{{ props.Brokerage }}</p>
      </div>
    </CardContent>
  </Card>
</template>
