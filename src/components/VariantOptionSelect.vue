<script setup lang="ts">
import type { ProductOption, ProductOptionValue } from '@/lib/types'
import { ref, watch } from 'vue'

const { variantId, option, selectedValue } = defineProps<{
  variantId?: string
  option: ProductOption
  selectedValue?: ProductOptionValue
}>()

const activeValue = ref<ProductOptionValue>()

const emit = defineEmits(['selectChange'])

watch(
  () => variantId,
  () => {
    activeValue.value = selectedValue
  },
  { immediate: true },
)
</script>

<template>
  <div class="text-sm">
    <label :for="option.name + '-select'">{{ option.name }}</label>

    <select
      :id="option.name + '-select'"
      :name="option.name"
      class="border border-gray-300 rounded p-1 w-full"
      v-model="activeValue"
      @change="emit('selectChange', activeValue)"
      required
    >
      <option value=""></option>
      <option
        v-for="val in option.values"
        :key="val.id"
        :value="val"
        :selected="val.id === activeValue?.id"
      >
        {{ val.name }}
      </option>
    </select>
  </div>
</template>
