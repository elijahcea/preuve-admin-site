<script setup lang="ts">
import type { CollectionPreview } from '@/lib/types'
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

const { isOpen, selectedCollections, collections } = defineProps<{
  isOpen: boolean
  selectedCollections: CollectionPreview[]
  collections: CollectionPreview[]
}>()

const emit = defineEmits(['saveEdit', 'cancelEdit'])

const activeCollections = ref<CollectionPreview[]>([])

watch(
  () => isOpen,
  (val) => {
    if (val === true) {
      activeCollections.value = selectedCollections
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
        @submit.prevent="emit('saveEdit', { collectionIds: activeCollections.map((c) => c.id) })"
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
            <DialogTitle class="font-semibold mb-3">Edit collections</DialogTitle>

            <Listbox as="div" v-model="activeCollections" multiple>
              <div class="p-3">
                <ListboxLabel>Collections</ListboxLabel>
                <ListboxButton
                  class="relative border border-gray-300 rounded p-2 w-full flex items-center justify-between my-1"
                >
                  <div v-if="activeCollections.length" class="flex gap-1 flex-wrap">
                    <el-tag v-for="collection in activeCollections" :key="collection.id">
                      <p class="truncate">{{ collection.title }}</p>
                    </el-tag>
                  </div>
                  <p v-else>Select collections</p>
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
                      <ListboxOption
                        v-for="collection in collections"
                        :key="collection.id"
                        :value="activeCollections.find((c) => collection.id === c.id) ?? collection"
                        v-slot="{ active, selected }"
                        as="template"
                      >
                        <li
                          :class="[active ? 'bg-blue-100 text-blue-900' : '', 'p-2 cursor-default']"
                        >
                          <span v-show="selected" class="absolute left-0 pl-0.5 text-blue-600">
                            <CheckIcon class="size-5" aria-hidden="true" />
                          </span>
                          <p :class="[selected ? 'font-medium' : 'font-normal', 'pl-5 truncate']">
                            {{ collection.title }}
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
