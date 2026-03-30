<script setup lang="ts">
import { ref, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import PriceInput from './../PriceInput.vue'
import type { ProductOption, ProductOptionValue } from '@/lib/types'
import VariantOptionSelect from '../VariantOptionSelect.vue'

const { isOpen, currencySymbol, options } = defineProps<{
  isOpen: boolean
  currencySymbol: string
  options: ProductOption[]
}>()

const emit = defineEmits(['save', 'cancel'])

const sku = ref(null)
const inventoryQuantity = ref(null)
const price = ref(null)
const activeValues = ref<ProductOptionValue[]>([])

const handleSelectChange = (val: ProductOptionValue) => {
  const currValIdx = activeValues.value.findIndex((v) => v.optionId === val.optionId)
  if (currValIdx === -1) {
    activeValues.value = [val, ...activeValues.value]
  } else {
    const updatedValues = [...activeValues.value]
    updatedValues.splice(currValIdx, 1, val)
    activeValues.value = updatedValues
  }
}

watch(
  () => isOpen,
  (val) => {
    if (val === true) {
      sku.value = null
      inventoryQuantity.value = null
      price.value = null
      activeValues.value = []
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
        @submit.prevent="
          emit('save', {
            sku,
            inventoryQuantity,
            price,
            selectedValues: activeValues,
          })
        "
        class="fixed inset-0 flex min-h-full items-center justify-center"
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
            <DialogTitle class="font-semibold mb-3">Create variant</DialogTitle>

            <div class="flex justify-center gap-2 text-sm">
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
                  v-model="inventoryQuantity"
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  step="1"
                  class="border border-gray-300 rounded p-1 w-full my-1"
                />
              </div>
            </div>

            <div class="text-sm">
              <label class="my-1" for="price">Price</label>
              <PriceInput
                input-id="price"
                :currency-symbol="currencySymbol"
                v-model="price"
                :required="isOpen"
              />
            </div>

            <VariantOptionSelect
              v-for="option in options"
              :is-open="isOpen"
              :key="option.id"
              :option="option"
              @select-change="handleSelectChange"
            />

            <div class="flex justify-end gap-1 mt-3">
              <button
                type="button"
                class="rounded-md bg-cool-gray py-1 px-2 hover:opacity-80"
                @click="emit('cancel')"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="rounded-md py-1 px-2 ml-2 bg-fill text-background hover:opacity-80"
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
