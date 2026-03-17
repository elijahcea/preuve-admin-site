<script setup lang="ts">
const title = defineModel<string>('title', { required: true })
const description = defineModel<string>('description', { required: true })
</script>

<template>
  <section class="bg-light rounded-xl shadow-lg p-3">
    <div>
      <label for="title">Title</label>
      <input
        id="title"
        type="text"
        class="border border-gray-300 rounded p-1 w-full mt-1"
        v-model="title"
      />
    </div>
    <div class="mt-3">
      <label for="description">Description</label>
      <textarea
        id="description"
        rows="5"
        class="resize-none border border-gray-300 rounded p-1 w-full mt-1"
        v-model="description"
      ></textarea>
    </div>
  </section>
</template>
