<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { EllipsisHorizontalIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'

const { allowEdit, allowDelete, itemId } = defineProps<{
  allowEdit: boolean
  allowDelete: boolean
  itemId: string
}>()
const emit = defineEmits(['editItem', 'deleteItem'])
</script>

<template>
  <Menu as="div" class="relative" v-slot="{ close }">
    <MenuButton class="rounded-md py-1 px-2 hover:bg-cool-gray">
      <EllipsisHorizontalIcon class="size-5" />
    </MenuButton>
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems
        class="absolute mt-1 w-min-content rounded-md bg-white outline outline-gray-100 shadow-lg divide-y divide-gray-100 z-10"
      >
        <MenuItem v-if="allowEdit" as="div" class="p-1" v-slot="{ active }">
          <button
            :class="[
              { 'bg-cool-gray': active },
              'flex items-center gap-1 w-full font-medium rounded-md p-2',
            ]"
            type="button"
            @click.prevent="
              () => {
                emit('editItem', itemId)
                close()
              }
            "
          >
            <PencilSquareIcon class="size-4" aria-disabled="true" />
            Edit
          </button>
        </MenuItem>
        <MenuItem v-if="allowDelete" as="div" class="p-1" v-slot="{ active }">
          <button
            :class="[
              { 'bg-cool-gray': active },
              'flex items-center gap-1 w-full font-medium rounded-md p-2',
            ]"
            type="button"
            @click.prevent="
              () => {
                emit('deleteItem', itemId)
                close()
              }
            "
          >
            <TrashIcon class="size-4" aria-disabled="true" />
            Delete
          </button>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>
