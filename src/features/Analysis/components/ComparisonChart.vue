<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { defineProps } from "vue";

interface Props {
  title: string;
  actionText?: string;
  showAction?: boolean;
  onAction?: () => void;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="flex items-center justify-between w-full border-b pb-3 mb-4">
    <!-- Título -->
    <h2 class="text-2xl font-bold tracking-tight text-[#00AF75]">
      {{ title }}
    </h2>

    <!-- Botón opcional -->
    <div v-if="showAction">
      <Button
        class="bg-[#00AF75] hover:bg-[#00AF75]/90 text-white shadow-sm"
        @click="props.onAction"
      >
        {{ actionText }}
      </Button>
    </div>
  </div>
</template>
