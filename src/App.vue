<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import HeaderComponent from './components/HeaderComponent.vue'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <HeaderComponent />
  <div class="grid grid-cols-1 md:grid-cols-[1fr_6fr] text-xs md:text-sm content-container">
    <NavBar />
    <main class="grow p-3 bg-background overflow-y-auto">
      <RouterView />
    </main>
  </div>
  <VueQueryDevtools />
</template>

<style scoped>
.content-container {
  height: calc(100% - 60px);
}
</style>
