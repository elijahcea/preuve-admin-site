<script setup lang="ts">
const sku = defineModel<string | null>('sku', { required: true })
const quantity = defineModel<number | null>('quantity', { required: true })
</script>

<template>
  <section class="bg-light rounded shadow-lg p-3">
    <h2 class="font-semibold mb-4">Inventory</h2>
    <div class="flex justify-center gap-2">
      <div class="w-full">
        <label for="sku">SKU (Stock Keeping Unit)</label>
        <input
          id="sku"
          name="sku"
          type="text"
          v-model="sku"
          class="border border-gray-300 rounded p-1 w-full my-1"
        />
      </div>
      <div class="w-full">
        <label for="quantity">Quantity</label>
        <input
          required
          v-model="quantity"
          id="quantity"
          name="quantity"
          type="number"
          min="0"
          step="1"
          class="border border-gray-300 rounded p-1 w-full my-1"
        />
      </div>
    </div>
  </section>
</template>
