<script setup lang="ts">
const sku = defineModel<string>('sku', { required: true })
const quantity = defineModel<number>('quantity', { required: true })
</script>

<template>
  <section class="bg-background rounded shadow-lg p-3">
    <h2 class="font-semibold mb-4">Inventory</h2>
    <div class="flex justify-center gap-2">
      <div class="w-full">
        <label for="sku">SKU (Stock Keeping Unit)</label>
        <input
          id="sku"
          name="sku"
          type="text"
          v-model="sku"
          class="border border-gray-300 rounded p-2 w-full my-1"
        />
      </div>
      <div class="w-full">
        <label for="quantity">Quantity</label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          required
          v-model="quantity"
          class="border border-gray-300 rounded p-2 w-full my-1"
        />
      </div>
    </div>
  </section>
</template>
