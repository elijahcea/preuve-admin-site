<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
  ListboxLabel,
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/24/outline'
import { ElTag } from 'element-plus'
import { ref, watch } from 'vue'

const { isOpen, status } = defineProps<{ isOpen: boolean; status: boolean }>()

const emit = defineEmits(['saveEdit', 'cancelEdit'])

const productStatus = ref()

watch(
  () => isOpen,
  (val) => {
    if (val === true) {
      productStatus.value = status
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
        @submit.prevent="emit('saveEdit', { status: productStatus })"
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
            <DialogTitle class="font-semibold mb-3">Edit status</DialogTitle>

            <Listbox as="div" v-model="productStatus" name="product-status">
              <div class="p-3 text-sm">
                <ListboxLabel>Status</ListboxLabel>

                <ListboxButton
                  class="relative border border-gray-300 rounded p-1 w-full flex items-center justify-between my-1"
                >
                  <el-tag>{{ productStatus ? 'Active' : 'Draft' }}</el-tag>
                  <span>
                    <ChevronUpDownIcon class="size-5" aria-hidden="true" />
                  </span>
                </ListboxButton>
                <div class="relative mt-1">
                  <transition
                    leave-active-class="transition duration-100 ease-in"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                  >
                    <ListboxOptions
                      class="absolute z-50 w-full bg-light shadow-lg rounded border border-gray-300 divide-y divide-gray-100"
                    >
                      <ListboxOption :value="true" v-slot="{ active, selected }" as="template">
                        <li
                          :class="[active ? 'bg-blue-100 text-blue-900' : '', 'p-1 cursor-default']"
                        >
                          <span v-show="selected" class="absolute left-0 pl-0.5 text-blue-600">
                            <CheckIcon class="size-5" aria-hidden="true" />
                          </span>
                          <p :class="[selected ? 'font-medium' : 'font-normal', 'pl-5 truncate']">
                            Active
                          </p>
                        </li>
                      </ListboxOption>
                      <ListboxOption :value="false" v-slot="{ active, selected }" as="template">
                        <li
                          :class="[active ? 'bg-blue-100 text-blue-900' : '', 'p-1 cursor-default']"
                        >
                          <span v-show="selected" class="absolute left-0 pl-0.5 text-blue-600">
                            <CheckIcon class="size-5" aria-hidden="true" />
                          </span>
                          <p :class="[selected ? 'font-medium' : 'font-normal', 'pl-5 truncate']">
                            Draft
                          </p>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </div>
            </Listbox>

            <div class="flex justify-end gap-1 mt-3">
              <button
                type="button"
                class="rounded-md bg-cool-gray py-1 px-2 hover:opacity-80"
                @click="emit('cancelEdit')"
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
