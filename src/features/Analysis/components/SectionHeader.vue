<script setup lang="ts">
import { computed } from "vue";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAnalysisStore } from "../store/analysis.store";

type TopPick = "top5" | "top10";

interface Props {
  title: string;
}

const props = defineProps<Props>();
const analysisStore = useAnalysisStore();

// Proxy con el store directamente
const model = computed<TopPick>({
  get: () => analysisStore.selection,
  set: (v) => analysisStore.setSelection(v),
});
</script>

<template>
  <div class="flex items-center justify-between w-full border-b pb-3 mb-4">
    <h2 class="text-2xl font-bold tracking-tight text-[#00AF75]">
      {{ props.title }}
    </h2>

    <ToggleGroup type="single" v-model="model" class="flex gap-0">
      <ToggleGroupItem
        value="top5"
        class="data-[state=on]:bg-[#00AF75] data-[state=on]:text-white"
      >
        Top 5
      </ToggleGroupItem>
      <ToggleGroupItem
        value="top10"
        class="data-[state=on]:bg-[#00AF75] data-[state=on]:text-white"
      >
        Top 10
      </ToggleGroupItem>
    </ToggleGroup>
  </div>
</template>
