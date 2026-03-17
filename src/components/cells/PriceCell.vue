<script setup lang="ts">
const { price, currencySymbol } = defineProps<{ price: number; currencySymbol: string }>()
</script>

<template>
  <span class="opacity-60">{{ currencySymbol }}</span>
  <span class="ml-1">{{ Number(price.toFixed(2)) }}</span>
</template>
