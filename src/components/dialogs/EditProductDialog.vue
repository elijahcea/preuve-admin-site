<script setup lang="ts">
import { ref, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'

const { isOpen, title, description } = defineProps<{
  isOpen: boolean
  title: string
  description: string
}>()
const emit = defineEmits(['saveEdit', 'cancelEdit'])

const productTitle = ref()
const productDescription = ref()

watch(
  () => isOpen,
  (val) => {
    if (val === true) {
      productTitle.value = title
      productDescription.value = description
    }
  },
)
</script>

<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog @close="emit('cancelEdit')">
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
        @submit.prevent="emit('saveEdit', { title: productTitle, description: productDescription })"
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
          <DialogPanel class="w-full max-w-md bg-background p-3 rounded-xl">
            <DialogTitle class="font-semibold mb-3">Edit product info</DialogTitle>

            <div class="flex flex-col justify-center gap-2">
              <div class="w-full">
                <label for="title-edit">Title</label>
                <input
                  id="title-edit"
                  type="text"
                  class="border border-gray-300 rounded p-1 w-full mt-1"
                  v-model="productTitle"
                  required
                />
              </div>
              <div class="w-full">
                <label for="description-edit">Description</label>
                <textarea
                  id="description-edit"
                  rows="5"
                  class="resize-none border border-gray-300 rounded p-1 w-full mt-1"
                  v-model="productDescription"
                ></textarea>
              </div>
            </div>

            <div class="flex justify-end gap-1 mt-3">
              <button
                type="button"
                class="bg-light outline outline-gray-200 font-medium rounded-md py-1 px-2 hover:bg-gray-200"
                @click="emit('cancelEdit')"
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
