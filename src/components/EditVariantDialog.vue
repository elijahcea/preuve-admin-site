<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import PriceInput from './PriceInput.vue'

const isOpen = defineModel<boolean>('isOpen', { required: true })
const {
  variantId,
  inventoryQuantity = 0,
  sku = null,
  price = 0,
  currencySymbol,
} = defineProps<{
  variantId?: string
  inventoryQuantity?: number
  sku?: string | null
  price?: number
  currencySymbol: string
}>()
const emit = defineEmits(['saveVariantEdit'])

const variantInfo = ref({
  inventoryQuantity,
  sku,
  price,
})

const setIsOpen = (value: boolean) => (isOpen.value = value)
</script>

<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog @close="setIsOpen">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25"></div>
      </TransitionChild>
      <div class="fixed inset-0 flex min-h-full items-center justify-center">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel class="w-full max-w-md bg-background p-3 rounded-xl">
            <DialogTitle class="font-semibold mb-3">Edit variant</DialogTitle>

            <div class="flex justify-center gap-2">
              <div class="w-full text-sm">
                <label for="sku">SKU (Stock Keeping Unit)</label>
                <input
                  id="sku"
                  name="sku"
                  type="text"
                  v-model="variantInfo.sku"
                  class="border border-gray-300 rounded p-1 w-full my-1"
                />
              </div>
              <div class="w-full text-sm">
                <label for="quantity">Quantity</label>
                <input
                  required
                  v-model="variantInfo.inventoryQuantity"
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  step="1"
                  class="border border-gray-300 rounded p-1 w-full my-1"
                />
              </div>
            </div>

            <label class="text-sm" for="price">Price</label>
            <PriceInput
              input-id="price"
              :currency-symbol="currencySymbol"
              v-model="variantInfo.price"
            />

            <div class="flex justify-end gap-1 mt-3">
              <button
                class="font-semibold rounded bg-cool-gray py-1 px-2 hover:opacity-80"
                @click="setIsOpen(false)"
              >
                Cancel
              </button>
              <button
                class="font-bold rounded py-1 px-2 ml-2 bg-fill text-background hover:opacity-80"
                @click="emit('saveVariantEdit', { id: variantId, ...variantInfo })"
              >
                Done
              </button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
