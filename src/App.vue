<script setup lang="ts">
  import HeaderComponent from './components/HeaderComponent.vue';
  import NavBar from './components/NavBar.vue';
</script>

<template>
  <HeaderComponent />
  <div class="flex h-full">
    <NavBar />
    <main class="grow py-3 bg-gray-200">
      <RouterView />
    </main>
  </div>
</template>

<style scoped></style>
