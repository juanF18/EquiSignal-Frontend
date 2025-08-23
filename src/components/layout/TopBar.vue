<script setup lang="ts">
import { ref } from "vue";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AcceptableValue } from "reka-ui";

const search = ref("");
const filter = ref<string>("all");

function handleSearch(e: Event) {
  const target = e.target as HTMLInputElement;
  search.value = target.value;
  console.log("Searching:", search.value);
}

function handleFilter(value: AcceptableValue) {
  filter.value = typeof value === "string" ? value : "all";
  console.log("Filter:", filter.value);
  return filter.value;
}
</script>

<template>
  <header
    class="w-full bg-white shadow px-6 py-3 flex items-center justify-between"
  >
    <!-- Nombre de la app -->
    <div class="text-xl font-bold tracking-wide">EquiSignal</div>

    <!-- Barra de búsqueda -->
    <div class="flex-1 px-6">
      <Input
        type="text"
        placeholder="Buscar..."
        v-model="search"
        class="w-full max-w-md"
        @input="handleSearch"
      />
    </div>

    <!-- Select -->
    <Select v-model="filter" @update:modelValue="handleFilter">
      <SelectTrigger class="w-[180px]">
        <SelectValue placeholder="Filtrar por" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos</SelectItem>
        <SelectItem value="active">Activos</SelectItem>
        <SelectItem value="archived">Archivados</SelectItem>
      </SelectContent>
    </Select>
  </header>
</template>
