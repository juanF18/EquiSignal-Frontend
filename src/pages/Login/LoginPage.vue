<script setup lang="ts">
import { ref } from "vue";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const email = ref("");
const password = ref("");

function handleLogin() {
  console.log("Login attempt:", {
    email: email.value,
    password: password.value,
  });
  // Aquí iría la lógica real de login (API, store, etc.)
}
</script>

<template>
  <div class="w-full max-w-sm bg-white rounded-2xl shadow p-6">
    <h1 class="text-2xl font-bold mb-6 text-center">Iniciar sesión</h1>

    <div class="space-y-4">
      <!-- Email -->
      <div>
        <label class="block text-sm font-medium mb-1">Email</label>
        <Input v-model="email" type="email" placeholder="tu@email.com" />
      </div>

      <!-- Password -->
      <div>
        <label class="block text-sm font-medium mb-1">Contraseña</label>
        <Input v-model="password" type="password" placeholder="********" />
      </div>

      <!-- Botón -->
      <Button class="w-full mt-4" @click="handleLogin"> Entrar 🚀 </Button>
    </div>
  </div>
</template>
