<script setup lang="ts">
import { computed } from "vue";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type TopPick = "top5" | "top10";

interface Props {
  title: string;
  modelValue?: TopPick;
}

const props = defineProps<Props>();
const emit = defineEmits<{ (e: "update:modelValue", v: TopPick): void }>();

// Proxy para v-model (lee del prop y emite al padre)
const model = computed<TopPick>({
  get: () => props.modelValue ?? "top5",
  set: (v) => emit("update:modelValue", v),
});
</script>

<template>
  <div class="flex items-center justify-between w-full border-b pb-3 mb-4">
    <h2 class="text-2xl font-bold tracking-tight text-[#00AF75]">
      {{ title }}
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
