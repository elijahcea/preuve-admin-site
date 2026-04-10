<script setup lang="ts">
import { ref, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import PriceInput from './../PriceInput.vue'

const {
  isOpen,
  currencySymbol,

  id,
  sku,
  inventoryQuantity,
  price,
} = defineProps<{
  isOpen: boolean
  currencySymbol: string

  id?: string
  sku?: string | null
  inventoryQuantity?: number
  price?: number
}>()

const emit = defineEmits(['save', 'cancel'])

const variantInfo = ref()

watch(
  () => isOpen,
  (val) => {
    if (val === true) {
      variantInfo.value = {
        sku,
        inventoryQuantity,
        price,
      }
    }
  },
)
</script>

<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog @close="emit('cancel')">
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
      <form
        @submit.prevent="emit('save', { id, ...variantInfo })"
        class="fixed inset-0 flex min-h-full items-center justify-center text-xs md:text-sm"
      >
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel class="w-full max-w-md bg-background p-3 rounded-xl flex flex-col gap-2">
            <DialogTitle class="font-semibold mb-3">Edit variant</DialogTitle>

            <div class="flex justify-center gap-2">
              <div class="w-full">
                <label for="variant-sku">SKU (Stock Keeping Unit)</label>
                <input
                  id="variant-sku"
                  name="variant-sku"
                  type="text"
                  v-model="variantInfo.sku"
                  class="border border-gray-300 rounded p-1 w-full my-1"
                />
              </div>
              <div class="w-full">
                <label for="variant-quantity">Quantity</label>
                <input
                  required
                  v-model="variantInfo.inventoryQuantity"
                  id="variant-quantity"
                  name="variant-quantity"
                  type="number"
                  min="0"
                  step="1"
                  class="border border-gray-300 rounded p-1 w-full my-1"
                />
              </div>
            </div>

            <div>
              <label class="my-1" for="variant-price">Price</label>
              <PriceInput
                input-id="variant-price"
                :currency-symbol="currencySymbol"
                v-model="variantInfo.price"
                :required="isOpen"
              />
            </div>

            <div class="flex justify-end gap-1 mt-3">
              <button
                type="button"
                class="bg-light outline outline-gray-200 font-medium rounded-md py-1 px-2 hover:bg-gray-200"
                @click="emit('cancel')"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="font-medium rounded-md ml-2 py-1 px-2 bg-fill text-background hover:opacity-80"
              >
                Done
              </button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </form>
    </Dialog>
  </TransitionRoot>
</template>
