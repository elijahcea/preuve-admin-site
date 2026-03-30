<script setup lang="ts">
import { ShoppingBagIcon, TagIcon, HomeIcon } from '@heroicons/vue/24/outline'

const iconSize = 'size-5'
const itemStyles = 'flex items-center px-2 py-1 gap-2 hover:bg-(--nav-bg-hover) rounded'
const activeStyles = 'bg-light outline outline-gray-200'
</script>

<template>
  <nav
    class="pt-3 px-2 min-w-3xs bg-(--nav-bg) inset-shadow-sm font-semibold border-r border-r-gray-200"
  >
    <ul>
      <RouterLink to="/" :class="itemStyles" :active-class="activeStyles">
        <HomeIcon :class="iconSize"></HomeIcon>
        <p>Home</p>
      </RouterLink>
      <RouterLink :to="{ name: 'products' }" :class="itemStyles" :active-class="activeStyles">
        <ShoppingBagIcon :class="iconSize"></ShoppingBagIcon>
        <p>Products</p>
      </RouterLink>
      <RouterLink :to="{ name: 'collections' }" :class="itemStyles" :active-class="activeStyles">
        <TagIcon :class="iconSize"></TagIcon>
        <p>Collections</p>
      </RouterLink>
    </ul>
  </nav>
</template>

<style scoped>
nav {
  --nav-bg: #ebebeb;
  --nav-bg-hover: #f1f1f1;
  --nav-bg-selected: #fafafa;
}
</style>
