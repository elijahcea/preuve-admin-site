<script setup lang="ts">
import { BuildingStorefrontIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <header class="bg-foreground text-background sticky top-0 z-100">
    <nav class="flex justify-between items-center px-5 py-3 font-semibold">
      <div class="flex gap-2 items-center">
        <BuildingStorefrontIcon class="size-5" />
        <RouterLink :to="{ name: 'home' }">Preuve Admin</RouterLink>
      </div>
      <button class="bg-current/10 rounded p-2 hover:bg-current/20 text-sm">Login</button>
    </nav>
  </header>
</template>
