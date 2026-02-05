<script setup lang="ts">
const { status } = defineProps<{
  status: boolean
}>()
</script>

<template>
  <div
    :class="[
      'rounded-2xl border p-1 text-xs',
      status
        ? 'border-blue-300 bg-blue-300 text-blue-900'
        : 'border-gray-300 bg-gray-300 text-gray-900',
    ]"
  >
    {{ status ? 'Active' : 'Draft' }}
  </div>
</template>
