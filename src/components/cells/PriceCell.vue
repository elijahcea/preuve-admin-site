<script setup lang="ts">
const { price, locale, currencySymbol } = defineProps<{
  price: number
  locale: string
  currencySymbol: string
}>()
</script>

<template>
  <span class="opacity-60">{{ currencySymbol }}</span>
  <span class="ml-1">{{
    new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
      price,
    )
  }}</span>
</template>
