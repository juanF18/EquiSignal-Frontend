<script setup lang="ts">
import { computed } from "vue";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Tab } from "@/types/ui";

interface Props {
  tabs: Tab[];
  modelValue?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{ (e: "update:modelValue", v: string): void }>();

const model = computed({
  get: () => props.modelValue ?? props.tabs[0]?.value ?? "",
  set: (v) => emit("update:modelValue", v),
});
</script>

<template>
  <Tabs v-model="model" class="w-full">
    <TabsList class="grid w-full grid-cols-2 md:w-auto md:inline-flex">
      <TabsTrigger
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        class="data-[state=active]:bg-[#00AF75] data-[state=active]:text-white"
      >
        {{ tab.label }}
      </TabsTrigger>
    </TabsList>

    <TabsContent
      v-for="tab in tabs"
      :key="tab.value"
      :value="tab.value"
      class="mt-4"
    >
      <slot :name="tab.value">
        {{ tab.content }}
      </slot>
    </TabsContent>
  </Tabs>
</template>
