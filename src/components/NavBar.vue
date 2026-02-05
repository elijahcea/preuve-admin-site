<script setup lang="ts">
import { ShoppingBagIcon, TagIcon, HomeIcon } from '@heroicons/vue/24/outline'

const iconSize = 'size-5'
const itemStyles = 'flex items-center px-2 py-1 gap-2 hover:bg-current/20 rounded'
</script>

<template>
  <nav class="min-w-3xs px-2 bg-gray-200 inset-shadow-sm font-semibold border-r border-r-gray-200">
    <ul class="sticky top-18">
      <RouterLink to="/" :class="itemStyles">
        <HomeIcon :class="iconSize"></HomeIcon>
        <p>Home</p>
      </RouterLink>
      <RouterLink :to="{ name: 'products' }" :class="itemStyles">
        <ShoppingBagIcon :class="iconSize"></ShoppingBagIcon>
        <p>Products</p>
      </RouterLink>
      <RouterLink :to="{ name: 'collections' }" :class="itemStyles">
        <TagIcon :class="iconSize"></TagIcon>
        <p>Collections</p>
      </RouterLink>
    </ul>
  </nav>
</template>

<style scoped>
.router-link-active {
  background-color: var(--color-gray-100);
}
</style>
