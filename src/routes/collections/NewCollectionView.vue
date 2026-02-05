<script setup lang="ts">
import TitleAndDescription from '@/components/TitleAndDescription.vue'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

const title = ref<string>('')
const description = ref<string>('')
</script>

<template>
  <div class="max-w-2xl flex flex-col m-auto items-center gap-5">
    <div class="flex items-center justify-start w-full gap-3">
      <RouterLink
        :to="{ name: 'collections' }"
        class="p-1 hover:bg-current/20 rounded border border-gray-400"
      >
        <ArrowLeftIcon class="size-5" />
      </RouterLink>
      <h1 class="font-bold text-xl">Create collection</h1>
    </div>
    <form class="w-full text-sm flex flex-col gap-5">
      <TitleAndDescription v-model:title="title" v-model:description="description" />
      <div class="m-auto">
        <RouterLink :to="{ name: 'collections' }">
          <button class="bg-gray-300 rounded p-2 hover:bg-gray-300/70">Discard</button>
        </RouterLink>
        <button type="submit" class="bg-blue-300 rounded p-2 ml-2 hover:bg-blue-300/70">
          Save
        </button>
      </div>
    </form>
  </div>
</template>
