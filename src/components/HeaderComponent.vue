<script setup lang="ts">
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import {
  BuildingStorefrontIcon,
  HomeIcon,
  ShoppingBagIcon,
  TagIcon,
} from '@heroicons/vue/24/outline'
import LoginButton from './LoginButton.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import ProfileMenu from './ProfileMenu.vue'
import { ref } from 'vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { RouterLink } from 'vue-router'

const { isAuthenticated } = useAuth0()

const isOpen = ref(false)
</script>

<template>
  <header
    class="bg-foreground text-background min-h-15 grid grid-cols-[1fr_2fr_1fr] md:grid-cols-1 items-center px-4 gap-1"
  >
    <nav class="md:hidden">
      <button
        type="button"
        @click="isOpen = true"
        class="align-middle cursor-pointer hover:opacity-60"
      >
        <Bars3Icon class="size-7" />
      </button>
      <TransitionRoot :show="isOpen" as="template">
        <Dialog @close="isOpen = false" class="relative z-15">
          <TransitionChild
            enter="duration-250 ease-in-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-250 ease-in-out"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-gray-500/75" aria-hidden="true"></div>
          </TransitionChild>

          <div class="fixed inset-0 overflow-hidden">
            <div class="absolute inset-0 overflow-hidden">
              <div
                class="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10 sm:pr-16"
              >
                <TransitionChild
                  enter="transition duration-250 ease-in-out"
                  enter-from="-translate-x-full"
                  enter-to="translate-x-0"
                  leave="transition duration-250 ease-in-out"
                  leave-from="translate-x-0"
                  leave-to="-translate-x-full"
                >
                  <DialogPanel class="pointer-events-auto w-screen max-w-64 h-full">
                    <div class="flex h-full flex-col overflow-y-auto bg-background shadow-xl">
                      <div class="flex-1 overflow-y-auto">
                        <div
                          class="flex items-start justify-between py-4 px-2 border-b border-foreground/10"
                        >
                          <div class="flex h-7 items-center">
                            <button
                              type="button"
                              @click="isOpen = false"
                              class="cursor-pointer relative p-2 text-gray-400 hover:text-gray-500"
                            >
                              <XMarkIcon aria-hidden="true" class="size-6" />
                            </button>
                          </div>
                        </div>

                        <nav class="divide-y divide-foreground/10">
                          <div class="px-2 py-4">
                            <ul class="flex flex-col gap-4">
                              <li @click="isOpen = false">
                                <RouterLink
                                  to="/"
                                  class="w-full inline-flex items-center gap-2 px-2 py-1 rounded hover:bg-foreground/10"
                                >
                                  <HomeIcon class="size-5"></HomeIcon>
                                  <p>Home</p>
                                </RouterLink>
                              </li>
                              <li @click="isOpen = false">
                                <RouterLink
                                  :to="{ name: 'products' }"
                                  class="w-full inline-flex items-center gap-2 px-2 py-1 rounded hover:bg-foreground/10"
                                >
                                  <ShoppingBagIcon class="size-5"></ShoppingBagIcon>
                                  <p>Products</p>
                                </RouterLink>
                              </li>
                              <li @click="isOpen = false">
                                <RouterLink
                                  :to="{ name: 'collections' }"
                                  class="w-full inline-flex items-center gap-2 px-2 py-1 rounded hover:bg-foreground/10"
                                >
                                  <TagIcon class="size-5"></TagIcon>
                                  <p>Collections</p>
                                </RouterLink>
                              </li>
                            </ul>
                          </div>
                        </nav>
                      </div>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </nav>
    <div class="flex gap-2 items-center font-semibold justify-center">
      <BuildingStorefrontIcon class="size-5" />
      <RouterLink :to="{ name: 'home' }">Preuve Admin</RouterLink>
    </div>
    <div class="justify-self-end">
      <ProfileMenu v-if="isAuthenticated" />
      <LoginButton v-else />
    </div>
  </header>
</template>
