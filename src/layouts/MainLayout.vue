<script setup lang="ts">
import TopBar from "@/components/layout/TopBar.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <TopBar />
    <main class="flex-1 p-6">
      <router-view />
    </main>
  </div>
</template>
