<!-- src/components/Header.vue -->
<script setup lang="ts">
import { ref } from "vue";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AcceptableValue } from "reka-ui";
import {
  Grid2x2,
  BarChart3,
  Search as SearchIcon,
  ArrowUpDown,
} from "lucide-vue-next";

const search = ref("");
const filter = ref<string>("all");

function handleSearch(e: Event) {
  const target = e.target as HTMLInputElement;
  search.value = target.value;
}

function handleFilter(value: AcceptableValue) {
  filter.value = typeof value === "string" ? value : "all";
  return filter.value;
}
</script>

<template>
  <header class="w-full bg-white border-b" style="border-color: #6f757d80">
    <div class="px-6 py-3 flex items-center justify-between gap-4">
      <!-- IZQUIERDA: logo + nav + búsqueda -->
      <div class="flex items-center gap-4 min-w-0">
        <!-- Logo -->
        <div
          class="text-2xl font-bold tracking-wide text-[#00AF75] whitespace-nowrap"
        >
          EquiSignal
        </div>

        <!-- Navegación -->
        <nav class="flex items-center gap-2">
          <Button
            class="rounded-sm px-4 bg-[#00AF75] hover:bg-[#00AF75]/90 text-white shadow-sm"
          >
            <Grid2x2 class="mr-2 h-4 w-4" />
            Dashboard
          </Button>

          <Button
            variant="outline"
            class="rounded-sm px-4 border border-[#00AF75]/30 text-[#00AF75] bg-white hover:bg-[#00AF75]/10"
          >
            <BarChart3 class="mr-2 h-4 w-4" />
            Análisis
          </Button>
        </nav>

        <!-- Búsqueda (más a la izquierda) -->
        <div class="relative w-[420px] max-w-full">
          <SearchIcon
            class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A]"
          />
          <Input
            type="text"
            aria-label="Buscar acciones"
            placeholder="Buscar acciones..."
            v-model="search"
            class="pl-9 placeholder:text-[#71717A] w-full"
            @input="handleSearch"
          />
        </div>
      </div>

      <!-- DERECHA: Select -->
      <div class="flex items-center">
        <Select v-model="filter" @update:modelValue="handleFilter">
          <SelectTrigger class="w-[180px]">
            <div class="flex items-center gap-2">
              <ArrowUpDown class="h-4 w-4" />
              <SelectValue placeholder="Ticker" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="archived">Archivados</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </header>
</template>
