<script setup lang="ts">
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-vue-next";

interface Props {
  page: number;
  totalPages: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "prev"): void;
  (e: "next"): void;
  (e: "goToPage", page: number): void;
}>();

// Mostrar solo 5 páginas visibles centradas en la actual
const visiblePages = computed(() => {
  const pages: number[] = [];
  const half = Math.floor(5 / 2);

  let start = Math.max(1, props.page - half);
  let end = Math.min(props.totalPages, start + 4);

  // ajustar si se queda corto al inicio
  if (end - start < 4) {
    start = Math.max(1, end - 4);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});
</script>

<template>
  <div class="w-full flex items-center justify-center gap-2 mt-6">
    <!-- Primera página -->
    <Button
      variant="outline"
      size="icon"
      :disabled="props.page === 1"
      @click="emit('goToPage', 1)"
    >
      <ChevronsLeft class="w-4 h-4" />
    </Button>

    <!-- Botón Anterior -->
    <Button
      variant="outline"
      size="icon"
      :disabled="props.page === 1"
      @click="emit('prev')"
    >
      <ChevronLeft class="w-4 h-4" />
    </Button>

    <!-- Números de páginas -->
    <Button
      v-for="p in visiblePages"
      :key="p"
      variant="outline"
      :class="
        p === props.page
          ? 'bg-[#00AF75] text-white shadow-sm hover:bg-[#00AF75]/90'
          : 'border border-[#00AF75]/30 text-[#00AF75] bg-white hover:bg-[#00AF75]/10'
      "
      @click="emit('goToPage', p)"
    >
      {{ p }}
    </Button>

    <!-- Botón Siguiente -->
    <Button
      variant="outline"
      size="icon"
      :disabled="props.page === props.totalPages"
      @click="emit('next')"
    >
      <ChevronRight class="w-4 h-4" />
    </Button>

    <!-- Última página -->
    <Button
      variant="outline"
      size="icon"
      :disabled="props.page === props.totalPages"
      @click="emit('goToPage', props.totalPages)"
    >
      <ChevronsRight class="w-4 h-4" />
    </Button>
  </div>
</template>
