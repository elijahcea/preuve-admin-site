<script setup lang="ts">
import { BuildingStorefrontIcon } from '@heroicons/vue/24/outline'
import LoginButton from './LoginButton.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import ProfileMenu from './ProfileMenu.vue'

const { isAuthenticated } = useAuth0()
</script>

<template>
  <header class="bg-foreground text-background max-h-15">
    <nav class="flex justify-between items-center px-5 py-3 font-semibold">
      <div class="flex gap-2 items-center">
        <BuildingStorefrontIcon class="size-5" />
        <RouterLink :to="{ name: 'home' }">Preuve Admin</RouterLink>
      </div>
      <ProfileMenu v-if="isAuthenticated" />
      <LoginButton v-else />
    </nav>
  </header>
</template>
