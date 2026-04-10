<script setup lang="ts">
import { ref, watch } from 'vue'
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'

const { isOpen, altText } = defineProps<{
  isOpen: boolean
  altText: string | null
}>()
const emit = defineEmits(['saveEdit', 'cancelEdit'])

const alt = ref<string | null>(null)
const file = ref<File | undefined>()

watch(
  () => isOpen,
  (val) => {
    if (val === true) {
      alt.value = altText
      file.value = undefined
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
        @submit.prevent="emit('saveEdit', { ...(file !== undefined && { file }), altText: alt })"
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
            <div class="flex flex-col justify-center gap-2">
              <label for="featured-image" class="font-semibold">Edit featured image</label>

              <ImageInput v-model:file="file" :alt="alt" input-id="featured-image" />

              <div class="pt-4">
                <label for="alt">Image Alt</label>
                <p class="text-xs">
                  Optionally provide a brief description of the image for improved accessibility
                </p>
                <input
                  id="alt"
                  type="text"
                  class="border border-gray-300 rounded p-1 w-full mt-1"
                  v-model="alt"
                />
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
