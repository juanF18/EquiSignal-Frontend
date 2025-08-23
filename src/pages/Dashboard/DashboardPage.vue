<script setup lang="ts">
// Aquí puedes traer datos con pinia o API más adelante
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold">Dashboard</h1>

    <p class="text-gray-600">
      Bienvenido a <span class="font-semibold">EquiSignal</span>. 🎉 Aquí podrás
      ver tus datos, gráficas o reportes.
    </p>

    <!-- Ejemplo: tarjeta simple -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="p-4 bg-white rounded-xl shadow">
        <h2 class="font-medium">Usuarios</h2>
        <p class="text-2xl font-bold">120</p>
      </div>
      <div class="p-4 bg-white rounded-xl shadow">
        <h2 class="font-medium">Proyectos</h2>
        <p class="text-2xl font-bold">8</p>
      </div>
      <div class="p-4 bg-white rounded-xl shadow">
        <h2 class="font-medium">Notificaciones</h2>
        <p class="text-2xl font-bold">5</p>
      </div>
    </div>
  </div>
</template>
