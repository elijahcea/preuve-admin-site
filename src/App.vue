<script setup lang="ts">
import HeaderComponent from './components/HeaderComponent.vue'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <HeaderComponent />
  <div class="flex h-full text-sm">
    <NavBar />
    <main class="grow p-3 bg-gray-100">
      <RouterView />
    </main>
  </div>
</template>

<style scoped></style>
