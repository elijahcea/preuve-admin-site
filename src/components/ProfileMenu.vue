<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/vue/24/outline'

const { user, logout, isLoading } = useAuth0()

const handleLogout = () => {
  logout({
    logoutParams: {
      returnTo: window.location.origin,
    },
  })
}
</script>

<template>
  <Menu as="div" class="relative" v-slot="{ close }" v-loading="isLoading">
    <MenuButton class="bg-fill rounded-md py-1 px-2 outline outline-black hover:bg-fill/50 text-sm">
      <p>{{ user?.name || user?.nickname }}</p>
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
        class="absolute right-0 mt-2 w-56 bg-white text-black rounded-md shadow-lg divide-y divide-gray-200 z-10"
      >
        <MenuItem as="div" class="p-1" v-slot="{ active }">
          <button
            :class="[
              { 'bg-gray-100': active },
              'w-full font-medium text-sm rounded-md p-2 flex items-center gap-2',
            ]"
            @click.prevent="
              () => {
                handleLogout()
                close()
              }
            "
            :disabled="isLoading"
            v-loading="isLoading"
          >
            <ArrowLeftStartOnRectangleIcon class="size-5" />
            Log Out
          </button>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>
