<script setup lang="ts">
import type { ProductOption } from '@/lib/types'
import { TrashIcon } from '@heroicons/vue/24/outline'

const options = defineModel<ProductOption[]>({ required: true })

const addOption = () => {
  options.value.push({
    id: '',
    position: options.value.length + 1,
    name: '',
    optionValues: [
      {
        id: '',
        position: 1,
        name: '',
        optionId: '',
      },
    ],
  })
}

const deleteOption = (index: number) => {
  options.value.splice(index, 1)
  reorderOptions()
}

const reorderOptions = () => {
  options.value = options.value.map((option, index) => ({
    ...option,
    position: index + 1,
  }))
}

const reorderOptionValues = (option: ProductOption) => {
  option.optionValues = option.optionValues.map((value, index) => ({
    ...value,
    position: index + 1,
  }))
}

const addOptionValue = (optionIndex: number) => {
  const option = options.value[optionIndex]
  if (!option) return
  if (!option.optionValues) {
    option.optionValues = []
  }
  option.optionValues.push({
    id: '',
    position: option.optionValues.length + 1,
    name: '',
    optionId: option.id,
  })
}

const deleteOptionValue = (optionIndex: number, valueIndex: number) => {
  const option = options.value[optionIndex]
  if (!option) return
  option.optionValues.splice(valueIndex, 1)
  reorderOptionValues(option)
}
</script>

<template>
  <div
    v-for="(option, optionIndex) in options"
    :key="option.id"
    class="border-b border-gray-200 p-3"
  >
    <label :for="`option-${option.position}-name`" class="font-semibold">Option name</label>
    <div class="flex gap-2 my-1">
      <input
        type="text"
        :id="`option-${option.position}-name`"
        v-model="option.name"
        placeholder="e.g., Size, Color, Material"
        required
        class="border border-gray-300 rounded p-2 w-full my-1"
      />
      <button type="button" @click="deleteOption(optionIndex)" class="p-2 hover:bg-red-100 rounded">
        <TrashIcon class="size-4" />
      </button>
    </div>

    <!-- Option Values -->
    <fieldset>
      <legend class="font-semibold">Option values</legend>
      <div
        v-for="(optionValue, valueIndex) in option.optionValues"
        :key="optionValue.id"
        id="option-values"
        class="flex gap-2 my-1"
      >
        <input
          type="text"
          :id="`option-${option.position}-value-${optionValue.position}`"
          v-model="optionValue.name"
          placeholder="e.g., Small, Red, Cotton"
          required
          class="border border-gray-300 rounded p-2 w-full my-1"
        />
        <button
          type="button"
          @click="deleteOptionValue(optionIndex, valueIndex)"
          class="p-2 hover:bg-red-100 rounded"
        >
          <TrashIcon class="size-4" />
        </button>
      </div>

      <!-- Add option value button -->
      <div class="text-center">
        <button
          v-if="option.optionValues.length < 10"
          type="button"
          @click="addOptionValue(optionIndex)"
          class="text-sm text-blue-600 hover:text-blue-800 font-medium my-3"
        >
          + Add another value
        </button>
      </div>
    </fieldset>

    <button
      type="button"
      class="p-2 shadow hover:bg-gray-300/50 rounded border border-gray-300 my-2"
    >
      Done
    </button>
  </div>

  <!-- Add option button -->
  <div class="text-center">
    <button
      v-if="options.length < 3"
      type="button"
      @click="addOption"
      class="text-blue-600 hover:text-blue-800 font-medium p-5"
    >
      + Add another option
    </button>
  </div>
</template>
