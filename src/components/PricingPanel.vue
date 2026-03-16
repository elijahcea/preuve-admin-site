<script setup lang="ts">
const { currencySymbol } = defineProps<{
  currencySymbol: string
}>()

const price = defineModel<number | null>({ required: true })

const handlePriceChange = (e: Event) => {
  const currVal = (e.target as HTMLInputElement).valueAsNumber
  if (!currVal) return

  price.value = Number(currVal.toFixed(2))
}
</script>

<template>
  <section class="bg-light rounded shadow p-3">
    <h2 class="font-semibold mb-4">Pricing</h2>
    <label for="price">Price</label>
    <div class="flex items-center border border-gray-300 rounded">
      <span class="ml-2 opacity-60">{{ currencySymbol }}</span>
      <input
        required
        v-model="price"
        id="price"
        name="price"
        placeholder="0.00"
        type="number"
        min="0.01"
        step="0.01"
        class="w-full p-1"
        @change="handlePriceChange"
      />
    </div>
  </section>
</template>
