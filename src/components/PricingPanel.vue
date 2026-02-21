<script setup lang="ts">
const { currencySymbol } = defineProps<{
  currencySymbol: string
}>()

const price = defineModel<number>({ required: true })
</script>

<template>
  <section class="bg-light rounded shadow p-3">
    <h2 class="font-semibold mb-4">Pricing</h2>
    <label for="price">Price</label>
    <div class="flex items-center border border-gray-300 rounded">
      <span class="ml-2 opacity-60">{{ currencySymbol }}</span>
      <input
        id="price"
        name="price"
        placeholder="0.00"
        type="number"
        maxlength="24"
        min="0"
        inputmode="decimal"
        required
        v-model="price"
        class="w-full p-2"
      />
    </div>
  </section>
</template>
