<script setup lang="ts">
import { BuildingStorefrontIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <header class="bg-foreground text-background max-h-15">
    <nav class="flex justify-between items-center px-5 py-3 font-semibold">
      <div class="flex gap-2 items-center">
        <BuildingStorefrontIcon class="size-5" />
        <RouterLink :to="{ name: 'home' }">Preuve Admin</RouterLink>
      </div>
      <button class="bg-fill rounded-md p-2 hover:bg-fill/70 text-sm">Login</button>
    </nav>
  </header>
</template>
