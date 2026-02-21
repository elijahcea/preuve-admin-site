<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import HeaderComponent from './components/HeaderComponent.vue'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <HeaderComponent />
  <div class="flex min-h-full text-sm">
    <NavBar />
    <main class="grow p-3 bg-background">
      <RouterView />
    </main>
  </div>
  <VueQueryDevtools />
</template>

<style scoped></style>
