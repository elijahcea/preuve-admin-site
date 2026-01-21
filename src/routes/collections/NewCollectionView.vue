<script setup lang="ts">
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <div class="max-w-2xl flex flex-col m-auto items-center gap-5">
    <div class="flex items-center justify-start w-full gap-3">
      <RouterLink to="/collections" class="p-1 hover:bg-current/20 rounded border border-gray-400">
        <ArrowLeftIcon class="size-5" />
      </RouterLink>
      <h1 class="font-bold text-xl">Create collection</h1>
    </div>
    <form class="w-full text-sm flex flex-col gap-5">
      <fieldset class="bg-background rounded shadow-lg p-3">
        <div>
          <label for="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            class="border border-gray-300 rounded p-1 w-full my-1"
          />
        </div>
        <div>
          <label for="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter description"
            rows="5"
            class="resize-none border border-gray-300 rounded p-1 w-full my-1"
          ></textarea>
        </div>
      </fieldset>
      <div class="m-auto">
        <button type="button" class="bg-gray-300 rounded p-2 hover:bg-gray-300/70">Discard</button>
        <button type="submit" class="bg-blue-300 rounded p-2 ml-2 hover:bg-blue-300/70">
          Save
        </button>
      </div>
    </form>
  </div>
</template>
