<script setup lang="ts">
import { ShoppingBagIcon, TagIcon, SwatchIcon, HomeIcon } from "@heroicons/vue/24/outline";

const iconSize = "size-5";
const itemStyles = "flex items-center px-2 py-1 gap-2 hover:bg-current/20 rounded"
</script>

<template>
    <nav class="p-3 bg-gray-300 inset-shadow-sm font-semibold">
        <ul>
            <RouterLink to="/" :class="itemStyles">
                <HomeIcon :class="iconSize"></HomeIcon>
                <p>Home</p>
            </RouterLink>
            <RouterLink to="/products" :class="itemStyles">
                <ShoppingBagIcon :class="iconSize"></ShoppingBagIcon>
                <p>Products</p>
            </RouterLink>
            <RouterLink to="/collections" :class="itemStyles">
                <TagIcon :class="iconSize"></TagIcon>
                <p>Collections</p>
            </RouterLink>
            <RouterLink to="/options" :class="itemStyles">
                <SwatchIcon :class="iconSize"></SwatchIcon>
                <p>Options</p>
            </RouterLink>
        </ul>
    </nav>
</template>

<style scoped>
.router-link-active {
  background-color: var(--background);
}
</style>