<script setup lang="ts">
import { computed } from "vue";

interface Props {
  size?: "sm" | "md" | "lg";
  color?: string;
  position?: "inline" | "center" | "fullscreen";
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  color: "#00AF75",
  position: "inline",
  loading: true,
});

const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "w-4 h-4 border-2";
    case "lg":
      return "w-12 h-12 border-4";
    default:
      return "w-8 h-8 border-4";
  }
});

const wrapperClass = computed(() => {
  switch (props.position) {
    case "fullscreen":
      return "fixed inset-0 flex items-center justify-center bg-white/70 z-50";
    case "center":
      return "flex items-center justify-center w-full h-full";
    default:
      return "inline-flex items-center";
  }
});
</script>

<template>
  <div v-if="loading" :class="wrapperClass">
    <span
      class="animate-spin rounded-full border-t-transparent"
      :class="sizeClass"
      :style="{ borderColor: color }"
    ></span>
  </div>
</template>
