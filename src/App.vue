<script setup lang="ts">
  import HeaderComponent from './components/Header.vue';
  import NavBar from './components/NavBar.vue';
</script>

<template>
  <HeaderComponent />
  <div class="flex h-full">
    <NavBar />
    <main class="grow p-2 bg-gray-100">
      <RouterView />
    </main>
  </div>
</template>

<style scoped></style>
