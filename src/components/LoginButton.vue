<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'

const { loginWithRedirect, isLoading } = useAuth0()
const login = () => loginWithRedirect()
</script>

<template>
  <button
    type="button"
    @click="login"
    :disabled="isLoading"
    v-loading="isLoading"
    class="bg-fill rounded-md p-2 hover:bg-fill/50 text-sm"
  >
    Log In
  </button>
</template>
