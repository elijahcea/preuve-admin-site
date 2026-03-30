<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'

const { loginWithRedirect, isLoading } = useAuth0()
const login = () => loginWithRedirect()
</script>

<template>
  <button
    type="button"
    @click.prevent="login"
    :disabled="isLoading"
    v-loading="isLoading"
    class="bg-fill rounded-md py-1 px-2 outline outline-black hover:bg-fill/50 text-sm"
  >
    Log In
  </button>
</template>
