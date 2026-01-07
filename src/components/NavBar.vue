<script setup lang="ts">
import { ShoppingBagIcon, TagIcon, SwatchIcon } from "@heroicons/vue/24/outline";

const iconSize = "size-5";
const itemStyles = "flex items-center gap-2 hover:bg-current/20"
</script>

<template>
    <nav class="p-2 bg-gray-50">
        <ul>
            <li :class="itemStyles">
                <ShoppingBagIcon :class="iconSize"></ShoppingBagIcon>
                <p>Products</p>
            </li>
            <li :class="itemStyles">
                <TagIcon :class="iconSize"></TagIcon>
                <p>Collections</p>
            </li>
            <li :class="itemStyles">
                <SwatchIcon :class="iconSize"></SwatchIcon>
                <p>Options</p>
            </li>
        </ul>
    </nav>
</template>