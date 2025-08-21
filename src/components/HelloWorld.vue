<script setup lang="ts">
import { Button } from "@/components/ui/button"; // así lo trae shadcn-vue

function handleClick() {
  alert("¡Hola desde shadcn-vue! 🚀");
}
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <Button @click="handleClick"> Click aquí ✨ </Button>
  </div>
</template>
